import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

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

function getStaticEsmClosure(entryFile) {
  const files = new Set();

  function visit(file) {
    const resolvedFile = resolve(file);
    if (files.has(resolvedFile) || !existsSync(resolvedFile)) return;
    files.add(resolvedFile);

    const source = readFileSync(resolvedFile, "utf8");
    for (const match of source.matchAll(/(?:from\s+|import\s+)["']([^"']+)["']/g)) {
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

validateComponent(sourceRoot);
validateArtifactNames(distRoot);
validateGzipBudget("components/react/basic/ImageView.js", 75 * 1024);
validateGzipBudget("components/react/form/FormTimePicker.js", 50 * 1024);
validateGzipBudget("components/react/form/FormDateTimePicker.js", 50 * 1024);
validateGzipBudget("components/react/data-entry/TransferList.js", 50 * 1024);

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
