<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

import { getDemoPreset } from '../data/demo-presets';
import { localizeDemoData } from '../data/demo-localization';
import { useDemoTranslation } from '../composables/use-demo-translation';
import { useI18n } from '../i18n';
import type { ApiEntry, DemoVariant, FrameworkComponentDefinition } from '../types';
import CodeBlock from './CodeBlock.vue';
import PropControl from './PropControl.vue';

const props = defineProps<{ definition: FrameworkComponentDefinition }>();
const { locale, t } = useI18n();
const mountPoint = ref<HTMLElement>();
const activeVariantId = ref('default');
const panel = ref<'preview' | 'code'>('preview');
const interactiveProps = ref<Record<string, unknown>>({});
const eventLog = ref<string[]>([]);
const error = ref('');
const demoStage = ref<HTMLElement>();
useDemoTranslation(demoStage);
let renderVersion = 0;

const componentModules = import.meta.glob<unknown>(
  '../../../library/src/components/*/*/index.wc.ts',
);

interface PreviewPreset {
  attributes?: Record<string, string>;
  properties?: Record<string, unknown>;
  text?: string;
  slots?: Record<string, string>;
  cards?: string[];
}

type PreviewElement = HTMLElement & Record<string, unknown>;

const imageSource =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"%3E%3Crect width="320" height="180" rx="18" fill="%23f4fbe8"/%3E%3Ccircle cx="160" cy="90" r="48" fill="%2386cb16"/%3E%3Ctext x="160" y="98" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="%231d3f03"%3EPEAUI%3C/text%3E%3C/svg%3E';

const presets: Record<string, PreviewPreset> = {
  ImageView: { attributes: { src: imageSource, alt: 'Grafika demonstracyjna PEAUI', size: 'm' } },
  SvgIcon: { attributes: { name: 'check' } },
  CardCarousel: {
    attributes: { 'aria-label': 'Przykładowa karuzela', 'default-visible-slides': '2' },
    cards: ['Pierwsza karta', 'Druga karta', 'Trzecia karta'],
  },
  CounterBadge: { properties: { value: 3 } },
  DescriptionField: { attributes: { label: 'Status' }, text: 'Gotowy do publikacji' },
  SectionHeading: {
    attributes: { size: 'm', variant: 'primary' },
    slots: { title: 'Ustawienia projektu', description: 'Przykładowy nagłówek sekcji.' },
  },
  TagChip: { attributes: { label: 'Aktywny', variant: 'primary', size: 'm' } },
  ButtonAction: { attributes: { variant: 'primary', size: 'm' }, text: 'Zapisz zmiany' },
  MessageText: { attributes: { variant: 'info', 'with-icon': '' }, text: 'Dane zostały zapisane.' },
  ToastAlert: {
    attributes: {
      variant: 'success',
      title: 'Gotowe',
      description: 'Zmiany zostały zapisane.',
      'with-border': '',
    },
  },
  FieldLabel: { attributes: { for: 'demo-field', text: 'Nazwa projektu', required: '' } },
  FormField: {
    attributes: { id: 'demo-field', name: 'demo-field', label: 'Nazwa projektu', value: 'PEAUI' },
  },
  FormInput: {
    attributes: {
      id: 'demo-input',
      name: 'demo-input',
      label: 'Nazwa projektu',
      value: 'PEAUI',
    },
  },
  FormPassword: {
    attributes: {
      id: 'demo-password',
      name: 'demo-password',
      label: 'Hasło',
      value: 'Peaui-2026!',
      'can-visible': '',
    },
  },
  CardPanel: { attributes: { size: 'm', 'border-color': 'primary' }, text: 'Treść panelu PEAUI' },
  GridItem: { attributes: { colspan: '1' }, text: 'Element siatki' },
  GridSection: { attributes: { columns: '3', gap: '4' }, cards: ['Pierwszy', 'Drugi', 'Trzeci'] },
  PageLayout: {
    attributes: { 'aria-label': 'Przykładowy układ strony' },
    text: 'Główna treść strony',
  },
  NavigationLink: { attributes: { path: '#demo', variant: 'primary' }, text: 'Przejdź dalej' },
  InfoTooltip: {
    attributes: { placement: 'top', variant: 'primary' },
    text: 'Najedź lub ustaw fokus',
    slots: { title: 'Informacja', description: 'To jest natywny Web Component PEAUI.' },
  },
  TreeList: {
    properties: { tree: { label: 'Przykładowa gałąź', children: {} } },
  },
};

const inputEntries = computed(() => [...props.definition.props, ...props.definition.models]);
const baseProps = computed(() => createBaseProps());
const variants = computed(() => createVariants(baseProps.value));
const activeVariant = computed(
  () => variants.value.find((variant) => variant.id === activeVariantId.value) ?? variants.value[0],
);
const exampleCode = computed(() => createExampleCode());

