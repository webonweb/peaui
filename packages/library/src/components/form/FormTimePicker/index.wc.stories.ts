import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FormTimePickerVueComponent from './index.vue';
import { formTimePickerDemoProps, formTimePickerLongLabel } from './form-time-picker.demo';
import { defineFormTimePicker, FormTimePickerElement } from './index.wc';

defineFormTimePicker();

function renderTimePicker(args: VueCustomElementStoryArgs): HTMLElement {
  const element = document.createElement(FormTimePickerElement.tagName) as HTMLElement &
    Record<string, unknown>;
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }
  return element;
}

function renderCollection(configurations: VueCustomElementStoryArgs[]): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.dataset.timePickerParity = '';
  Object.assign(wrapper.style, {
    alignItems: 'start',
    display: 'grid',
    gap: '1.25rem',
    gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,18rem),1fr))',
  });
  configurations.forEach((configuration) => wrapper.append(renderTimePicker(configuration)));
  return wrapper;
}

const meta = {
  title: '5. Form/FormTimePicker WC',
  component: FormTimePickerElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(FormTimePickerVueComponent),
    ...formTimePickerDemoProps,
    ariaLabel: undefined,
    dataTestId: 'form-time-picker-default',
    open: false,
  },
  argTypes: createVueCustomElementArgTypes(FormTimePickerVueComponent),
  parameters: {
    name: 'FormTimePicker',
    description:
      'Light-DOM Web Component z identycznym modelem czasu, wyglądem, responsywnością, ARIA i obsługą klawiatury jak Vue i React.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormTimePicker';
</script>
<peaui-form-time-picker id="meeting-time" name="meetingTime" label="Godzina spotkania" value="09:30"></peaui-form-time-picker>
    `,
  },
  render: renderTimePicker,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const VariantsAndPanels: Story = {
  render: () =>
    renderCollection([
      { id: 'time-input-wc', label: 'Pole tekstowe', name: 'timeInput', value: '09:30' },
      {
        id: 'time-segmented-wc',
        label: 'Segmenty',
        name: 'timeSegmented',
        value: '09:30',
        variant: 'segmented',
      },
      {
        id: 'time-spin-wc',
        label: 'Panel spinbutton',
        name: 'timeSpin',
        panelMode: 'spinbutton',
        value: '09:30',
      },
    ]),
};
export const TwelveHourWithSeconds: Story = {
  args: {
    format: '12h',
    locale: 'en-US',
    minuteStep: 1,
    secondStep: 1,
    showSeconds: true,
    value: '13:05:09',
  },
};
export const ValidationAndStates: Story = {
  render: () =>
    renderCollection([
      { id: 'time-required-wc', label: 'Wymagany czas', name: 'timeRequired', required: true },
      {
        error: 'Godzina musi mieścić się w godzinach pracy.',
        id: 'time-error-wc',
        label: 'Błąd zewnętrzny',
        name: 'timeError',
        value: '07:30',
      },
      {
        id: 'time-readonly-wc',
        label: 'Tylko do odczytu',
        name: 'timeReadonly',
        readonly: true,
        value: '09:30',
      },
      {
        id: 'time-loading-wc',
        label: 'Ładowanie',
        loading: true,
        name: 'timeLoading',
        value: '09:30',
      },
      {
        disabled: true,
        id: 'time-disabled-wc',
        label: 'Niedostępny',
        name: 'timeDisabled',
        value: '09:30',
      },
    ]),
};
export const NativeSlots: Story = {
  args: { open: true },
  render: (args) => {
    const element = renderTimePicker(args);
    const description = document.createElement('span');
    description.slot = 'description';
    description.textContent = 'Opis przekazany przez natywny slot.';
    const footer = document.createElement('button');
    footer.slot = 'footer';
    footer.type = 'button';
    footer.textContent = 'Gotowe';
    element.append(description, footer);
    return element;
  },
};
export const MobileAndLongLabel: Story = {
  args: {
    dataTestId: 'form-time-picker-mobile',
    id: 'time-mobile-wc',
    label: formTimePickerLongLabel,
    name: 'timeMobile',
    value: '09:30',
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.dataset.timePickerMobile = '';
    Object.assign(wrapper.style, { maxInlineSize: '100%', paddingBlock: '1rem', width: '18rem' });
    wrapper.append(renderTimePicker(args));
    return wrapper;
  },
};

export const NativeRequiredAndReset: Story = {
  render: () => {
    const form = document.createElement('form');
    form.addEventListener('submit', (event) => event.preventDefault());
    form.append(
      renderTimePicker({
        id: 'native-time',
        name: 'value',
        label: 'Required value',
        variant: 'segmented',
        required: true,
        value: undefined,
      }),
    );
    for (const type of ['submit', 'reset'] as const) {
      const button = document.createElement('button');
      button.type = type;
      button.textContent = type === 'submit' ? 'Validate' : 'Reset';
      form.append(button);
    }
    return form;
  },
};
