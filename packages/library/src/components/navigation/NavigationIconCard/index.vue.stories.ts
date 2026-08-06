import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import NavigationIconCardComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof NavigationIconCardComponent> = {
  title: '7. Navigation/NavigationIconCard',
  component: NavigationIconCardComponent,
  parameters: {
    name: 'NavigationIconCard',
    description: 'Karta nawigacyjna z ikona i tekstem. Cala powierzchnia komponentu jest linkiem.',
    code: `
<script lang="ts" setup>
  import NavigationIconCard from "@peaui/ui/navigation/NavigationIconCard";
</script>

<template>
  <NavigationIconCard
    icon="users"
    text="Obywatel"
    path="/citizen"
    dataTestId="navigation-icon-card"
  />
</template>
    `,
  },
  argTypes: {
    icon: {
      control: { type: 'text' },
      description: 'Nazwa ikony z assetow SvgIcon.',
      table: {
        type: { summary: 'string' },
      },
    },
    text: {
      control: { type: 'text' },
      description: 'Widoczny tekst karty i domyslna dostepna nazwa linku.',
      table: {
        type: { summary: 'string' },
      },
    },
    path: {
      control: { type: 'text' },
      description: 'Sciezka lub adres przypisany do calej karty.',
      table: {
        type: { summary: 'string' },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Opcjonalny aria-label uzywany, gdy widoczny tekst nie jest dostepny.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Opcjonalny data-testid dla root linku.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof NavigationIconCardComponent>;

export const NavigationIconCard: Story = {
  render: (args) => ({
    components: { NavigationIconCardComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
          <NavigationIconCardComponent v-bind="args" />
      </StoryContent>
    `,
  }),
  args: {
    icon: 'users-alt',
    text: 'Obywatel',
    path: '/citizen',
    ariaLabel: undefined,
    dataTestId: 'navigation-icon-card',
  },
};

export const Grid: Story = {
  render: () => ({
    components: { NavigationIconCardComponent, StoryContent },
    setup() {
      return {
        settings: getSettings(meta),
        cards: [
          { icon: 'users', text: 'Obywatel', path: '/citizen' },
          { icon: 'calculator', text: 'Kalkulator', path: '/calculator' },
          { icon: 'cogs', text: 'Ustawienia', path: '/settings' },
        ],
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(12rem,1fr));gap:1rem;max-width:40rem;">
          <NavigationIconCardComponent
            v-for="card in cards"
            :key="card.text"
            v-bind="card"
          />
        </div>
      </StoryContent>
    `,
  }),
};
