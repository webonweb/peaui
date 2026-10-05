// Exercise the published Node SSR and browser ESM entries, including native top-layer behavior.
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import Module from "node:module";
import os from "node:os";
import path from "node:path";
import { build } from "esbuild";
import { chromium, firefox, webkit } from "playwright";

const root = process.cwd();
const engine = process.env.PEAUI_BROWSER || "chromium";
const browserType = { chromium, firefox, webkit }[engine];
assert(browserType, `Unknown browser: ${engine}`);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "peaui-hydration-"));
const metadata = await build({
  entryPoints: [
    path.join(root, "packages/docs/src/generated/component-api.ts"),
  ],
  bundle: true,
  write: false,
  format: "esm",
  platform: "node",
  logLevel: "silent",
});
const { generatedComponentApi } = await import(
  "data:text/javascript;base64," +
    Buffer.from(metadata.outputFiles[0].text).toString("base64")
);
const catalog = generatedComponentApi.map(({ name, category }) => ({
  name,
  location: `${category}/${name}`,
}));
assert(catalog.length > 0, "Component catalog must not be empty");
const imports = catalog
  .flatMap(({ name, location }) =>
    ["vue", "react"].map(
      (framework) =>
        `import ${framework}${name} from '@peaui/ui/${framework}/${location}';`,
    ),
  )
  .join("\n");
const shared = `${imports}
import { generatedComponentApi } from './packages/docs/src/generated/component-api';
import { getDemoPreset } from './packages/docs/src/data/demo-presets';
import { createSSRApp, h, nextTick } from 'vue';
import { createElement } from 'react';
const components = {${["vue", "react"].map((framework) => `${framework}:{${catalog.map(({ name }) => `${name}:${framework}${name}`).join(",")}}`).join(",")}};
function tree(framework, name, behavior) {
  const definition = generatedComponentApi.find(item => item.name === name);
  const preset = getDemoPreset({...definition, slug:name.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase()});
  const slots = {...(preset.defaultSlot ? {default:preset.defaultSlot} : {}), ...preset.slots};
  const props = {...preset.props};
  const nodes = (value, key) => (Array.isArray(value) ? value : [value]).map((text, index) => framework === 'vue' ? h('span',{key:key+index},text) : createElement('span',{key:key+index},text));
  let vueSlots = Object.fromEntries(Object.entries(slots).map(([key,value]) => [key, () => nodes(value,key)]));
  if (framework === 'react') for (const [key,value] of Object.entries(slots)) props[key === 'default' ? 'children' : key.replace(/[-:]([a-z])/g,(_,c)=>c.toUpperCase())] = nodes(value,key);
  if (behavior) {
    for (const key of Object.keys(props)) delete props[key];
    if (name === 'FormSelect') {
      Object.assign(props,{id:'choice',name:'choice',label:'Choose',value:'a',options:[{label:'Alpha',value:'a'},{label:'Beta',value:'b'}]});
      vueSlots = {};
    } else if (framework === 'react') {
      Object.assign(props,{children:'Open',content:createElement('button',{type:'button'},'Inside')});
    } else vueSlots = {default:()=>['Open'],content:()=>h('button',{type:'button'},'Inside')};
  }
  const copies = Array.from({length:behavior ? 1 : 2},(_,index) => {
    const instanceProps = {...props};
    // The label preset uses the same external field ID; each fixture owns its own pair.
    for (const key of ['id','for']) if (typeof props[key] === 'string') instanceProps[key] = props[key]+'-'+index;
    return framework === 'vue' ? h('section',{key:index},[h(components.vue[name],instanceProps,vueSlots)]) : createElement('section',{key:index},createElement(components.react[name],instanceProps));
  });
  return framework === 'vue' ? h('div',{'data-hydration-case':name},copies) : createElement('div',{'data-hydration-case':name},copies);
}
export function vueApp(name,behavior){return createSSRApp({render:()=>tree('vue',name,behavior)});}
export function reactTree(name,behavior){return tree('react',name,behavior);}
`;
const serverBuild = await build({
  stdin: {
    contents:
      shared +
      "\nexport {renderToString as renderVue} from 'vue/server-renderer'; export {renderToString as renderReact} from 'react-dom/server';",
    resolveDir: root,
  },
  bundle: true,
  write: false,
  platform: "node",
  format: "cjs",
  external: [
    "vue",
    "vue/*",
    "react",
    "react/*",
    "react-dom",
    "react-dom/*",
    "@peaui/ui/*",
  ],
  define: { "import.meta.env.BASE_URL": '"/"' },
  logLevel: "silent",
});
const serverModule = new Module(path.join(root, "hydration-fixtures.cjs"));
serverModule.filename = path.join(root, "hydration-fixtures.cjs");
serverModule.paths = Module._nodeModulePaths(root);
serverModule._compile(serverBuild.outputFiles[0].text, serverModule.filename);
const { vueApp, reactTree, renderVue, renderReact } = serverModule.exports;
const fixtures = [];
for (const { name } of catalog)
  for (const framework of ["vue", "react"]) {
    fixtures.push({
      name,
      framework,
      html:
        framework === "vue"
          ? await renderVue(vueApp(name))
          : renderReact(reactTree(name)),
    });
  }
for (const name of ["PopoverButton", "PopoverOverlayer", "FormSelect"])
  for (const framework of ["vue", "react"]) {
    fixtures.push({
      name,
      framework,
      behavior: true,
      html:
        framework === "vue"
          ? await renderVue(vueApp(name, true))
          : renderReact(reactTree(name, true)),
    });
  }
