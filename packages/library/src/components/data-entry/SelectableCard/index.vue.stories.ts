import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import SelectableCardComponent from './index.vue';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof SelectableCardComponent> = {
  title: '3. Data Entry/SelectableCard',
  component: SelectableCardComponent,
  parameters: {
    name: 'SelectableCard',
    description:
      'SelectableCard to klikalna karta służąca do wyboru opcji. ' +
      'Obsługuje stany active, disabled i readonly oraz sloty title i description.',
    code: `
<script lang="ts" setup>
  import SelectableCard from "@peaui/ui/data-entry/SelectableCard";
</script>

<template>
  <SelectableCard
    ariaLabel="Wybierz metodę obliczeń"
    :active="true"
    :readonly="false"
    dataTestId="selectable-card"
  >
    <template #title>
      Title
    </template>

    <template #description>
      Opis wybranej metody obliczeń…
    </template>
  </SelectableCard>
</template>
    `,
  },
  argTypes: {
    active: {
      control: { type: 'boolean' },
      description: 'Określa, czy karta jest zaznaczona.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Wyłącza możliwość interakcji z kartą.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readonly: {
      control: { type: 'boolean' },
      description: 'Ustawia kartę w stanie tylko do odczytu i blokuje interakcję, ale nie fokus.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'ARIA label dla przycisku (wymagane).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowe data-testid dla komponentu oraz jego slotów.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SelectableCardComponent>;

export const SelectableCard: Story = {
  render: (args) => ({
    components: { StoryContent, SelectableCardComponent },
    setup() {
      const settings = getSettings(meta);
      return { args, settings };
    },
    template: `
      <StoryContent :settings>
        <SelectableCardComponent v-bind="args">
          <template #title>
            Metoda standardowa
          </template>

          <template #description>
            Metoda oparta o standardowy sposób użytkowania budynku oraz dane klimatyczne najbliższej stacji meteorologicznej.
          </template>

          <template #hint>
            Przykładowa podpowiedź dla wybranej metody.
          </template>
        </SelectableCardComponent>
      </StoryContent>
    `,
  }),
  args: {
    active: false,
    disabled: false,
    readonly: false,
    ariaLabel: 'Wybierz metodę standardową',
    dataTestId: 'selectable-card',
  },
};

export const Readonly: Story = {
  render: SelectableCard.render,
  args: {
    active: true,
    disabled: false,
    readonly: true,
    ariaLabel: 'Wybrana metoda standardowa tylko do odczytu',
    dataTestId: 'selectable-card-readonly',
  },
};
