import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';
import ts from 'typescript';

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const componentsRoot = path.resolve(docsRoot, '../library/src/components');
const outputFile = path.resolve(docsRoot, 'src/generated/component-api.ts');
const frameworkOutputFile = path.resolve(docsRoot, 'src/generated/framework-component-api.ts');
const catalogOutputFile = path.resolve(docsRoot, 'src/generated/component-catalog.ts');
const prettierOptions = {
  ...((await resolveConfig(outputFile)) ?? {}),
  parser: 'typescript',
};

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
  fallbackIcon: 'Nazwa ikony używanej, gdy obraz ani inicjały nie są dostępne.',
  initials: 'Jawne inicjały wyświetlane przed fallbackiem ikonowym.',
  interactive: 'Renderuje komponent jako natywną kontrolkę interaktywną.',
  loading: 'Wybiera natywną strategię ładowania obrazu.',
  shape: 'Wariant kształtu komponentu.',
  statusLabel: 'Dostępna etykieta tekstowa opisująca status.',
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
  falseValue: 'Wartość domenowa zwracana po wyłączeniu przełącznika.',
  form: 'Identyfikator natywnego formularza będącego właścicielem kontrolki.',
  gap: 'Odstęp pomiędzy elementami układu.',
  hasMore: 'Informuje, że aplikacja może dołączyć kolejne elementy po osiągnięciu końca.',
  height: 'Wysokość viewportu jako liczba pikseli albo wartość CSS.',
  icon: 'Nazwa ikony prezentowanej przez komponent.',
  iconAfter: 'Nazwa ikony wyświetlanej za treścią pola.',
  iconBefore: 'Nazwa ikony wyświetlanej przed treścią pola.',
  id: 'Unikalny identyfikator elementu w dokumencie.',
  isLoading: 'Włącza stan ładowania i informuje o trwającej operacji.',
  itemKey: 'Pole lub funkcja zwracająca stabilny klucz elementu.',
  itemLabel: 'Pole lub funkcja zwracająca domyślną etykietę elementu.',
  itemSize: 'Stała wysokość pojedynczego elementu w pikselach.',
  label: 'Widoczna etykieta opisująca element lub pole formularza.',
  labelPosition: 'Pozycja etykiety względem właściwej kontrolki.',
  loadingLabel: 'Dostępny komunikat opisujący trwającą operację.',
  max: 'Maksymalna dozwolona wartość albo szerokość.',
  maxLength: 'Maksymalna liczba znaków możliwa do wprowadzenia.',
  min: 'Minimalna dozwolona wartość.',
  name: 'Nazwa pola używana przez formularz lub nazwa zasobu.',
  open: 'Steruje widocznością rozwijanego elementu albo warstwy.',
  offLabel: 'Widoczny tekst opisujący stan wyłączony.',
  onLabel: 'Widoczny tekst opisujący stan włączony.',
  options: 'Lista opcji dostępnych do wyświetlenia lub wyboru.',
  overscan: 'Liczba dodatkowych elementów renderowanych poza widocznym zakresem.',
  semanticRole: 'Wybiera semantykę neutralnej listy albo interaktywnego listboxa.',
  page: 'Numer aktualnie wybranej strony.',
  placeholder: 'Tekst pomocniczy widoczny przed wprowadzeniem wartości.',
  readonly: 'Ustawia komponent w trybie tylko do odczytu.',
  records: 'Kolekcja rekordów prezentowanych przez komponent.',
  required: 'Oznacza wartość jako wymaganą.',
  rowsPerPage: 'Liczba rekordów wyświetlanych na jednej stronie.',
  selected: 'Określa bieżące zaznaczenie.',
  selectedRows: 'Identyfikatory aktualnie zaznaczonych wierszy.',
  showStateLabel: 'Pokazuje tekstowy opis bieżącego stanu obok kontrolki.',
  size: 'Wariant rozmiaru komponentu.',
  src: 'Adres źródłowy obrazu albo innego zasobu.',
  status: 'Stan wizualny i semantyczny komponentu.',
  step: 'Krok zmiany wartości liczbowej.',
  title: 'Główny tytuł prezentowany w komponencie.',
  total: 'Łączna liczba elementów.',
  totalPages: 'Łączna liczba stron dostępnych w paginacji.',
  trueValue: 'Wartość domenowa zwracana po włączeniu przełącznika.',
  type: 'Wariant funkcjonalny lub wizualny komponentu.',
  value: 'Bieżąca wartość kontrolowana przez v-model.',
  variant: 'Wariant wizualny komponentu.',
};

