import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import FormButtonGroupComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const defaultOptions = [
  { label: 'Tak', key: 'yes' },
  { label: 'Nie', key: 'no' },
  { label: 'Moze', key: 'maybe', disabled: true },
];

const optionsWithHints = [
  { label: 'Tak', key: 'yes', hint: 'Opcja dostepna do natychmiastowego wyboru.' },
  { label: 'Nie', key: 'no' },
  {
    label: 'Moze',
    key: 'maybe',
    disabled: true,
    hint: 'Ta opcja jest chwilowo niedostepna.',
  },
];

const meta: Meta<typeof FormButtonGroupComponent> = {
  title: '5. Form/FormButtonGroup',
  component: FormButtonGroupComponent,
  parameters: {
    name: 'FormButtonGroup',
    description:
      'Komponent wyboru pojedynczej opcji renderowany jako grupa przyciskow. ' +
      'Obsluguje v-model:value, klawiature, readonly/disabled, semantyke radiogroup oraz hinty dla pojedynczych opcji.',
    code: `
<script lang="ts" setup>
  import FormButtonGroup from "@peaui/ui/form/FormButtonGroup";
  import { ref } from "vue";

  const value = ref("yes");

  const options = [
    { label: "Tak", key: "yes", hint: "Opcja dostepna do natychmiastowego wyboru." },
    { label: "Nie", key: "no" },
    { label: "Moze", key: "maybe", disabled: true, hint: "Ta opcja jest chwilowo niedostepna." },
  ];
</script>

<template>
  <FormButtonGroup
    v-model:value="value"
    id="decision"
    name="decision"
    label="Decyzja"
    size="m"
    :options="options"
  >
    <template #additionalHint>
      Opcjonalne
    </template>
  </FormButtonGroup>
</template>
    `,
  },
  argTypes: {
    id: {
      control: { type: 'text' },
      description: 'ID komponentu.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    name: {
      control: { type: 'text' },
      description: 'Nazwa pola formularza dla ukrytego inputa.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    value: {
      control: { type: 'text' },
      description: 'Aktualnie wybrana wartosc (v-model:value).',
      table: {
        type: { summary: 'string | number | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    label: {
      control: { type: 'text' },
      description: 'Etykieta renderowana nad grupa przyciskow.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 's', 'm', 'l'],
      description: 'Rozmiar przyciskow w grupie.',
      table: {
        type: { summary: "'xs' | 's' | 'm' | 'l'" },
        defaultValue: { summary: 'm' },
      },
    },
    isToggle: {
      control: { type: 'boolean' },
      description:
        'Pozwala odznaczyc aktualnie wybrana opcje po ponownym kliknieciu lub Enter/Space.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
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
    options: {
      control: { type: 'object' },
      description: 'Lista opcji grupy przyciskow. Kazda opcja wspiera m.in. disabled oraz hint.',
      table: {
        type: { summary: 'ButtonGroupOption[]' },
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

type Story = StoryObj<typeof FormButtonGroupComponent>;

export const FormButtonGroup: Story = {
  render: (args) => ({
    components: { FormButtonGroupComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <FormButtonGroupComponent v-bind="args" v-model:value="args.value">
          <template #hint>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </template>

          <template #description>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </template>
        </FormButtonGroupComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'decision',
    name: 'decision',
    value: 'yes',
    label: 'Decyzja',
    size: 'm',
    isToggle: false,
    required: false,
    readonly: false,
    disabled: false,
    options: defaultOptions,
    dataTestId: 'form-button-group',
  },
};

export const ToggleSelection: Story = {
  render: FormButtonGroup.render,
  args: {
    id: 'decision-toggle',
    name: 'decisionToggle',
    value: 'yes',
    label: 'Decyzja z mozliwoscia odznaczania',
    size: 'm',
    isToggle: true,
    required: false,
    readonly: false,
    disabled: false,
    options: defaultOptions,
    dataTestId: 'form-button-group-toggle',
  },
};

export const WithAdditionalHint: Story = {
  render: (args) => ({
    components: { FormButtonGroupComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <FormButtonGroupComponent v-bind="args" v-model:value="args.value">
          <template #additionalHint>
            Opcjonalne
          </template>
        </FormButtonGroupComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'decision-hint',
    name: 'decisionHint',
    value: 'yes',
    label: 'Decyzja',
    size: 'm',
    isToggle: false,
    required: false,
    readonly: false,
    disabled: false,
    options: defaultOptions,
    dataTestId: 'form-button-group-hint',
  },
};

export const WithOptionHints: Story = {
  render: FormButtonGroup.render,
  args: {
    id: 'decision-option-hints',
    name: 'decisionOptionHints',
    value: 'yes',
    label: 'Decyzja z hintami w opcjach',
    size: 'm',
    isToggle: false,
    required: false,
    readonly: false,
    disabled: false,
    options: optionsWithHints,
    dataTestId: 'form-button-group-option-hints',
  },
};
