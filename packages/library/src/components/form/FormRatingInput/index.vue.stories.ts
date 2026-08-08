import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import {
  formRatingInputDemoProps,
  formRatingInputLabels,
  formRatingInputLongLabel,
} from './form-rating-input.demo';
import FormRatingInputComponent from './index.vue';
import type { RatingValue } from './rating-input.shared';

const meta = {
  title: '5. Form/FormRatingInput',
  component: FormRatingInputComponent,
  parameters: {
    name: 'FormRatingInput',
    description:
      'Dostępna i responsywna ocena z pojedynczym suwakiem, stabilnym opisem wartości oraz gwiazdkami w systemowym kolorze primary.',
  },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'] },
    step: { control: 'select', options: [1, 0.5] },
  },
} satisfies Meta<typeof FormRatingInputComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

export const Playground: Story = {
  render: (args) => ({
    components: { FormRatingInputComponent, StoryContent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="inline-size:32rem;max-inline-size:100%">
          <FormRatingInputComponent v-bind="args" v-model:value="args.value" />
        </div>
      </StoryContent>
    `,
  }),
  args: {
    ...formRatingInputDemoProps,
    allowClear: true,
    dataTestId: 'form-rating-input-default',
    step: 0.5,
  },
};

export const FullAndHalfSteps: Story = {
  render: () => ({
    components: { FormRatingInputComponent, StoryContent },
    setup: () => ({ labels: formRatingInputLabels, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div data-rating-parity style="display:grid;gap:1rem">
          <FormRatingInputComponent id="rating-full" name="ratingFull" label="Pełne oceny" :value="4" :labels="labels" />
          <FormRatingInputComponent id="rating-half" name="ratingHalf" label="Połówkowe oceny" :value="3.5" :labels="labels" :step="0.5" />
          <FormRatingInputComponent id="rating-empty" name="ratingEmpty" label="Pusta ocena" :value="null" allow-clear />
        </div>
      </StoryContent>
    `,
  }),
};

export const SizesAndCustomIcon: Story = {
  render: () => ({
    components: { FormRatingInputComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem">
          <FormRatingInputComponent id="rating-s" label="Mała" :value="3" size="s" />
          <FormRatingInputComponent id="rating-m" label="Średnia" :value="3" size="m" />
          <FormRatingInputComponent id="rating-l" label="Duża, własna ikona" :value="3" size="l" icon="core/heart" />
        </div>
      </StoryContent>
    `,
  }),
};

export const ReadonlyDisabledAndError: Story = {
  render: () => ({
    components: { FormRatingInputComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1rem">
          <FormRatingInputComponent id="rating-readonly" label="Tylko do odczytu" :value="4" readonly />
          <FormRatingInputComponent id="rating-disabled" label="Wyłączona" :value="2" disabled />
          <FormRatingInputComponent id="rating-error" label="Wymagana ocena" :value="null" required error="Wybierz ocenę, aby kontynuować." />
        </div>
      </StoryContent>
    `,
  }),
};

export const ControlledKeyboardAndClear: Story = {
  render: () => ({
    components: { FormRatingInputComponent, StoryContent },
    setup() {
      const value = ref<RatingValue>(2.5);
      return { settings: getSettings(meta), value };
    },
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem;max-inline-size:32rem">
          <p>Użyj strzałek, Home, End oraz Delete lub Backspace.</p>
          <FormRatingInputComponent v-model:value="value" id="rating-keyboard" name="ratingKeyboard" label="Ocena sterowana" :step="0.5" allow-clear />
          <output>Model: {{ value ?? 'brak' }}</output>
        </div>
      </StoryContent>
    `,
  }),
};

export const MobileAndLongLabel: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  args: {
    ...formRatingInputDemoProps,
    dataTestId: 'form-rating-input-mobile',
    label: formRatingInputLongLabel,
    max: 10,
    value: 7,
  },
  render: Playground.render,
};

export const DarkMode: Story = {
  args: { ...formRatingInputDemoProps, step: 0.5 },
  parameters: { backgrounds: { default: 'dark' } },
  render: Playground.render,
};
