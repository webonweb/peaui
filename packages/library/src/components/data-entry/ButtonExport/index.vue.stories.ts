import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import ButtonExportComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof ButtonExportComponent> = {
  title: '3. Data Entry/ButtonExport',
  component: ButtonExportComponent,
  parameters: {
    name: 'ButtonExport',
    description:
      'Komponent ButtonExport to dostępny (WCAG) przycisk formularzowy z wariantami i rozmiarami. Wymaga ariaLabel. Obsługuje native disabled + aria-disabled oraz data-testid do testów.',
    code: `
<script lang="ts" setup>
  import ButtonExport from "@peaui/ui/data-entry/ButtonExport";
</script>

<template>
  <ButtonExport aria-label="Zapisz formularz">
    Zapisz
  </ButtonExport>
</template>
    `,
  },
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: [
        'top',
        'right',
        'bottom',
        'left',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ],
      description: 'Pozycja panelu popovera względem triggera.',
      table: {
        type: {
          summary:
            "'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        },
        defaultValue: { summary: 'top' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 's', 'm', 'l'],
      description: 'Rozmiar przycisku.',
      table: {
        type: { summary: "'xs' | 's' | 'm' | 'l'" },
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
    selectedItemsCount: {
      control: { type: 'number' },
      description: 'Liczba aktualnie zaznaczonych elementów.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
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

type Story = StoryObj<typeof ButtonExportComponent>;

const buttonVariants = [
  { variant: 'primary', label: 'Primary' },
  { variant: 'secondary', label: 'Secondary' },
  { variant: 'ghost', label: 'Ghost' },
  { variant: 'danger', label: 'Danger' },
] as const;

export const ButtonExport: Story = {
  render: (args) => ({
    components: { ButtonExportComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
    <StoryContent :settings>
      <ButtonExportComponent v-bind="args">
        Lorem Ipsum
      </ButtonExportComponent>
    </StoryContent>
    `,
  }),
  args: {
    ariaLabel: 'Lorem ipusm',
  },
};

export const Variants: Story = {
  render: () => ({
    components: { ButtonExportComponent, StoryContent },
    setup() {
      return {
        settings: getSettings(meta),
        buttonVariants,
      };
    },
    template: `
    <StoryContent :settings>
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <ButtonExportComponent
          v-for="item in buttonVariants"
          :key="item.variant"
          :variant="item.variant"
          aria-label="Eksport danych"
          :selected-items-count="3"
        >
          {{ item.label }}
        </ButtonExportComponent>
      </div>
    </StoryContent>
    `,
  }),
};
