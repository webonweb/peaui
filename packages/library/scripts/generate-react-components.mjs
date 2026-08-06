import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const libraryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const componentsRoot = path.join(libraryRoot, 'src/components');
const reactRoot = path.join(libraryRoot, 'src/react');
const docsApiFile = path.resolve(libraryRoot, '../docs/src/generated/component-api.ts');

function readComponentApi() {
  const source = fs.readFileSync(docsApiFile, 'utf8');
  const start = source.indexOf('= ') + 2;
  const end = source.lastIndexOf(' as const');

  if (start < 2 || end < start) {
    throw new Error('Nie udało się odczytać wygenerowanego API komponentów Vue.');
  }

  return JSON.parse(source.slice(start, end));
}

function toPublicName(sourceName) {
  return sourceName === 'PhotoEditior' ? 'PhotoEditor' : sourceName;
}

function toCamelCase(value) {
  return value.replace(/[-:]([a-z])/g, (_, character) => character.toUpperCase());
}

function toPascalCase(value) {
  const camel = toCamelCase(value.replace(/^on:/, ''));
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function getCallbackName(eventName) {
  if (eventName === 'update:open') return 'onOpenChange';
  if (eventName === 'on:dblclick') return 'onRowDoubleClick';
  if (eventName === 'keydown') return 'onKeyDown';
  if (eventName === 'pointerdown') return 'onPointerDown';
  return `on${toPascalCase(eventName)}`;
}

function normalizeType(type, propertyName = '') {
  if (propertyName === 'columns') return 'PeauiTableColumn[]';
  if (propertyName === 'records') return 'PeauiRecord[]';
  if (['items', 'options', 'tabs'].includes(propertyName)) return 'PeauiOption[]';
  if (propertyName === 'tree') return 'PeauiTreeNode | PeauiTreeNode[]';
  if (propertyName === 'image') return 'string | File | Blob | undefined';
  if (propertyName === 'file') return 'File | undefined';
  if (propertyName === 'sortColumns') return 'PeauiSortDescriptor[]';
  if (propertyName === 'sortType') return "'asc' | 'desc' | undefined";
  if (propertyName === 'value' && type.includes('DatePickerRangeValue')) {
    return 'string | PeauiRangeValue<string> | undefined';
  }
  if (propertyName === 'value' && type.includes('YearPickerRangeValue')) {
    return 'number | PeauiRangeValue<number> | undefined';
  }
  const normalized = type
    .replace(/\bany\b/g, 'unknown')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\|\s*/, '');

  if (
    /^(?:string|number|boolean|unknown|null|undefined|File|Date)(?:\[\])?(?:\s*\|\s*(?:string|number|boolean|unknown|null|undefined|File|Date)(?:\[\])?)*$/.test(
      normalized,
    )
  ) {
    return normalized;
  }

  if (/^(?:'[^']+'\s*\|\s*)*'[^']+'$/.test(normalized)) return normalized;
  if (/^string\[\]$|^number\[\]$|^File\[\]$|^unknown\[\]$/.test(normalized)) return normalized;
  if (/^Record<string, unknown>(?:\[\])?$/.test(normalized)) return normalized;

  return 'unknown';
}

function renderProperty(name, type, required, description) {
  const propertyName = /^[A-Za-z_$][\w$]*$/.test(name) ? name : JSON.stringify(name);
  const optional = required ? '' : '?';
  return `    /** ${description.replace(/\*\//g, '* /')} */\n    ${propertyName}${optional}: ${type};`;
}

function renderProps(api) {
  const entries = [];

  for (const prop of api.props) {
    entries.push(
      renderProperty(
        prop.name,
        normalizeType(prop.type, prop.name),
        prop.required,
        prop.description,
      ),
    );
  }

  for (const model of api.models) {
    const name = toCamelCase(model.name);
    const type = normalizeType(model.type, name);
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    entries.push(renderProperty(name, type, false, model.description));
    entries.push(
      renderProperty(
        `default${capitalized}`,
        type,
        false,
        `Początkowa niekontrolowana wartość właściwości ${name}.`,
      ),
    );
    entries.push(
      renderProperty(
        `on${capitalized}Change`,
        `(value: ${type}) => void`,
        false,
        `Callback React wywoływany po zmianie właściwości ${name}.`,
      ),
    );
  }

  for (const event of api.events) {
    const callbackName = getCallbackName(event.name);

    if (['onClick', 'onKeyDown', 'onPointerDown'].includes(callbackName)) continue;
    if (entries.some((entry) => entry.includes(` ${callbackName}?`))) continue;
    entries.push(
      renderProperty(callbackName, '(...args: unknown[]) => void', false, event.description),
    );
  }

  for (const slot of api.slots) {
    if (slot.name === 'default') continue;
    if (slot.name.includes('[')) {
      if (!entries.some((entry) => entry.includes(' renderCell?'))) {
        entries.push(
          renderProperty(
            'renderCell',
            '(columnKey: string, record: PeauiRecord, rowIndex: number) => ReactNode',
            false,
            'Renderuje niestandardową zawartość komórki tabeli.',
          ),
        );
      }
      continue;
    }
    const name = toCamelCase(slot.name.replace(/[^A-Za-z0-9-]/g, '-'));
    if (!name || entries.some((entry) => entry.includes(` ${name}?`))) continue;
    entries.push(renderProperty(name, 'ReactNode', false, slot.description));
  }

  return entries.join('\n');
}

function writePropsFile(components) {
  const names = components.map((api) => `'${toPublicName(api.name)}'`).join(' | ');
  const map = components
    .map((api) => `  ${toPublicName(api.name)}: PeauiReactBaseProps & {\n${renderProps(api)}\n  };`)
    .join('\n');
  const source =
    `// Ten plik jest generowany przez scripts/generate-react-components.mjs.\n` +
    `// Źródłem kontraktu są publiczne propsy, modele, zdarzenia i sloty komponentów Vue.\n\n` +
    `import type { CSSProperties, KeyboardEventHandler, MouseEventHandler, PointerEventHandler, ReactNode } from 'react';\n\n` +
    `export type ReactComponentName = ${names};\n\n` +
    `export type PeauiReactBaseProps = {\n` +
    `  children?: ReactNode;\n` +
    `  className?: string;\n` +
    `  style?: CSSProperties;\n` +
    `  role?: string;\n` +
    `  tabIndex?: number;\n` +
    `  onClick?: MouseEventHandler<HTMLElement>;\n` +
    `  onKeyDown?: KeyboardEventHandler<HTMLElement>;\n` +
    `  onPointerDown?: PointerEventHandler<HTMLElement>;\n` +
    `  'aria-label'?: string;\n` +
    `  'aria-describedby'?: string;\n` +
    `  'aria-labelledby'?: string;\n` +
    `  'data-testid'?: string;\n` +
    `};\n\n` +
    `export type PeauiRecord = Record<string, unknown>;\n` +
    `export type PeauiOption = { id?: string; key?: string; label: string; value?: unknown; active?: boolean; disabled?: boolean; hint?: string; icon?: string; path?: string; isValid?: boolean; number?: string; status?: 'default' | 'complete' | 'during' | 'disabled' | 'hidden'; additional?: ReactNode };\n` +
    `export type PeauiTableColumn = PeauiRecord & { key: string; label?: string; canSort?: boolean; sortable?: boolean; type?: string; actionName?: string; actionLabel?: string; inline?: boolean; manage?: PeauiRecord };\n` +
    `export type PeauiTreeNode = PeauiRecord & { id?: string | number; label?: string; children?: PeauiTreeNode[] | Record<string, PeauiTreeNode> };\n` +
    `export type PeauiSortDescriptor = { key: string; direction?: 'asc' | 'desc' };\n` +
    `export type PeauiRangeValue<Value> = { from?: Value; to?: Value; start?: Value; end?: Value };\n\n` +
    `export type ReactComponentPropsMap = {\n${map}\n};\n\n` +
    `export type PeauiReactProps<Name extends ReactComponentName> = ReactComponentPropsMap[Name];\n`;

  fs.mkdirSync(reactRoot, { recursive: true });
  fs.writeFileSync(path.join(reactRoot, 'generated-react-props.ts'), source, 'utf8');
}

function writeCatalogFile(components) {
  const entries = components
    .map(
      (api) =>
        `  { category: '${api.category}', name: '${toPublicName(api.name)}', sourceName: '${api.name}' },`,
    )
    .join('\n');
  const source =
    `// Ten plik jest generowany przez scripts/generate-react-components.mjs.\n` +
    `import type { ReactComponentName } from './generated-react-props';\n\n` +
    `export const reactComponentCatalog = [\n${entries}\n] as const satisfies readonly { category: string; name: ReactComponentName; sourceName: string }[];\n`;
  fs.writeFileSync(path.join(reactRoot, 'generated-react-catalog.ts'), source, 'utf8');
}

function writeIconData() {
  const iconsDirectory = path.join(libraryRoot, 'src/assets/icons');
  const icons = fs
    .readdirSync(iconsDirectory)
    .filter((file) => file.endsWith('.svg'))
    .sort()
    .map((file) => {
      const source = fs.readFileSync(path.join(iconsDirectory, file), 'utf8').trim();
      const viewBox = source.match(/viewBox=["']([^"']+)["']/)?.[1] ?? '0 0 24 24';
      const body = source.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)?.[1]?.trim() ?? '';
      return [path.basename(file, '.svg'), { body, viewBox }];
    });
  const source =
    `// Ten plik jest generowany przez scripts/generate-react-components.mjs.\n` +
    `export const reactIconData: Readonly<Record<string, { body: string; viewBox: string }>> = ${JSON.stringify(Object.fromEntries(icons), null, 2)};\n`;
  fs.writeFileSync(path.join(reactRoot, 'generated-icon-data.ts'), source, 'utf8');
}

