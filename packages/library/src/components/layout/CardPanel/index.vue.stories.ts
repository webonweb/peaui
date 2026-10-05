import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import CardPanelComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

type StoryArgs = InstanceType<typeof CardPanelComponent>['$props'];

const meta: Meta<typeof CardPanelComponent> = {
  title: '6. Layout/CardPanel',
  component: CardPanelComponent,
  parameters: {
    name: 'CardPanel',
    description:
      'CardPanel to kontener layoutowy. Obsluguje semantyczny wrapper (`as`), opcjonalny aria-label, cien (`isShadowEnabled`), styl hover (`isHoverEnabled`), rozmiar, niezalezne kolory tla i obramowania oraz opcjonalny slot `header` z separatorem.',
    code: `
<script setup lang="ts">
import CardPanel from '@peaui/ui/layout/CardPanel';
</script>

<template>
  <CardPanel
    as="section"
    size="l"
    ariaLabel="Przykladowa sekcja"
    :isShadowEnabled="true"
    :isHoverEnabled="true"
    backgroundColor="grey"
    borderColor="primary"
    dataTestId="card-panel"
  >
    <template #header>
      <strong>Panel naglowka</strong>
    </template>

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </CardPanel>
</template>
    `,
  },
  argTypes: {
    ariaLabel: {
      control: { type: 'text' },
      description: 'ARIA label dla panelu. Uzywaj tylko gdy panel jest logiczna sekcja UI.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    isShadowEnabled: {
      control: { type: 'boolean' },
      description: 'Wlacza cien panelu.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isHoverEnabled: {
      control: { type: 'boolean' },
      description: 'Wlacza styl hover dla panelu.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowy data-test-id do testow.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    backgroundColor: {
      control: { type: 'select' },
      options: ['default', 'primary', 'grey'],
      description: 'Kolor tla panelu.',
      table: {
        type: { summary: "'default' | 'primary' | 'grey'" },
        defaultValue: { summary: 'default' },
      },
    },
    borderColor: {
      control: { type: 'select' },
      options: ['default', 'primary', 'grey'],
      description: 'Kolor obramowania panelu.',
      table: {
        type: { summary: "'default' | 'primary' | 'grey'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 's', 'm', 'l'],
      description: 'Rozmiar panelu, wplywajacy na gestosc i padding.',
      table: {
        type: { summary: "'xs' | 's' | 'm' | 'l'" },
        defaultValue: { summary: 'm' },
      },
    },
    as: {
      control: { type: 'select' },
      options: ['div', 'section', 'article'],
      description: 'Element HTML uzywany jako wrapper.',
      table: {
        type: { summary: "'div' | 'section' | 'article'" },
        defaultValue: { summary: 'div' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CardPanelComponent>;

const renderStory = (args: StoryArgs) => ({
  components: { StoryContent, CardPanelComponent },
  setup() {
    const settings = getSettings(meta);
    return { args, settings };
  },
  template: `
    <StoryContent :settings>
      <CardPanelComponent v-bind="args">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget sapien vel tortor porta luctus sed nec diam.
      </CardPanelComponent>
    </StoryContent>
  `,
});

export const CardPanel: Story = {
  render: renderStory,
  args: {
    as: 'div',
    ariaLabel: undefined,
    isShadowEnabled: false,
    isHoverEnabled: true,
    backgroundColor: 'default',
    borderColor: 'default',
    size: 'm',
    dataTestId: 'card-panel',
  },
};

export const Sizes: Story = {
  render: () => ({
    components: { StoryContent, CardPanelComponent },
    setup() {
      const settings = getSettings(meta);
      const sizes: Array<'xs' | 's' | 'm' | 'l'> = ['xs', 's', 'm', 'l'];
      return { settings, sizes };
    },
    template: `
      <StoryContent :settings>
        <div style="display: grid; gap: 1rem;">
          <CardPanelComponent
            v-for="size in sizes"
            :key="size"
            :size="size"
            backgroundColor="grey"
            borderColor="primary"
            as="section"
          >
            <strong>Size {{ size }}</strong>
            <p style="margin: 0.5rem 0 0;">Przyklad panelu dla rozmiaru {{ size }}.</p>
          </CardPanelComponent>
        </div>
      </StoryContent>
    `,
  }),
};

export const Colors: Story = {
  render: () => ({
    components: { StoryContent, CardPanelComponent },
    setup() {
      const settings = getSettings(meta);
      const combinations = [
        { title: 'Default', backgroundColor: 'default', borderColor: 'default' },
        { title: 'Primary Border', backgroundColor: 'default', borderColor: 'primary' },
        { title: 'Grey Surface', backgroundColor: 'grey', borderColor: 'grey' },
        { title: 'Primary Surface', backgroundColor: 'primary', borderColor: 'primary' },
      ];
      return { combinations, settings };
    },
    template: `
      <StoryContent :settings>
        <div style="display: grid; gap: 1rem;">
          <CardPanelComponent
            v-for="item in combinations"
            :key="item.title"
            :backgroundColor="item.backgroundColor"
            :borderColor="item.borderColor"
          >
            <strong>{{ item.title }}</strong>
            <p style="margin: 0.5rem 0 0;">backgroundColor={{ item.backgroundColor }}, borderColor={{ item.borderColor }}</p>
          </CardPanelComponent>
        </div>
      </StoryContent>
    `,
  }),
};

export const WithHeader: Story = {
  render: (args: StoryArgs) => ({
    components: { StoryContent, CardPanelComponent },
    setup() {
      const settings = getSettings(meta);
      return { args, settings };
    },
    template: `
      <StoryContent :settings>
        <CardPanelComponent v-bind="args">
          <template #header>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
              <strong>Dane budynku</strong>
              <span style="color: var(--peaui-color-grey-500);">Stan: roboczy</span>
            </div>
          </template>

          <p style="margin: 0;">
            Zawartosc panelu pozostaje w osobnej sekcji, a separator pod naglowkiem rozciaga sie na cala szerokosc contentu.
          </p>
        </CardPanelComponent>
      </StoryContent>
    `,
  }),
  args: {
    as: 'section',
    ariaLabel: 'Panel z naglowkiem',
    isShadowEnabled: false,
    isHoverEnabled: true,
    backgroundColor: 'default',
    borderColor: 'grey',
    size: 'm',
    dataTestId: 'card-panel-header',
  },
};

export const Link: Story = {
  render: () => ({
    components: { CardPanelComponent },
    template: `<CardPanelComponent as="a" href="#orders">Wszystkie zamówienia</CardPanelComponent>`,
  }),
};
