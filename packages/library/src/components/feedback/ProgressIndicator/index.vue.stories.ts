import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import ProgressIndicatorComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof ProgressIndicatorComponent> = {
  title: '4. Feedback/ProgressIndicator',
  component: ProgressIndicatorComponent,
  parameters: {
    name: 'ProgressIndicator',
    description:
      'Okrągły wskaźnik postępu (kroki). Props: steps, active, size, strokeWidth, removeActive.',
    code: `
<script lang="ts" setup>
  import ProgressIndicator from "@peaui/ui/feedback/ProgressIndicator";
</script>

<template>
  <ProgressIndicator :steps="5" :active="1" />
</template>
    `,
  },
  argTypes: {
    steps: {
      control: { type: 'number' },
      description: 'Liczba kroków.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: undefined },
      },
    },
    active: {
      control: { type: 'number' },
      description: 'Aktualny krok (wartość aktywna).',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    size: {
      control: { type: 'number' },
      description: 'Rozmiar komponentu w px (szerokość/wysokość).',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    strokeWidth: {
      control: { type: 'number' },
      description: 'Grubość obrysu.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    removeActive: {
      control: { type: 'boolean' },
      description: 'Gdy true – usuwa aktywną część (np. pokazuje tylko total).',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'data-testid na root.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProgressIndicatorComponent>;

export const ProgressIndicator: Story = {
  render: (args) => ({
    components: { ProgressIndicatorComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <ProgressIndicatorComponent v-bind="args" />
      </StoryContent>
    `,
  }),
  args: {
    steps: 5,
    active: 1,
    size: undefined,
    strokeWidth: undefined,
    removeActive: false,
    dataTestId: 'progress-indicator',
  },
};

export const NotStarted: Story = {
  ...ProgressIndicator,
  args: { ...ProgressIndicator.args, steps: 4, active: undefined },
};
