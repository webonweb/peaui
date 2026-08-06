import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import BreadcrumbsComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof BreadcrumbsComponent> = {
  title: '7. Navigation/Breadcrumbs',
  component: BreadcrumbsComponent,
  parameters: {
    name: 'Breadcrumbs',
    description:
      'Komponent nawigacyjny w formie breadcrumbs. Renderuje ścieżkę jako lista (ol/li) oraz wersję mobilną z popoverem.',
    code: `
<script lang="ts" setup>
  import Breadcrumbs from "@peaui/ui/navigation/Breadcrumbs";
</script>

<template>
  <Breadcrumbs
    aria-label="Ścieżka nawigacji"
    :items="[
      { key: 'home', label: 'Home' },
      { key: 'projects', label: 'Projects' },
      { key: 'current', label: 'Current page' },
    ]"
    separator="/"
  />
</template>
    `,
  },
  argTypes: {
    items: {
      control: { type: 'object' },
      description: 'Lista elementów breadcrumbs. Każdy item: { key, label, disabled? }.',
      table: {
        type: {
          summary:
            'Array<{ key?: string; label: string | ((router: any) => string); path?: string }>',
        },
        defaultValue: { summary: 'Ścieżka nawigacji' },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Wartość aria-label dla elementu nawigacji.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    separator: {
      control: { type: 'text' },
      description: 'Separator renderowany pomiędzy elementami.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Atrybut data-testid do testów.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof BreadcrumbsComponent>;

export const Breadcrumbs: Story = {
  render: (args) => ({
    components: { BreadcrumbsComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="resize: horizontal;overflow: auto;min-width: 200px;max-width: 500px;width:500px">
          <BreadcrumbsComponent v-bind="args" />
        </div>
      </StoryContent>
    `,
  }),
  args: {
    ariaLabel: 'Ścieżka nawigacji',
    items: [
      { key: 'home', label: 'Home' },
      { key: 'projects', label: 'Projects' },
      { key: 'current', label: 'Current page' },
    ],
    separator: '/',
  },
};
