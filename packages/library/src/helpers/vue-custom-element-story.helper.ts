type RuntimePropType =
  | ArrayConstructor
  | BooleanConstructor
  | FunctionConstructor
  | NumberConstructor
  | ObjectConstructor
  | StringConstructor;

type RuntimePropOptions = {
  default?: unknown;
  required?: boolean;
  type?: RuntimePropType | null | Array<RuntimePropType | null>;
};

type RuntimeComponent = {
  props?: Record<string, RuntimePropOptions | RuntimePropType> | string[];
};

export type VueCustomElementStoryArgs = Record<string, unknown>;

function getProps(component: unknown): Record<string, RuntimePropOptions> {
  const props = (component as RuntimeComponent).props;

  if (!props) return {};

  if (Array.isArray(props)) {
    return Object.fromEntries(props.map((name) => [name, {}]));
  }

  return Object.fromEntries(
    Object.entries(props).map(([name, options]) => [
      name,
      typeof options === 'function' ? { type: options } : options,
    ]),
  );
}

function getTypes(options: RuntimePropOptions): RuntimePropType[] {
  if (!options.type) return [];
  const types = Array.isArray(options.type) ? options.type : [options.type];
  return types.filter((type): type is RuntimePropType => typeof type === 'function');
}

function getTypeSummary(options: RuntimePropOptions): string {
  if (!options.type) return 'unknown';
  const types = Array.isArray(options.type) ? options.type : [options.type];
  const names = types.map((type) => {
    if (type === null) return 'null';
    if (typeof type === 'function') return type.name.toLocaleLowerCase();
    return 'unknown';
  });
  return names.length > 0 ? names.join(' | ') : 'unknown';
}

function getControl(options: RuntimePropOptions): { type: string } {
  const types = getTypes(options);

  if (types.includes(Boolean)) return { type: 'boolean' };
  if (types.includes(Number)) return { type: 'number' };
  if (types.includes(Array) || types.includes(Object)) return { type: 'object' };
  return { type: 'text' };
}

function getFallbackValue(name: string, options: RuntimePropOptions): unknown {
  const types = getTypes(options);

  if (name === 'open' && types.includes(Boolean)) return true;
  if (name === 'tree' && types.includes(Object)) {
    return { label: 'Przykładowa gałąź', children: {} };
  }
  if (types.includes(Boolean)) return false;
  if (types.includes(Number)) return name === 'totalPages' ? 5 : 1;
  if (types.includes(Array)) return [];
  if (types.includes(Object)) return {};
  if (types.includes(Function)) return () => undefined;
  if (name.toLocaleLowerCase().includes('icon') && types.includes(String)) return 'check';

  const textValues: Record<string, string> = {
    ariaLabel: 'Przykładowy komponent PEAUI',
    description: 'Przykładowy opis komponentu.',
    id: 'peaui-story-example',
    label: 'Przykładowa etykieta',
    name: 'peaui-story-example',
    path: '#example',
    placeholder: 'Wpisz wartość',
    text: 'Przykładowa treść',
    title: 'Przykładowy tytuł',
    value: 'Przykładowa wartość',
  };

  return textValues[name] ?? 'Przykład';
}

function getDefaultValue(options: RuntimePropOptions): unknown {
  if (options.default === undefined) return undefined;

  if (typeof options.default !== 'function' || getTypes(options).includes(Function)) {
    return options.default;
  }

  try {
    return (options.default as (rawProps: Record<string, unknown>) => unknown)({});
  } catch {
    return undefined;
  }
}

export function createVueCustomElementArgTypes(component: unknown): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(getProps(component)).map(([name, options]) => [
      name,
      {
        control: getControl(options),
        description: `Właściwość „${name}” odziedziczona z publicznego API komponentu Vue.`,
        table: {
          type: { summary: getTypeSummary(options) },
          defaultValue: { summary: getDefaultValue(options) },
        },
      },
    ]),
  );
}

export function createVueCustomElementStoryArgs(component: unknown): VueCustomElementStoryArgs {
  const args: VueCustomElementStoryArgs = {};

  for (const [name, options] of Object.entries(getProps(component))) {
    const defaultValue = getDefaultValue(options);
    const shouldProvideExample =
      options.required === true ||
      ['ariaLabel', 'description', 'id', 'label', 'name', 'text', 'title'].includes(name);

    if (defaultValue !== undefined) {
      args[name] = defaultValue;
    } else if (shouldProvideExample) {
      args[name] = getFallbackValue(name, options);
    }
  }

  return args;
}

export function renderVueCustomElementStory(
  tagName: string,
  args: VueCustomElementStoryArgs,
): HTMLElement {
  const element = document.createElement(tagName) as HTMLElement & Record<string, unknown>;

  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }

  element.append(document.createTextNode('Przykładowa treść komponentu'));
  return element;
}
