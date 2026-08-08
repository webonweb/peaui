import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import {
  formDateTimePickerDemoProps,
  formDateTimePickerDemoValue,
  formDateTimePickerLongLabel,
} from './form-date-time-picker.demo';
import FormDateTimePickerVueComponent from './index.vue';
import { defineFormDateTimePicker, FormDateTimePickerElement } from './index.wc';

defineFormDateTimePicker();

function renderDateTimePicker(args: VueCustomElementStoryArgs): HTMLElement {
  const element = document.createElement(FormDateTimePickerElement.tagName) as HTMLElement &
    Record<string, unknown>;
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }
  return element;
}

function renderCollection(configurations: VueCustomElementStoryArgs[]): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.dataset.dateTimePickerParity = '';
  Object.assign(wrapper.style, {
    alignItems: 'start',
    display: 'grid',
    gap: '1.25rem',
    gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,22rem),1fr))',
  });
  configurations.forEach((configuration) => wrapper.append(renderDateTimePicker(configuration)));
  return wrapper;
}

const meta = {
  title: '5. Form/FormDateTimePicker WC',
  component: FormDateTimePickerElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(FormDateTimePickerVueComponent),
    ...formDateTimePickerDemoProps,
    ariaLabel: undefined,
    dataTestId: 'form-date-time-picker-default',
    open: false,
  },
  argTypes: createVueCustomElementArgTypes(FormDateTimePickerVueComponent),
  parameters: {
    name: 'FormDateTimePicker',
    description:
      'Light-DOM Web Component z identycznym modelem lokalnej daty i czasu, wyglądem, responsywnością, ARIA i klawiaturą jak Vue i React.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormDateTimePicker';
  import '@peaui/ui/styles.css';
  const picker = document.querySelector('peaui-form-date-time-picker');
  picker.value = { date: '2026-08-18', time: '09:30' };
</script>
<peaui-form-date-time-picker id="meeting" name="meeting" label="Termin spotkania"></peaui-form-date-time-picker>
    `,
  },
  render: renderDateTimePicker,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const InputAndLayoutVariants: Story = {
  render: () =>
    renderCollection([
      { ...formDateTimePickerDemoProps, id: 'date-time-single-wc' },
      {
        ...formDateTimePickerDemoProps,
        id: 'date-time-split-wc',
        label: 'Dwa pola',
        variant: 'split-input',
      },
      {
        ...formDateTimePickerDemoProps,
        id: 'date-time-stacked-wc',
        label: 'Panel pionowy',
        layout: 'stacked',
      },
    ]),
};
export const ConfirmAndBoundaries: Story = {
  args: {
    confirm: true,
    max: { date: '2026-08-20', time: '17:00' },
    min: { date: '2026-08-18', time: '09:00' },
    open: true,
  },
};
export const TwelveHourWithSeconds: Story = {
  args: {
    format: '12h',
    locale: 'en-US',
    minuteStep: 1,
    secondStep: 1,
    showSeconds: true,
    timeZone: 'America/New_York',
    value: { date: '2026-08-18', time: '13:05:09' },
  },
};
export const ValidationAndStates: Story = {
  render: () =>
    renderCollection([
      { id: 'date-time-required-wc', label: 'Wymagany termin', name: 'required', required: true },
      {
        ...formDateTimePickerDemoProps,
        error: 'Termin koliduje z innym spotkaniem.',
        id: 'date-time-error-wc',
      },
      { ...formDateTimePickerDemoProps, id: 'date-time-readonly-wc', readonly: true },
      { ...formDateTimePickerDemoProps, id: 'date-time-loading-wc', loading: true },
      { ...formDateTimePickerDemoProps, disabled: true, id: 'date-time-disabled-wc' },
    ]),
};
export const NativeSlots: Story = {
  args: { confirm: true, open: true },
  render: (args) => {
    const element = renderDateTimePicker(args);
    const description = document.createElement('span');
    description.slot = 'description';
    description.textContent = 'Opis przekazany przez natywny slot.';
    const footer = document.createElement('div');
    footer.slot = 'footer';
    footer.textContent = 'Niestandardowe akcje terminu';
    element.append(description, footer);
    return element;
  },
};
export const MobileAndLongLabel: Story = {
  args: {
    dataTestId: 'form-date-time-picker-mobile',
    id: 'date-time-mobile-wc',
    label: formDateTimePickerLongLabel,
    name: 'dateTimeMobile',
    value: formDateTimePickerDemoValue,
    variant: 'split-input',
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.dataset.dateTimePickerMobile = '';
    Object.assign(wrapper.style, { maxInlineSize: '100%', paddingBlock: '1rem', width: '19rem' });
    wrapper.append(renderDateTimePicker(args));
    return wrapper;
  },
};
