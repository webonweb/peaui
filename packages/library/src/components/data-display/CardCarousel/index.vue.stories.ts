import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import CardCarouselComponent from './index.vue';
import ButtonAction from '../../data-entry/ButtonAction/index.vue';

const { getSettings } = useSettingsStorie();

const demoCards = [
  {
    category: 'Analiza',
    title: 'Bilans roczny',
    content: 'Zestawienie wskaznikow i podstawowych danych dla calego okresu.',
  },
  {
    category: 'Projekt',
    title: 'Modernizacja',
    content: 'Pakiet zmian z naciskiem na efektywnosc i przewidywany koszt.',
  },
  {
    category: 'Raport',
    title: 'Kontrola terenowa',
    content: 'Podsumowanie wynikow inspekcji z ostatniego etapu prac.',
  },
  {
    category: 'Dokument',
    title: 'Wytyczne',
    content: 'Zbior zasad i ograniczen dla zespolu wdrozeniowego.',
  },
  {
    category: 'Zestaw',
    title: 'Porownanie wariantow',
    content: 'Wspolne kryteria dla trzech mozliwych scenariuszy realizacji.',
  },
  {
    category: 'Monitoring',
    title: 'Stan wdrozenia',
    content: 'Aktualny postep z rozbiciem na glowne obszary odpowiedzialnosci.',
  },
];

