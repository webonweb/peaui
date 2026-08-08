import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import {
  formDateTimePickerDemoProps,
  formDateTimePickerDemoValue,
  formDateTimePickerLongLabel,
} from './form-date-time-picker.demo';
import FormDateTimePickerComponent from './index.vue';
import type { LocalDateTimeValue } from './date-time-picker.shared';

const meta = {
  title: '5. Form/FormDateTimePicker',
  component: FormDateTimePickerComponent,
  parameters: {
    name: 'FormDateTimePicker',
    description:
      'Responsywny wybór lokalnej daty i czasu z jednym modelem, wspólnym panelem, pełną klawiaturą i opcjonalnym zatwierdzaniem.',
  },
  argTypes: {
    dateFormat: { control: 'select', options: ['locale', 'iso'] },
    format: { control: 'select', options: ['24h', '12h'] },
    layout: { control: 'select', options: ['side-by-side', 'stacked'] },
    placement: { control: 'select', options: ['bottom', 'top'] },
    variant: { control: 'select', options: ['single-input', 'split-input'] },
  },
} satisfies Meta<typeof FormDateTimePickerComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

export const Playground: Story = {
  render: (args) => ({
    components: { FormDateTimePickerComponent, StoryContent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="inline-size:32rem;max-inline-size:100%">
          <FormDateTimePickerComponent v-bind="args" v-model:value="args.value" v-model:open="args.open" />
        </div>
      </StoryContent>
    `,
  }),
  args: {
    ...formDateTimePickerDemoProps,
    dataTestId: 'form-date-time-picker-default',
    open: false,
  },
};

export const InputAndLayoutVariants: Story = {
  render: () => ({
    components: { FormDateTimePickerComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta), value: formDateTimePickerDemoValue }),
    template: `
      <StoryContent :settings>
        <div data-date-time-picker-parity style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,22rem),1fr));gap:1.25rem;align-items:start">
          <FormDateTimePickerComponent id="date-time-single" name="dateTimeSingle" label="Jedno pole" :value="value" />
          <FormDateTimePickerComponent id="date-time-split" name="dateTimeSplit" label="Dwa pola" :value="value" variant="split-input" />
          <FormDateTimePickerComponent id="date-time-stacked" name="dateTimeStacked" label="Panel pionowy" :value="value" layout="stacked" />
        </div>
      </StoryContent>
    `,
  }),
};

export const ConfirmAndBoundaries: Story = {
  args: {
    ...formDateTimePickerDemoProps,
    confirm: true,
    max: { date: '2026-08-20', time: '17:00' },
    min: { date: '2026-08-18', time: '09:00' },
    open: true,
  },
  render: Playground.render,
};

export const TwelveHourWithSeconds: Story = {
  args: {
    ...formDateTimePickerDemoProps,
    format: '12h',
    locale: 'en-US',
    minuteStep: 1,
    secondStep: 1,
    showSeconds: true,
    timeZone: 'America/New_York',
    value: { date: '2026-08-18', time: '13:05:09' },
  },
  render: Playground.render,
};

export const ValidationAndStates: Story = {
  render: () => ({
    components: { FormDateTimePickerComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta), value: formDateTimePickerDemoValue }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr));gap:1.25rem">
          <FormDateTimePickerComponent id="date-time-required" name="dateTimeRequired" label="Wymagany termin" required />
          <FormDateTimePickerComponent id="date-time-error" name="dateTimeError" label="Błąd zewnętrzny" :value="value" error="Termin koliduje z innym spotkaniem." />
          <FormDateTimePickerComponent id="date-time-readonly" name="dateTimeReadonly" label="Tylko do odczytu" :value="value" readonly />
          <FormDateTimePickerComponent id="date-time-loading" name="dateTimeLoading" label="Ładowanie" :value="value" loading />
          <FormDateTimePickerComponent id="date-time-disabled" name="dateTimeDisabled" label="Niedostępny" :value="value" disabled />
        </div>
      </StoryContent>
    `,
  }),
};

export const Controlled: Story = {
  render: () => ({
    components: { FormDateTimePickerComponent, StoryContent },
    setup() {
      const value = ref<LocalDateTimeValue>();
      const open = ref(false);
      return { open, settings: getSettings(meta), value };
    },
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem;inline-size:32rem;max-inline-size:100%">
          <FormDateTimePickerComponent v-model:value="value" v-model:open="open" id="date-time-controlled" name="dateTimeControlled" label="Kontrolowany termin" />
          <output>Wartość: {{ value ? value.date + ' ' + value.time : 'brak' }}; panel: {{ open ? 'otwarty' : 'zamknięty' }}</output>
        </div>
      </StoryContent>
    `,
  }),
};

export const MobileAndLongLabel: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    components: { FormDateTimePickerComponent },
    setup: () => ({ formDateTimePickerDemoValue, formDateTimePickerLongLabel }),
    template: `
      <div data-date-time-picker-mobile style="inline-size:19rem;max-inline-size:100%;padding-block:1rem">
        <FormDateTimePickerComponent id="date-time-mobile" name="dateTimeMobile" :label="formDateTimePickerLongLabel" :value="formDateTimePickerDemoValue" variant="split-input" data-test-id="form-date-time-picker-mobile" />
      </div>
    `,
  }),
};
