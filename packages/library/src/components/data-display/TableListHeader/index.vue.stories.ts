import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, watch } from 'vue';

import TableListHeaderComponent from './index.vue';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof TableListHeaderComponent> = {
  title: '2. Data Display/TableListHeader',
  component: TableListHeaderComponent,
  parameters: {
    name: 'TableListHeader',
    description:
      'Naglowek listy tabeli z wyszukiwaniem, filtrowaniem, tworzeniem rekordow i eksportem. ' +
      'Komponent korzysta z SearchInput, ButtonAction, ButtonExport, CounterBadge oraz DrawerPanel.',
    code: `
<script lang="ts" setup>
  import { ref } from "vue";
  import TableListHeader from "@peaui/ui/data-display/TableListHeader";

  const filtersOpen = ref(false);
</script>

<template>
  <TableListHeader
    v-model:filters-open="filtersOpen"
    can-create
    can-export
    can-filter
    can-search
    :count-filters="2"
    :count-selected-records="3"
    :total-records="18"
    search-placeholder="Szukaj rekordu"
  >
    <template #filters-drawer>
      <div>Przykladowa zawartosc filtrow</div>
    </template>
  </TableListHeader>
</template>
    `,
  },
  argTypes: {
    buttonCreateLabel: {
      control: { type: 'text' },
      description: 'Etykieta przycisku tworzenia rekordu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: 'Dodaj rekord' },
      },
    },
    canCreate: {
      control: { type: 'boolean' },
      description: 'Pokazuje przycisk tworzenia.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    canExport: {
      control: { type: 'boolean' },
      description: 'Pokazuje przycisk eksportu.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    canFilter: {
      control: { type: 'boolean' },
      description: 'Pokazuje przyciski filtrowania oraz drawer filtrow.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    canSearch: {
      control: { type: 'boolean' },
      description: 'Pokazuje pole wyszukiwania.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    countFilters: {
      control: { type: 'number' },
      description: 'Liczba aktywnych filtrow.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    countSelectedRecords: {
      control: { type: 'number' },
      description: 'Liczba zaznaczonych rekordow przekazywana do eksportu.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    searchPlaceholder: {
      control: { type: 'text' },
      description: 'Placeholder pola wyszukiwania.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    totalRecords: {
      control: { type: 'number' },
      description: 'Liczba rekordow przekazywana do kontrolki eksportu.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    forceExport: {
      control: { type: 'boolean' },
      description: 'Pomija potwierdzenie eksportu wszystkich rekordow.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    filtersOpen: {
      control: { type: 'boolean' },
      description: 'Stan otwarcia drawer filtrow przekazywany przez v-model:filters-open.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TableListHeaderComponent>;

function createRender(withDescription = false) {
  return (args: Record<string, unknown>) => ({
    components: {
      StoryContent,
      TableListHeaderComponent,
    },
    setup() {
      const filtersOpen = ref(Boolean(args.filtersOpen ?? false));

      watch(
        () => args.filtersOpen,
        (nextValue) => {
          filtersOpen.value = Boolean(nextValue ?? false);
        },
      );

      return {
        args,
        filtersOpen,
        settings: getSettings(meta),
        withDescription,
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="width: 100%; max-width: 80rem;">
          <TableListHeaderComponent v-bind="args" v-model:filters-open="filtersOpen">
            <template #filters-drawer>
              <div style="display: grid; gap: 1rem;">
                <strong>Panel filtrow</strong>
                <p style="margin: 0;">Tutaj mozna osadzic formularz filtrowania.</p>
              </div>
            </template>

            <template #additional-buttons>
              <button
                type="button"
                style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid #d5d8dd; background: white;"
              >
                Dodatkowa akcja
              </button>
            </template>

            <template #additional-content>
              <div
                style="padding: 0.75rem 1rem; border-radius: 0.75rem; border: 1px solid #e5e7eb;"
              >
                Dodatkowa zawartosc nad lista
              </div>
            </template>

            <template v-if="withDescription" #additional-description>
              <div
                style="padding: 0.75rem 1rem; border-radius: 0.75rem; background: #f4fbe8; color: #326a04; min-width: 16rem;"
              >
                Status uzupelnienia: <strong>8 / 12</strong>
              </div>
            </template>
          </TableListHeaderComponent>
        </div>
      </StoryContent>
    `,
  });
}

export const TableListHeader: Story = {
  render: createRender(false),
  args: {
    buttonCreateLabel: 'Dodaj rekord',
    canCreate: true,
    canExport: true,
    canFilter: true,
    canSearch: true,
    countFilters: 2,
    countSelectedRecords: 3,
    searchPlaceholder: 'Szukaj rekordu',
    totalRecords: 18,
    forceExport: false,
    filtersOpen: false,
  },
};

export const WithDescription: Story = {
  render: createRender(true),
  args: {
    buttonCreateLabel: 'Dodaj wpis',
    canCreate: true,
    canExport: true,
    canFilter: true,
    canSearch: true,
    countFilters: 1,
    countSelectedRecords: 0,
    searchPlaceholder: 'Szukaj po nazwie',
    totalRecords: 24,
    forceExport: false,
    filtersOpen: false,
  },
};
