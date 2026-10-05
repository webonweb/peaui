import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'prettier';

const libraryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = path.resolve(libraryRoot, '../..');
const apiFile = path.join(repositoryRoot, 'packages/docs/src/generated/framework-component-api.ts');
const manifestFile = path.join(libraryRoot, 'custom-elements.json');
const typesFile = path.join(libraryRoot, 'src/web-components.ts');
const checkOnly = process.argv.includes('--check');
const packageManifest = JSON.parse(fs.readFileSync(path.join(libraryRoot, 'package.json'), 'utf8'));

function readWebComponentApi() {
  const source = fs.readFileSync(apiFile, 'utf8');
  const match = source.match(
    /export const generatedWebComponentApi = (\[[\s\S]*?\]) as const satisfies readonly FrameworkComponentApi\[];/,
  );

  if (!match) throw new Error('Nie mozna odczytac wygenerowanego API Web Components.');
  // The matched value is a committed, generated local literal (no user input).
  return Function(`"use strict"; return (${match[1]});`)();
}

function createManifest(components) {
  return {
    schemaVersion: '1.0.0',
    readme: 'README.md',
    modules: components.map((component) => {
      // Consumers receive compiled entry points; source files are not part of the package.
      const modulePath = packageManifest.exports['./wc/*'].import
        .replace('*', `${component.category}/${component.sourceName}`)
        .replace(/^\.\//, '');
      const className = `${component.name}Element`;
      const members = [...component.props, ...component.models]
        .filter(
          (entry, index, entries) =>
            entries.findIndex((item) => item.name === entry.name) === index,
        )
        .map((entry) => ({
          kind: 'field',
          // data-testid is the HTML spelling of the public dataTestId property.
          name:
            entry.name === 'data-testid'
              ? 'dataTestId'
              : entry.name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
          attribute: entry.name,
          type: { text: entry.type },
          description: entry.description,
          ...(entry.default === undefined ? {} : { default: entry.default }),
        }));

      return {
        kind: 'javascript-module',
        path: modulePath,
        declarations: [
          {
            kind: 'class',
            name: className,
            tagName: component.tagName,
            customElement: true,
            description: `${component.name} Web Component z publicznego katalogu PEAUI.`,
            members,
            events: component.events.map((event) => ({
              name: event.name,
              type: { text: 'CustomEvent<unknown>' },
              description: event.description,
            })),
            slots: component.slots.map((slot) => ({
              name: slot.name === 'default' ? '' : slot.name,
              description: slot.description,
            })),
          },
        ],
        exports: [
          { kind: 'js', name: className, declaration: { name: className, module: modulePath } },
          {
            kind: 'custom-element-definition',
            name: component.tagName,
            declaration: { name: className, module: modulePath },
          },
        ],
      };
    }),
  };
}

function createTypes(components) {
  const entries = components
    .map(
      (component) =>
        `    '${component.tagName}': InstanceType<typeof import('./components/${component.category}/${component.sourceName}/index.wc').default>;`,
    )
    .join('\n');
  const tagNames = components.map((component) => `  '${component.tagName}',`).join('\n');

  return (
    `// Ten plik jest generowany przez scripts/generate-custom-elements-manifest.mjs.\n` +
    `// Zapewnia typy dla document.createElement/querySelector bez rejestrowania elementow.\n\n` +
    `export const PEAUI_WEB_COMPONENT_TAG_NAMES = [\n${tagNames}\n] as const;\n\n` +
    `export type PeauiWebComponentTagName = (typeof PEAUI_WEB_COMPONENT_TAG_NAMES)[number];\n\n` +
    `declare global {\n  interface HTMLElementTagNameMap {\n${entries}\n  }\n}\n\n` +
    `export {};\n`
  );
}

function checkFile(file, expected, label) {
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== expected) {
    throw new Error(`${label} nie jest aktualny. Uruchom npm run custom-elements:generate.`);
  }
}

const components = readWebComponentApi();
const manifest = `${JSON.stringify(createManifest(components), null, 2)}\n`;
const types = await format(createTypes(components), {
  parser: 'typescript',
  printWidth: 100,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
});

if (checkOnly) {
  checkFile(manifestFile, manifest, 'custom-elements.json');
  checkFile(typesFile, types, 'src/web-components.ts');
  console.log(`[custom-elements] OK: ${components.length} elementow.`);
} else {
  fs.writeFileSync(manifestFile, manifest, 'utf8');
  fs.writeFileSync(typesFile, types, 'utf8');
  console.log(`[custom-elements] Zapisano ${components.length} elementow.`);
}
