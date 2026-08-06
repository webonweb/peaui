import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import FormButtonCheckboxComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof FormButtonCheckboxComponent> = {
  title: '5. Form/FormButtonCheckbox',
  component: FormButtonCheckboxComponent,
  parameters: {
    name: 'FormButtonCheckbox',
    description:
      'Buttonowy wariant checkboxa oparty o input type="checkbox". ' +
      'Obsluguje v-model:value, rozmiary zgodne z ButtonAction, data-testid oraz atrybuty ARIA.',
    code: `
<script lang="ts" setup>
  import FormButtonCheckbox from "@peaui/ui/form/FormButtonCheckbox";
  import { ref } from "vue";

  const value = ref(true);
</script>

<template>
  <div style="max-width: 18.5rem;">
    <FormButtonCheckbox
      v-model:value="value"
      id="heating"
      name="heating"
      size="m"
      dataTestId="form-button-checkbox"
    >
      Ogrzewanie
    </FormButtonCheckbox>
  </div>
</template>
    `,
  },
  argTypes: {
    id: {
      control: { type: 'text' },
      description: 'ID pola formularza.',
      table: {
        type: { summary: 'string' },
      },
    },
    name: {
      control: { type: 'text' },
      description: 'Nazwa pola formularza.',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      control: { type: 'boolean' },
      description: 'Aktualny stan checkboxa (v-model:value).',
      table: {
        type: { summary: 'boolean | undefined' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['xxs', 'xs', 's', 'm', 'l'],
      description: 'Rozmiar komponentu zgodny z ButtonAction.',
      table: {
        type: { summary: `'xxs' | 'xs' | 's' | 'm' | 'l'` },
        defaultValue: { summary: 'm' },
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
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Blokuje interakcje z polem.',
      table: {
        type: { summary: 'boolean | undefined' },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Fallback dla dostepnej nazwy, gdy nie ma widocznego tekstu w slocie.',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowy data-testid komponentu.',
      table: {
        type: { summary: 'string | undefined' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormButtonCheckboxComponent>;

export const FormButtonCheckbox: Story = {
  render: (args) => ({
    components: { FormButtonCheckboxComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
          <FormButtonCheckboxComponent v-bind="args" v-model:value="args.value">
            Ogrzewanie
          </FormButtonCheckboxComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'heating',
    name: 'heating',
    value: true,
    size: 'm',
    isValid: true,
    required: false,
    disabled: false,
    dataTestId: 'form-button-checkbox',
  },
};

export const States: Story = {
  render: () => ({
    components: { FormButtonCheckboxComponent, StoryContent },
    setup() {
      const checked = ref(true);
      const unchecked = ref(false);

      return {
        checked,
        settings: getSettings(meta),
        unchecked,
      };
    },
    template: `
      <StoryContent :settings>
        <div style="max-width: 18.5rem; display: grid; gap: 1rem;">
          <FormButtonCheckboxComponent
            v-model:value="checked"
            id="heating-checked"
            name="heating-checked"
            dataTestId="form-button-checkbox-checked"
          >
            Ogrzewanie
          </FormButtonCheckboxComponent>

          <FormButtonCheckboxComponent
            v-model:value="unchecked"
            id="hot-water"
            name="hot-water"
            dataTestId="form-button-checkbox-unchecked"
          >
            Ciepla woda uzytkowa
          </FormButtonCheckboxComponent>
        </div>
      </StoryContent>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    components: { FormButtonCheckboxComponent, StoryContent },
    setup() {
      return { settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <div style="max-width: 18.5rem;">
          <FormButtonCheckboxComponent
            :value="true"
            disabled
            id="heating-disabled"
            name="heating-disabled"
            dataTestId="form-button-checkbox-disabled"
          >
            Ogrzewanie
          </FormButtonCheckboxComponent>
        </div>
      </StoryContent>
    `,
  }),
};