function writeComponentFiles(components) {
  for (const api of components) {
    const publicName = toPublicName(api.name);
    const directory = path.join(componentsRoot, api.category, api.name);
    const componentSource =
      `import { createPeauiReactComponent } from '@/react/create-peaui-react-component';\n` +
      `import type { PeauiReactProps } from '@/react/generated-react-props';\n\n` +
      `export type ${publicName}Props = PeauiReactProps<'${publicName}'>;\n\n` +
      `const ${publicName} = createPeauiReactComponent('${publicName}');\n\n` +
      `export default ${publicName};\n`;
    const storySource =
      `import type { Meta, StoryObj } from '@storybook/react';\n\n` +
      `import { getReactStoryArgs } from '@/react/story-args';\n` +
      `import ${publicName} from './index';\n\n` +
      `const meta = {\n` +
      `  title: 'React/${api.category}/${publicName}',\n` +
      `  component: ${publicName},\n` +
      `  args: getReactStoryArgs('${publicName}'),\n` +
      `  parameters: { layout: 'padded' },\n` +
      `} satisfies Meta<typeof ${publicName}>;\n\n` +
      `export default meta;\n` +
      `type Story = StoryObj<typeof meta>;\n\n` +
      `export const Default: Story = {};\n` +
      (api.props.some((prop) => prop.name === 'disabled')
        ? `\nexport const Disabled: Story = { args: { disabled: true } };\n`
        : '');

    fs.writeFileSync(path.join(directory, 'index.tsx'), componentSource, 'utf8');
    fs.writeFileSync(path.join(directory, 'index.react.stories.tsx'), storySource, 'utf8');
  }
}

const components = readComponentApi();

writePropsFile(components);
writeCatalogFile(components);
writeIconData();
writeComponentFiles(components);

console.log(`Wygenerowano natywne entry pointy React: ${components.length}.`);
