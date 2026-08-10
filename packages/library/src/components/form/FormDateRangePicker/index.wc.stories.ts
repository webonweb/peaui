import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import {
  formDateRangePickerDemoProps,
  formDateRangePickerDemoValue,
  formDateRangePickerLongLabel,
} from './form-date-range-picker.demo';
import FormDateRangePickerVueComponent from './index.vue';
import { defineFormDateRangePicker, FormDateRangePickerElement } from './index.wc';

defineFormDateRangePicker();

function renderPicker(args: VueCustomElementStoryArgs): HTMLElement {
  const element = document.createElement(FormDateRangePickerElement.tagName) as HTMLElement &
    Record<string, unknown>;
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }
  return element;
}

function renderCollection(configurations: VueCustomElementStoryArgs[]): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.dataset.dateRangePickerParity = '';
  Object.assign(wrapper.style, {
    alignItems: 'start',
    display: 'grid',
    gap: '1.25rem',
    gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,22rem),1fr))',
  });
  configurations.forEach((configuration) => wrapper.append(renderPicker(configuration)));
  return wrapper;
}

const meta = {
  title: '5. Form/FormDateRangePicker WC',
  component: FormDateRangePickerElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(FormDateRangePickerVueComponent),
    ...formDateRangePickerDemoProps,
    ariaLabel: undefined,
    dataTestId: 'form-date-range-picker-default',
    open: false,
  },
  argTypes: createVueCustomElementArgTypes(FormDateRangePickerVueComponent),
  parameters: {
    name: 'FormDateRangePicker',
    description:
      'Light-DOM Web Component z identycznym modelem zakresu, kompaktowymi presetami xxs, systemowymi akcjami xs, responsywnością, ARIA i klawiaturą jak Vue i React.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormDateRangePicker';
  const picker = document.querySelector('peaui-form-date-range-picker');
  picker.value = ['2026-08-10', '2026-08-18'];
</script>
<peaui-form-date-range-picker id="range" name="range" label="Zakres raportu"></peaui-form-date-range-picker>
    `,
  },
  render: renderPicker,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const VariantsAndCalendars: Story = {
  render: () =>
    renderCollection([
      { ...formDateRangePickerDemoProps, id: 'range-two-wc' },
      {
        ...formDateRangePickerDemoProps,
        id: 'range-single-wc',
        label: 'Jedno pole',
        variant: 'single-input',
      },
      {
        ...formDateRangePickerDemoProps,
        calendars: 1,
        id: 'range-calendar-wc',
        label: 'Jeden kalendarz',
      },
    ]),
};
export const ConfirmBoundariesAndPresets: Story = {
  args: { confirm: true, maxDate: '2026-08-31', minDate: '2026-08-01', open: true },
};
export const SelectionPolicies: Story = {
  render: () =>
    renderCollection([
      {
        ...formDateRangePickerDemoProps,
        dateFormat: 'iso',
        id: 'range-swap-wc',
        label: 'Swap',
        selectionOrder: 'swap',
        variant: 'single-input',
      },
      {
        ...formDateRangePickerDemoProps,
        dateFormat: 'iso',
        id: 'range-reject-wc',
        label: 'Reject',
        selectionOrder: 'reject',
        variant: 'single-input',
      },
      {
        ...formDateRangePickerDemoProps,
        dateFormat: 'iso',
        id: 'range-reset-wc',
        label: 'Reset końca',
        selectionOrder: 'resetEnd',
        variant: 'single-input',
      },
    ]),
};
export const ValidationAndStates: Story = {
  render: () =>
    renderCollection([
      { id: 'range-required-wc', label: 'Wymagany zakres', name: 'required', required: true },
      {
        ...formDateRangePickerDemoProps,
        error: 'Zakres koliduje z zamkniętym okresem.',
        id: 'range-error-wc',
      },
      { ...formDateRangePickerDemoProps, id: 'range-readonly-wc', readonly: true },
      { ...formDateRangePickerDemoProps, id: 'range-loading-wc', loading: true },
      { ...formDateRangePickerDemoProps, disabled: true, id: 'range-disabled-wc' },
    ]),
};
export const NativeSlots: Story = {
  args: { confirm: true, open: true },
  render: (args) => {
    const element = renderPicker(args);
    const description = document.createElement('span');
    description.slot = 'description';
    description.textContent = 'Opis przekazany przez natywny slot.';
    const footer = document.createElement('div');
    footer.slot = 'footer';
    footer.textContent = 'Niestandardowe akcje zakresu';
    element.append(description, footer);
    return element;
  },
};
export const MobileAndLongLabel: Story = {
  args: {
    dataTestId: 'form-date-range-picker-mobile',
    id: 'range-mobile-wc',
    label: formDateRangePickerLongLabel,
    name: 'rangeMobile',
    value: formDateRangePickerDemoValue,
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.dataset.dateRangePickerMobile = '';
    Object.assign(wrapper.style, { maxInlineSize: '100%', paddingBlock: '1rem', width: '19rem' });
    wrapper.append(renderPicker(args));
    return wrapper;
  },
};