function toPropertyName(name: string): string {
  if (name === 'data-testid') return 'dataTestId';
  return name.replace(/-([a-z])/g, (_, character: string) => character.toUpperCase());
}

function findInputName(name: string): string | undefined {
  return inputEntries.value.find(
    (entry) => entry.name === name || toPropertyName(entry.name) === name,
  )?.name;
}

function isBooleanEntry(entry: ApiEntry): boolean {
  return entry.type.includes('boolean');
}

function isNumberEntry(entry: ApiEntry): boolean {
  return entry.type.includes('number') && !entry.type.includes('[]');
}

function isComplexEntry(entry: ApiEntry, value: unknown): boolean {
  return (
    Array.isArray(value) ||
    (typeof value === 'object' && value !== null) ||
    entry.type.includes('[]') ||
    entry.type.includes('Record<') ||
    entry.type.includes('File') ||
    entry.type.includes('object')
  );
}

function normalizePresetValue(entry: ApiEntry, value: unknown): unknown {
  if (isBooleanEntry(entry)) {
    if (typeof value === 'boolean') return value;
    if (typeof value !== 'string' || value.length === 0) return true;
    return !['false', '0', 'no', 'off'].includes(value.toLocaleLowerCase());
  }

  if (isNumberEntry(entry) && typeof value === 'string' && value.trim()) {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : value;
  }

  return value;
}

function getRequiredPropertyExample(name: string, type: string): unknown {
  const normalizedName = toPropertyName(name);
  const normalizedType = type.toLocaleLowerCase();

  if (normalizedName === 'tree')
    return localizeDemoData({ label: 'Przykładowa gałąź', children: {} });
  if (normalizedName.toLocaleLowerCase().includes('icon')) return 'check';
  if (normalizedType.includes('[]') || normalizedType.includes('array')) return [];
  if (normalizedType.includes('boolean')) return false;
  if (normalizedType.includes('number') && !normalizedType.includes('string')) return 1;
  if (normalizedType.includes('record') || normalizedType.includes('object')) return {};
  if (normalizedType.includes('=>')) return () => undefined;

  const textValues: Record<string, string> = {
    ariaLabel: 'Przykładowy komponent PEAUI',
    id: 'peaui-docs-example',
    label: 'Przykładowa etykieta',
    name: 'peaui-docs-example',
    path: '#example',
    text: 'Przykładowa treść',
    title: 'Przykładowy tytuł',
    value: 'Przykładowa wartość',
  };

  return localizeDemoData(textValues[normalizedName] ?? 'Przykład');
}

function createBaseProps(): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const sharedPreset = getDemoPreset(props.definition);
  const preset = localizeDemoData(presets[props.definition.name] ?? {});

  for (const [name, value] of Object.entries(sharedPreset.props)) {
    const inputName = findInputName(name);
    if (inputName) result[inputName] = value;
  }

  for (const [name, value] of Object.entries(preset.attributes ?? {})) {
    const inputName = findInputName(name);
    const entry = inputEntries.value.find((item) => item.name === inputName);
    if (inputName && entry) result[inputName] = normalizePresetValue(entry, value);
  }

  for (const [name, value] of Object.entries(preset.properties ?? {})) {
    const inputName = findInputName(name);
    if (inputName) result[inputName] = value;
  }

  for (const entry of inputEntries.value) {
    if (result[entry.name] === undefined && entry.required) {
      result[entry.name] = getRequiredPropertyExample(entry.name, entry.type);
    }
  }

  return result;
}

function unionValues(type: string): string[] {
  const matches = [...type.matchAll(/['"]([^'"]+)['"]/g)].map((match) => match[1]);
  return [...new Set(matches)].filter((value) => !value.startsWith('on:'));
}

