import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import {
  formDateRangePickerDemoPresets,
  formDateRangePickerDemoProps,
  formDateRangePickerDemoValue,
  formDateRangePickerLongLabel,
} from './form-date-range-picker.demo';
import FormDateRangePickerComponent from './index.vue';
import type { DateRangeValue } from './date-range-picker.shared';

const meta = {
  title: '5. Form/FormDateRangePicker',
  component: FormDateRangePickerComponent,
  args: { ...formDateRangePickerDemoProps },
  parameters: {
    name: 'FormDateRangePicker',
    description:
      'Responsywny wybór zakresu dat z ręcznym wpisem, kompaktowymi presetami xxs, jednym lub dwoma kalendarzami, pełną klawiaturą oraz systemowymi akcjami zatwierdzania xs.',
  },
  argTypes: {
    calendars: { control: 'select', options: [1, 2] },
    dateFormat: { control: 'select', options: ['locale', 'iso'] },
    placement: { control: 'select', options: ['bottom', 'top'] },
    selectionOrder: { control: 'select', options: ['swap', 'reject', 'resetEnd'] },
    variant: { control: 'select', options: ['single-input', 'two-inputs'] },
  },
} satisfies Meta<typeof FormDateRangePickerComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

export const Playground: Story = {
  render: (args) => ({
    components: { FormDateRangePickerComponent, StoryContent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="inline-size:34rem;max-inline-size:100%">
          <FormDateRangePickerComponent v-bind="args" v-model:value="args.value" v-model:open="args.open" />
        </div>
      </StoryContent>
    `,
  }),
  args: {
    ...formDateRangePickerDemoProps,
    dataTestId: 'form-date-range-picker-default',
    open: false,
  },
};

export const VariantsAndCalendars: Story = {
  render: () => ({
    components: { FormDateRangePickerComponent, StoryContent },
    setup: () => ({
      presets: formDateRangePickerDemoPresets,
      settings: getSettings(meta),
      value: formDateRangePickerDemoValue,
    }),
    template: `
      <StoryContent :settings>
        <div data-date-range-picker-parity style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,22rem),1fr));gap:1.25rem;align-items:start">
          <FormDateRangePickerComponent id="range-two-inputs" name="rangeTwoInputs" label="Dwa pola" :value="value" :presets="presets" />
          <FormDateRangePickerComponent id="range-single-input" name="rangeSingleInput" label="Jedno pole" :value="value" variant="single-input" :presets="presets" />
          <FormDateRangePickerComponent id="range-single-calendar" name="rangeSingleCalendar" label="Jeden kalendarz" :value="value" :calendars="1" />
        </div>
      </StoryContent>
    `,
  }),
};

export const ConfirmBoundariesAndPresets: Story = {
  args: {
    ...formDateRangePickerDemoProps,
    confirm: true,
    maxDate: '2026-08-31',
    minDate: '2026-08-01',
    open: true,
  },
  render: Playground.render,
};

export const SelectionPolicies: Story = {
  render: () => ({
    components: { FormDateRangePickerComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr));gap:1.25rem">
          <FormDateRangePickerComponent id="range-swap" name="rangeSwap" label="Swap" date-format="iso" variant="single-input" selection-order="swap" />
          <FormDateRangePickerComponent id="range-reject" name="rangeReject" label="Reject" date-format="iso" variant="single-input" selection-order="reject" />
          <FormDateRangePickerComponent id="range-reset" name="rangeReset" label="Reset końca" date-format="iso" variant="single-input" selection-order="resetEnd" />
        </div>
      </StoryContent>
    `,
  }),
};

export const ValidationAndStates: Story = {
  render: () => ({
    components: { FormDateRangePickerComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta), value: formDateRangePickerDemoValue }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr));gap:1.25rem">
          <FormDateRangePickerComponent id="range-required" name="rangeRequired" label="Wymagany zakres" required />
          <FormDateRangePickerComponent id="range-error" name="rangeError" label="Błąd zewnętrzny" :value="value" error="Zakres koliduje z zamkniętym okresem." />
          <FormDateRangePickerComponent id="range-readonly" name="rangeReadonly" label="Tylko do odczytu" :value="value" readonly />
          <FormDateRangePickerComponent id="range-loading" name="rangeLoading" label="Ładowanie" :value="value" loading />
          <FormDateRangePickerComponent id="range-disabled" name="rangeDisabled" label="Niedostępny" :value="value" disabled />
        </div>
      </StoryContent>
    `,
  }),
};

export const Controlled: Story = {
  render: () => ({
    components: { FormDateRangePickerComponent, StoryContent },
    setup() {
      const value = ref<DateRangeValue>();
      const open = ref(false);
      return { open, settings: getSettings(meta), value };
    },
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem;inline-size:34rem;max-inline-size:100%">
          <FormDateRangePickerComponent v-model:value="value" v-model:open="open" id="range-controlled" name="rangeControlled" label="Kontrolowany zakres" />
          <output>Wartość: {{ value?.filter(Boolean).join(' – ') || 'brak' }}; panel: {{ open ? 'otwarty' : 'zamknięty' }}</output>
        </div>
      </StoryContent>
    `,
  }),
};

export const MobileAndLongLabel: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    components: { FormDateRangePickerComponent },
    setup: () => ({ formDateRangePickerDemoValue, formDateRangePickerLongLabel }),
    template: `
      <div data-date-range-picker-mobile style="inline-size:19rem;max-inline-size:100%;padding-block:1rem">
        <FormDateRangePickerComponent id="range-mobile" name="rangeMobile" :label="formDateRangePickerLongLabel" :value="formDateRangePickerDemoValue" data-test-id="form-date-range-picker-mobile" />
      </div>
    `,
  }),
};
