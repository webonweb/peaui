import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const componentsRoot = path.resolve(docsRoot, '../library/src/components');
const outputFile = path.resolve(docsRoot, 'src/generated/component-api.ts');
const frameworkOutputFile = path.resolve(docsRoot, 'src/generated/framework-component-api.ts');

const categoryLabels = {
  basic: 'Podstawowe',
  'data-display': 'Prezentacja danych',
  'data-entry': 'Wprowadzanie danych',
  feedback: 'Informacje zwrotne',
  form: 'Formularze',
  layout: 'Układ',
  navigation: 'Nawigacja',
  overlayer: 'Warstwy i okna',
};

const propDescriptions = {
  active: 'Określa aktywny element albo aktywny krok.',
  after: 'Treść wyświetlana za właściwą wartością pola.',
  alt: 'Alternatywny opis obrazu używany przez technologie asystujące.',
  ariaLabel: 'Dostępna nazwa elementu przekazywana przez aria-label.',
  before: 'Treść wyświetlana przed właściwą wartością pola.',
  canCreate: 'Włącza możliwość dodawania nowych rekordów.',
  canErase: 'Pokazuje akcję pozwalającą wyczyścić bieżącą wartość.',
  canHideColumns: 'Pozwala użytkownikowi sterować widocznością kolumn.',
  canSelectRows: 'Włącza możliwość zaznaczania wierszy.',
  columns: 'Definicje kolumn określające ich etykiety, klucze i sposób renderowania.',
  dataTestId: 'Stabilny identyfikator data-testid przeznaczony dla testów automatycznych.',
  description: 'Dodatkowy opis objaśniający zawartość albo stan komponentu.',
  disabled: 'Wyłącza komponent i blokuje jego interakcje.',
  editable: 'Włącza tryb edycji danych.',
  error: 'Komunikat błędu powiązany z polem lub operacją.',
  gap: 'Odstęp pomiędzy elementami układu.',
  icon: 'Nazwa ikony prezentowanej przez komponent.',
  iconAfter: 'Nazwa ikony wyświetlanej za treścią pola.',
  iconBefore: 'Nazwa ikony wyświetlanej przed treścią pola.',
  id: 'Unikalny identyfikator elementu w dokumencie.',
  isLoading: 'Włącza stan ładowania i informuje o trwającej operacji.',
  label: 'Widoczna etykieta opisująca element lub pole formularza.',
  max: 'Maksymalna dozwolona wartość albo szerokość.',
  maxLength: 'Maksymalna liczba znaków możliwa do wprowadzenia.',
  min: 'Minimalna dozwolona wartość.',
  name: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
  open: 'Steruje widocznością rozwijanego elementu albo warstwy.',
  options: 'Lista opcji dostępnych do wyświetlenia lub wyboru.',
  page: 'Numer aktualnie wybranej strony.',
  placeholder: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
  readonly: 'Ustawia komponent w trybie tylko do odczytu.',
  records: 'Kolekcja rekordów prezentowanych przez komponent.',
  required: 'Oznacza wartość jako wymaganą.',
  rowsPerPage: 'Liczba rekordów wyświetlanych na jednej stronie.',
  selected: 'Określa bieżące zaznaczenie.',
  selectedRows: 'Identyfikatory aktualnie zaznaczonych wierszy.',
  size: 'Wariant rozmiaru komponentu.',
  src: 'Adres źródłowy obrazu albo innego zasobu.',
  status: 'Stan wizualny i semantyczny komponentu.',
  step: 'Krok zmiany wartości liczbowej.',
  title: 'Główny tytuł prezentowany w komponencie.',
  total: 'Łączna liczba elementów.',
  totalPages: 'Łączna liczba stron dostępnych w paginacji.',
  type: 'Wariant funkcjonalny lub wizualny komponentu.',
  value: 'Bieżąca wartość kontrolowana przez v-model.',
  variant: 'Wariant wizualny komponentu.',
};

const modelDescriptions = {
  file: 'Wybrany plik kontrolowany przez v-model:file.',
  files: 'Lista wybranych plików kontrolowana przez v-model:files.',
  image: 'Edytowany obraz kontrolowany przez v-model:image.',
  limit: 'Wybrany limit elementów kontrolowany przez v-model:limit.',
  open: 'Stan otwarcia kontrolowany przez v-model:open.',
  page: 'Aktualna strona kontrolowana przez v-model:page.',
  tree: 'Dane drzewa kontrolowane przez v-model:tree.',
  value: 'Bieżąca wartość kontrolowana przez v-model:value.',
};

