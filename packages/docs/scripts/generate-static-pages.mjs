import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(docsRoot, 'dist');
const publicSiteUrl = 'https://webonweb.github.io/peaui';
const frameworkLabels = {
  vue: 'Vue 3',
  react: 'React',
  'web-components': 'Web Components',
};
const categoryLabels = {
  en: {
    basic: 'Basic',
    'data-display': 'Data display',
    'data-entry': 'Data entry',
    feedback: 'Feedback',
    form: 'Forms',
    layout: 'Layout',
    navigation: 'Navigation',
    overlayer: 'Overlays and dialogs',
  },
  pl: {
    basic: 'Podstawowe',
    'data-display': 'Prezentacja danych',
    'data-entry': 'Wprowadzanie danych',
    feedback: 'Informacje zwrotne',
    form: 'Formularze',
    layout: 'Układ',
    navigation: 'Nawigacja',
    overlayer: 'Warstwy i okna',
  },
};

function toSlug(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function unwrapExpression(expression) {
  let current = expression;
  while (
    ts.isAsExpression(current) ||
    ts.isParenthesizedExpression(current) ||
    ts.isSatisfiesExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function readPropertyName(name, sourceName) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  throw new Error(`Unsupported generated property name in ${sourceName}.`);
}

function readLiteral(expression, sourceName) {
  const current = unwrapExpression(expression);
  if (ts.isArrayLiteralExpression(current)) {
    return current.elements.map((element) => readLiteral(element, sourceName));
  }
  if (ts.isObjectLiteralExpression(current)) {
    return Object.fromEntries(
      current.properties.map((property) => {
        if (!ts.isPropertyAssignment(property)) {
          throw new Error(`Unsupported generated property in ${sourceName}.`);
        }
        return [
          readPropertyName(property.name, sourceName),
          readLiteral(property.initializer, sourceName),
        ];
      }),
    );
  }
  if (ts.isStringLiteral(current) || ts.isNoSubstitutionTemplateLiteral(current)) {
    return current.text;
  }
  if (ts.isNumericLiteral(current)) return Number(current.text);
  if (current.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (current.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (current.kind === ts.SyntaxKind.NullKeyword) return null;
  if (
    ts.isPrefixUnaryExpression(current) &&
    current.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(current.operand)
  ) {
    return -Number(current.operand.text);
  }
  throw new Error(`Unsupported generated value in ${sourceName}.`);
}

export function parseGeneratedValueSource(source, exportName, sourceName = 'generated source') {
  const sourceFile = ts.createSourceFile(
    sourceName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === exportName &&
        declaration.initializer
      ) {
        return readLiteral(declaration.initializer, sourceName);
      }
    }
  }
  throw new Error(`Could not read ${exportName} from ${sourceName}.`);
}

export function parseGeneratedArraySource(source, exportName, sourceName = 'generated source') {
  const value = parseGeneratedValueSource(source, exportName, sourceName);
  if (!Array.isArray(value)) throw new Error(`${exportName} must be an array.`);
  return value;
}

function interpolate(message, values) {
  return message.replace(/\{(\w+)\}/g, (match, name) => String(values[name] ?? match));
}

function normalizeRoutePath(routePath) {
  if (!routePath || routePath === '/') return '';
  return `${routePath.replace(/^\/+|\/+$/g, '')}/`;
}

export function getCanonicalUrl(routePath, locale) {
  return `${publicSiteUrl}/${locale === 'pl' ? 'pl/' : ''}${normalizeRoutePath(routePath)}`;
}

function getMetadata(route, locale, messages) {
  const values = {
    category: categoryLabels[locale][route.category] ?? route.category ?? '',
    component: route.component ?? '',
    framework: frameworkLabels[route.framework] ?? 'Vue',
  };
  const key = route.kind === 'home' ? 'home' : route.kind === 'category' ? 'category' : route.kind;

  return {
    canonicalUrl: getCanonicalUrl(route.path, locale),
    description: interpolate(messages[`seo.${key}.description`][locale], values),
    title: interpolate(messages[`seo.${key}.title`][locale], values),
  };
}

export function buildPublicRoutes(frameworkComponents) {
  const routes = [{ kind: 'home', path: '/' }];

  for (const [framework, components] of Object.entries(frameworkComponents)) {
    routes.push(
      { kind: 'start', framework, path: `/${framework}/start` },
      { kind: 'components', framework, path: `/${framework}/components` },
      { kind: 'icons', framework, path: `/${framework}/icons` },
    );

    const categories = [...new Set(components.map((component) => component.category))];
    for (const category of categories) {
      routes.push({
        kind: 'category',
        framework,
        category,
        path: `/${framework}/components/${category}`,
      });
    }

    for (const component of components) {
      routes.push({
        kind: 'component',
        framework,
        category: component.category,
        component: component.name,
        path: `/${framework}/components/${component.category}/${toSlug(component.name)}`,
      });
    }
  }

  return routes;
}

export function renderSitemap(routes) {
  const urls = ['en', 'pl'].flatMap((locale) =>
    routes.map((route) => `  <url><loc>${getCanonicalUrl(route.path, locale)}</loc></url>`),
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

export function renderRobots() {
  return `User-agent: *\nAllow: /peaui/\n\nSitemap: ${publicSiteUrl}/sitemap.xml\n`;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function setMetaContent(html, attribute, name, content) {
  const expression = new RegExp(`<meta\\s+${attribute}="${name}"[\\s\\S]*?\\/?>`, 'i');
  const tag = `<meta ${attribute}="${name}" content="${escapeHtml(content)}" />`;
  return expression.test(html)
    ? html.replace(expression, tag)
    : html.replace('</head>', `    ${tag}\n  </head>`);
}

export function renderRouteHtml(template, route, locale, messages) {
  const metadata = getMetadata(route, locale, messages);
  let html = template
    .replace(/<html lang="[^"]+">/, `<html lang="${locale}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`)
    .replace(
      /<link rel="canonical" href="[^"]+"\s*\/?>/,
      `<link rel="canonical" href="${metadata.canonicalUrl}" />`,
    );

  html = setMetaContent(html, 'name', 'description', metadata.description);
  html = setMetaContent(html, 'property', 'og:title', metadata.title);
  html = setMetaContent(html, 'property', 'og:description', metadata.description);
  html = setMetaContent(html, 'property', 'og:url', metadata.canonicalUrl);
  html = setMetaContent(html, 'property', 'og:locale', locale === 'pl' ? 'pl_PL' : 'en_US');
  html = setMetaContent(html, 'name', 'twitter:title', metadata.title);
  html = setMetaContent(html, 'name', 'twitter:description', metadata.description);
  return html;
}

function outputPathForRoute(route, locale) {
  const localePrefix = locale === 'pl' ? 'pl' : '';
  const normalized = route.path === '/' ? '' : route.path.replace(/^\/+|\/+$/g, '');
  return path.join(distRoot, localePrefix, normalized, 'index.html');
}

function writeStaticRoute(template, route, locale, messages) {
  const outputFile = outputPathForRoute(route, locale);
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, renderRouteHtml(template, route, locale, messages), 'utf8');
}

export function renderNotFoundHtml(template) {
  return setMetaContent(template, 'name', 'robots', 'noindex');
}

export function generateStaticPages() {
  const generatedRoot = path.join(docsRoot, 'src', 'generated');
  const catalogFile = path.join(generatedRoot, 'component-catalog.ts');
  const frameworkComponents = parseGeneratedValueSource(
    fs.readFileSync(catalogFile, 'utf8'),
    'generatedComponentCatalog',
    catalogFile,
  );
  const messages = JSON.parse(
    fs.readFileSync(path.join(docsRoot, 'src', 'data', 'seo-messages.json'), 'utf8'),
  );
  const routes = buildPublicRoutes(frameworkComponents);
  const indexFile = path.join(distRoot, 'index.html');
  const template = fs.readFileSync(indexFile, 'utf8');

  for (const locale of ['en', 'pl']) {
    for (const route of routes) {
      if (locale === 'en' && route.path === '/') continue;
      writeStaticRoute(template, route, locale, messages);
    }
  }

  fs.writeFileSync(path.join(distRoot, 'sitemap.xml'), renderSitemap(routes), 'utf8');
  fs.writeFileSync(path.join(distRoot, 'robots.txt'), renderRobots(), 'utf8');
  fs.writeFileSync(path.join(distRoot, '404.html'), renderNotFoundHtml(template), 'utf8');
  console.log(`Generated ${routes.length * 2} localized SEO routes, sitemap.xml and robots.txt.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  generateStaticPages();
}
