import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import InputSliderComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof InputSliderComponent> = {
  title: '3. Data Entry/InputSlider',
  component: InputSliderComponent,
  parameters: {
    name: 'InputSlider',
    description:
      'InputSlider to komponent formularza oparty o input type="range". ' +
      'Obsługuje v-model, przyciski zwiększania/zmniejszania wartości oraz stany disabled i error.',
    code: `
<script lang="ts" setup>
  import InputSlider from "@peaui/ui/data-entry/InputSlider";
  import { ref } from "vue";

  const value = ref(50);
</script>

<template>
  <InputSlider
    v-model="value"
    label="Wartość"
  />
</template>
    `,
  },
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'Etykieta pola formularza.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Aria-label dla natywnego input range.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },

    dataTestId: {
      control: { type: 'text' },
      description: 'Atrybut data-testid dla komponentu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof InputSliderComponent>;

export const InputSlider: Story = {
  render: (args) => ({
    components: { StoryContent, InputSliderComponent },
    setup() {
      const settings = getSettings(meta);
      return { args, settings };
    },
    template: `
      <StoryContent :settings="settings">
        <InputSliderComponent v-bind="args" />
      </StoryContent>
    `,
  }),
  args: {
    name: 'lorem-ipsum',
    ariaLabel: 'Przykladowy suwak',
    dataTestId: 'input-slider',
  },
};