const eventDescriptions = {
  'on:change': 'Emitowane po zmianie wartości.',
  'on:changeValue': 'Emitowane po zmianie wartości komórki; przekazuje identyfikator rekordu i nową wartość.',
  'on:click': 'Emitowane po aktywacji komponentu.',
  'on:close': 'Emitowane podczas zamykania komponentu.',
  'on:dblclick': 'Emitowane po dwukrotnym kliknięciu wiersza; przekazuje identyfikator i rekord.',
  'on:dbclick': 'Przestarzała nazwa zdarzenia dwukrotnego kliknięcia. Użyj „on:dblclick”.',
  'on:remove': 'Emitowane po wybraniu akcji usunięcia.',
  'on:select': 'Emitowane po wybraniu elementu.',
  'on:submit': 'Emitowane po zatwierdzeniu danych.',
};

function humanize(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/^./, (character) => character.toUpperCase());
}

function walkDirectories(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (!entry.isDirectory() || entry.name === '__internal__') return [];
    if (fs.existsSync(path.join(entryPath, 'index.vue'))) return [entryPath];

    return walkDirectories(entryPath);
  });
}

function walkFrameworkDirectories(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (!entry.isDirectory() || entry.name === '__internal__') return [];

    const hasImplementation = ['index.vue', 'index.tsx', 'index.wc.ts'].some((file) =>
      fs.existsSync(path.join(entryPath, file)),
    );

    return [...(hasImplementation ? [entryPath] : []), ...walkFrameworkDirectories(entryPath)];
  });
}

function getScript(source) {
  return [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1])
    .join('\n');
}

function getTemplate(source) {
  const templateStart = source.indexOf('<template');
  const templateEnd = source.lastIndexOf('</template>');

  if (templateStart === -1 || templateEnd === -1) return '';
  const contentStart = source.indexOf('>', templateStart) + 1;

  return source.slice(contentStart, templateEnd);
}

