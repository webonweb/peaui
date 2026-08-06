import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import FormFieldComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof FormFieldComponent> = {
  title: '5. Form/FormField',
  component: FormFieldComponent,
  parameters: {
    name: 'FormField',
    description: 'Kontener pola formularza z etykieta i opcjonalnym tooltipem w slocie hint.',
    code: `
<script lang="ts" setup>
  import FormField from "@peaui/ui/form/FormField";
</script>

<template>
  <FormField
    id="first-name"
    name="firstName"
    label="Imie"
    :required="true"
    dataTestId="form-field"
  >
    <template #hint>
      Tutaj mozesz dodac podpowiedz do pola.
    </template>
  </FormField>
</template>
    `,
  },
  argTypes: {
    after: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Tekst wyswietlany po zawartosci pola.',
    },
    before: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Tekst wyswietlany przed zawartoscia pola.',
    },
    canErase: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Czy pole moze byc czyszczone.',
    },
    disabled: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Stan wylaczenia pola.',
    },
    iconAfter: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Nazwa ikony wyswietlanej po prawej stronie pola.',
    },
    iconBefore: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Nazwa ikony wyswietlanej po lewej stronie pola.',
    },
    id: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
      description: 'ID pola, przekazywane do etykiety.',
    },
    label: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Tekst etykiety renderowanej nad polem.',
    },
    maxLength: {
      control: { type: 'number' },
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Maksymalna liczba znakow.',
    },
    name: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
      description: 'Nazwa pola formularza.',
    },
    placeholder: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Placeholder pola.',
    },
    readonly: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Tryb tylko do odczytu.',
    },
    required: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Czy pole jest wymagane.',
    },
    dataTestId: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Bazowy data-testid komponentu.',
    },
    value: {
      control: { type: 'object' },
      table: {
        type: { summary: 'string | number | string[] | null | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Aktualna wartosc pola.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormFieldComponent>;

export const FormField: Story = {
  render: (args) => ({
    components: { FormFieldComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <div style="width:300px">
          <FormFieldComponent v-bind="args">
            <template #hint>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ullamcorper finibus augue ut feugiat.
            </template>
          </FormFieldComponent>
        </div>
      </StoryContent>
    `,
  }),
  args: {
    after: undefined,
    before: undefined,
    canErase: false,
    disabled: false,
    iconAfter: undefined,
    iconBefore: undefined,
    id: 'first-name',
    label: 'Lorem ipsum',
    maxLength: undefined,
    name: 'firstName',
    placeholder: 'Wpisz wartosc',
    readonly: false,
    required: true,
    dataTestId: 'form-field',
    value: undefined,
  },
};
