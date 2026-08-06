import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import SpinnerLoaderComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof SpinnerLoaderComponent> = {
  title: '4. Feedback/SpinnerLoader',
  component: SpinnerLoaderComponent,
  parameters: {
    name: 'SpinnerLoader',
    description:
      'Pełnoekranowy loader blokujący UI. Zawiera komunikat dla czytników ekranu (sr-only) oraz overlay. Przyjmuje dataTestId i wspiera przekazywanie atrybutów przez v-bind (useAttrs).',
    code: `
<script lang="ts" setup>
  import SpinnerLoader from "@peaui/ui/feedback/SpinnerLoader";
</script>

<template>
  <SpinnerLoader dataTestId="fullscreen-loader" />
</template>
    `,
  },
  argTypes: {
    dataTestId: {
      control: { type: 'text' },
      description: 'Atrybut data-testid do testów automatycznych (opcjonalny).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SpinnerLoaderComponent>;

export const SpinnerLoader: Story = {
  render: (args) => ({
    components: { SpinnerLoaderComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <SpinnerLoaderComponent v-bind="args" />
      </StoryContent>
    `,
  }),
  args: {
    dataTestId: 'spinner-loader',
  },
};
