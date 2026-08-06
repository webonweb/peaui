import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import ButtonActionComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof ButtonActionComponent> = {
  title: '3. Data Entry/ButtonAction',
  component: ButtonActionComponent,
  parameters: {
    name: 'ButtonAction',
    description:
      'Komponent ButtonAction to dostępny (WCAG) przycisk formularzowy z wariantami i rozmiarami. Wymaga ariaLabel. Obsługuje native disabled + aria-disabled oraz data-testid do testów.',
    code: `
<script lang="ts" setup>
  import ButtonAction from "@peaui/ui/data-entry/ButtonAction";
</script>

<template>
  <ButtonAction aria-label="Zapisz formularz">
    Zapisz
  </ButtonAction>
</template>
    `,
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xxs', 'xs', 's', 'm', 'l'],
      description: 'Rozmiar przycisku.',
      table: {
        type: { summary: "'xxs' | 'xs' | 's' | 'm' | 'l'" },
        defaultValue: { summary: 'm' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Wariant wizualny przycisku.',
      table: {
        type: { summary: "'primary' | 'secondary' | 'ghost' | 'danger'" },
        defaultValue: { summary: 'primary' },
      },
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      description: 'Typ natywnego przycisku w formularzu.',
      table: {
        type: { summary: "'button' | 'submit' | 'reset'" },
        defaultValue: { summary: 'button' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Blokuje interakcje (native disabled + aria-disabled).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'WYMAGANE: aria-label dla przycisku (WCAG).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Atrybut data-testid do testów automatycznych (opcjonalny).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ButtonActionComponent>;

const buttonVariants = [
  { variant: 'primary', label: 'Primary' },
  { variant: 'secondary', label: 'Secondary' },
  { variant: 'ghost', label: 'Ghost' },
  { variant: 'danger', label: 'Danger' },
] as const;

export const ButtonAction: Story = {
  render: (args) => ({
    components: { ButtonActionComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
    <StoryContent :settings>
      <ButtonActionComponent v-bind="args">
        Lorem Ipsum
      </ButtonActionComponent>
    </StoryContent>
    `,
  }),
  args: {
    ariaLabel: 'Lorem ipusm',
  },
};

export const Variants: Story = {
  render: () => ({
    components: { ButtonActionComponent, StoryContent },
    setup() {
      return {
        settings: getSettings(meta),
        buttonVariants,
      };
    },
    template: `
    <StoryContent :settings>
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <ButtonActionComponent
          v-for="item in buttonVariants"
          :key="item.variant"
          :variant="item.variant"
          aria-label="Przycisk akcji"
        >
          {{ item.label }}
        </ButtonActionComponent>
      </div>
    </StoryContent>
    `,
  }),
};
