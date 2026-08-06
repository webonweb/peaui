import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import FormTextareaComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof FormTextareaComponent> = {
  title: '5. Form/FormTextarea',
  component: FormTextareaComponent,
  parameters: {
    name: 'FormTextarea',
    description:
      'Bazowy komponent textarea opakowany w FormField. ' +
      'Obsluguje v-model:value, kontrolke rows oraz standardowe sloty pomocnicze.',
    code: `
<script lang="ts" setup>
  import FormTextarea from "@peaui/ui/form/FormTextarea";
  import { ref } from "vue";

  const value = ref("Opis przykladowy");
</script>

<template>
  <FormTextarea
    v-model:value="value"
    id="description"
    name="description"
    label="Opis"
    placeholder="Wpisz opis"
    :rows="5"
  >
    <template #hint>
      Tutaj mozesz dodac podpowiedz do pola.
    </template>
  </FormTextarea>
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
      description: 'Placeholder pola textarea.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: "'wpisz'" },
      },
    },
    rows: {
      control: { type: 'number' },
      description: 'Liczba widocznych wierszy textarea.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: '5' },
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

type Story = StoryObj<typeof FormTextareaComponent>;

export const FormTextarea: Story = {
  render: (args) => ({
    components: { FormTextareaComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
          <FormTextareaComponent v-bind="args" v-model:value="args.value">
            <template #hint>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ullamcorper finibus augue ut feugiat.
            </template>
  

 
          </FormTextareaComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'description',
    name: 'description',
    value: 'Lorem ipsum',
    label: 'Lorem ipsum',
    rows: 5,
    maxLength: undefined,
    required: true,
    readonly: false,
    disabled: false,
    dataTestId: 'form-textarea',
  },
};