function createVariants(initialProps: Record<string, unknown>): DemoVariant[] {
  const result: DemoVariant[] = [
    {
      id: 'default',
      label: t('demo.default'),
      description: t('demo.defaultDescription'),
      props: { ...initialProps },
    },
  ];
  const enumEntry = props.definition.props
    .map((entry) => ({ entry, values: unionValues(entry.type) }))
    .find(({ values }) => values.length >= 2 && values.length <= 8);

  if (enumEntry) {
    for (const value of enumEntry.values.slice(0, 6)) {
      result.push({
        id: `${enumEntry.entry.name}-${value}`,
        label: value,
        description: t('demo.variantDescription', { name: enumEntry.entry.name, value }),
        props: { ...initialProps, [enumEntry.entry.name]: value },
      });
    }
  }

  const booleanPriorities = [
    'disabled',
    'readonly',
    'isLoading',
    'active',
    'open',
    'withShadow',
    'withBorder',
    'isSimple',
    'editable',
    'range',
    'searchable',
    'rounded',
    'isHeaderSticky',
  ];
  const booleanEntries = [...props.definition.props, ...props.definition.models]
    .filter(isBooleanEntry)
    .sort((left, right) => {
      const leftIndex = booleanPriorities.indexOf(toPropertyName(left.name));
      const rightIndex = booleanPriorities.indexOf(toPropertyName(right.name));
      return (
        (leftIndex < 0 ? Number.MAX_SAFE_INTEGER : leftIndex) -
        (rightIndex < 0 ? Number.MAX_SAFE_INTEGER : rightIndex)
      );
    });

  for (const entry of booleanEntries.slice(0, enumEntry ? 2 : 3)) {
    if (result.some((variant) => variant.id === entry.name)) continue;
    result.push({
      id: entry.name,
      label: entry.name,
      description: t('demo.stateDescription', { name: entry.name }),
      props: { ...initialProps, [entry.name]: !initialProps[entry.name] },
    });
  }

  return result;
}

function clone(value: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
}

function getContentPreset(): Required<Pick<PreviewPreset, 'slots' | 'cards'>> & { text: string } {
  const sharedPreset = getDemoPreset(props.definition);
  const preset = localizeDemoData(presets[props.definition.name] ?? {});
  const sharedContent = Array.isArray(sharedPreset.defaultSlot)
    ? sharedPreset.defaultSlot
    : sharedPreset.defaultSlot
      ? [sharedPreset.defaultSlot]
      : [];

  return {
    text: preset.text ?? (sharedContent.length === 1 ? (sharedContent[0] ?? '') : ''),
    slots: { ...sharedPreset.slots, ...preset.slots },
    cards: preset.cards ?? (sharedContent.length > 1 ? sharedContent : []),
  };
}

function appendPreviewContent(element: HTMLElement): void {
  const content = getContentPreset();
  if (content.text) element.append(document.createTextNode(content.text));

  for (const [slot, value] of Object.entries(content.slots)) {
    const child = document.createElement('span');
    child.slot = slot;
    child.textContent = value;
    element.append(child);
  }

  for (const value of content.cards) {
    const card = document.createElement('div');
    card.className = 'docs-wc-card';
    card.textContent = value;
    element.append(card);
  }
}

function logEvent(name: string, value: unknown): void {
  let serialized: string;
  try {
    serialized = typeof value === 'object' ? JSON.stringify(value) : String(value);
  } catch {
    serialized = String(value);
  }
  eventLog.value = [`${name}: ${serialized}`, ...eventLog.value].slice(0, 4);
}

function handleComponentEvent(name: string, event: Event): void {
  const value = event instanceof CustomEvent ? event.detail : undefined;
  logEvent(name, value);

  if (!name.startsWith('update:')) return;
  const modelName = name.slice('update:'.length);
  const inputName = findInputName(modelName);
  if (inputName) interactiveProps.value = { ...interactiveProps.value, [inputName]: value };
}

function createPreviewElement(): PreviewElement {
  const element = document.createElement(props.definition.tagName ?? 'div') as PreviewElement;

  for (const entry of inputEntries.value) {
    const value = interactiveProps.value[entry.name];
    const propertyName = toPropertyName(entry.name);

    if (typeof value === 'function' || isComplexEntry(entry, value)) {
      if (value !== undefined) element[propertyName] = value;
    } else if (isBooleanEntry(entry)) {
      if (value) element.setAttribute(entry.name, '');
    } else if (value !== undefined && value !== null && value !== '') {
      element.setAttribute(entry.name, String(value));
    }
  }

  appendPreviewContent(element);

  for (const event of props.definition.events) {
    element.addEventListener(event.name, (nativeEvent) =>
      handleComponentEvent(event.name, nativeEvent),
    );
  }

  return element;
}

async function renderPreview(): Promise<void> {
  const currentRender = ++renderVersion;
  error.value = '';
  await nextTick();
  if (!mountPoint.value) return;

  const suffix = `/components/${props.definition.category}/${props.definition.sourceName}/index.wc.ts`;
  const moduleEntry = Object.entries(componentModules).find(([file]) =>
    file.replace(/\\/g, '/').endsWith(suffix),
  );

  if (!moduleEntry) {
    error.value = t('demo.wcModuleMissing');
    return;
  }

  try {
    await moduleEntry[1]();
    if (currentRender !== renderVersion || !mountPoint.value) return;
    mountPoint.value.replaceChildren(createPreviewElement());
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : t('demo.previewFailed');
  }
}

function selectVariant(id: string): void {
  activeVariantId.value = id;
  const variant = variants.value.find((entry) => entry.id === id) ?? variants.value[0];
  interactiveProps.value = clone(variant?.props ?? {});
  eventLog.value = [];
  void renderPreview();
}

