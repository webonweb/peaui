import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import FormTimePickerComponent from './index.vue';
import { formTimePickerDemoProps, formTimePickerLongLabel } from './form-time-picker.demo';

const meta = {
  title: '5. Form/FormTimePicker',
  component: FormTimePickerComponent,
  args: { ...formTimePickerDemoProps },
  parameters: {
    name: 'FormTimePicker',
    description:
      'Dostępny wybór czasu z ręcznym wpisywaniem, segmentami, formatem 12/24h, sekundami, zakresem i kontrolowanym panelem.',
  },
  argTypes: {
    format: { control: 'select', options: ['24h', '12h'] },
    panelMode: { control: 'select', options: ['dropdown', 'spinbutton'] },
    placement: { control: 'select', options: ['bottom', 'top'] },
    variant: { control: 'select', options: ['input', 'segmented'] },
  },
} satisfies Meta<typeof FormTimePickerComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

export const Playground: Story = {
  render: (args) => ({
    components: { FormTimePickerComponent, StoryContent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="inline-size:22rem;max-inline-size:100%">
          <FormTimePickerComponent v-bind="args" v-model:value="args.value" v-model:open="args.open" />
        </div>
      </StoryContent>
    `,
  }),
  args: { ...formTimePickerDemoProps, dataTestId: 'form-time-picker-default', open: false },
};

export const VariantsAndPanels: Story = {
  render: () => ({
    components: { FormTimePickerComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div data-time-picker-parity style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:1.25rem;align-items:start">
          <FormTimePickerComponent id="time-input" name="time-input" label="Pole tekstowe" value="09:30" />
          <FormTimePickerComponent id="time-segmented" name="time-segmented" label="Segmenty" value="09:30" variant="segmented" />
          <FormTimePickerComponent id="time-spin" name="time-spin" label="Panel spinbutton" value="09:30" panel-mode="spinbutton" />
        </div>
      </StoryContent>
    `,
  }),
};

export const TwelveHourWithSeconds: Story = {
  args: {
    ...formTimePickerDemoProps,
    format: '12h',
    locale: 'en-US',
    minuteStep: 1,
    secondStep: 1,
    showSeconds: true,
    value: '13:05:09',
  },
  render: Playground.render,
};

export const ValidationAndStates: Story = {
  render: () => ({
    components: { FormTimePickerComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:1.25rem">
          <FormTimePickerComponent id="time-required" name="time-required" label="Wymagany czas" required />
          <FormTimePickerComponent id="time-error" name="time-error" label="Błąd zewnętrzny" value="07:30" error="Godzina musi mieścić się w godzinach pracy." />
          <FormTimePickerComponent id="time-readonly" name="time-readonly" label="Tylko do odczytu" value="09:30" readonly />
          <FormTimePickerComponent id="time-loading" name="time-loading" label="Ładowanie" value="09:30" loading />
          <FormTimePickerComponent id="time-disabled" name="time-disabled" label="Niedostępny" value="09:30" disabled />
        </div>
      </StoryContent>
    `,
  }),
};

export const Controlled: Story = {
  render: () => ({
    components: { FormTimePickerComponent, StoryContent },
    setup() {
      const value = ref<string>();
      const open = ref(false);
      return { open, settings: getSettings(meta), value };
    },
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem;inline-size:22rem;max-inline-size:100%">
          <FormTimePickerComponent v-model:value="value" v-model:open="open" id="time-controlled" name="time-controlled" label="Kontrolowany czas" />
          <output>Wartość: {{ value || 'brak' }}; panel: {{ open ? 'otwarty' : 'zamknięty' }}</output>
        </div>
      </StoryContent>
    `,
  }),
};

export const MobileAndLongLabel: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    components: { FormTimePickerComponent },
    setup: () => ({ formTimePickerLongLabel }),
    template: `
      <div data-time-picker-mobile style="inline-size:18rem;max-inline-size:100%;padding-block:1rem">
        <FormTimePickerComponent id="time-mobile" name="time-mobile" :label="formTimePickerLongLabel" value="09:30" data-test-id="form-time-picker-mobile" />
      </div>
    `,
  }),
};

export const NativeRequiredAndReset: Story = {
  render: () => ({
    components: { FormTimePickerComponent },
    setup: () => ({ value: ref<string | undefined>(undefined) }),
    template:
      '<form @submit.prevent @reset="value = undefined"><FormTimePickerComponent id="native-time" name="value" label="Required value" variant="segmented" required v-model:value="value" /><button type="submit">Validate</button><button type="reset">Reset</button></form>',
  }),
};