const modelDescriptions = {
  activeIndex: 'Indeks aktywnego elementu kontrolowany przez v-model:activeIndex.',
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
  blur: 'Emitowane po opuszczeniu kontrolki przez fokus.',
  change: 'Emitowane po zmianie wartości przez użytkownika.',
  copy: 'Emitowane po rozwiązaniu dokładnego tekstu i przed próbą zapisu do schowka.',
  error: 'Emitowane, gdy operacja komponentu kończy się błędem.',
  focus: 'Emitowane po ustawieniu fokusu na kontrolce.',
  load: 'Emitowane po poprawnym załadowaniu obrazu.',
  statusChange: 'Emitowane po każdej wewnętrznej zmianie statusu operacji.',
  success: 'Emitowane po poprawnym zakończeniu operacji komponentu.',
  'on:change': 'Emitowane po zmianie wartości.',
  'on:changeValue':
    'Emitowane po zmianie wartości komórki; przekazuje identyfikator rekordu i nową wartość.',
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
  if (ts.isIdentifier(node)) {
    const declaration = getDefinitions(sourceFile).get(node.text);
    if (
      declaration &&
      ts.isVariableDeclaration(declaration) &&
      declaration.initializer &&
      declaration.initializer !== node
    ) {
      return literalValue(declaration.initializer, declaration.getSourceFile());
    }
  }
  if (ts.isArrowFunction(node)) {
    let body = node.body;
    while (ts.isParenthesizedExpression(body)) body = body.expression;
    return body.getText(sourceFile);
  }
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
      return definition.type.getText();
    }
  }

  return typeNode.getText(sourceFile);
}

const definitionsCache = new Map();

function getDefinitions(sourceFile) {
  if (definitionsCache.has(sourceFile.fileName)) return definitionsCache.get(sourceFile.fileName);
  const definitions = new Map();
  definitionsCache.set(sourceFile.fileName, definitions);

  for (const statement of sourceFile.statements) {
    if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) {
      definitions.set(statement.name.text, statement);
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) definitions.set(declaration.name.text, declaration);
      }
    }
  }

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier))
      continue;
    const specifier = statement.moduleSpecifier.text;
    if (!specifier.startsWith('.') && !specifier.startsWith('@/')) continue;
    const base = specifier.startsWith('@/')
      ? path.resolve(componentsRoot, '..', specifier.slice(2))
      : path.resolve(path.dirname(sourceFile.fileName), specifier);
    const file = [base, `${base}.ts`, path.join(base, 'index.ts')].find(
      (candidate) =>
        fs.existsSync(candidate) && fs.statSync(candidate).isFile() && candidate.endsWith('.ts'),
    );
    if (
      !file ||
      !statement.importClause?.namedBindings ||
      !ts.isNamedImports(statement.importClause.namedBindings)
    )
      continue;
    const imported = getDefinitions(
      ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true),
    );
    for (const binding of statement.importClause.namedBindings.elements) {
      const declaration = imported.get((binding.propertyName ?? binding.name).text);
      if (declaration) definitions.set(binding.name.text, declaration);
    }
  }

  return definitions;
}

