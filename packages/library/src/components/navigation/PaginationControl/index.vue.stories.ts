import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import PaginationControlComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof PaginationControlComponent> = {
  title: '7. Navigation/PaginationControl',
  component: PaginationControlComponent,
  parameters: {
    name: 'PaginationControl',
    description:
      'Komponent paginacji do przechodzenia miedzy stronami wynikow. ' +
      'Wspiera aria-label, dataTestId, aria-current dla aktywnej strony i responsywny uklad z przewijaniem listy stron.',
    code: `
<script lang="ts" setup>
  import { ref } from "vue";
  import PaginationControl from "@peaui/ui/navigation/PaginationControl";

  const page = ref(3);
</script>

<template>
  <PaginationControl
    v-model:page="page"
    :total-pages="12"
    ariaLabel="Nawigacja stron tabeli"
    dataTestId="pagination-control"
  />
</template>
    `,
  },
  argTypes: {
    totalPages: {
      control: { type: 'number' },
      description: 'Laczna liczba stron.',
      table: {
        type: { summary: 'number' },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Etykieta aria-label dla elementu nav.',
      table: {
        type: { summary: 'string' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowy data-testid dla komponentu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PaginationControlComponent>;

export const PaginationControl: Story = {
  render: (args) => ({
    components: { PaginationControlComponent, StoryContent },
    setup() {
      const page = ref(3);

      return {
        args,
        page,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="max-width: 48rem;">
          <PaginationControlComponent v-bind="args" v-model:page="page" />
        </div>
      </StoryContent>
    `,
  }),
  args: {
    totalPages: 12,
    ariaLabel: 'Nawigacja stron tabeli',
    dataTestId: 'pagination-control',
  },
};

export const NearEndState: Story = {
  render: (args) => ({
    components: { PaginationControlComponent, StoryContent },
    setup() {
      const page = ref(10);

      return {
        args,
        page,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="max-width: 48rem;">
          <PaginationControlComponent v-bind="args" v-model:page="page" />
        </div>
      </StoryContent>
    `,
  }),
  args: {
    totalPages: 12,
    ariaLabel: 'Nawigacja stron tabeli',
    dataTestId: 'pagination-control-end',
  },
};
