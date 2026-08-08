import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import FormSelectComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const defaultOptions = [
  {
    id: '7026160b-d1c3-4760-b5bc-6439f03e4a02',
    value: 'uncovered',
    label: 'nieosłonięte',
    disabled: false,
    active: false,
  },
  {
    id: 'e86cb89b-7d88-43ea-8e7d-5a7b7d0a1ac4',
    value: 'partly-covered',
    label: 'średnio osłonięte',
    disabled: false,
    active: false,
  },
  {
    id: 'acbaf27d-e584-4300-b897-cecfb29deb39',
    value: 'covered',
    label: 'mocno osłonięte',
    disabled: false,
    active: false,
  },
];

const meta: Meta<typeof FormSelectComponent> = {
  title: '5. Form/FormSelect',
  component: FormSelectComponent,
  parameters: {
    name: 'FormSelect',
    description:
      'Komponent select opakowany w FormField i otwierany przez PopoverOverlayer. ' +
      'Obsluguje filtrowanie, sterowanie klawiatura oraz v-model:value zwracajacy option.label ' +
      'po wyborze opcji.',
    code: `
<script lang="ts" setup>
  import FormSelect from "@peaui/ui/form/FormSelect";
  import { ref } from "vue";

  const value = ref("Mazowieckie");

  const options = [
    { label: "Mazowieckie", value: "mazowieckie" },
    { label: "Malopolskie", value: "malopolskie" },
    { label: "Pomorskie", value: "pomorskie" },
  ];
</script>

<template>
  <FormSelect
    v-model:value="value"
    id="voivodeship"
    name="voivodeship"
    label="Wojewodztwo"
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
      control: { type: 'text' },
      description: 'Aktualna wartosc pola (v-model:value), zwracana jako option.label po wyborze.',
      table: {
        type: { summary: 'unknown' },
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
      description: 'Placeholder pola select.',
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
    canWrite: {
      control: { type: 'boolean' },
      description: 'Pozwala wpisac wartosc recznie.',
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
    placement: {
      control: { type: 'select' },
      options: ['top', 'bottom'],
      description:
        'Preferowana strona otwarcia listy. Komponent automatycznie odwraca kierunek, gdy brakuje miejsca w viewportcie.',
      table: {
        type: { summary: "'top' | 'bottom' | undefined" },
        defaultValue: { summary: 'bottom' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 's', 'm', 'l'],
      description: 'Rozmiar pola zgodny z wariantami ButtonAction.',
      table: {
        type: { summary: "'xs' | 's' | 'm' | 'l' | undefined" },
        defaultValue: { summary: 'm' },
      },
    },
    options: {
      control: { type: 'object' },
      description: 'Lista opcji selecta.',
      table: {
        type: { summary: 'SelectFieldOption[]' },
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

type Story = StoryObj<typeof FormSelectComponent>;

export const FormSelect: Story = {
  render: (args) => ({
    components: { FormSelectComponent, StoryContent },
    setup() {
      const show = ref(false);
      return { args, settings: getSettings(meta), show };
    },
    template: `
      <StoryContent :settings>
          <FormSelectComponent v-bind="args" v-model:value="args.value">
            <template #hint>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ullamcorper finibus augue ut feugiat.
            </template>
          </FormSelectComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'lorem-ipsum',
    name: 'lorem-ipsum',
    value: 'partly-covered',

    label: 'Lorem ipsum',
    required: true,
    readonly: false,
    disabled: false,
    before: undefined,
    after: undefined,
    iconBefore: undefined,
    canErase: true,
    canWrite: false,
    searchable: true,
    placement: undefined,
    size: 'm',
    options: defaultOptions,
    dataTestId: 'form-select',
  },
};
