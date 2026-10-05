import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { build } from "esbuild";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageRoot = join(repositoryRoot, "packages", "library");
const sourceRoot = join(packageRoot, "src", "components");
const distRoot = join(packageRoot, "dist");
const manifest = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8"),
);
const packageIndex = readFileSync(join(packageRoot, "src", "index.ts"), "utf8");
const errors = [];
const checkedEntries = { react: 0, vue: 0, wc: 0 };
const componentEntries = [];
const bundleMeasurements = [];
const componentBudgets = JSON.parse(
  readFileSync(join(repositoryRoot, "scripts/component-budgets.json"), "utf8"),
);
const require = createRequire(import.meta.url);

function validateArtifactNames(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const artifactPath = join(directory, entry.name);

    if (entry.name.toLowerCase().includes("undefined")) {
      errors.push(
        `Artefakt paczki zawiera niepoprawny segment "undefined": ${relative(repositoryRoot, artifactPath)}`,
      );
    }

    if (entry.isDirectory()) validateArtifactNames(artifactPath);
  }
}

function getDirectoryStats(directory) {
  let files = 0;
  let bytes = 0;

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const artifactPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      const nested = getDirectoryStats(artifactPath);
      files += nested.files;
      bytes += nested.bytes;
      continue;
    }

    files += 1;
    bytes += readFileSync(artifactPath).byteLength;
  }

  return { files, bytes };
}

function validateJavaScriptSourceMaps(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const artifactPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (artifactPath === join(distRoot, "sources")) continue;
      validateJavaScriptSourceMaps(artifactPath);
      continue;
    }

    if (
      /\.(?:js|cjs)$/.test(entry.name) &&
      !existsSync(`${artifactPath}.map`)
    ) {
      errors.push(
        `Brak mapy zrodlowej dla ${relative(repositoryRoot, artifactPath)}`,
      );
    }
  }
}

