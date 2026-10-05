import GridSection from '@/components/layout/GridSection/index.vue';
import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import GridItemComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof GridItemComponent> = {
  title: '6. Layout/GridItem',
  component: GridItemComponent,
  parameters: {
    name: 'GridItem',
    description: 'Element siatki (grid) z opcjonalnym wewnętrznym gridem i colspan.',
    code: `
<script lang="ts" setup>
  import GridItem from "@peaui/ui/layout/GridItem";
</script>

<template>
  <GridItem :colspan="2" :grid="true">
    <div>Content</div>
  </GridItem>
</template>
    `,
  },
  argTypes: {
    colspan: {
      control: { type: 'number' },
      description: 'Ile kolumn ma zajmować element (span).',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: '1' },
      },
    },
    columns: {
      control: { type: 'number' },
      description:
        'Liczba kolumn wewnętrznego grida; domyślnie 2. Wartość 0 dobiera kolumny do dzieci.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: '2' },
      },
    },
    gap: {
      control: { type: 'number' },
      description: 'Gap wewnetrznego grida w skali zgodnej z GridSection.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: '6' },
      },
    },
    grid: {
      control: { type: 'boolean' },
      description: 'Jeśli true – element staje się gridem wewnętrznym.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'true' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof GridItemComponent>;

export const GridItem: Story = {
  render: (args) => ({
    components: { GridItemComponent, StoryContent, GridSection },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <GridSection>
          <GridItemComponent v-bind="args">
            <div>Content</div>
            <div>Content</div>
            <div>Content</div>
          </GridItemComponent>
        </GridSection>
      </StoryContent>
    `,
  }),
  args: {
    colspan: 3,
    columns: 4,
    gap: 6,
    grid: true,
  },
};
