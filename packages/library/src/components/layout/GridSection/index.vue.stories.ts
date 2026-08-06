import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import GridSectionComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof GridSectionComponent> = {
  title: '6. Layout/GridSection',
  component: GridSectionComponent,
  parameters: {
    name: 'GridSection',
    description: 'Layoutowy grid z opcjonalnym slotem additional nad contentem.',
    code: `
<script lang="ts" setup>
  import GridSection from "@peaui/ui/layout/GridSection";
</script>

<template>
  <GridSection :columns="4" :gap="6">
    <template #additional>
      <div>Additional</div>
    </template>

    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
    <div>Item 4</div>
  </GridSection>
</template>
    `,
  },
  argTypes: {
    columns: {
      control: { type: 'number' },
      description: 'Liczba kolumn (responsywnie).',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: '4' },
      },
    },
    gap: {
      control: { type: 'number' },
      description: 'Pionowy odstęp między elementami (gap-y-*) w content.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: '6' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof GridSectionComponent>;

export const GridSection: Story = {
  render: (args) => ({
    components: { GridSectionComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <GridSectionComponent v-bind="args">
          <template #additional>
            <div>Additional</div>
          </template>

          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
          <div>Item 4</div>
        </GridSectionComponent>
      </StoryContent>
    `,
  }),
  args: {
    columns: 4,
    gap: 6,
  },
};