const meta: Meta<typeof CardCarouselComponent> = {
  title: '2. Data Display/CardCarousel',
  component: CardCarouselComponent,
  parameters: {
    name: 'CardCarousel',
    description:
      'Karuzela kart z przewijaniem poziomym, obsluga klawiatury, pointer drag oraz nawigacja przyciskami i kropkami.',
    code: `
<script lang="ts" setup>
  import CardCarousel from "@peaui/ui/data-display/CardCarousel";

  const cards = [
    { title: "Bilans roczny", content: "Krotki opis pierwszej karty." },
    { title: "Modernizacja", content: "Krotki opis drugiej karty." },
    { title: "Kontrola terenowa", content: "Krotki opis trzeciej karty." },
    { title: "Wytyczne", content: "Krotki opis czwartej karty." },
  ];
</script>

<template>
  <CardCarousel ariaLabel="Karuzela kart" dataTestId="card-carousel">
    <article
      v-for="card in cards"
      :key="card.title"
      style="display:grid; gap:0.75rem; min-height:100%; padding:1rem; border:1px solid var(--peaui-color-grey-200); border-radius:0.75rem; background-color:var(--peaui-color-grey-0);"
    >
      <strong>{{ card.title }}</strong>
      <p>{{ card.content }}</p>
    </article>
  </CardCarousel>
</template>
    `,
  },
  argTypes: {
    ariaLabel: {
      control: { type: 'text' },
      description: 'Etykieta aria-label regionu karuzeli.',
      table: { type: { summary: 'string | undefined' } },
    },
    animationDelay: {
      control: { type: 'number' },
      description: 'Czas w milisekundach pomiedzy automatycznym przejsciem do kolejnego widoku.',
      table: { type: { summary: 'number | undefined' } },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowy data-testid dla karuzeli i elementow sterowania.',
      table: { type: { summary: 'string | undefined' } },
    },
    defaultVisibleSlides: {
      control: { type: 'number' },
      description: 'Docelowa liczba widocznych kart na szerokich ekranach.',
      table: { type: { summary: 'number | undefined' } },
    },
    isNavigationDotsVisible: {
      control: { type: 'boolean' },
      description: 'Pokazuje lub ukrywa paginacje w formie kropek.',
      table: { type: { summary: 'boolean | undefined' } },
    },
    isNavigationVisible: {
      control: { type: 'boolean' },
      description: 'Pokazuje lub ukrywa przyciski poprzednia/nastepna.',
      table: { type: { summary: 'boolean | undefined' } },
    },
    withAnimation: {
      control: { type: 'boolean' },
      description: 'Automatycznie przewija karuzele co 2 sekundy o jeden widok.',
      table: { type: { summary: 'boolean | undefined' } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CardCarouselComponent>;

function createRender(cards = demoCards) {
  return (args: InstanceType<typeof CardCarouselComponent>['$props']) => ({
    components: { StoryContent, CardCarouselComponent },
    setup() {
      return {
        args,
        cards,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="padding: 1.5rem; max-width: 100%;">
          <CardCarouselComponent v-bind="args">
            <article
              v-for="card in cards"
              :key="card.title"
              style="display:grid; gap:0.75rem; min-height:100%; padding:1rem; border:1px solid var(--peaui-color-grey-200); border-radius:0.75rem; background-color:var(--peaui-color-grey-0); box-shadow:0 0 0 1px color-mix(in srgb, var(--peaui-color-grey-100) 60%, transparent);"
            >
              <span style="display:inline-flex; width:max-content; padding:0.25rem 0.5rem; border-radius:999px; background-color:var(--peaui-color-primary-50); color:var(--peaui-color-primary-700); font-size:0.75rem; line-height:1rem;">
                {{ card.category }}
              </span>
              <strong style="font-size:1rem; line-height:1.5rem; color:var(--peaui-color-grey-800);">
                {{ card.title }}
              </strong>
              <p style="margin:0; color:var(--peaui-color-grey-600);">
                {{ card.content }}
              </p>
            </article>
          </CardCarouselComponent>
        </div>
      </StoryContent>
    `,
  });
}

export const CardCarousel: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Karuzela kart z przykladami',
    animationDelay: 2000,
    dataTestId: 'card-carousel',
    defaultVisibleSlides: 4,
    isNavigationDotsVisible: true,
    isNavigationVisible: true,
    withAnimation: false,
  },
};

export const SingleVisibleSlide: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Karuzela kart z pojedynczym widokiem',
    animationDelay: 2000,
    dataTestId: 'card-carousel-single',
    defaultVisibleSlides: 1,
    isNavigationDotsVisible: true,
    isNavigationVisible: true,
    withAnimation: false,
  },
};

export const WithoutDots: Story = {
  render: createRender(demoCards.slice(0, 5)),
  args: {
    ariaLabel: 'Karuzela kart bez kropek',
    animationDelay: 2000,
    dataTestId: 'card-carousel-without-dots',
    defaultVisibleSlides: 3,
    isNavigationDotsVisible: false,
    isNavigationVisible: true,
    withAnimation: false,
  },
};

export const WithoutArrowsWithDots: Story = {
  render: createRender(demoCards.slice(0, 5)),
  args: {
    ariaLabel: 'Karuzela kart tylko z kropkami',
    animationDelay: 2000,
    dataTestId: 'card-carousel-without-arrows',
    defaultVisibleSlides: 3,
    isNavigationDotsVisible: true,
    isNavigationVisible: false,
    withAnimation: false,
  },
};

export const WithAnimation: Story = {
  render: createRender(demoCards.slice(0, 5)),
  args: {
    ariaLabel: 'Karuzela kart z autoplay',
    animationDelay: 2000,
    dataTestId: 'card-carousel-with-animation',
    defaultVisibleSlides: 3,
    isNavigationDotsVisible: true,
    isNavigationVisible: true,
    withAnimation: true,
  },
};

export const DynamicSlides: Story = {
  render: () => ({
    components: { CardCarouselComponent, ButtonAction },
    setup: () => ({ cards: ref(['A', 'B', 'C']) }),
    template: `<div>
      <ButtonAction @click="cards = ['A', 'X']">Zaktualizuj karty</ButtonAction>
      <CardCarouselComponent :default-visible-slides="1"><article v-for="key in cards" :key="key">Karta {{ key }}</article></CardCarouselComponent>
    </div>`,
  }),
};
