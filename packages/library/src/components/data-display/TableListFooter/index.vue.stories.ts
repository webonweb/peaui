import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, watch } from 'vue';

import TableListFooterComponent from './index.vue';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof TableListFooterComponent> = {
  title: '2. Data Display/TableListFooter',
  component: TableListFooterComponent,
  parameters: {
    name: 'TableListFooter',
    description:
      'Stopka listy tabeli z zakresem rekordow, paginacja i kontrolka liczby rekordow na stronie. ' +
      'Komponent zachowuje dotychczasowa logike i dostaje warstwe BEM oraz atrybuty dostepnosci.',
    code: `
<script lang="ts" setup>
  import { ref } from "vue";
  import TableListFooter from "@peaui/ui/data-display/TableListFooter";

  const page = ref(3);
  const rowsPerPage = ref(10);
</script>

<template>
  <TableListFooter
    :page="page"
    :rowsNumber="91"
    :rowsPerPage="rowsPerPage"
    :total="10"
    @on:change:page="(nextPage) => (page = nextPage)"
    @on:change:limit="(limit) => (rowsPerPage = limit)"
  />
</template>
    `,
  },
  argTypes: {
    rowsNumber: {
      control: { type: 'number' },
      description: 'Laczna liczba rekordow.',
      table: {
        type: { summary: 'number' },
      },
    },
    rowsPerPage: {
      control: { type: 'number' },
      description: 'Liczba rekordow na stronie.',
      table: {
        type: { summary: 'number' },
      },
    },
    page: {
      control: { type: 'number' },
      description: 'Aktualna strona.',
      table: {
        type: { summary: 'number' },
      },
    },
    total: {
      control: { type: 'number' },
      description: 'Liczba rekordow uzywana do warunku wyswietlenia paginacji.',
      table: {
        type: { summary: 'number' },
      },
    },
    under: {
      control: { type: 'boolean' },
      description: 'Przenosi paginacje pod glowne kontrolki.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
    isFlex: {
      control: { type: 'boolean' },
      description: 'Przelacza footer na wariant flex.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowy data-testid komponentu i jego elementow podrzednych.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TableListFooterComponent>;

function createRender() {
  return (args: Record<string, unknown>) => ({
    components: {
      StoryContent,
      TableListFooterComponent,
    },
    setup() {
      const page = ref(Number(args.page ?? 1));
      const rowsPerPage = ref(Number(args.rowsPerPage ?? 10));

      watch(
        () => args.page,
        (nextValue) => {
          page.value = Number(nextValue ?? 1);
        },
      );

      watch(
        () => args.rowsPerPage,
        (nextValue) => {
          rowsPerPage.value = Number(nextValue ?? 10);
        },
      );

      return {
        args,
        page,
        rowsPerPage,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="width: 100%; max-width: 72rem;">
          <TableListFooterComponent
            v-bind="args"
            :page="page"
            :rowsPerPage="rowsPerPage"
            @on:change:page="(nextPage) => (page = nextPage)"
            @on:change:limit="(limit) => (rowsPerPage = limit)"
          />
        </div>
      </StoryContent>
    `,
  });
}

export const TableListFooter: Story = {
  render: createRender(),
  args: {
    rowsNumber: 91,
    rowsPerPage: 10,
    page: 3,
    total: 10,
    under: false,
    isFlex: false,
    dataTestId: 'table-list-footer',
  },
};

export const PaginationUnder: Story = {
  render: createRender(),
  args: {
    rowsNumber: 128,
    rowsPerPage: 25,
    page: 2,
    total: 25,
    under: true,
    isFlex: true,
    dataTestId: 'table-list-footer-under',
  },
};
