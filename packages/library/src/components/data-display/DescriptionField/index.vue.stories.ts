import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import DescriptionFieldComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof DescriptionFieldComponent> = {
  title: '2. Data Display/DescriptionField',
  component: DescriptionFieldComponent,
  parameters: {
    name: 'DescriptionField',
    description:
      'Komponent do wyswietlania pary label + value w semantycznym <dl> z opcjonalnymi dodatkami po bokach oraz slotem hint.',
    code: `
<script lang="ts" setup>
  import DescriptionField from "@peaui/ui/data-display/DescriptionField";
</script>

<template>
  <DescriptionField label="Telefon">
    <template #hint>Numer telefonu kontaktowego klienta.</template>
    <template #additional-before>...</template>
    <a href="tel:+48123456789">+48 123 456 789</a>
    <template #additional-after>...</template>
  </DescriptionField>
</template>
    `,
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Etykieta pola renderowana w <dt>.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description:
        'Bazowy data-testid dla testow. Dodatkowo generowane sa sufiksy: -label, -value, -addon-before, -addon-after oraz -tooltip.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DescriptionFieldComponent>;

export const DescriptionField: Story = {
  render: (args) => ({
    components: { DescriptionFieldComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <DescriptionFieldComponent v-bind="args">
          <template #additional-before>before</template>
          Lorem ipsum dolor sit amet, consectetur
          <template #additional-after>after</template>
        </DescriptionFieldComponent>
      </StoryContent>
    `,
  }),
  args: {
    label: 'Lorem ipsum',
    dataTestId: undefined,
  },
};

export const WithHint: Story = {
  render: (args) => ({
    components: { DescriptionFieldComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <DescriptionFieldComponent v-bind="args">
          <template #hint>
            Ta wartosc prezentuje aktualny status procesu i jest odswiezana po zapisaniu zmian.
          </template>
          W trakcie weryfikacji
        </DescriptionFieldComponent>
      </StoryContent>
    `,
  }),
  args: {
    label: 'Status wniosku',
    dataTestId: 'description-field-with-hint',
  },
};