function getStaticEsmClosure(entryFile) {
  const files = new Set();

  function visit(file) {
    const resolvedFile = resolve(file);
    if (files.has(resolvedFile) || !existsSync(resolvedFile)) return;
    files.add(resolvedFile);

    const source = readFileSync(resolvedFile, "utf8");
    for (const match of source.matchAll(
      /(?:from\s+|import\s+|require\(\s*)["']([^"']+)["']/g,
    )) {
      if (!match[1].startsWith(".")) continue;
      visit(resolve(dirname(resolvedFile), match[1]));
    }
  }

  visit(entryFile);
  return files;
}

function validateGzipBudget(relativeEntry, maximumBytes) {
  const entryFile = join(distRoot, relativeEntry);
  if (!existsSync(entryFile)) return;

  const closure = getStaticEsmClosure(entryFile);
  const gzipBytes = [...closure].reduce(
    (total, file) => total + gzipSync(readFileSync(file)).byteLength,
    0,
  );

  if (gzipBytes > maximumBytes) {
    errors.push(
      `Przekroczony budżet ESM ${relativeEntry}: ${gzipBytes} B gzip > ${maximumBytes} B`,
    );
  }
}

function validateAutomaticStyles(relativeEntry, framework, component) {
  const entryFile = join(distRoot, relativeEntry);
  if (!existsSync(entryFile)) return;

  const cssFiles = [...getStaticEsmClosure(entryFile)].filter((file) =>
    file.endsWith(".css"),
  );

  if (cssFiles.length === 0) {
    errors.push(
      `Brak automatycznego importu CSS dla ${framework}/${component}`,
    );
  }

  if (cssFiles.includes(join(distRoot, "styles.css"))) {
    errors.push(
      `Komponent ${framework}/${component} importuje pełny styles.css zamiast stylów komponentu`,
    );
  }
}

function validateCommonJsNodeLoad(relativeEntry, description) {
  const entryFile = join(distRoot, relativeEntry);
  if (!existsSync(entryFile)) return;

  const source = readFileSync(entryFile, "utf8");
  if (/require\(["'][^"']+\.css["']\)/.test(source)) {
    errors.push(`${description} bezpoĹ›rednio wymaga pliku CSS w Node`);
    return;
  }

  try {
    require(entryFile);
  } catch (error) {
    errors.push(
      `${description} nie daje siÄ™ zaĹ‚adowaÄ‡ przez require(): ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function assertFile(path, description) {
  if (!existsSync(path)) {
    errors.push(`${description}: ${relative(repositoryRoot, path)}`);
  }
}

function validateComponent(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const relativeDirectory = relative(sourceRoot, directory)
    .split(sep)
    .join("/");
  const implementations = [
    ["index.vue", "vue"],
    ["index.tsx", "react"],
    ["index.wc.ts", "wc"],
  ];

  const availableImplementations = implementations.filter(([sourceFile]) =>
    entries.some((entry) => entry.isFile() && entry.name === sourceFile),
  );

  if (
    availableImplementations.length > 0 &&
    availableImplementations.length < implementations.length
  ) {
    for (const [sourceFile, framework] of implementations) {
      if (
        !entries.some((entry) => entry.isFile() && entry.name === sourceFile)
      ) {
        errors.push(
          `Brak implementacji ${framework} komponentu ${relativeDirectory}: ${sourceFile}`,
        );
      }
    }
  }

  for (const [sourceFile, framework] of implementations) {
    if (!entries.some((entry) => entry.isFile() && entry.name === sourceFile)) {
      continue;
    }

    assertFile(
      join(distRoot, "components", framework, `${relativeDirectory}.js`),
      `Brak modułu ESM komponentu ${framework}`,
    );
    assertFile(
      join(distRoot, "components", framework, `${relativeDirectory}.umd.cjs`),
      `Brak modułu CommonJS komponentu ${framework}`,
    );
    assertFile(
      join(distRoot, framework, `${relativeDirectory}.d.ts`),
      `Brak deklaracji komponentu ${framework}`,
    );
    validateAutomaticStyles(
      `components/${framework}/${relativeDirectory}.js`,
      framework,
      relativeDirectory,
    );
    componentEntries.push({
      entry: `components/${framework}/${relativeDirectory}.js`,
      framework,
      component: relativeDirectory,
    });
    if (framework !== "wc") {
      validateCommonJsNodeLoad(
        `components/${framework}/${relativeDirectory}.umd.cjs`,
        `CommonJS ${framework}/${relativeDirectory}`,
      );
    }

    if (
      framework === "vue" &&
      !packageIndex.includes(`'./components/${relativeDirectory}/index.vue'`)
    ) {
      errors.push(`Brak komponentu Vue w głównym API: ${relativeDirectory}`);
    }

    checkedEntries[framework] += 1;
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      validateComponent(join(directory, entry.name));
    }
  }
}

for (const [field, expected] of [
  ["name", "@peaui/ui"],
  ["license", "MIT"],
]) {
  if (manifest[field] !== expected) {
    errors.push(`Niepoprawne pole ${field} w package.json`);
  }
}

if (manifest.private === true) {
  errors.push("Paczka biblioteki nie może mieć private=true");
}

if (manifest.publishConfig?.access !== "public") {
  errors.push("publishConfig.access musi mieć wartość public");
}

for (const [path, description] of [
  [join(packageRoot, "LICENSE"), "Brak licencji"],
  [join(packageRoot, "README.md"), "Brak README paczki"],
  [join(distRoot, "index.js"), "Brak głównego modułu ESM"],
  [join(distRoot, "index.umd.cjs"), "Brak głównego modułu CommonJS"],
  [join(distRoot, "index.d.ts"), "Brak głównych deklaracji typów"],
  [join(distRoot, "styles.css"), "Brak arkusza stylów"],
]) {
  assertFile(path, description);
}

assertFile(
  join(packageRoot, "THIRD_PARTY_LICENSES.md"),
  "Brak informacji o licencjach zaleznosci",
);
assertFile(
  join(distRoot, "index.js.map"),
  "Brak mapy zrodlowej glownego modulu ESM",
);

assertFile(
  join(packageRoot, "custom-elements.json"),
  "Brak manifestu Custom Elements",
);
assertFile(
  join(distRoot, "web-components.d.ts"),
  "Brak globalnych typow Web Components",
);

validateComponent(sourceRoot);
validateArtifactNames(distRoot);
validateJavaScriptSourceMaps(distRoot);
validateCommonJsNodeLoad("index.umd.cjs", "GĹ‚Ăłwny moduĹ‚ CommonJS");
validateGzipBudget("styles.css", 45 * 1024);

// Measure the actual consumer bundle; static module closures count exports the bundler removes.
// React budgets include canonical feedback glyphs and real tooltip/form composition.
// TableList also composes editing/select/selection/tag controls; TransferList composes
// SearchInput, checkbox, error/empty/loading states and actions instead of incomplete copies.
for (const { entry, framework, component } of componentEntries) {
  const budget = componentBudgets[`${framework}/${component}`];
  if (!budget) {
    errors.push(`Missing component budget: ${framework}/${component}`);
    continue;
  }
  const result = await build({
    entryPoints: [join(distRoot, entry)],
    bundle: true,
    minify: true,
    splitting: true,
    format: "esm",
    platform: "browser",
    metafile: true,
    write: false,
    outdir: join(distRoot, "__consumer_budget__"),
    logLevel: "silent",
    external: ["vue", "vue/*", "react", "react/*", "react-dom", "react-dom/*"],
  });
  const output = new Map(
    Object.entries(result.metafile.outputs).map(([file, metadata]) => [
      resolve(file),
      metadata,
    ]),
  );
  const initial = [...output].find(
    ([, metadata]) =>
      metadata.entryPoint &&
      resolve(metadata.entryPoint) === join(distRoot, entry),
  );
  const reached = new Set();
  const visit = (file, closure = reached, includeDynamic = false) => {
    const absolute = resolve(file);
    if (closure.has(absolute)) return;
    closure.add(absolute);
    for (const dependency of output.get(absolute)?.imports ?? []) {
      if (
        !dependency.external &&
        (includeDynamic || dependency.kind !== "dynamic-import")
      )
        visit(dependency.path, closure, includeDynamic);
    }
  };
  if (!initial) throw new Error(`Missing consumer entry: ${entry}`);
  visit(initial[0]);
  // Splitting can emit orphan chunks for dynamic imports removed by tree shaking.
  // Inspect only code a consumer can reach, including its actual lazy imports.
  const runtimeReached = new Set();
  visit(initial[0], runtimeReached, true);
  const gzipBytes = result.outputFiles
    .filter((file) => reached.has(file.path) && file.path.endsWith(".js"))
    .reduce((sum, file) => sum + gzipSync(file.contents).byteLength, 0);
  const entryCSS = initial[1].cssBundle;
  if (framework === "react" && component === "data-display/TableList") {
    const tableCSS = result.outputFiles
      .filter((file) => entryCSS && file.path === resolve(entryCSS))
      .map((file) => file.text)
      .join("\n");
    for (const selector of [
      ".peaui-form-label",
      ".peaui-form-select",
      ".peaui-tag-chip",
    ]) {
      if (!tableCSS.includes(selector))
        errors.push(
          `Missing composed component CSS in isolated TableList import: ${selector}`,
        );
    }
  }
  const cssBytes = result.outputFiles
    .filter((file) => entryCSS && file.path === resolve(entryCSS))
    .reduce((sum, file) => sum + gzipSync(file.contents).byteLength, 0);
  bundleMeasurements.push({
    component,
    framework,
    js: gzipBytes,
    css: cssBytes,
    budget,
  });
  if (gzipBytes > budget.js)
    errors.push(
      `Consumer JS budget exceeded: ${entry}: ${gzipBytes} B gzip > ${budget.js} B`,
    );
  if (cssBytes > budget.css)
    errors.push(
      `Consumer CSS budget exceeded: ${entry}: ${cssBytes} B gzip > ${budget.css} B`,
    );
  const externals = [...output.values()].flatMap((value) =>
    value.imports
      .filter((dependency) => dependency.external)
      .map((dependency) => dependency.path),
  );
  const forbiddenRuntime =
    framework === "react" ? /^vue(?:\/|$)/ : /^react(?:-dom)?(?:\/|$)/;
  if (externals.some((dependency) => forbiddenRuntime.test(dependency)))
    errors.push(`Mixed framework runtimes in ${entry}`);
  if (
    framework === "wc" &&
    budget.native &&
    externals.some((dependency) => /^vue(?:\/|$)/.test(dependency))
  )
    errors.push(`Native element unexpectedly imports Vue: ${entry}`);
  if (
    Object.keys(result.metafile.inputs).some((input) =>
      input.includes("/entities/"),
    )
  )
    errors.push(
      `Browser bundle unexpectedly includes the server HTML decoder: ${entry}`,
    );
  if (
    framework === "react" &&
    [
      "overlayer/InfoTooltip",
      "navigation/NavigationCard",
      "navigation/NavigationStepper",
      "form/FormFieldLabel",
      "form/FormColorPicker",
      "form/FormTimePicker",
      "form/FormDateTimePicker",
      "data-display/DescriptionField",
      "data-display/SectionHeading",
      "data-display/CalculationResults",
      "data-entry/SelectableCard",
    ].includes(component) &&
    [...runtimeReached].some((file) =>
      Object.entries(output.get(file)?.inputs ?? {}).some(
        ([input, contribution]) =>
          input.includes("/icons/runtime/") && contribution.bytesInOutput > 0,
      ),
    )
  )
    errors.push(
      `Bundled control icons unexpectedly include the dynamic icon catalog: ${entry}`,
    );
  if (
    framework === "react" &&
    [
      "form/FormInput",
      "form/FormNumber",
      "data-entry/SearchInput",
      "data-entry/InputSlider",
    ].includes(component) &&
    [...output.values()].some((metadata) =>
      Object.entries(metadata.inputs).some(
        ([input, contribution]) =>
          input.includes("/FormPassword/strength.helper.") &&
          contribution.bytesInOutput > 0,
      ),
    )
  )
    errors.push(
      `Text input unexpectedly includes password strength logic: ${entry}`,
    );
}

const distStats = getDirectoryStats(distRoot);
if (process.env.PEAUI_BUNDLE_REPORT) {
  writeFileSync(
    process.env.PEAUI_BUNDLE_REPORT,
    JSON.stringify(
      {
        date: new Date().toISOString(),
        components: bundleMeasurements,
        dist: distStats,
      },
      null,
      2,
    ) + "\n",
  );
}

if (distStats.bytes > 16 * 1024 * 1024) {
  errors.push(
    `Przekroczony budzet dist: ${distStats.bytes} B > ${16 * 1024 * 1024} B`,
  );
}

const debugSources = getDirectoryStats(join(distRoot, "sources"));
if (debugSources.files > 700)
  errors.push(`Too many debug source files: ${debugSources.files} > 700`);
if (distStats.files - debugSources.files > 4000) {
  errors.push(
    `Przekroczony budzet liczby plikow dist bez zrodel debugowania: ${distStats.files - debugSources.files} > 4000`,
  );
}

if (errors.length > 0) {
  console.error("Walidacja paczki npm nie powiodła się:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exitCode = 1;
} else {
  const totalEntries = Object.values(checkedEntries).reduce(
    (total, count) => total + count,
    0,
  );
  console.log(
    `Paczka npm jest kompletna: Vue ${checkedEntries.vue}, React ${checkedEntries.react}, ` +
      `Web Components ${checkedEntries.wc} (${totalEntries} wejść komponentów).`,
  );
}
