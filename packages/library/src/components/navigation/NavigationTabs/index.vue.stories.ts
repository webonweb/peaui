import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import NavigationTabsComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof NavigationTabsComponent> = {
  title: '7. Navigation/NavigationTabs',
  component: NavigationTabsComponent,
  parameters: {
    name: 'NavigationTabs',
    description:
      'Komponent nawigacyjny w formie zakladek. Renderuje liste przyciskow na podstawie przekazanych tabow, bez niepelnego wzorca ARIA tablist/tab.',
    code: `
<script lang="ts" setup>
  import NavigationTabs from "@peaui/ui/navigation/NavigationTabs";
</script>

<template>
  <NavigationTabs
    ariaLabel="Nawigacja zakladek"
    :tabs="[
      { key: 'general', label: 'Ogolne', active: true },
      { key: 'details', label: 'Szczegoly', isValid: false },
      { key: 'history', label: 'Historia', disabled: true },
    ]"
  />
</template>
    `,
  },
  argTypes: {
    tabs: {
      control: { type: 'object' },
      description:
        'Lista tabow do wyrenderowania. Kazdy tab: { key, label, active?, disabled?, isValid? }. Dla isValid=false tab jest oznaczony na czerwono.',
      table: {
        type: {
          summary:
            'Array<{ key: string; label: string; active?: boolean; disabled?: boolean; isValid?: boolean }>',
        },
        defaultValue: { summary: undefined },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Wartosc aria-label dla elementu nav.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Atrybut data-testid do testow.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    withBackround: {
      control: { type: 'boolean' },
      description: 'Steruje tlem zakladek. Dla false komponent nie dodaje backgroundow dla tabow.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'true' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof NavigationTabsComponent>;

export const NavigationTabs: Story = {
  render: (args) => ({
    components: { NavigationTabsComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="resize: horizontal; overflow: auto; min-width: 200px; max-width: 500px; width: 500px;">
          <NavigationTabsComponent v-bind="args" />
        </div>
      </StoryContent>
    `,
  }),
  args: {
    ariaLabel: 'Nawigacja zakladek',
    tabs: [
      { key: 'general', label: 'Ogolne', active: true },
      { key: 'details', label: 'Szczegoly' },
      { key: 'history', label: 'Historia', disabled: true },
    ],
    withBackround: true,
    dataTestId: undefined,
  },
};

export const WithInvalidTab: Story = {
  ...NavigationTabs,
  args: {
    ariaLabel: 'Nawigacja zakladek z bledem',
    tabs: [
      { key: 'general', label: 'Ogolne', active: true },
      { key: 'details', label: 'Szczegoly', isValid: false },
      { key: 'history', label: 'Historia', disabled: true },
    ],
    dataTestId: 'navigation-tabs-invalid',
  },
};

export const WithoutBackground: Story = {
  ...NavigationTabs,
  args: {
    ariaLabel: 'Nawigacja zakladek bez tla',
    tabs: [
      { key: 'general', label: 'Ogolne', active: true },
      { key: 'details', label: 'Szczegoly' },
      { key: 'history', label: 'Historia', disabled: true },
    ],
    withBackround: false,
    dataTestId: 'navigation-tabs-without-background',
  },
};

export const KeyboardInteraction: Story = {
  ...NavigationTabs,
  args: {
    ariaLabel: 'Keyboard navigation',
    tabs: [
      { key: 'account', label: 'Account', active: true },
      { key: 'blocked', label: 'Unavailable', disabled: true },
      { key: 'settings', label: 'Settings' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use Left/Right, Home and End to move focus; Enter or Space selects the original tab object, including its key.',
      },
    },
  },
};

export const LabelContent: Story = {
  args: {
    ariaLabel: 'Sections with extra label content',
    tabs: [
      { key: 'inbox', label: 'Inbox', active: true },
      { key: 'archive', label: 'Archive' },
    ],
  },
  render: (args) => ({
    components: { NavigationTabsComponent },
    setup: () => ({ args }),
    template: `<NavigationTabsComponent v-bind="args"><template #navigation-tabs-inbox-before><span aria-hidden="true">★</span></template><template #navigation-tabs-inbox-after><span aria-hidden="true">3</span></template></NavigationTabsComponent>`,
  }),
};
