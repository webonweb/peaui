import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import PopoverOverlayerComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

type Placement =
  'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type PopupType = 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

const meta: Meta<typeof PopoverOverlayerComponent> = {
  title: '8. Overlayer/PopoverOverlayer',
  component: PopoverOverlayerComponent,
  parameters: {
    name: 'PopoverOverlayer',
    description:
      'Komponent PopoverOverlayer dziala jak PopoverButton, ale trigger dostarczasz ' +
      'dowolnym slotem. Tresc panelu przekazujesz przez slot `content`, a pozycjonowanie ' +
      'i natywny popover sa zgodne z PopoverButton. Opcjonalnie panel moze przyjac szerokosc triggera. ' +
      'Dla prostych custom triggerow komponent automatycznie dodaje fokus i semantyke przycisku.',
    code: `
<script lang="ts" setup>
  import PopoverOverlayer from "@peaui/ui/overlayer/PopoverOverlayer";
</script>

<template>
  <PopoverOverlayer
    ariaLabel="Otworz popover"
    placement="bottom"
    :matchTriggerWidth="true"
    popupType="dialog"
    dataTestId="popover-overlayer"
  >
    <div style="padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem;">
      Custom trigger
    </div>

    <template #content>
      Tresc popovera...
    </template>
  </PopoverOverlayer>
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
      description: 'Pozycja panelu popovera wzgledem triggera.',
      table: {
        type: {
          summary:
            "'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        },
        defaultValue: { summary: 'top' },
      },
    },

    disabled: {
      control: { type: 'boolean' },
      description: 'Wylacza trigger popovera.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    matchTriggerWidth: {
      control: { type: 'boolean' },
      description: 'Dopasowuje szerokosc panelu do szerokosci triggera.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    ariaLabel: {
      control: { type: 'text' },
      description:
        'Opcjonalny ARIA label dla triggera wrappera; przy prostym triggerze wrapper dostaje tez domyslnie role button i tabindex.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },

    popupType: {
      control: { type: 'select' },
      options: ['dialog', 'menu', 'listbox', 'tree', 'grid'],
      description:
        'Opcjonalny typ popupu do ustawienia w aria-haspopup. Ustawiaj tylko wtedy, gdy znasz semantyke panelu.',
      table: {
        type: { summary: "'dialog' | 'menu' | 'listbox' | 'tree' | 'grid'" },
        defaultValue: { summary: undefined },
      },
    },

    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowe data-test-id; komponent dopina sufiksy -trigger/-content.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PopoverOverlayerComponent>;

export const PopoverOverlayer: Story = {
  render: (args) => ({
    components: { StoryContent, PopoverOverlayerComponent },
    setup() {
      const settings = getSettings(meta);
      return { args, settings };
    },
    template: `
      <StoryContent :settings>
        <PopoverOverlayerComponent v-bind="args">
          <div style="padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem;">
            Custom trigger
          </div>

          <template #content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac nulla et ligula elementum viverra.
          </template>
        </PopoverOverlayerComponent>
      </StoryContent>
    `,
  }),
  args: {
    placement: 'bottom' as Placement,
    disabled: false,
    matchTriggerWidth: false,
    popupType: undefined as PopupType | undefined,
    ariaLabel: 'Otworz popover',
    dataTestId: 'popover-overlayer',
  },
};

export const KeyboardBetweenControls: Story = {
  render: () => ({
    components: { PopoverOverlayerComponent },
    template:
      '<PopoverOverlayerComponent aria-label="Open panel">Open panel<template #content><button type="button">First action</button><button type="button">Second action</button></template></PopoverOverlayerComponent>',
  }),
};
