import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import {
  formTagsInputDemoProps,
  formTagsInputDemoSuggestions,
  formTagsInputLongLabel,
} from './form-tags-input.demo';
import FormTagsInputVueComponent from './index.vue';
import { defineFormTagsInput, FormTagsInputElement } from './index.wc';

defineFormTagsInput();

function renderTags(args: VueCustomElementStoryArgs): HTMLElement {
  const element = document.createElement(FormTagsInputElement.tagName) as HTMLElement &
    Record<string, unknown>;
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }
  return element;
}

function renderCollection(configurations: VueCustomElementStoryArgs[]): HTMLElement {
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    display: 'grid',
    gap: '1.25rem',
    gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,19rem),1fr))',
  });
  configurations.forEach((configuration) => wrapper.append(renderTags(configuration)));
  return wrapper;
}

const meta = {
  title: '5. Form/FormTagsInput WC',
  component: FormTagsInputElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(FormTagsInputVueComponent),
    ...formTagsInputDemoProps,
    ariaLabel: undefined,
    dataTestId: 'form-tags-input-default',
    inputValue: '',
  },
  argTypes: createVueCustomElementArgTypes(FormTagsInputVueComponent),
  parameters: {
    name: 'FormTagsInput',
    description:
      'Light-DOM Web Component z identyczną walidacją, DOM, wyglądem, ARIA, klawiaturą i responsywnością jak Vue i React.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormTagsInput';
  import '@peaui/ui/styles.css';
</script>
<peaui-form-tags-input id="technologies" name="technologies" label="Technologie"></peaui-form-tags-input>
    `,
  },
  render: renderTags,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};

export const SuggestionsOnly: Story = {
  args: {
    allowCreate: false,
    dataTestId: 'form-tags-input-suggestions',
    mode: 'suggestions-only',
    value: ['Vue'],
  },
};

export const PasteEditAndKeyboard: Story = {
  args: {
    dataTestId: 'form-tags-input-keyboard',
    description: 'Każda zmiana przechodzi walidację przed aktualizacją modelu.',
    id: 'tags-keyboard-wc',
    label: 'Tagi obsługiwane klawiaturą',
    name: 'tagsKeyboard',
    suggestions: [...formTagsInputDemoSuggestions],
    value: ['Vue', 'React'],
  },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.dataset.tagsKeyboard = '';
    Object.assign(wrapper.style, { maxInlineSize: '100%', width: '34rem' });
    const instructions = document.createElement('p');
    instructions.textContent =
      'Wklej wartości oddzielone przecinkiem. Backspace wybiera i usuwa, strzałki przenoszą fokus, F2 edytuje, a Escape anuluje.';
    wrapper.append(instructions, renderTags(args));
    return wrapper;
  },
};

export const Objects: Story = {
  args: {
    allowCreate: false,
    id: 'tags-objects-wc',
    label: 'Obszary jakości',
    mode: 'suggestions-only',
    name: 'areas',
    suggestions: [
      { id: 'a11y', label: 'Dostępność', value: 'accessibility' },
      { id: 'perf', label: 'Wydajność', value: 'performance' },
      { id: 'docs', label: 'Dokumentacja', value: 'documentation' },
    ],
    value: [{ id: 'a11y', label: 'Dostępność', value: 'accessibility' }],
  },
};

export const ValidationAndStates: Story = {
  render: () =>
    renderCollection([
      { id: 'tags-required-wc', label: 'Pole wymagane', name: 'required', required: true },
      {
        error: 'Usuń nieobsługiwany tag.',
        id: 'tags-error-wc',
        label: 'Błąd walidacji',
        name: 'error',
        value: ['Nieobsługiwany'],
      },
      {
        id: 'tags-max-wc',
        label: 'Osiągnięty limit',
        max: 2,
        name: 'max',
        value: ['Vue', 'React'],
      },
      {
        id: 'tags-readonly-wc',
        label: 'Tylko do odczytu',
        name: 'readonly',
        readonly: true,
        value: ['Vue', 'React'],
      },
      { id: 'tags-loading-wc', label: 'Ładowanie sugestii', loading: true, name: 'loading' },
      {
        disabled: true,
        id: 'tags-disabled-wc',
        label: 'Niedostępne',
        name: 'disabled',
        value: ['Vue'],
      },
    ]),
};

export const NativeSlots: Story = {
  render: (args) => {
    const element = renderTags(args);
    const hint = document.createElement('small');
    hint.slot = 'hint';
    hint.textContent = 'Maksymalnie 6 wartości';
    const prefix = document.createElement('span');
    prefix.slot = 'prefix';
    prefix.textContent = '#';
    element.append(hint, prefix);
    return element;
  },
};

export const MobileLongContentAndRtl: Story = {
  args: {
    dataTestId: 'form-tags-input-mobile',
    description: 'Długie etykiety i tagi zawijają się bez poziomego overflow.',
    id: 'tags-mobile-wc',
    label: formTagsInputLongLabel,
    layout: 'stacked',
    name: 'mobile',
    suggestions: ['Responsywny projekt wielojęzyczny'],
    value: ['Bardzo długa nazwa technologii interfejsowej', 'WCAG 2.2 AA'],
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.dataset.tagsMobile = '';
    wrapper.dir = 'rtl';
    Object.assign(wrapper.style, { maxInlineSize: '100%', paddingBlock: '1rem', width: '19rem' });
    wrapper.append(renderTags(args));
    return wrapper;
  },
};
