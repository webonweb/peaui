import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import {
  formColorPickerDemoProps,
  formColorPickerLongLabel,
  formColorPickerSavedColors,
} from './form-color-picker.demo';
import FormColorPickerVueComponent from './index.vue';
import { defineFormColorPicker, FormColorPickerElement } from './index.wc';

defineFormColorPicker();

function renderColorPicker(args: VueCustomElementStoryArgs): HTMLElement {
  const element = document.createElement(FormColorPickerElement.tagName) as HTMLElement &
    Record<string, unknown>;
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }
  return element;
}

function renderCollection(configurations: VueCustomElementStoryArgs[]): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.dataset.colorPickerParity = '';
  Object.assign(wrapper.style, {
    alignItems: 'start',
    display: 'grid',
    gap: '1.25rem',
    gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,20rem),1fr))',
  });
  configurations.forEach((configuration) => wrapper.append(renderColorPicker(configuration)));
  return wrapper;
}

const meta = {
  title: '5. Form/FormColorPicker WC',
  component: FormColorPickerElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(FormColorPickerVueComponent),
    ...formColorPickerDemoProps,
    ariaLabel: undefined,
    dataTestId: 'form-color-picker-default',
    open: false,
  },
  argTypes: createVueCustomElementArgTypes(FormColorPickerVueComponent),
  parameters: {
    name: 'FormColorPicker',
    description:
      'Light-DOM Web Component z identycznym modelem HSVA, wyglądem, responsywnością, ARIA i klawiaturą jak Vue i React.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormColorPicker';
  import '@peaui/ui/styles.css';
  const picker = document.querySelector('peaui-form-color-picker');
  picker.value = '#4C9A2AE6';
</script>
<peaui-form-color-picker id="brand" name="brand" label="Kolor marki" alpha></peaui-form-color-picker>
    `,
  },
  render: renderColorPicker,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const FormatsAndDensity: Story = {
  render: () =>
    renderCollection([
      { id: 'color-hex-wc', label: 'HEX', name: 'colorHex', value: '#4C9A2A', variant: 'inline' },
      {
        density: 'compact',
        format: 'rgb',
        id: 'color-rgb-wc',
        label: 'RGB compact',
        name: 'colorRgb',
        value: 'rgb(76, 154, 42)',
        variant: 'inline',
      },
      {
        alpha: true,
        format: 'hsl',
        id: 'color-hsl-wc',
        label: 'HSL z alpha',
        name: 'colorHsl',
        value: 'hsla(102, 57%, 38%, .7)',
        variant: 'inline',
      },
    ]),
};
export const PalettesAndEyedropper: Story = { args: { open: true, showEyedropper: true } };
export const KeyboardAndContrast: Story = {
  render: () => {
    const wrapper = renderCollection([
      {
        density: 'compact',
        id: 'color-dark-wc',
        label: 'Wskaźnik na czerni',
        name: 'colorDark',
        value: '#000000',
        variant: 'inline',
      },
      {
        density: 'compact',
        id: 'color-light-wc',
        label: 'Wskaźnik na bieli',
        name: 'colorLight',
        value: '#FFFFFF',
        variant: 'inline',
      },
    ]);
    const instructions = document.createElement('p');
    instructions.textContent =
      'Ustaw fokus na powierzchni koloru i użyj strzałek; Shift zmienia wartość o większy krok.';
    wrapper.prepend(instructions);
    return wrapper;
  },
};
export const ValidationAndStates: Story = {
  render: () =>
    renderCollection([
      {
        id: 'color-required-wc',
        label: 'Wymagany kolor',
        name: 'colorRequired',
        required: true,
        value: '',
      },
      {
        error: 'Ten kolor nie spełnia zasad marki.',
        id: 'color-error-wc',
        label: 'Błąd zewnętrzny',
        name: 'colorError',
        value: '#C73E3A',
      },
      {
        id: 'color-readonly-wc',
        label: 'Tylko do odczytu',
        name: 'colorReadonly',
        readonly: true,
        value: '#4C9A2A',
      },
      {
        id: 'color-loading-wc',
        label: 'Ładowanie',
        loading: true,
        name: 'colorLoading',
        value: '#4C9A2A',
      },
      {
        disabled: true,
        id: 'color-disabled-wc',
        label: 'Niedostępny',
        name: 'colorDisabled',
        value: '#4C9A2A',
      },
    ]),
};
export const NativeSlots: Story = {
  args: { open: true },
  render: (args) => {
    const element = renderColorPicker(args);
    const description = document.createElement('span');
    description.slot = 'description';
    description.textContent = 'Opis przekazany przez natywny slot.';
    const footer = document.createElement('div');
    footer.slot = 'footer';
    footer.textContent = 'Niestandardowa zawartość stopki';
    element.append(description, footer);
    return element;
  },
};
export const MobileAndLongLabel: Story = {
  args: {
    alpha: true,
    dataTestId: 'form-color-picker-mobile',
    id: 'color-mobile-wc',
    label: formColorPickerLongLabel,
    name: 'colorMobile',
    savedColors: formColorPickerSavedColors,
    value: '#4C9A2AE6',
    variant: 'inline',
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.dataset.colorPickerMobile = '';
    Object.assign(wrapper.style, { maxInlineSize: '100%', paddingBlock: '1rem', width: '19rem' });
    wrapper.append(renderColorPicker(args));
    return wrapper;
  },
};
