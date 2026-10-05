import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import NavigationDisclosureCardComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof NavigationDisclosureCardComponent> = {
  title: '7. Navigation/NavigationDisclosureCard',
  component: NavigationDisclosureCardComponent,
  parameters: {
    name: 'NavigationDisclosureCard',
    description:
      'Karta nawigacyjna oparta o details/summary. W trybie bez path rozwija zawartosc, ' +
      'a po podaniu path renderuje natywny link prowadzacy do wskazanej sciezki.',
    code: `
<script lang="ts" setup>
  import NavigationDisclosureCard from "@peaui/ui/navigation/NavigationDisclosureCard";
</script>

<template>
  <NavigationDisclosureCard
    id="building-data"
    dataTestId="navigation-disclosure-card"
    title="Dane budynku"
    description="Sekcja zawiera podstawowe informacje o budynku."
    :open="true"
  >
    <template #title-additional>
      <span>Wymagane</span>
    </template>

    <template #description-additional>
      <span>3 pola</span>
    </template>

    <div>Przykladowa zawartosc sekcji.</div>
  </NavigationDisclosureCard>
</template>
    `,
  },
  argTypes: {
    id: {
      control: { type: 'text' },
      description: 'Id root elementu komponentu.',
      table: {
        type: { summary: 'string' },
      },
    },
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
      description: 'Opcjonalna sciezka. Gdy istnieje, komponent renderuje wariant linkowy.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    open: {
      control: { type: 'boolean' },
      description: 'Poczatkowy stan otwarcia komponentu.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Opcjonalny aria-label dla wariantu linkowego.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowy data-testid dla komponentu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof NavigationDisclosureCardComponent>;

export const NavigationDisclosureCard: Story = {
  render: (args) => ({
    components: { NavigationDisclosureCardComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
          <NavigationDisclosureCardComponent
            :key="JSON.stringify(args)"
            v-bind="args"
          >
            <template #description-additional>
              <span>3 pola</span>
            </template>

            Lorem ipsum
          </NavigationDisclosureCardComponent>
      </StoryContent>
    `,
  }),
  args: {
    id: 'building-data',
    title: 'Dane budynku',
    description: 'Sekcja zawiera podstawowe informacje o budynku.',
    path: undefined,
    open: false,
    ariaLabel: undefined,
    dataTestId: 'navigation-disclosure-card',
  },
};

export const LinkVariant: Story = {
  render: () => ({
    components: { NavigationDisclosureCardComponent, StoryContent },
    setup() {
      return {
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="display:flex;flex-direction: column;gap:1rem;width:100%">
          <NavigationDisclosureCardComponent
            id="building-data-link"
            dataTestId="navigation-disclosure-card-link"
            title="Dane budynku"
            description="Podstawowe informacje o świadectwie, takie jak jego rodzaj, sposób opracowania oraz dane identyfikacyjne."
            path="/building"
            ariaLabel="Przejdz do sekcji dane budynku"
          >
            <template #title-additional>
              <span>Nowe</span>
            </template>

            <template #description-additional>
              <span>Przejdz dalej</span>
            </template>
          </NavigationDisclosureCardComponent>

          <NavigationDisclosureCardComponent
            id="building-data-link-open"
            dataTestId="navigation-disclosure-card-link-open"
            title="Podsumowanie"
            description="Wariant linkowy moze tez pokazac dodatkowa zawartosc pod karta."
            path="/summary"
            :open="true"
          >
            <div style="margin:0;">Dodatkowy opis lub status widoczny pod linkiem.</div>
          </NavigationDisclosureCardComponent>
        </div>
      </StoryContent>
    `,
  }),
};

export const ExplicitLinkName: Story = {
  render: () => ({
    components: { NavigationDisclosureCardComponent },
    template:
      '<NavigationDisclosureCardComponent id="named-card" title="" description="" path="#account" aria-label="Account details" />',
  }),
};