function updateProp(name: string, value: unknown): void {
  interactiveProps.value = { ...interactiveProps.value, [name]: value };
  void renderPreview();
}

function escapeAttribute(value: unknown): string {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;');
}

function serializeProperty(value: unknown): string {
  if (value === undefined) return 'undefined';
  return JSON.stringify(value, null, 2) ?? 'undefined';
}

function createExampleCode(): string {
  const tagName = props.definition.tagName ?? 'div';
  const attributes: string[] = [];
  const properties: string[] = [];

  for (const entry of inputEntries.value) {
    const value = interactiveProps.value[entry.name];
    if (value === undefined || value === null || value === '') continue;
    if (typeof value === 'function') continue;

    if (isComplexEntry(entry, value)) {
      properties.push(`component.${toPropertyName(entry.name)} = ${serializeProperty(value)};`);
    } else if (isBooleanEntry(entry)) {
      if (value) attributes.push(entry.name);
    } else {
      attributes.push(`${entry.name}="${escapeAttribute(value)}"`);
    }
  }

  const content = getContentPreset();
  const contentLines = [
    ...(content.text ? [`  ${content.text}`] : []),
    ...Object.entries(content.slots).map(
      ([slot, value]) => `  <span slot="${slot}">${value}</span>`,
    ),
    ...content.cards.map((value) => `  <div>${value}</div>`),
  ];
  const attributeBlock = attributes.length ? `\n  ${attributes.join('\n  ')}` : '';
  const markup = contentLines.length
    ? `<${tagName}${attributeBlock}>\n${contentLines.join('\n')}\n</${tagName}>`
    : `<${tagName}${attributeBlock}></${tagName}>`;
  const eventLines = props.definition.events.map(
    (event) =>
      `component.addEventListener('${event.name}', (event) => {\n  console.log(event.detail);\n});`,
  );
  const scriptLines = [
    `import '@peaui/ui/styles.css';`,
    `import '${props.definition.importPath}';`,
    '',
    `const component = document.querySelector('${tagName}');`,
    ...properties,
    ...(properties.length && eventLines.length ? [''] : []),
    ...eventLines,
  ];

  return `${markup}\n\n<script type="module">\n${scriptLines.join('\n')}\n<\/script>`;
}

watch(
  () => [props.definition.importPath, locale.value],
  () => {
    activeVariantId.value = 'default';
    panel.value = 'preview';
    selectVariant('default');
  },
  { immediate: true },
);

watch(panel, (activePanel) => {
  if (activePanel === 'preview') void renderPreview();
});

onBeforeUnmount(() => {
  renderVersion += 1;
  mountPoint.value?.replaceChildren();
});
</script>

<template>
  <div class="demo-workbench">
    <div class="variant-tabs" role="tablist" :aria-label="t('demo.wcVariants')">
      <button
        v-for="variant in variants"
        :key="variant.id"
        type="button"
        role="tab"
        :aria-selected="activeVariantId === variant.id"
        @click="selectVariant(variant.id)"
      >
        {{ variant.label }}
      </button>
    </div>

    <p class="variant-description">{{ activeVariant?.description }}</p>

    <div class="demo-panel">
      <div class="demo-panel__toolbar">
        <div class="segmented-control">
          <button type="button" :class="{ active: panel === 'preview' }" @click="panel = 'preview'">
            {{ t('common.preview') }}
          </button>
          <button type="button" :class="{ active: panel === 'code' }" @click="panel = 'code'">
            {{ t('common.code') }} HTML
          </button>
        </div>
        <button class="reset-button" type="button" @click="selectVariant(activeVariantId)">
          {{ t('common.reset') }}
        </button>
      </div>

      <div v-if="panel === 'preview'" ref="demoStage" class="demo-stage">
        <div ref="mountPoint" class="wc-live-root" />
        <p v-if="error" class="demo-error">{{ error }}</p>
      </div>
      <CodeBlock v-else :code="exampleCode" language="html" />
    </div>

    <details class="playground-controls">
      <summary>
        <span>
          <strong>{{ t('demo.wcPlayground') }}</strong>
          <small>{{ t('demo.wcHint') }}</small>
        </span>
        <span aria-hidden="true">+</span>
      </summary>
      <div class="playground-controls__grid">
        <PropControl
          v-for="entry in inputEntries"
          :key="entry.name"
          :entry="entry"
          :value="interactiveProps[entry.name]"
          @change="updateProp(entry.name, $event)"
        />
      </div>
    </details>

    <div v-if="eventLog.length" class="event-log" aria-live="polite">
      <strong>{{ t('demo.customEvents') }}</strong>
      <code v-for="event in eventLog" :key="event">{{ event }}</code>
    </div>
  </div>
</template>
