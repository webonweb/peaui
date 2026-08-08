import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import { formPinInputDemoProps, formPinInputLongLabel } from './form-pin-input.demo';
import FormPinInputVueComponent from './index.vue';
import { defineFormPinInput, FormPinInputElement } from './index.wc';

defineFormPinInput();

function renderPin(args: VueCustomElementStoryArgs): HTMLElement {
  const element = document.createElement(FormPinInputElement.tagName) as HTMLElement &
    Record<string, unknown>;
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }
  return element;
}

function renderCollection(configurations: VueCustomElementStoryArgs[]): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.dataset.pinParity = '';
  Object.assign(wrapper.style, {
    display: 'grid',
    gap: '1.25rem',
    gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,19rem),1fr))',
  });
  configurations.forEach((configuration) => wrapper.append(renderPin(configuration)));
  return wrapper;
}

const meta = {
  title: '5. Form/FormPinInput WC',
  component: FormPinInputElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(FormPinInputVueComponent),
    ...formPinInputDemoProps,
    ariaLabel: undefined,
    dataTestId: 'form-pin-input-default',
  },
  argTypes: createVueCustomElementArgTypes(FormPinInputVueComponent),
  parameters: {
    name: 'FormPinInput',
    description:
      'Light-DOM Web Component z identyczną normalizacją, wyglądem, ARIA, klawiaturą i responsywnością jak Vue i React.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormPinInput';
  import '@peaui/ui/styles.css';
</script>
<peaui-form-pin-input id="otp" name="otp" label="Kod weryfikacyjny"></peaui-form-pin-input>
    `,
  },
  render: renderPin,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const NumericAndAlphanumeric: Story = {
  render: () =>
    renderCollection([
      {
        id: 'pin-numeric-wc',
        label: 'Kod numeryczny',
        length: 4,
        name: 'pinNumeric',
        value: '0123',
      },
      {
        id: 'pin-alpha-wc',
        label: 'Kod alfanumeryczny',
        name: 'pinAlpha',
        transform: 'uppercase',
        type: 'alphanumeric',
        value: 'A1B2C3',
      },
    ]),
};
export const MaskedAndGrouped: Story = {
  args: {
    dataTestId: 'form-pin-input-masked',
    description:
      'Maskowanie ogranicza podgląd kodu, ale nie zastępuje bezpiecznego przechowywania.',
    mask: true,
    separatorEvery: 3,
    value: '120045',
  },
};
export const PasteAndKeyboard: Story = {
  args: {
    dataTestId: 'form-pin-input-keyboard',
    description: 'Tab opuszcza grupę; strzałki zmieniają aktywną komórkę.',
    id: 'pin-keyboard-wc',
    label: 'Kod obsługiwany klawiaturą',
    name: 'pinKeyboard',
  },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.dataset.pinKeyboard = '';
    Object.assign(wrapper.style, { maxInlineSize: '100%', width: '30rem' });
    const instructions = document.createElement('p');
    instructions.textContent = 'Wklej cały kod albo użyj strzałek, Home, End, Backspace i Delete.';
    wrapper.append(instructions, renderPin(args));
    return wrapper;
  },
};
export const ValidationAndStates: Story = {
  render: () =>
    renderCollection([
      {
        id: 'pin-required-wc',
        label: 'Kod wymagany',
        name: 'pinRequired',
        required: true,
        value: '',
      },
      {
        error: 'Kod wygasł. Wpisz nowy kod.',
        id: 'pin-error-wc',
        label: 'Kod z błędem',
        name: 'pinError',
        value: '1234',
      },
      {
        id: 'pin-readonly-wc',
        label: 'Tylko do odczytu',
        name: 'pinReadonly',
        readonly: true,
        value: '120045',
      },
      { id: 'pin-loading-wc', label: 'Ładowanie', loading: true, name: 'pinLoading', value: '' },
      {
        disabled: true,
        id: 'pin-disabled-wc',
        label: 'Niedostępny',
        name: 'pinDisabled',
        value: '120045',
      },
    ]),
};
export const NativeSlots: Story = {
  args: { separatorEvery: 3 },
  render: (args) => {
    const element = renderPin(args);
    const separator = document.createElement('strong');
    separator.slot = 'separator';
    separator.textContent = '·';
    const hint = document.createElement('small');
    hint.slot = 'hint';
    hint.textContent = 'Kod jednorazowy';
    element.append(separator, hint);
    return element;
  },
};
export const MobileAndLongCode: Story = {
  args: {
    dataTestId: 'form-pin-input-mobile',
    description: 'Dwanaście znaków jest dostępne przez kontrolowane przewijanie poziome.',
    id: 'pin-mobile-wc',
    label: formPinInputLongLabel,
    length: 12,
    name: 'pinMobile',
    separatorEvery: 4,
    transform: 'uppercase',
    type: 'alphanumeric',
    value: 'AB12CD34EF56',
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.dataset.pinMobile = '';
    Object.assign(wrapper.style, { maxInlineSize: '100%', paddingBlock: '1rem', width: '19rem' });
    wrapper.append(renderPin(args));
    return wrapper;
  },
};
