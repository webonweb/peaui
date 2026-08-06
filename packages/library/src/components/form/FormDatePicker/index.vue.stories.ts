import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import FormDatePickerComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof FormDatePickerComponent> = {
  title: '5. Form/FormDatePicker',
  component: FormDatePickerComponent,
  parameters: {
    name: 'FormDatePicker',
    description:
      'Komponent wyboru daty opakowany w FormField i otwierany przez PopoverOverlayer. ' +
      'Wewnatrz wykorzystuje lokalne elementy PickerButton i PickerNavigation, ' +
      'obsluguje v-model:value, wybor pojedynczej daty lub zakresu dat, przechodzenie ' +
      'miedzy dniami, miesiacami i latami oraz aria dla pola, panelu dialogowego i siatki kalendarza. ' +
      'Propsy minDate i maxDate pozwalaja ograniczyc zakres dat mozliwych do wybrania.',
    code: `
<script lang="ts" setup>
  import FormDatePicker from "@peaui/ui/form/FormDatePicker";
  import { ref } from "vue";

  const value = ref("2026-03-27");
</script>

<template>
  <FormDatePicker
    v-model:value="value"
    id="construction-date"
    name="construction-date"
    label="Data budowy"
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
      description: 'Aktualnie wybrana data lub zakres dat (v-model:value).',
      table: {
        type: { summary: 'string | [string, string] | undefined' },
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
        defaultValue: { summary: "'wybierz date'" },
      },
    },
    range: {
      control: { type: 'boolean' },
      description: 'Wlacza wybor zakresu dat od-do.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    minDate: {
      control: { type: 'text' },
      description: 'Najmniejsza data, jaka moze zostac wybrana w formacie YYYY-MM-DD.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    maxDate: {
      control: { type: 'text' },
      description: 'Najwieksza data, jaka moze zostac wybrana w formacie YYYY-MM-DD.',
      table: {
        type: { summary: 'string | undefined' },
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

type Story = StoryObj<typeof FormDatePickerComponent>;

export const FormDatePicker: Story = {
  render: (args) => ({
    components: { FormDatePickerComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <FormDatePickerComponent v-bind="args" v-model:value="args.value">
          <template #hint>
            Wybierz date z kalendarza i przechodz miedzy miesiacami klawiszami PageUp/PageDown.
          </template>

          <template #description>
            Komponent pozwala wybrac pojedyncza date z popupu w stylu biblioteki.
          </template>
        </FormDatePickerComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'construction-date',
    name: 'construction-date',
    value: '2026-03-27',
    label: 'Data budowy',
    placeholder: 'wybierz date',
    range: false,
    minDate: '2026-01-01',
    maxDate: '2026-12-31',
    required: false,
    readonly: false,
    disabled: false,
    before: undefined,
    after: undefined,
    iconBefore: undefined,
    canErase: true,
    dataTestId: 'form-date-picker',
  },
};

export const FormDatePickerRange: Story = {
  render: FormDatePicker.render,
  args: {
    id: 'employment-dates',
    name: 'employment-dates',
    value: ['2026-03-10', '2026-03-15'],
    label: 'Zakres dat',
    placeholder: 'wybierz zakres dat',
    range: true,
    minDate: '2026-01-01',
    maxDate: '2026-12-31',
    required: false,
    readonly: false,
    disabled: false,
    before: undefined,
    after: undefined,
    iconBefore: undefined,
    canErase: true,
    dataTestId: 'form-date-picker-range',
  },
};
