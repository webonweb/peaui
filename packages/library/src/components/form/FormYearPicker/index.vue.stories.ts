import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import FormYearPickerComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof FormYearPickerComponent> = {
  title: '5. Form/FormYearPicker',
  component: FormYearPickerComponent,
  parameters: {
    name: 'FormYearPicker',
    description:
      'Komponent wyboru roku opakowany w FormField i otwierany przez PopoverOverlayer. ' +
      'Wewnatrz wykorzystuje lokalne elementy PickerButton i PickerNavigation, ' +
      'obsluguje v-model:value, wybieranie lat z zakresu 10-letniego, nawigacje klawiatura ' +
      'oraz aria dla pola i panelu dialogowego. ' +
      'Po ustawieniu range=true model przyjmuje [rokOd, rokDo]. ' +
      'Propsy minYear i maxYear pozwalaja ograniczyc zakres lat mozliwych do wybrania.',
    code: `
<script lang="ts" setup>
  import FormYearPicker from "@peaui/ui/form/FormYearPicker";
  import { ref } from "vue";

  const value = ref(2024);
</script>

<template>
  <FormYearPicker
    v-model:value="value"
    id="construction-year"
    name="construction-year"
    label="Rok budowy"
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
      description: 'Aktualnie wybrany rok lub zakres lat (v-model:value).',
      table: {
        type: { summary: 'number | [number, number] | undefined' },
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
      description: 'Placeholder pola.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: "'wybierz rok'" },
      },
    },
    range: {
      control: { type: 'boolean' },
      description: 'Wlacza wybor zakresu lat od-do.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    minYear: {
      control: { type: 'number' },
      description: 'Najmniejszy rok, jaki mozna wybrac.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    maxYear: {
      control: { type: 'number' },
      description: 'Najwiekszy rok, jaki mozna wybrac.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: undefined },
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
      description: 'Blokuje zmiane wartosci, pozostawiajac komponent czytelnym.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Blokuje interakcje z komponentem.',
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
        defaultValue: { summary: 'true' },
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

type Story = StoryObj<typeof FormYearPickerComponent>;

export const FormYearPicker: Story = {
  render: (args) => ({
    components: { FormYearPickerComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <FormYearPickerComponent v-bind="args" v-model:value="args.value">
          <template #hint>
            Wybierz rok z zakresu 10-letniego i zmieniaj dekady klawiszami PageUp/PageDown.
          </template>

          <template #description>
            Komponent pozwala wybrac pojedynczy rok z popupu w stylu biblioteki.
          </template>
        </FormYearPickerComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'construction-year',
    name: 'construction-year',
    value: 2024,
    label: 'Rok budowy',
    placeholder: 'wybierz rok',
    range: false,
    minYear: 2020,
    maxYear: 2030,
    required: false,
    readonly: false,
    disabled: false,
    before: undefined,
    after: undefined,
    iconBefore: undefined,
    canErase: true,
    dataTestId: 'form-year-picker',
  },
};

export const FormYearPickerRange: Story = {
  render: FormYearPicker.render,
  args: {
    id: 'employment-years',
    name: 'employment-years',
    value: [2018, 2022],
    label: 'Zakres lat',
    placeholder: 'wybierz zakres lat',
    range: true,
    minYear: 2010,
    maxYear: 2030,
    required: false,
    readonly: false,
    disabled: false,
    before: undefined,
    after: undefined,
    iconBefore: undefined,
    canErase: true,
    dataTestId: 'form-year-picker-range',
  },
};
