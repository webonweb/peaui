import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { build } from "esbuild";
import { JSDOM } from "jsdom";
import { build as buildVite } from "vite";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(
  new URL("../packages/library/", import.meta.url),
);
const packageManifest = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8"),
);
const customElementsManifest = JSON.parse(
  readFileSync(join(packageRoot, packageManifest.customElements), "utf8"),
);

test("Custom Elements manifest points to published public constructor exports", async () => {
  const entryPattern = packageManifest.exports["./wc/*"].import;
  const [prefix, suffix] = entryPattern.replace(/^\.\//, "").split("*");
  const imports = customElementsManifest.modules.map((module, index) => {
    assert.ok(
      module.path.startsWith(prefix) && module.path.endsWith(suffix),
      module.path,
    );
    assert.ok(
      existsSync(join(packageRoot, module.path)),
      `Missing manifest module: ${module.path}`,
    );
    assert.ok(
      packageManifest.files.some(
        (file) => module.path === file || module.path.startsWith(`${file}/`),
      ),
      `Manifest module is excluded from the published package: ${module.path}`,
    );
    return `import * as Element${index} from '${packageManifest.name}/${module.path}';`;
  });
  const result = await build({
    stdin: {
      contents: `${imports.join("\n")}\nglobalThis.manifestElements = [${customElementsManifest.modules.map((_, index) => `Element${index}`).join(",")}];`,
      resolveDir: process.cwd(),
    },
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
    outdir: mkdtempSync(join(tmpdir(), "peaui-manifest-consumer-")),
    logLevel: "silent",
  });
  const dom = new JSDOM("", { runScripts: "outside-only" });
  try {
    dom.window.eval(
      result.outputFiles.find((file) => file.path.endsWith(".js")).text,
    );
    for (const [index, module] of customElementsManifest.modules.entries()) {
      const runtime = dom.window.manifestElements[index];
      for (const exported of module.exports) {
        assert.equal(exported.declaration.module, module.path);
        const constructor = runtime[exported.declaration.name];
        assert.equal(
          typeof constructor,
          "function",
          `Missing export: ${exported.declaration.name}`,
        );
        if (exported.kind === "custom-element-definition") {
          assert.equal(
            dom.window.customElements.get(exported.name),
            constructor,
          );
        } else {
          assert.equal(runtime[exported.name], constructor);
        }
      }
    }
  } finally {
    dom.window.close();
  }
});

test("Custom Elements manifest preserves the runtime dataTestId property", async () => {
  const fields = customElementsManifest.modules.flatMap((module) =>
    module.declarations.flatMap((declaration) =>
      declaration.members.filter(
        (member) => member.attribute === "data-testid",
      ),
    ),
  );
  assert.ok(fields.length > 0);
  for (const member of fields) assert.equal(member.name, "dataTestId");

  // Exercise both a handwritten element and the Vue adapter using only manifest names.
  for (const [tagName, testId] of [
    ["peaui-button-action", "manifest-consumer"],
    ["peaui-form-checkbox", "manifest-consumer-element"],
  ]) {
    const module = customElementsManifest.modules.find((module) =>
      module.declarations.some(
        (declaration) => declaration.tagName === tagName,
      ),
    );
    const member = module.declarations[0].members.find(
      (member) => member.attribute === "data-testid",
    );
    const result = await build({
      entryPoints: [join(packageRoot, module.path)],
      bundle: true,
      write: false,
      format: "iife",
      platform: "browser",
      define: {
        "process.env.NODE_ENV": '"production"',
        __VUE_OPTIONS_API__: "true",
        __VUE_PROD_DEVTOOLS__: "false",
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
      },
      outdir: mkdtempSync(join(tmpdir(), "peaui-manifest-property-")),
      logLevel: "silent",
    });
    const dom = new JSDOM("", { runScripts: "outside-only" });
    try {
      dom.window.eval(
        result.outputFiles.find((file) => file.path.endsWith(".js")).text,
      );
      const element = dom.window.document.createElement(tagName);
      if (tagName === "peaui-form-checkbox") {
        element.id = "manifest-checkbox";
        element.name = "manifest-checkbox";
        element.value = false;
      }
      dom.window.document.body.append(element);
      assert.ok(
        member.name in element,
        `${tagName}.${member.name} is a real property`,
      );
      element[member.name] = "manifest-consumer";
      await Promise.resolve();
      assert.ok(
        element.querySelector(`[data-testid="${testId}"]`),
        `${tagName} renders ${testId}`,
      );
    } finally {
      dom.window.close();
    }
  }
});

test("browser bundlers retain side-effect-only custom element registration", async () => {
  for (const [entry, tag] of [
    ["data-entry/ButtonAction", "peaui-button-action"],
    ["layout/SectionDivider", "peaui-section-divider"],
    ["form/FormSelect", "peaui-form-select"],
    ["data-display/CounterBadge", "peaui-counter-badge"],
    ["feedback/SpinnerLoader", "peaui-spinner-loader"],
  ]) {
    const result = await build({
      stdin: {
        contents: `import '@peaui/ui/wc/${entry}';`,
        resolveDir: process.cwd(),
      },
      bundle: true,
      write: false,
      format: "iife",
      platform: "browser",
      metafile: true,
      outdir: mkdtempSync(join(tmpdir(), "peaui-consumer-")),
      logLevel: "silent",
    });
    const dom = new JSDOM("", { runScripts: "outside-only" });
    try {
      dom.window.eval(
        result.outputFiles.find((file) => file.path.endsWith(".js")).text,
      );
      assert.ok(
        dom.window.customElements.get(tag),
        `${tag} must survive tree shaking`,
      );
      assert.ok(
        result.outputFiles.some((file) => file.path.endsWith(".css")),
        `${tag} needs CSS`,
      );
      if (
        [
          "peaui-section-divider",
          "peaui-counter-badge",
          "peaui-spinner-loader",
        ].includes(tag)
      ) {
        assert.ok(
          !Object.keys(result.metafile.inputs).some((file) =>
            /(?:@vue|node_modules\/vue)/.test(file),
          ),
          "Native separator must not include a framework runtime",
        );
      }
    } finally {
      dom.window.close();
    }
  }
});

test("Node ESM consumers render default React and Vue imports without CSS loaders", async () => {
  const React = await import("react");
  const { renderToString: renderReact } = await import("react-dom/server");
  const { createSSRApp } = await import("vue");
  const { renderToString: renderVue } = await import("vue/server-renderer");
  const { default: ReactButton } =
    await import("@peaui/ui/react/data-entry/ButtonAction");
  const { default: VueButton } =
    await import("@peaui/ui/vue/data-entry/ButtonAction");
  assert.match(
    renderReact(React.createElement(ReactButton, null, "Save")),
    /<button/,
  );
  assert.match(await renderVue(createSSRApp(VueButton, null)), /<button/);
});

test("a real Vue table renders nested records in SSR without DOMParser", async () => {
  const { createSSRApp } = await import("vue");
  const { renderToString } = await import("vue/server-renderer");
  const { default: Table } =
    await import("@peaui/ui/vue/data-display/TableList");
  const html = await renderToString(
    createSSRApp(Table, {
      columns: [{ key: "user.name", label: "<b>Name &amp; surname</b>" }],
      records: [{ id: "1", user: { name: "Ada" } }],
    }),
  );
  assert.match(html, /Ada/);
});

test("the Vite import transform keeps named Vue and React imports at component CSS size", async () => {
  const { peauiImports } = await import("@peaui/ui/vite");
  async function bundle(source, optimize) {
    const entry = join(process.cwd(), "__peaui-consumer__.js");
    const result = await buildVite({
      configFile: false,
      logLevel: "silent",
      plugins: [
        {
          name: "consumer-fixture",
          resolveId: (id) => (id === entry ? entry : undefined),
          load: (id) => (id === entry ? source : undefined),
        },
        ...(optimize ? [peauiImports()] : []),
      ],
      build: {
        write: false,
        rollupOptions: {
          input: entry,
          external: [/^vue(?:\/|$)/, /^react(?:\/|$)/, /^react-dom(?:\/|$)/],
        },
      },
    });
    const output = (Array.isArray(result) ? result[0] : result).output;
    return {
      css: output
        .filter(
          (item) => item.type === "asset" && item.fileName.endsWith(".css"),
        )
        .reduce((sum, item) => sum + Buffer.byteLength(item.source), 0),
      imports: output
        .filter((item) => item.type === "chunk")
        .flatMap((item) => item.imports),
      js: output
        .filter((item) => item.type === "chunk" && item.isEntry)
        .reduce((sum, item) => sum + gzipSync(item.code).byteLength, 0),
    };
  }
  for (const framework of ["vue", "react"])
    for (const [name, category, jsBudget] of [
      ["ButtonAction", "data-entry", 3000],
      ["GridItem", "layout", 1600],
      ["FormFieldLabel", "form", 6500],
    ]) {
      const direct = await bundle(
        `import Component from '@peaui/ui/${framework}/${category}/${name}'; console.log(Component);`,
        false,
      );
      const named = await bundle(
        `import { ${name} as Component } from '@peaui/ui/${framework}'; console.log(Component);`,
        true,
      );
      assert.ok(
        named.css > 0 && named.css <= direct.css * 1.01,
        `${framework} named import must retain only Button CSS: ${named.css} vs ${direct.css}`,
      );
      assert.ok(
        named.js < jsBudget,
        `${framework} ${name} must remain below ${jsBudget} B gzip`,
      );
      assert.ok(
        !named.imports.some((specifier) =>
          specifier.startsWith(framework === "react" ? "vue" : "react"),
        ),
        `${framework} must not pull in the other framework`,
      );
    }
});

test("published source maps resolve to deduplicated debug sources", () => {
  const dist = fileURLToPath(
    new URL("../packages/library/dist/", import.meta.url),
  );
  let checked = 0;
  const formats = new Set();
  for (const file of readdirSync(dist, { recursive: true }).filter((entry) =>
    entry.endsWith(".map"),
  )) {
    const mapPath = join(dist, file);
    const map = JSON.parse(readFileSync(mapPath, "utf8"));
    for (const [index, source] of (map.sources ?? []).entries()) {
      if (
        map.sourcesContent?.[index] !== undefined &&
        map.sourcesContent[index] !== null
      )
        continue;
      assert.ok(
        existsSync(resolve(dirname(mapPath), source)),
        `Missing debug source: ${file}: ${source}`,
      );
      checked++;
      formats.add(file.endsWith(".cjs.map") ? "cjs" : "esm");
    }
  }
  assert.ok(
    checked > 0 && formats.size === 2,
    "Both ESM and CommonJS maps retain their original sources",
  );
});