function getPropertyName(node, sourceFile) {
  return node.name?.getText(sourceFile).replace(/^['\"]|['\"]$/g, '') ?? '';
}

function getDocumentation(node) {
  const documentation = ts
    .getJSDocCommentsAndTags(node)
    .map((entry) => entry.getText())
    .join(' ')
    .replace(/^\/\*\*|\*\/$/g, '')
    .replace(/\s*\*\s*/g, ' ')
    .trim();

  return documentation || undefined;
}

function literalValue(node, sourceFile) {
  if (!node) return undefined;
  if (ts.isArrowFunction(node)) return node.body.getText(sourceFile);
  const text = node.getText(sourceFile);

  if (/^['\"`]/.test(text)) return text.slice(1, -1);
  return text;
}

function getTypeText(typeNode, definitions, sourceFile) {
  if (!typeNode) return 'unknown';

  if (ts.isTypeReferenceNode(typeNode)) {
    const definition = definitions.get(typeNode.typeName.getText(sourceFile));

    if (
      definition &&
      ts.isTypeAliasDeclaration(definition) &&
      ts.isUnionTypeNode(definition.type) &&
      definition.type.types.every(
        (entry) =>
          ts.isLiteralTypeNode(entry) ||
          entry.kind === ts.SyntaxKind.UndefinedKeyword ||
          entry.kind === ts.SyntaxKind.NullKeyword ||
          entry.kind === ts.SyntaxKind.StringKeyword ||
          entry.kind === ts.SyntaxKind.NumberKeyword ||
          entry.kind === ts.SyntaxKind.BooleanKeyword ||
          ts.isTypeReferenceNode(entry),
      )
    ) {
      return definition.type.getText(sourceFile);
    }
  }

  return typeNode.getText(sourceFile);
}

function getDefinitions(sourceFile) {
  const definitions = new Map();

  for (const statement of sourceFile.statements) {
    if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) {
      definitions.set(statement.name.text, statement);
    }
  }

  return definitions;
}

function resolveMembers(typeNode, definitions) {
  if (!typeNode) return [];
  if (ts.isTypeLiteralNode(typeNode)) return typeNode.members;

  if (ts.isTypeReferenceNode(typeNode)) {
    const definition = definitions.get(typeNode.typeName.getText());
    if (ts.isInterfaceDeclaration(definition)) return definition.members;
    if (ts.isTypeAliasDeclaration(definition) && ts.isTypeLiteralNode(definition.type)) {
      return definition.type.members;
    }
  }

  return [];
}

function isCallNamed(node, name) {
  return ts.isCallExpression(node) && node.expression.getText() === name;
}

function findVariableDeclaration(node) {
  let current = node;

  while (current && !ts.isVariableDeclaration(current)) current = current.parent;
  return current;
}

function readPropsDefaults(call, sourceFile) {
  const defaults = {};
  const variable = findVariableDeclaration(call);

  if (variable && ts.isObjectBindingPattern(variable.name)) {
    for (const element of variable.name.elements) {
      if (!element.initializer) continue;
      const name = (element.propertyName ?? element.name).getText(sourceFile);
      defaults[name] = literalValue(element.initializer, sourceFile);
    }
  }

  if (call.parent && isCallNamed(call.parent, 'withDefaults')) {
    const defaultsObject = call.parent.arguments[1];

    if (defaultsObject && ts.isObjectLiteralExpression(defaultsObject)) {
      for (const property of defaultsObject.properties) {
        if (!ts.isPropertyAssignment(property)) continue;
        defaults[getPropertyName(property, sourceFile)] = literalValue(
          property.initializer,
          sourceFile,
        );
      }
    }
  }

  return defaults;
}

function extractEvents(typeNode, sourceFile) {
  if (!typeNode) return [];
  const text = typeNode.getText(sourceFile);
  const names = new Set();

  for (const match of text.matchAll(/['\"]([^'\"]+)['\"]\s*:/g)) names.add(match[1]);
  for (const match of text.matchAll(/(?:e|event)\s*:\s*['\"]([^'\"]+)['\"]/g)) names.add(match[1]);

  return [...names].map((name) => ({
    name,
    description: eventDescriptions[name] ?? `Emitowane, gdy komponent zgłasza zdarzenie „${name}”.`,
  }));
}

function extractComponent(componentDirectory) {
  const file = path.join(componentDirectory, 'index.vue');
  const source = fs.readFileSync(file, 'utf8');
  const script = getScript(source);
  const template = getTemplate(source);
  const sourceFile = ts.createSourceFile(
    file,
    script,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const definitions = getDefinitions(sourceFile);
  const props = [];
  const models = [];
  const events = [];

  function visit(node) {
    if (isCallNamed(node, 'defineProps')) {
      const defaults = readPropsDefaults(node, sourceFile);

      for (const member of resolveMembers(node.typeArguments?.[0], definitions)) {
        if (!ts.isPropertySignature(member)) continue;
        const name = getPropertyName(member, sourceFile);
        const type = getTypeText(member.type, definitions, sourceFile);

        props.push({
          name,
          type,
          required: !member.questionToken && defaults[name] === undefined,
          default: defaults[name],
          description:
            getDocumentation(member) ??
            propDescriptions[name] ??
            `Konfiguruje właściwość „${humanize(name).toLocaleLowerCase('pl-PL')}” komponentu.`,
        });
      }
    }

    if (isCallNamed(node, 'defineModel')) {
      const nameNode = node.arguments[0];
      const optionsNode = node.arguments[1];
      const name = nameNode && ts.isStringLiteralLike(nameNode) ? nameNode.text : 'modelValue';
      let required = false;
      let defaultValue;

      if (optionsNode && ts.isObjectLiteralExpression(optionsNode)) {
        for (const property of optionsNode.properties) {
          if (!ts.isPropertyAssignment(property)) continue;
          const propertyName = getPropertyName(property, sourceFile);
          if (propertyName === 'required')
            required = property.initializer.kind === ts.SyntaxKind.TrueKeyword;
          if (propertyName === 'default')
            defaultValue = literalValue(property.initializer, sourceFile);
        }
      }

      models.push({
        name,
        type: getTypeText(node.typeArguments?.[0], definitions, sourceFile),
        required,
        default: defaultValue,
        description: modelDescriptions[name] ?? `Wartość kontrolowana przez v-model:${name}.`,
      });
    }

    if (isCallNamed(node, 'defineEmits')) {
      events.push(...extractEvents(node.typeArguments?.[0], sourceFile));
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  const slots = new Set();
  for (const match of template.matchAll(/<slot(?:\s[^>]*)?>/g)) {
    const slotMarkup = match[0];
    const name = slotMarkup.match(/\bname=['\"]([^'\"]+)['\"]/)?.[1] ?? 'default';
    slots.add(name);
  }

  const relative = path.relative(componentsRoot, componentDirectory).replace(/\\/g, '/');
  const [category, name] = relative.split('/');

  return {
    name,
    category,
    categoryLabel: categoryLabels[category] ?? humanize(category),
    importPath: `@peaui/ui/${category}/${name}`,
    props,
    models: models.filter(
      (model, index, list) => list.findIndex((item) => item.name === model.name) === index,
    ),
    events: events.filter(
      (event, index, list) => list.findIndex((item) => item.name === event.name) === index,
    ),
    slots: [...slots].map((name) => ({
      name,
      description:
        name === 'default'
          ? 'Główna treść przekazywana do komponentu.'
          : `Treść osadzana w nazwanym slocie „${name}”.`,
    })),
  };
}

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function toCamelCase(value) {
  return value.replace(/[-:]([a-z])/g, (_, character) => character.toUpperCase());
}

function toReactCallbackName(value) {
  if (value === 'update:open') return 'onOpenChange';
  if (value === 'on:dblclick') return 'onRowDoubleClick';
  const normalized = toCamelCase(value.replace(/^on:/, ''));
  return `on${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`;
}

function getFrameworkIdentity(componentDirectory) {
  const relative = path.relative(componentsRoot, componentDirectory).replace(/\\/g, '/');
  const [category, sourceName] = relative.split('/');
  const name = sourceName === 'PhotoEditior' ? 'PhotoEditor' : sourceName;

  return {
    category,
    categoryLabel: categoryLabels[category] ?? humanize(category),
    name,
    sourceName,
  };
}

function extractWebComponent(componentDirectory) {
  const file = path.join(componentDirectory, 'index.wc.ts');
  const source = fs.readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const identity = getFrameworkIdentity(componentDirectory);

  if (source.includes('createVueCustomElement')) {
    const vueApi = extractComponent(componentDirectory);
    const toWebProperty = (entry) => ({
      ...entry,
      name: entry.name === 'dataTestId' ? 'data-testid' : toKebabCase(entry.name),
      description: `${entry.description} W HTML użyj atrybutu z myślnikami; wartości złożone ustaw jako property.`,
    });
    const modelEvents = vueApi.models.map((model) => ({
      name: `update:${model.name}`,
      description: `Natywne zdarzenie CustomEvent emitowane po zmianie właściwości „${model.name}”.`,
    }));

    return {
      ...identity,
      framework: 'web-components',
      importPath: `@peaui/ui/wc/${identity.category}/${identity.sourceName}`,
      tagName: `peaui-${toKebabCase(identity.name)}`,
      status: 'stable',
      props: vueApi.props.map(toWebProperty),
      models: vueApi.models.map(toWebProperty),
      events: [...vueApi.events, ...modelEvents].filter(
        (event, index, list) => list.findIndex((item) => item.name === event.name) === index,
      ),
      slots: vueApi.slots,
    };
  }

  const observedAttributes = new Set();
  const accessorTypes = new Map();
  const events = new Set();

  function visit(node) {
    if (
      ts.isGetAccessorDeclaration(node) &&
      node.name.getText(sourceFile) === 'observedAttributes' &&
      node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword)
    ) {
      const collectAttributes = (child) => {
        if (ts.isStringLiteralLike(child)) observedAttributes.add(child.text);
        ts.forEachChild(child, collectAttributes);
      };
      collectAttributes(node);
    }

    if (
      ts.isGetAccessorDeclaration(node) &&
      !ts.isPrivateIdentifier(node.name) &&
      !node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword)
    ) {
      accessorTypes.set(node.name.getText(sourceFile), node.type?.getText(sourceFile) ?? 'string');
    }

    if (
      ts.isNewExpression(node) &&
      node.expression.getText(sourceFile) === 'CustomEvent' &&
      node.arguments?.[0] &&
      ts.isStringLiteralLike(node.arguments[0])
    ) {
      events.add(node.arguments[0].text);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  for (const property of accessorTypes.keys()) {
    const attributeName =
      property === 'beforeText'
        ? 'before'
        : property === 'afterText'
          ? 'after'
          : property === 'dataTestId'
            ? 'data-testid'
            : property.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    const alreadyDocumented = [...observedAttributes].some(
      (attribute) => toCamelCase(attribute) === property,
    );

    if (!alreadyDocumented) observedAttributes.add(attributeName);
  }

  const props = [...observedAttributes].map((name) => {
    const propertyName = toCamelCase(name === 'for' ? 'for' : name);

    return {
      name,
      type: accessorTypes.get(propertyName) ?? 'string',
      required: false,
      description:
        propDescriptions[propertyName] ??
        `Atrybut HTML „${name}” konfigurujący komponent ${identity.name}.`,
    };
  });

  return {
    ...identity,
    framework: 'web-components',
    importPath: `@peaui/ui/wc/${identity.category}/${identity.sourceName}`,
    tagName: `peaui-${toKebabCase(identity.name)}`,
    status: 'stable',
    props,
    models: [],
    events: [...events].map((name) => ({
      name,
      description:
        eventDescriptions[name] ??
        `Natywne zdarzenie CustomEvent „${name}” emitowane przez element.`,
    })),
    slots: source.includes('childNodes')
      ? [{ name: 'default', description: 'Treść umieszczana wewnątrz elementu niestandardowego.' }]
      : [],
  };
}

function extractReactComponent(componentDirectory) {
  const identity = getFrameworkIdentity(componentDirectory);
  const vueApi = extractComponent(componentDirectory);

  return {
    ...identity,
    framework: 'react',
    importPath: `@peaui/ui/react/${identity.category}/${identity.name}`,
    status: 'stable',
    props: vueApi.props,
    models: vueApi.models.map((model) => {
      const name = toCamelCase(model.name);
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
      return {
        ...model,
        name,
        required: false,
        description: `${model.description} W React dostępne są propsy ${name}, default${capitalized} i on${capitalized}Change.`,
      };
    }),
    events: vueApi.events.map((event) => ({
      ...event,
      name: toReactCallbackName(event.name),
      description: `${event.description} W React przekaż callback ${toReactCallbackName(event.name)}.`,
    })),
    slots: vueApi.slots.map((slot) => ({
      ...slot,
      name:
        slot.name === 'default'
          ? 'children'
          : slot.name.includes('[')
            ? 'renderCell'
            : toCamelCase(slot.name),
      description:
        slot.name === 'default'
          ? 'Główna treść React przekazywana przez children.'
          : slot.name.includes('[')
            ? 'Funkcja renderCell pozwala renderować niestandardową zawartość komórki tabeli.'
            : `${slot.description} W React jest to prop ReactNode „${toCamelCase(slot.name)}”.`,
    })),
  };
}

const components = walkDirectories(componentsRoot)
  .map(extractComponent)
  .sort((left, right) =>
    `${left.category}/${left.name}`.localeCompare(`${right.category}/${right.name}`, 'pl'),
  );

const fileContents =
  `// Ten plik jest generowany przez scripts/generate-component-api.mjs.\n` +
  `// Nie edytuj go ręcznie — źródłem prawdy są publiczne komponenty Vue.\n\n` +
  `import type { ComponentApi } from '../types';\n\n` +
  `export const generatedComponentApi = ${JSON.stringify(components, null, 2)} as const satisfies readonly ComponentApi[];\n`;

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, fileContents, 'utf8');

const frameworkDirectories = walkFrameworkDirectories(componentsRoot);
const reactComponents = frameworkDirectories
  .filter((directory) => fs.existsSync(path.join(directory, 'index.tsx')))
  .map(extractReactComponent);
const webComponents = frameworkDirectories
  .filter((directory) => fs.existsSync(path.join(directory, 'index.wc.ts')))
  .map(extractWebComponent);
const frameworkFileContents =
  `// Ten plik jest generowany przez scripts/generate-component-api.mjs.\n` +
  `// Nie edytuj go ręcznie — źródłem prawdy są implementacje React i Web Components.\n\n` +
  `import type { FrameworkComponentApi } from '../types';\n\n` +
  `export const generatedReactComponentApi = ${JSON.stringify(reactComponents, null, 2)} as const satisfies readonly FrameworkComponentApi[];\n\n` +
  `export const generatedWebComponentApi = ${JSON.stringify(webComponents, null, 2)} as const satisfies readonly FrameworkComponentApi[];\n`;

fs.writeFileSync(frameworkOutputFile, frameworkFileContents, 'utf8');

console.log(
  `Wygenerowano API: Vue ${components.length}, React ${reactComponents.length}, Web Components ${webComponents.length}.`,
);
