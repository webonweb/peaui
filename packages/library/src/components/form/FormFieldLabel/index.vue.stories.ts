import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import FormLabelComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof FormLabelComponent> = {
  title: '5. Form/FormLabel',
  component: FormLabelComponent,
  parameters: {
    name: 'FormLabel',
    description:
      'Etykieta pola formularza z opcjonalnym tooltipem (slot hint) i dopiskiem o niewymagalności pola.',
    code: `
<script lang="ts" setup>
  import FormLabel from "@peaui/ui/form/FormLabel";
</script>

<template>
  <FormLabel
    for="first-name"
    text="Imię"
    :readonly="false"
    :required="true"
    dataTestId="form-label"
  >
    <template #hint>
      Tutaj możesz dodać podpowiedź do pola.
    </template>
  </FormLabel>
</template>
    `,
  },
  argTypes: {
    for: {
      control: { type: 'text' },
      table: { type: { summary: 'string' }, defaultValue: { summary: undefined } },
      description: 'ID pola, do którego odnosi się etykieta (atrybut for).',
    },
    text: {
      control: { type: 'text' },
      table: { type: { summary: 'string' }, defaultValue: { summary: undefined } },
      description: 'Tekst etykiety (renderowany bez interpretowania HTML).',
    },
    readonly: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormLabelComponent>;

export const FormLabel: Story = {
  render: (args) => ({
    components: { FormLabelComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <div style="width:300px">
          <FormLabelComponent v-bind="args">
            <template #hint>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ullamcorper finibus augue ut feugiat. 
            </template>
          </FormLabelComponent>
        </div>
      </StoryContent>
    `,
  }),
  args: {
    for: 'first-name',
    text: 'Lorem ipsum',
    readonly: false,
    required: true,
    dataTestId: 'form-label',
  },
};
