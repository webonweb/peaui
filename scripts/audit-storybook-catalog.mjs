import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const catalogs = [
  { name: 'vue', root: join(repositoryRoot, 'packages/storybook/vue/storybook-static') },
  { name: 'react', root: join(repositoryRoot, 'packages/storybook/react/storybook-static') },
  { name: 'wc', root: join(repositoryRoot, 'packages/storybook/wc/storybook-static') },
];
const requestedCatalogs = new Set(
  (process.env.STORYBOOK_AUDIT_CATALOGS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
);
const requestedStories = new Set(
  (process.env.STORYBOOK_AUDIT_STORIES ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
);
const selectedCatalogs = requestedCatalogs.size
  ? catalogs.filter((catalog) => requestedCatalogs.has(catalog.name))
  : catalogs;
const axeDisabledRules = [
  'landmark-one-main',
  'page-has-heading-one',
  'region',
  'scrollable-region-focusable',
];
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function resolveRequestPath(root, requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const candidate = resolve(root, normalize(relativePath));

  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) return undefined;
  if (!existsSync(candidate)) return undefined;

  return statSync(candidate).isDirectory() ? join(candidate, 'index.html') : candidate;
}

async function startStaticServer(root) {
  const server = createServer((request, response) => {
    const filePath = resolveRequestPath(root, request.url ?? '/');

    if (!filePath || !existsSync(filePath)) {
      response.writeHead(404).end('Not found');
      return;
    }

    response.writeHead(200, {
      'cache-control': 'no-store',
      'content-type': mimeTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
    });
    createReadStream(filePath).pipe(response);
  });

  await new Promise((resolveListen, rejectListen) => {
    server.once('error', rejectListen);
    server.listen(0, '127.0.0.1', resolveListen);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error(`Cannot serve ${root}.`);

  return {
    close: () => new Promise((resolveClose) => server.close(resolveClose)),
    url: `http://127.0.0.1:${address.port}`,
  };
}

async function waitForStableLayout(page) {
  await page.evaluate(
    () =>
      new Promise((resolveFrame) =>
        requestAnimationFrame(() => requestAnimationFrame(resolveFrame)),
      ),
  );
}

async function getOverflowReport(page, width) {
  await page.setViewportSize({ height: 900, width });
  await waitForStableLayout(page);

  return page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const elements = [...document.querySelectorAll('#storybook-root *')]
      .filter((element) => {
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const bounds = element.getBoundingClientRect();
        return bounds.width > 0 && (bounds.right > viewportWidth + 1 || bounds.left < -1);
      })
      .slice(0, 12)
      .map((element) => {
        const bounds = element.getBoundingClientRect();
        return {
          className:
            typeof element.className === 'string'
              ? element.className
              : element.getAttribute('class') ?? '',
          left: Math.round(bounds.left),
          right: Math.round(bounds.right),
          tagName: element.tagName.toLowerCase(),
        };
      });

    return {
      clientWidth: viewportWidth,
      elements,
      scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    };
  });
}

async function auditCatalog(browser, catalog, serverUrl) {
  const indexResponse = await fetch(`${serverUrl}/index.json`);
  if (!indexResponse.ok) throw new Error(`Cannot read ${catalog.name} Storybook index.`);
  const index = await indexResponse.json();
  const stories = Object.values(index.entries)
    .filter(
      (entry) =>
        entry.type === 'story' && (!requestedStories.size || requestedStories.has(entry.id)),
    )
    .sort((left, right) => left.id.localeCompare(right.id));
  const browserContext = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { height: 900, width: 390 },
  });
  const failures = [];

  for (const [storyIndex, story] of stories.entries()) {
    const page = await browserContext.newPage();
    const runtimeErrors = [];
    const recordPageError = (error) => runtimeErrors.push(error.message);
    const recordConsoleError = (message) => {
      if (message.type() !== 'error') return;
      if (message.text().startsWith('Failed to load resource:')) return;
      runtimeErrors.push(message.text());
    };
    page.on('pageerror', recordPageError);
    page.on('console', recordConsoleError);

    try {
      const response = await page.goto(
        `${serverUrl}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`,
        { waitUntil: 'networkidle' },
      );
      if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? 'unknown'}`);
      await page.waitForFunction(
        () => Boolean(document.querySelector('#storybook-root')?.firstElementChild),
        undefined,
        { timeout: 15_000 },
      );
      await waitForStableLayout(page);

      const axeResults = await new AxeBuilder({ page })
        .include('#storybook-root')
        .exclude('[class*="story-settings"]')
        .withTags(['wcag2a', 'wcag2aa'])
        .disableRules(axeDisabledRules)
        .analyze();
      const overflow390 = await getOverflowReport(page, 390);
      const overflow320 = await getOverflowReport(page, 320);
      const hasOverflow390 = overflow390.scrollWidth > overflow390.clientWidth + 1;
      const hasOverflow320 = overflow320.scrollWidth > overflow320.clientWidth + 1;

      if (runtimeErrors.length || axeResults.violations.length || hasOverflow390 || hasOverflow320) {
        failures.push({
          axe: axeResults.violations.map((violation) => ({
            id: violation.id,
            nodes: violation.nodes.map((node) => ({
              failureSummary: node.failureSummary,
              html: node.html,
              target: node.target,
            })),
          })),
          overflow320: hasOverflow320 ? overflow320 : undefined,
          overflow390: hasOverflow390 ? overflow390 : undefined,
          runtimeErrors: [...new Set(runtimeErrors)],
          storyId: story.id,
          title: story.title,
        });
      }
    } catch (error) {
      failures.push({
        runtimeErrors: [...new Set([...runtimeErrors, error instanceof Error ? error.message : `${error}`])],
        storyId: story.id,
        title: story.title,
      });
    } finally {
      page.off('pageerror', recordPageError);
      page.off('console', recordConsoleError);
      await page.close();
    }

    if ((storyIndex + 1) % 50 === 0 || storyIndex + 1 === stories.length) {
      console.log(`${catalog.name}: ${storyIndex + 1}/${stories.length}`);
    }
  }

  await browserContext.close();
  return { failures, stories: stories.length };
}

for (const catalog of selectedCatalogs) {
  if (!existsSync(join(catalog.root, 'index.json'))) {
    throw new Error(`Missing ${catalog.name} Storybook build. Run the Storybook builds first.`);
  }
}

const servers = await Promise.all(selectedCatalogs.map((catalog) => startStaticServer(catalog.root)));
const browser = await chromium.launch({ headless: true });
const reports = [];

try {
  reports.push(
    ...(await Promise.all(
      selectedCatalogs.map(async (catalog, index) => ({
        catalog: catalog.name,
        ...(await auditCatalog(browser, catalog, servers[index].url)),
      })),
    )),
  );
} finally {
  await browser.close();
  await Promise.all(servers.map((server) => server.close()));
}

const failures = reports.flatMap((report) =>
  report.failures.map((failure) => ({ catalog: report.catalog, ...failure })),
);
const totalStories = reports.reduce((total, report) => total + report.stories, 0);

console.log(`Audited ${totalStories} stories; failures: ${failures.length}.`);
if (failures.length) {
  for (const failure of failures) {
    const axe = failure.axe?.map((violation) => violation.id).join(',') || '-';
    const layout = [failure.overflow390 && '390', failure.overflow320 && '320']
      .filter(Boolean)
      .join(',') || '-';
    const runtime = failure.runtimeErrors?.[0]?.split('\n')[0] || '-';
    console.error(
      `${failure.catalog}\t${failure.storyId}\taxe=${axe}\toverflow=${layout}\truntime=${runtime}`,
    );
  }
  if (process.env.STORYBOOK_AUDIT_VERBOSE === 'true') {
    console.error(JSON.stringify(failures, null, 2));
  }
  process.exitCode = 1;
}
