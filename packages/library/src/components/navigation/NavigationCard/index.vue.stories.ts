import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import NavigationCardComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof NavigationCardComponent> = {
  title: '7. Navigation/NavigationCard',
  component: NavigationCardComponent,
  parameters: {
    name: 'NavigationCard',
    description:
      'Karta nawigacyjna z opisem i stanami procesu. Wspiera stany aktywne, zakonczone i zablokowane oraz aria dla etykiety i opisu.',
    code: `
<script lang="ts" setup>
  import NavigationCard from "@peaui/ui/navigation/NavigationCard";
</script>

<template>
  <NavigationCard
    title="Dane budynku"
    description="Przejdz do sekcji odpowiedzialnej za podstawowe informacje o budynku."
    path="/building"
    size="s"
    variant="default"
  />
</template>
    `,
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Tytul karty.',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      control: { type: 'text' },
      description: 'Opis pomocniczy widoczny pod tytulem.',
      table: {
        type: { summary: 'string' },
      },
    },
    path: {
      control: { type: 'text' },
      description: 'Sciezka lub adres otwierany po kliknieciu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['s', 'm', 'l'],
      description: 'Rozmiar tytulu i jego kolor w aktywnych wariantach.',
      table: {
        type: { summary: "'s' | 'm' | 'l'" },
        defaultValue: { summary: 's' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'during', 'complete', 'disabled', 'hidden'],
      description: 'Wariant wizualny i funkcjonalny komponentu.',
      table: {
        type: {
          summary: "'default' | 'during' | 'complete' | 'disabled' | 'hidden'",
        },
        defaultValue: { summary: 'default' },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Opcjonalny aria-label nadpisujacy etykiete wyliczana z tresci.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Opcjonalny atrybut data-testid dla karty.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof NavigationCardComponent>;

export const NavigationCard: Story = {
  render: (args) => ({
    components: { NavigationCardComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="max-width: 32rem;">
          <NavigationCardComponent v-bind="args" />
        </div>
      </StoryContent>
    `,
  }),
  args: {
    title: 'Dane budynku',
    description: 'Przejdz do sekcji odpowiedzialnej za podstawowe informacje o budynku.',
    path: '/building',
    size: 's',
    variant: 'default',
    ariaLabel: undefined,
    dataTestId: undefined,
  },
};

export const Variants: Story = {
  render: () => ({
    components: { NavigationCardComponent, StoryContent },
    setup() {
      return {
        settings: getSettings(meta),
        cards: [
          {
            title: 'Dane budynku',
            description: 'Sekcja startowa gotowa do uzupelnienia.',
            path: '/building',
            variant: 'default',
          },
          {
            title: 'Parametry techniczne',
            description: 'Sekcja jest w trakcie wypelniania.',
            path: '/technical',
            variant: 'during',
          },
          {
            title: 'Podsumowanie',
            description: 'Sekcja zostala zakonczona.',
            path: '/summary',
            variant: 'complete',
          },
          {
            title: 'Wyniki',
            description: 'Sekcja pozostaje zablokowana do czasu uzupelnienia poprzednich krokow.',
            path: '/results',
            variant: 'disabled',
          },
          {
            title: 'Archiwum',
            description: 'Sekcja jest ukryta w przeplywie i pozostaje niedostepna.',
            path: '/archive',
            variant: 'hidden',
          },
        ],
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="display:grid;gap:1rem;max-width:32rem;">
          <NavigationCardComponent
            v-for="card in cards"
            :key="card.title"
            v-bind="card"
          />
        </div>
      </StoryContent>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { NavigationCardComponent, StoryContent },
    setup() {
      return {
        settings: getSettings(meta),
        cards: [
          {
            title: 'Rozmiar S',
            description: 'Tytul wykorzystuje rozmiar s i kolor primary-700.',
            path: '/size-s',
            size: 's',
            variant: 'default',
          },
          {
            title: 'Rozmiar M',
            description: 'Tytul wykorzystuje rozmiar m i kolor grey-700.',
            path: '/size-m',
            size: 'm',
            variant: 'default',
          },
          {
            title: 'Rozmiar L',
            description: 'Tytul wykorzystuje rozmiar l i kolor grey-700.',
            path: '/size-l',
            size: 'l',
            variant: 'default',
          },
        ],
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="display:grid;gap:1rem;max-width:32rem;">
          <NavigationCardComponent
            v-for="card in cards"
            :key="card.title"
            v-bind="card"
          />
        </div>
      </StoryContent>
    `,
  }),
};

export const DownloadLink: Story = {
  render: () => ({
    components: { NavigationCardComponent },
    template:
      '<NavigationCardComponent path="#report" title="Download report" description="Report file" target="_blank" rel="noopener" download="report.txt" />',
  }),
};
