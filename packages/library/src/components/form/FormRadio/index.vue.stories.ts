import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import FormRadioComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof FormRadioComponent> = {
  title: '5. Form/FormRadio',
  component: FormRadioComponent,
  parameters: {
    name: 'FormRadio',
    description:
      'Bazowy komponent radio oparty o input type="radio". ' +
      'Obsluguje v-model:value, aria dla required/invalid/disabled oraz wspiera natywna obsluge grup po wspolnym name.',
    code: `
<script lang="ts" setup>
  import FormRadio from "@peaui/ui/form/FormRadio";
  import { ref } from "vue";

  const value = ref("email");
</script>

<template>
  <FormRadio
    v-model:value="value"
    id="contact-email"
    name="contact-method"
    optionValue="email"
    dataTestId="form-radio-email"
  >
    E-mail
  </FormRadio>
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
      description: 'Nazwa grupy radio.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    value: {
      control: { type: 'text' },
      description: 'Aktualna wartosc grupy radio (v-model:value).',
      table: {
        type: { summary: 'string | number | boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    optionValue: {
      control: { type: 'text' },
      description: 'Wartosc przypisana do konkretnego radio.',
      table: {
        type: { summary: 'string | number | boolean' },
        defaultValue: { summary: undefined },
      },
    },
    isValid: {
      control: { type: 'boolean' },
      description: 'Steruje stanem poprawnosci pola.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'true' },
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

type Story = StoryObj<typeof FormRadioComponent>;

export const FormRadio: Story = {
  render: (args) => ({
    components: { FormRadioComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <FormRadioComponent v-bind="args" v-model:value="args.value">
          E-mail
        </FormRadioComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'contact-email',
    name: 'contact-method',
    value: 'email',
    optionValue: 'email',
    isValid: true,
    required: false,
    disabled: false,
    dataTestId: 'form-radio',
  },
};

export const RadioGroup: Story = {
  render: () => ({
    components: { FormRadioComponent, StoryContent },
    setup() {
      const value = ref<string | undefined>('email');

      return {
        value,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <div style="display: grid; gap: 0.75rem;">
          <FormRadioComponent
            v-model:value="value"
            id="contact-email-group"
            name="contact-method-group"
            optionValue="email"
            dataTestId="form-radio-group-email"
          >
            E-mail
          </FormRadioComponent>

          <FormRadioComponent
            v-model:value="value"
            id="contact-phone-group"
            name="contact-method-group"
            optionValue="phone"
            dataTestId="form-radio-group-phone"
          >
            Telefon
          </FormRadioComponent>
        </div>
      </StoryContent>
    `,
  }),
};

export const Invalid: Story = {
  render: (args) => ({
    components: { FormRadioComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <FormRadioComponent v-bind="args" v-model:value="args.value">
          E-mail
        </FormRadioComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'contact-email-invalid',
    name: 'contact-method-invalid',
    value: undefined,
    optionValue: 'email',
    isValid: false,
    required: true,
    disabled: false,
    dataTestId: 'form-radio-invalid',
  },
};

export const Disabled: Story = {
  render: (args) => ({
    components: { FormRadioComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <FormRadioComponent v-bind="args" v-model:value="args.value">
          E-mail
        </FormRadioComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'contact-email-disabled',
    name: 'contact-method-disabled',
    value: 'email',
    optionValue: 'email',
    isValid: true,
    required: false,
    disabled: true,
    dataTestId: 'form-radio-disabled',
  },
};
