import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import CalculationResultsComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof CalculationResultsComponent> = {
  title: '2. Data Display/CalculationResults',
  component: CalculationResultsComponent,
  parameters: {
    name: 'CalculationResults',
    description:
      'Komponent wyświetlający wynik obliczeń z etykietą oraz opcjonalnym przyciskiem akcji lub prostym układem bez przycisku.',
    code: `
<script lang="ts" setup>
  import CalculationResults from "@peaui/ui/data-display/CalculationResults";
</script>

<template>
  <CalculationResults
    label="Wynik obliczeń"
    result="123 kWh"
    :show-calculate-button="true"
  />
</template>
    `,
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Etykieta wyświetlana nad wynikiem.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    result: {
      control: { type: 'text' },
      description: 'Wartość wyniku obliczeń.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    showCalculateButton: {
      control: { type: 'boolean' },
      description: 'Czy wyświetlić przycisk obliczania.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    isSimple: {
      control: { type: 'boolean' },
      description:
        'Przełącza komponent w prosty układ bez przycisku, z wynikiem po prawej stronie.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Stan ładowania wyniku.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Blokuje przycisk akcji.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowy data-testid komponentu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CalculationResultsComponent>;

const renderStory = (args: Story['args']) => ({
  components: { CalculationResultsComponent, StoryContent },
  setup() {
    return { args, settings: getSettings(meta) };
  },
  template: `
    <StoryContent :settings>
      <div style="width:400px">
        <CalculationResultsComponent v-bind="args" @on:simulate="() => console.log('simulate')">
          <template #hint>
            Lorem ipsum
          </template>
        </CalculationResultsComponent>
      </div>
    </StoryContent>
  `,
});

export const CalculationResults: Story = {
  render: renderStory,
  args: {
    label: 'Lorem ipsum',
    result: '123 kWh',
    showCalculateButton: true,
    isSimple: false,
    isLoading: false,
    disabled: false,
    dataTestId: 'calculation-results',
  },
};

export const Loading: Story = {
  render: renderStory,
  args: { ...CalculationResults.args, isLoading: true, showCalculateButton: true },
};

export const Simple: Story = {
  render: renderStory,
  args: {
    label: 'Wynik uproszczony',
    result: '56.3 kWh',
    showCalculateButton: true,
    isSimple: true,
    isLoading: false,
    disabled: false,
    dataTestId: 'calculation-results-simple',
  },
};

export const SimpleLongResult: Story = {
  render: (args) => ({
    components: { CalculationResultsComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <div >
          <CalculationResultsComponent v-bind="args" @on:simulate="() => console.log('simulate')">
            <template #hint>
              Lorem ipsum
            </template>
          </CalculationResultsComponent>
        </div>
      </StoryContent>
    `,
  }),
  args: {
    label: 'Wynik uproszczony',
    result: '123456789.123456789 kWh/m²',
    showCalculateButton: true,
    isSimple: true,
    isLoading: false,
    disabled: false,
    dataTestId: 'calculation-results-simple-long-result',
  },
};