const client = `${shared}
import {hydrateRoot} from 'react-dom/client';
window.hydrationCheck = {
  async hydrate({name,framework,behavior}) {
    const host = document.getElementById('host');
    const first = host.firstElementChild;
    const errors = [];
    if(framework === 'vue') vueApp(name,behavior).mount(host);
    else hydrateRoot(host,reactTree(name,behavior),{onRecoverableError:error=>errors.push(error.message)});
    await nextTick(); await new Promise(resolve=>setTimeout(resolve,100)); await new Promise(requestAnimationFrame);
    const ids = [...host.querySelectorAll('[id]')].map(element=>element.id);
    return {recoverableErrors:errors,rootRetained:host.firstElementChild === first,duplicateIds:ids.filter((id,index)=>ids.indexOf(id)!==index)};
  },
  snapshot() {
    const trigger = document.querySelector('[aria-expanded]');
    const panel = document.querySelector('[popover]');
    return {exists:!!panel,popover:panel?.getAttribute('popover'),nativeOpen:!!panel?.matches(':popover-open'),visible:!!panel && getComputedStyle(panel).display!=='none' && panel.getBoundingClientRect().height>0,expanded:trigger?.getAttribute('aria-expanded')};
  }
};`;
await build({
  stdin: { contents: client, resolveDir: root },
  bundle: true,
  splitting: true,
  format: "esm",
  platform: "browser",
  outdir: temp,
  define: {
    "process.env.NODE_ENV": '"development"',
    "import.meta.env.BASE_URL": '"/"',
    __VUE_OPTIONS_API__: "true",
    __VUE_PROD_DEVTOOLS__: "false",
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true",
  },
  logLevel: "silent",
});
const server = http.createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");
  if (url.pathname === "/") {
    const fixture = fixtures[Number(url.searchParams.get("case"))];
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end(
      '<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="/stdin.css"></head><body><main id="host">' +
        fixture.html +
        '</main><button id="outside">Outside</button><script type="module" src="/stdin.js"></script></body></html>',
    );
    return;
  }
  const file = path.resolve(temp, "." + url.pathname);
  if (!file.startsWith(temp + path.sep) || !fs.existsSync(file)) {
    response.writeHead(404).end();
    return;
  }
  response.setHeader(
    "Content-Type",
    file.endsWith(".js") ? "text/javascript" : "text/css",
  );
  response.end(fs.readFileSync(file));
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const results = [];
let browser;
try {
  browser = await browserType.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  let messages = [];
  let pageErrors = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type()))
      messages.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  for (const [index, fixture] of fixtures.entries()) {
    messages = [];
    pageErrors = [];
    const result = {
      name: fixture.name,
      framework: fixture.framework,
      behavior: Boolean(fixture.behavior),
    };
    try {
      // Reload for each case: client-only module caches must not mask cold hydration defects.
      await page.goto(
        "http://127.0.0.1:" + server.address().port + "/?case=" + index,
      );
      await page.waitForFunction(() => window.hydrationCheck);
      if (fixture.behavior)
        result.serverDOM = await page.evaluate(() =>
          window.hydrationCheck.snapshot(),
        );
      Object.assign(
        result,
        await page.evaluate(
          (args) => window.hydrationCheck.hydrate(args),
          fixture,
        ),
      );
      if (fixture.behavior) {
        result.hydrated = await page.evaluate(() =>
          window.hydrationCheck.snapshot(),
        );
        await page.locator("[aria-expanded]").first().click();
        await page.waitForTimeout(150);
        result.opened = await page.evaluate(() =>
          window.hydrationCheck.snapshot(),
        );
        await page.mouse.click(1100, 850);
        await page.waitForTimeout(150);
        result.dismissed = await page.evaluate(() =>
          window.hydrationCheck.snapshot(),
        );
      }
      result.messages = messages;
      result.pageErrors = pageErrors;
      assert.deepEqual(pageErrors, []);
      assert.deepEqual(result.recoverableErrors, []);
      assert.deepEqual(result.duplicateIds, []);
      assert(result.rootRetained, "Hydration replaced the server root");
      assert(
        !messages.some((message) =>
          /hydration|mismatch|server rendered|uncaught/i.test(message),
        ),
        messages.join("\n"),
      );
      if (fixture.behavior) {
        for (const state of [
          result.serverDOM,
          result.hydrated,
          result.dismissed,
        ]) {
          assert.equal(state.popover, "auto");
          assert.equal(state.nativeOpen, false);
          assert.equal(state.visible, false);
          assert.equal(state.expanded, "false");
        }
        assert.equal(result.opened.nativeOpen, true);
        assert.equal(result.opened.visible, true);
        assert.equal(result.opened.expanded, "true");
      }
      result.passed = true;
    } catch (error) {
      result.passed = false;
      result.error = error.message;
      result.messages = messages;
      result.pageErrors = pageErrors;
    }
    results.push(result);
  }
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
const failed = results.filter((result) => !result.passed);
if (process.env.PEAUI_HYDRATION_REPORT) {
  const file = path.resolve(process.env.PEAUI_HYDRATION_REPORT);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    JSON.stringify(
      {
        date: new Date().toISOString(),
        engine,
        cases: results.length,
        failed: failed.length,
        results,
      },
      null,
      2,
    ) + "\n",
  );
}
console.log(JSON.stringify({ engine, cases: results.length, failed }, null, 2));
assert.equal(
  failed.length,
  0,
  `${failed.length} hydration cases failed in ${engine}`,
);
