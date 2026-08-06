import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';

import NavigationLinkComponent from './index.vue';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof NavigationLinkComponent> = {
  title: '7. Navigation/NavigationLink',
  component: NavigationLinkComponent,
  parameters: {
    name: 'NavigationLink',
    description:
      'Link nawigacyjny rozstrzygajacy RouterLink dla sciezek wewnetrznych oraz anchor dla url i hash.',
    code: `
<script lang="ts" setup>
  import NavigationLink from "@peaui/ui/navigation/NavigationLink";
</script>

<template>
  <NavigationLink
    path="/building"
    variant="default"
    size="s"
    dataTestId="navigation-link"
  >
    Przejdz do danych budynku
  </NavigationLink>
</template>
    `,
  },
  argTypes: {
    path: {
      control: { type: 'text' },
      description: 'Sciezka wewnetrzna, hash lub zewnetrzny url.',
      table: {
        type: { summary: 'string' },
      },
    },
    size: {
      control: { type: 'radio' },
      options: ['m', 's', 'xs'],
      description: 'Rozmiar tekstu linku.',
      table: {
        type: { summary: "'m' | 's' | 'xs'" },
        defaultValue: { summary: 's' },
      },
    },
    variant: {
      control: { type: 'radio' },
      options: ['default', 'primary'],
      description: 'Wariant kolorystyczny linku.',
      table: {
        type: { summary: "'default' | 'primary'" },
        defaultValue: { summary: 'default' },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Opcjonalny aria-label dla linku bez widocznego tekstu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Opcjonalny atrybut data-testid dla root komponentu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof NavigationLinkComponent>;

export const NavigationLink: Story = {
  render: (args) => ({
    components: { NavigationLinkComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
        <NavigationLinkComponent v-bind="args">
          Przejdz do danych budynku
        </NavigationLinkComponent>
      </StoryContent>
    `,
  }),
  args: {
    path: '/building',
    size: 's',
    variant: 'default',
    ariaLabel: undefined,
    dataTestId: 'navigation-link',
  },
};

export const Variants: Story = {
  render: () => ({
    components: { NavigationLinkComponent, StoryContent },
    setup() {
      return {
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <NavigationLinkComponent path="/building" variant="default" size="s">
            Wariant default
          </NavigationLinkComponent>
          <NavigationLinkComponent path="/building" variant="primary" size="s">
            Wariant primary
          </NavigationLinkComponent>
        </div>
      </StoryContent>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { NavigationLinkComponent, StoryContent },
    setup() {
      return {
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <NavigationLinkComponent path="/building" size="m" variant="default">
            Rozmiar m
          </NavigationLinkComponent>
          <NavigationLinkComponent path="/building" size="s" variant="default">
            Rozmiar s
          </NavigationLinkComponent>
          <NavigationLinkComponent path="/building" size="xs" variant="default">
            Rozmiar xs
          </NavigationLinkComponent>
        </div>
      </StoryContent>
    `,
  }),
};

export const Destinations: Story = {
  render: () => ({
    components: { NavigationLinkComponent, StoryContent },
    setup() {
      return {
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <NavigationLinkComponent path="/building" variant="default">
            Sciezka wewnetrzna
          </NavigationLinkComponent>
          <NavigationLinkComponent path="#summary" variant="default">
            Hash do sekcji
          </NavigationLinkComponent>
          <NavigationLinkComponent path="https://example.com" target="_blank" variant="primary">
            Zewnetrzny url
          </NavigationLinkComponent>
        </div>
      </StoryContent>
    `,
  }),
};