function resolveMembers(typeNode, definitions) {
  if (!typeNode) return [];
  if (ts.isTypeLiteralNode(typeNode)) return typeNode.members;

  if (ts.isTypeReferenceNode(typeNode)) {
    const definition = definitions.get(typeNode.typeName.getText());
    if (!definition) return [];
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
  const entries = new Map();
  for (const member of typeNode.members ?? []) {
    let name;
    let type;
    if (ts.isCallSignatureDeclaration(member)) {
      const eventType = member.parameters[0]?.type;
      if (!eventType || !ts.isLiteralTypeNode(eventType)) continue;
      name = eventType.literal.text;
      type = `(${member.parameters
        .slice(1)
        .map((parameter) => parameter.getText(sourceFile))
        .join(', ')}) => void`;
    } else if (ts.isPropertySignature(member)) {
      name = getPropertyName(member, sourceFile);
      type = member.type?.getText(sourceFile);
    }
    if (!name) continue;
    const previous = entries.get(name);
    entries.set(name, {
      name,
      type: previous ? `${previous.type} | ${type}` : type,
      description:
        getDocumentation(member) ??
        eventDescriptions[name] ??
        `Emitowane, gdy komponent zgłasza zdarzenie „${name}”.`,
    });
  }
  return [...entries.values()];
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
  const slots = new Set();

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
            (name === 'loading' && type === 'boolean'
              ? propDescriptions.isLoading
              : propDescriptions[name]) ??
            `Konfiguruje właściwość „${humanize(name).toLocaleLowerCase('pl-PL')}” komponentu.`,
        });
      }
    }

    if (isCallNamed(node, 'defineModel')) {
      const nameNode = node.arguments[0];
      const optionsNode =
        node.arguments[1] ??
        (nameNode && ts.isObjectLiteralExpression(nameNode) ? nameNode : undefined);
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

    if (isCallNamed(node, 'defineSlots')) {
      for (const member of resolveMembers(node.typeArguments?.[0], definitions)) {
        const name = getPropertyName(member, sourceFile);
        if (name) slots.add(name);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  // Props paired with explicit update events have the same v-model contract as
  // defineModel, including newer components that declare their state manually.
  for (const event of events) {
    if (!event.name.startsWith('update:')) continue;
    const modelName = event.name.slice('update:'.length);
    const propIndex = props.findIndex((prop) => prop.name === modelName);
    if (propIndex < 0 || models.some((model) => model.name === modelName)) continue;
    const [prop] = props.splice(propIndex, 1);
    models.push({
      ...prop,
      description:
        modelDescriptions[modelName] ?? `Wartość kontrolowana przez v-model:${modelName}.`,
    });
  }
  for (const model of models) {
    if (events.some((event) => event.name === `update:${model.name}`)) continue;
    events.push({
      name: `update:${model.name}`,
      type: `(value: ${model.type}) => void`,
      description: `Emitowane po zmianie modelu „${model.name}”; przekaż nową wartość do v-model${model.name === 'modelValue' ? '' : `:${model.name}`}.`,
    });
  }

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
    importPath: `@peaui/ui/vue/${category}/${name}`,
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

function getFrameworkIdentity(componentDirectory) {
  const relative = path.relative(componentsRoot, componentDirectory).replace(/\\/g, '/');
  const [category, sourceName] = relative.split('/');
  const name = sourceName;

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
      description: `${vueApi.models.some((model) => model.name === entry.name) ? `Kontrolowana właściwość ${entry.name}; synchronizuj ją przez zdarzenie update:${entry.name}.` : entry.description} Property JavaScript: ${entry.name}. Wartości złożone i funkcje ustawiaj jako properties.`,
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
    // Hand-written custom elements can project light-DOM content without using the
    // literal `childNodes` token. Vue remains the canonical public slot contract.
    slots: extractComponent(componentDirectory).slots,
  };
}

const reactFiles = walkFrameworkDirectories(componentsRoot)
  .map((directory) => path.join(directory, 'index.tsx'))
  .filter((file) => fs.existsSync(file));
const reactProgram = ts.createProgram(reactFiles, {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  skipLibCheck: true,
  strict: true,
  baseUrl: path.resolve(componentsRoot, '..'),
  paths: { '@/*': ['./*'] },
});
const reactChecker = reactProgram.getTypeChecker();

function extractReactComponent(componentDirectory) {
  const identity = getFrameworkIdentity(componentDirectory);
  const vueApi = extractComponent(componentDirectory);
  const sourceFile = reactProgram.getSourceFile(path.join(componentDirectory, 'index.tsx'));
  const declaration = sourceFile.statements.find(
    (statement) =>
      (ts.isTypeAliasDeclaration(statement) || ts.isInterfaceDeclaration(statement)) &&
      statement.name.text === `${identity.name}Props`,
  );
  if (!declaration) throw new Error(`Missing React public props: ${identity.name}`);
  const propsType = reactChecker.getTypeAtLocation(declaration);
  const vueInputs = new Map(
    [...vueApi.props, ...vueApi.models].map((entry) => [entry.name, entry]),
  );
  const props = [];
  const events = [];
  const slots = [];
  const ownDefaults = {};
  function collectDefaults(node) {
    if (ts.isParameter(node) && ts.isObjectBindingPattern(node.name)) {
      for (const element of node.name.elements) {
        if (element.initializer)
          ownDefaults[(element.propertyName ?? element.name).getText()] = literalValue(
            element.initializer,
            sourceFile,
          );
      }
    }
    ts.forEachChild(node, collectDefaults);
  }
  collectDefaults(sourceFile);
  for (const symbol of reactChecker.getPropertiesOfType(propsType)) {
    const name = symbol.getName();
    const member = symbol.declarations?.find((entry) =>
      entry.getSourceFile().fileName.replaceAll('\\', '/').includes('/library/src/'),
    );
    if (!member) continue;
    // Standard DOM attributes are documented once; keep each component table
    // focused on its public component contract and supported children.
    const isBaseProp =
      member.parent.name?.getText() === 'PeauiReactBaseProps' ||
      member.parent.parent?.name?.getText() === 'PeauiReactBaseProps';
    if (
      isBaseProp &&
      (name !== 'children' || !vueApi.slots.some((slot) => slot.name === 'default'))
    )
      continue;
    const vueEntry = vueInputs.get(name === 'tabIndex' ? 'tabindex' : name);
    const declaredTypes = [
      ...new Set(symbol.declarations?.map((entry) => entry.type?.getText()).filter(Boolean)),
    ];
    const type = declaredTypes.length
      ? declaredTypes.join(' | ')
      : reactChecker.typeToString(
          reactChecker.getTypeOfSymbolAtLocation(symbol, declaration),
          declaration,
          ts.TypeFormatFlags.NoTruncation,
        );
    let description =
      getDocumentation(member) ??
      vueEntry?.description ??
      propDescriptions[name] ??
      `Konfiguruje właściwość „${humanize(name).toLocaleLowerCase('pl-PL')}” komponentu.`;
    if (name === 'loading' && type === 'boolean') description = propDescriptions.isLoading;
    if (/^on[A-Z]/.test(name)) {
      events.push({
        name,
        type,
        description: description.replace(/v-model(?::[\w-]+)?/g, 'kontrolowany prop'),
      });
    } else if (
      name === 'children' ||
      /^render[A-Z]/.test(name) ||
      (!vueEntry && /ReactNode/.test(type))
    ) {
      slots.push({
        name,
        type,
        description: /=>/.test(type)
          ? `Funkcja renderująca ${name}; argumenty i zwracana treść są opisane w sygnaturze.`
          : `Treść React przekazywana przez prop ${name}.`,
      });
    } else {
      const defaultModel = name.startsWith('default')
        ? `${name[7]?.toLowerCase()}${name.slice(8)}`
        : undefined;
      props.push({
        name,
        type,
        required: !(symbol.flags & ts.SymbolFlags.Optional),
        default:
          ownDefaults[name] ??
          vueEntry?.default ??
          (defaultModel ? vueInputs.get(defaultModel)?.default : undefined),
        description,
      });
    }
  }
  const modelNames = new Set(
    props
      .filter((prop) =>
        events.some(
          (event) =>
            event.name === `on${prop.name.charAt(0).toUpperCase()}${prop.name.slice(1)}Change`,
        ),
      )
      .map((prop) => prop.name),
  );
  const models = props
    .filter((prop) => modelNames.has(prop.name))
    .map((model) => {
      const capitalized = `${model.name.charAt(0).toUpperCase()}${model.name.slice(1)}`;
      const uncontrolled = props.some((prop) => prop.name === `default${capitalized}`);
      return {
        ...model,
        description: `Kontrolowana wartość ${model.name}; aktualizuj ją przez on${capitalized}Change.${uncontrolled ? ` Dla stanu niekontrolowanego użyj default${capitalized}.` : ''}`,
      };
    });
  return {
    ...identity,
    framework: 'react',
    importPath: `@peaui/ui/react/${identity.category}/${identity.name}`,
    status: 'stable',
    props: props.filter((prop) => !modelNames.has(prop.name)),
    models,
    events,
    slots,
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
  `export const generatedComponentApi = ${JSON.stringify(
    components,
    null,
    2,
  )} as const satisfies readonly ComponentApi[];\n`;

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, await format(fileContents, prettierOptions), 'utf8');

const frameworkDirectories = walkFrameworkDirectories(componentsRoot);
const reactComponents = frameworkDirectories
  .filter((directory) => fs.existsSync(path.join(directory, 'index.tsx')))
  .map(extractReactComponent);
const webComponents = frameworkDirectories
  .filter((directory) => fs.existsSync(path.join(directory, 'index.wc.ts')))
  .map(extractWebComponent);
// Both framework catalogs are used together. Reuse identical Vue input rows
// instead of shipping their types/defaults/descriptions a second time for React.
const sharedVueRows = new Map(
  components.flatMap((component, componentIndex) =>
    component.props.map((entry, propIndex) => [
      JSON.stringify(entry),
      `generatedComponentApi[${componentIndex}].props[${propIndex}]`,
    ]),
  ),
);
const reactMetadataSource = JSON.stringify(
  reactComponents,
  (_key, value) => {
    if (!value || typeof value !== 'object' || !('required' in value)) return value;
    const reference = sharedVueRows.get(JSON.stringify(value));
    return reference ? `__SHARED_VUE_ROW__${reference}` : value;
  },
  2,
).replace(/"__SHARED_VUE_ROW__(generatedComponentApi\[\d+\]\.props\[\d+\])"/g, '$1');
const frameworkFileContents =
  `// Ten plik jest generowany przez scripts/generate-component-api.mjs.\n` +
  `// Nie edytuj go ręcznie — źródłem prawdy są implementacje React i Web Components.\n\n` +
  `import type { FrameworkComponentApi } from '../types';\n` +
  `import { generatedComponentApi } from './component-api';\n\n` +
  `export const generatedReactComponentApi = ${reactMetadataSource} as const satisfies readonly FrameworkComponentApi[];\n\n` +
  `export const generatedWebComponentApi = ${JSON.stringify(
    webComponents,
    null,
    2,
  )} as const satisfies readonly FrameworkComponentApi[];\n`;

fs.writeFileSync(frameworkOutputFile, await format(frameworkFileContents, prettierOptions), 'utf8');

function createCatalogEntry(component, framework) {
  return {
    name: component.name,
    category: component.category,
    categoryLabel: component.categoryLabel,
    framework,
    sourceName: component.sourceName ?? component.name,
    ...(component.tagName ? { tagName: component.tagName } : {}),
    status: component.status ?? 'stable',
  };
}

const catalogFileContents =
  `// Ten plik jest generowany przez scripts/generate-component-api.mjs.\n` +
  `// Zawiera lekki katalog nawigacyjny bez rozbudowanych opisow publicznego API.\n\n` +
  `import type { ComponentCatalogEntry, FrameworkId } from '../types';\n\n` +
  `export const generatedComponentCatalog = ${JSON.stringify(
    {
      vue: components.map((component) => createCatalogEntry(component, 'vue')),
      react: reactComponents.map((component) => createCatalogEntry(component, 'react')),
      'web-components': webComponents.map((component) =>
        createCatalogEntry(component, 'web-components'),
      ),
    },
    null,
    2,
  )} as const satisfies Record<FrameworkId, readonly ComponentCatalogEntry[]>;\n`;

fs.writeFileSync(catalogOutputFile, await format(catalogFileContents, prettierOptions), 'utf8');

console.log(
  `Wygenerowano API: Vue ${components.length}, React ${reactComponents.length}, Web Components ${webComponents.length}.`,
);
