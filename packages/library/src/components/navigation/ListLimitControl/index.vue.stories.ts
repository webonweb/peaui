import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import ListLimitControlComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof ListLimitControlComponent> = {
  title: '7. Navigation/ListLimitControl',
  component: ListLimitControlComponent,
  parameters: {
    name: 'ListLimitControl',
    description:
      'Kontrolka wyboru liczby rekordow na stronie. Korzysta z FormSelect, ' +
      'wspiera dataTestId i zachowuje prosty uklad etykieta plus pole wyboru.',
    code: `
<script lang="ts" setup>
  import { ref } from "vue";
  import ListLimitControl from "@peaui/ui/navigation/ListLimitControl";

  const limit = ref(10);
</script>

<template>
  <ListLimitControl
    id="results"
    v-model:limit="limit"
    label="Pokaz na stronie"
    :limit-list="[5, 10, 25, 50]"
    dataTestId="list-limit-control"
  >
    Pokaz na stronie
  </ListLimitControl>
</template>
    `,
  },
  argTypes: {
    id: {
      control: { type: 'text' },
      description: 'Id bazowy kontrolki.',
      table: {
        type: { summary: 'string' },
      },
    },
    label: {
      control: { type: 'text' },
      description: 'Tekst etykiety i fallback dla slotu.',
      table: {
        type: { summary: 'string' },
      },
    },
    limitList: {
      control: { type: 'object' },
      description: 'Lista dostepnych limitow rekordow na stronie.',
      table: {
        type: { summary: 'number[]' },
      },
    },
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom'],
      description: 'Wariant pozycji zachowany dla zgodnosci API.',
      table: {
        type: { summary: "'top' | 'bottom'" },
        defaultValue: { summary: 'bottom' },
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

type Story = StoryObj<typeof ListLimitControlComponent>;

export const ListLimitControl: Story = {
  render: (args) => ({
    components: { ListLimitControlComponent, StoryContent },
    setup() {
      const limit = ref(10);

      return {
        args,
        limit,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
          <ListLimitControlComponent v-bind="args" v-model:limit="limit">
            Pokaz na stronie
          </ListLimitControlComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'results',
    label: 'Pokaz na stronie',
    limitList: [5, 10, 25, 50],
    position: 'bottom',
    dataTestId: 'list-limit-control',
  },
};

export const CompactRange: Story = {
  render: (args) => ({
    components: { ListLimitControlComponent, StoryContent },
    setup() {
      const limit = ref(25);

      return {
        args,
        limit,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
          <ListLimitControlComponent v-bind="args" v-model:limit="limit">
            Rekordow na stronie
          </ListLimitControlComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'compact-results',
    label: 'Rekordow na stronie',
    limitList: [10, 25, 100],
    position: 'top',
    dataTestId: 'list-limit-control-compact',
  },
};
