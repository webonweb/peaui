import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import FormMultiSelectComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const defaultOptions = [
  { label: 'Warszawa', value: 'warszawa' },
  { label: 'Kraków', value: 'krakow' },
  { label: 'Łódź', value: 'lodz' },
  { label: 'Wrocław', value: 'wroclaw' },
  { label: 'Poznań', value: 'poznan' },
  { label: 'Gdańsk', value: 'gdansk' },
  { label: 'Szczecin', value: 'szczecin' },
  { label: 'Bydgoszcz', value: 'bydgoszcz' },
  { label: 'Lublin', value: 'lublin' },
  { label: 'Białystok', value: 'bialystok' },
  { label: 'Katowice', value: 'katowice' },
  { label: 'Gdynia', value: 'gdynia' },
  { label: 'Częstochowa', value: 'czestochowa' },
  { label: 'Radom', value: 'radom' },
  { label: 'Sosnowiec', value: 'sosnowiec' },
  { label: 'Toruń', value: 'torun' },
  { label: 'Kielce', value: 'kielce' },
  { label: 'Rzeszów', value: 'rzeszow' },
  { label: 'Gliwice', value: 'gliwice' },
  { label: 'Zabrze', value: 'zabrze' },
  { label: 'Olsztyn', value: 'olsztyn' },
  { label: 'Bielsko-Biała', value: 'bielsko_biala' },
  { label: 'Bytom', value: 'bytom' },
  { label: 'Zielona Góra', value: 'zielona_gora' },
  { label: 'Rybnik', value: 'rybnik' },
  { label: 'Ruda Śląska', value: 'ruda_slaska' },
  { label: 'Opole', value: 'opole' },
  { label: 'Tychy', value: 'tychy' },
  { label: 'Gorzów Wielkopolski', value: 'gorzow_wielkopolski' },
  { label: 'Elbląg', value: 'elblag' },
  { label: 'Płock', value: 'plock' },
  { label: 'Wałbrzych', value: 'walbrzych' },
];

const meta: Meta<typeof FormMultiSelectComponent> = {
  title: '5. Form/FormMultiSelect',
  component: FormMultiSelectComponent,
  parameters: {
    name: 'FormMultiSelect',
    description:
      'Komponent multiselect opakowany w FormField i otwierany przez PopoverOverlayer. ' +
      'Obsluguje filtrowanie, wielokrotny wybor, sterowanie klawiatura oraz v-model:value ' +
      'oparty o tablice option.value, przy jednoczesnym wyswietlaniu option.label w polu.',
    code: `
<script lang="ts" setup>
  import FormMultiSelect from "@peaui/ui/form/FormMultiSelect";
  import { ref } from "vue";

  const value = ref(["mazowieckie", "pomorskie"]);

  const options = [
    { label: "Mazowieckie", value: "mazowieckie" },
    { label: "Malopolskie", value: "malopolskie" },
    { label: "Pomorskie", value: "pomorskie" },
  ];
</script>

<template>
  <FormMultiSelect
    v-model:value="value"
    id="voivodeships"
    name="voivodeships"
    label="Wojewodztwa"
    :options="options"
  />
</template>
    `,
  },
  argTypes: {
    id: {
      control: { type: 'text' },
      description: 'ID pola formularza.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    name: {
      control: { type: 'text' },
      description: 'Nazwa pola formularza.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    value: {
      control: { type: 'object' },
      description: 'Aktualna wartosc pola (v-model:value), mapowana na tablice option.value.',
      table: {
        type: { summary: 'unknown[]' },
        defaultValue: { summary: undefined },
      },
    },
    label: {
      control: { type: 'text' },
      description: 'Etykieta renderowana nad polem.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder pola multiselect.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: "'wybierz/wyszukaj'" },
      },
    },
    required: {
      control: { type: 'boolean' },
      description: 'Oznacza pole jako wymagane.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    readonly: {
      control: { type: 'boolean' },
      description: 'Przelacza komponent w tryb tylko do odczytu.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Blokuje interakcje z polem.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    before: {
      control: { type: 'text' },
      description: 'Tekst wyswietlany przed polem.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    after: {
      control: { type: 'text' },
      description: 'Tekst wyswietlany po polu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    iconBefore: {
      control: { type: 'text' },
      description: 'Nazwa ikony wyswietlanej przed polem.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    canErase: {
      control: { type: 'boolean' },
      description: 'Pokazuje mozliwosc wyczyszczenia wartosci.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    searchable: {
      control: { type: 'boolean' },
      description: 'Wlacza filtrowanie opcji podczas pisania.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'true' },
      },
    },
    withSelectAll: {
      control: { type: 'boolean' },
      description:
        'Dodaje na gorze listy opcje zaznaczania lub odznaczania wszystkich widocznych opcji.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
    options: {
      control: { type: 'object' },
      description: 'Lista opcji multiselecta.',
      table: {
        type: { summary: 'MultiSelectFieldOption[]' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowy data-testid komponentu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormMultiSelectComponent>;

export const FormMultiSelect: Story = {
  render: (args) => ({
    components: { FormMultiSelectComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <FormMultiSelectComponent v-bind="args" v-model:value="args.value">
          <template #hint>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </template>

          <template #description>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </template>
        </FormMultiSelectComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'voivodeships',
    name: 'voivodeships',
    value: ['warszawa', 'gdansk'],
    label: 'Wojewodztwa',
    required: true,
    readonly: false,
    disabled: false,
    before: undefined,
    after: undefined,
    iconBefore: undefined,
    canErase: true,
    searchable: true,
    withSelectAll: false,
    options: defaultOptions,
    dataTestId: 'form-multiselect',
  },
};

export const Localized: Story = {
  ...FormMultiSelect,
  args: {
    ...FormMultiSelect.args,
    id: 'localized',
    name: 'localized',
    label: 'Choice',
    labels: {
      placeholder: 'Choose',
      searchPlaceholder: 'Search',
      selectPlaceholder: 'Choose an option',
      empty: 'No matches',
      emptyWritable: 'No matches. Type a value.',
      clear: 'Clear selection',
      selectAll: 'Select all',
      deselectAll: 'Deselect all',
    },
    options: [],
    withSelectAll: true,
  },
};

export const Virtualized: Story = {
  ...FormMultiSelect,
  args: {
    ...FormMultiSelect.args,
    virtual: true,
    optionHeight: 48,
    options: Array.from({ length: 5000 }, (_, value) => ({
      key: value,
      value,
      label: `Option ${value}`,
    })),
    id: 'virtual-options',
    name: 'virtual-options',
    value: [],
  },
};

export const LabelMigration: Story = {
  ...FormMultiSelect,
  args: {
    ...FormMultiSelect.args,
    id: 'label-migration',
    name: 'label-migration',
    valueMode: 'label',
    options: [
      { label: 'Alpha', value: 'a' },
      { label: 'Beta', value: 'b' },
    ],
    value: ['Alpha'],
  },
};

export const RequiredSelectOnly: Story = {
  ...FormMultiSelect,
  args: { ...FormMultiSelect.args, searchable: false, required: true, value: [] },
};

export const RequiredSearch: Story = {
  ...FormMultiSelect,
  args: {
    ...FormMultiSelect.args,
    searchable: true,
    required: true,
    canErase: true,
    value: ['a'],
    options: [{ label: 'Alpha', value: 'a' }],
  },
};
