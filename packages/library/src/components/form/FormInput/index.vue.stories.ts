import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import FormInputComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof FormInputComponent> = {
  title: '5. Form/FormInput',
  component: FormInputComponent,
  parameters: {
    name: 'FormInput',
    description:
      'Bazowy komponent input type="text" opakowany w FormField. ' +
      'Obsluguje v-model:value, etykiete, ikony, tekst przed/po polu oraz sloty pomocnicze.',
    code: `
<script lang="ts" setup>
  import FormInput from "@peaui/ui/form/FormInput";
  import { ref } from "vue";

  const value = ref("Jan");
</script>

<template>
  <FormInput
    v-model:value="value"
    id="first-name"
    name="firstName"
    label="Imie"
    placeholder="Wpisz imie"
  >
    <template #hint>
      Tutaj mozesz dodac podpowiedz do pola.
    </template>
  </FormInput>
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
      description: 'Aktualna wartosc pola (v-model:value).',
      table: {
        type: { summary: 'string | undefined' },
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
      description: 'Placeholder inputa.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: "'wpisz'" },
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
    iconAfter: {
      control: { type: 'text' },
      description: 'Nazwa ikony wyswietlanej po polu.',
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
    maxLength: {
      control: { type: 'number' },
      description: 'Maksymalna liczba znakow.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Bazowy data-testid komponentu.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormInputComponent>;

export const FormInput: Story = {
  render: (args) => ({
    components: { FormInputComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
          <FormInputComponent v-bind="args" v-model:value="args.value" before="test" after="tets">
            <template #hint>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ullamcorper finibus augue ut feugiat.
            </template>

            <template #description>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </template>
          </FormInputComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'lorem-ipsum',
    name: 'loremIpsum',
    value: 'lorem ipsum',
    label: 'Lorem ipsum',
    required: true,
    readonly: false,
    disabled: false,
    before: undefined,
    after: undefined,
    iconBefore: undefined,
    iconAfter: undefined,
    canErase: true,
    maxLength: undefined,
  },
};
