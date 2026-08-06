import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import EmptyStateComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof EmptyStateComponent> = {
  title: '4. Feedback/EmptyState',
  component: EmptyStateComponent,
  parameters: {
    name: 'EmptyState',
    description:
      'Komponent EmptyState służy do wyświetlania stanu braku danych (np. pusta tabela). Jest zgodny z WCAG/ARIA: posiada aria-labelledby/aria-describedby (gdy title/description są podane) oraz aria-label fallback. SVG jest dekoracyjne (aria-hidden).',
    code: `
<script lang="ts" setup>
  import EmptyState from "@peaui/ui/feedback/EmptyState";
</script>

<template>
    <EmptyState
      title="Brak danych"
      description="Nie znaleziono wyników. Zmień filtry lub dodaj nowy wpis."
      dataTestId="empty-state"
    >
        <template #additional>
            <button type="button">Dodaj</button>
        </template>
    </EmptyState>
</template>
    `,
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Tytuł EmptyState (zalecane).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },

    description: {
      control: { type: 'text' },
      description: 'Opis EmptyState (opcjonalny).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },

    dataTestId: {
      control: { type: 'text' },
      description: 'Zmienna dla testów automatycznych (opcjonalna).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof EmptyStateComponent>;

export const EmptyState: Story = {
  render: (args) => ({
    components: { EmptyStateComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <EmptyStateComponent v-bind="args">
          <template  #additional>
            Lorem ipsum
          </template>
        </EmptyStateComponent>
      </StoryContent>
    `,
  }),
  args: {
    title: 'Brak danych',
    description: 'Nie znaleziono wyników. Zmień filtry lub dodaj nowy wpis.',
    dataTestId: 'empty-state',
  },
};
