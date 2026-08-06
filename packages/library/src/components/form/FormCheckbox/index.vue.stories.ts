import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import FormCheckboxComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof FormCheckboxComponent> = {
  title: '5. Form/FormCheckbox',
  component: FormCheckboxComponent,
  parameters: {
    name: 'FormCheckbox',
    description:
      'Bazowy komponent checkbox oparty o input type="checkbox". ' +
      'Obsluguje v-model:value, stany disabled i invalid oraz atrybuty ARIA.',
    code: `
<script lang="ts" setup>
  import FormCheckbox from "@peaui/ui/form/FormCheckbox";
  import { ref } from "vue";

  const value = ref(true);
</script>

<template>
  <FormCheckbox
    v-model:value="value"
    id="agreement"
    name="agreement"
    :required="true"
    :isValid="true"
    dataTestId="form-checkbox"
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
      control: { type: 'boolean' },
      description: 'Aktualny stan checkboxa (v-model:value).',
      table: {
        type: { summary: 'boolean | undefined' },
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

type Story = StoryObj<typeof FormCheckboxComponent>;

export const FormCheckbox: Story = {
  render: (args) => ({
    components: { FormCheckboxComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <FormCheckboxComponent v-bind="args" v-model:value="args.value">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dapibus nec felis vel finibus. Suspendisse in gravida tellus. Donec metus risus, pretium at condimentum vel
        </FormCheckboxComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'agreement',
    name: 'agreement',
    value: true,
    isValid: true,
    required: true,
    disabled: false,
    dataTestId: 'form-checkbox',
  },
};
