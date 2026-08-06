import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import PopoverButtonComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

type ButtonSize = 'xs' | 's' | 'm' | 'l';
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Placement =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

const meta: Meta<typeof PopoverButtonComponent> = {
  title: '8. Overlayer/PopoverButton',
  component: PopoverButtonComponent,
  parameters: {
    name: 'PopoverButton',
    description:
      'Komponent PopoverButton sluzy jako trigger (ButtonAction) oraz content (native popover) ' +
      'pozycjonowany przez prop `placement`. Otwieranie i zamykanie realizowane jest przez ' +
      '`popovertarget` i `popover="auto"`. Tresc triggera dostarczasz slotem domyslnym, ' +
      'a tresc panelu przez slot `content`.',
    code: `
<script lang="ts" setup>
  import PopoverButton from "@peaui/ui/overlayer/PopoverButton";
</script>

<template>
  <PopoverButton
    ariaLabel="Otworz popover"
    placement="top"
    size="m"
    variant="primary"
    :matchTriggerWidth="false"
    dataTestId="popover-button"
  >
    Lorem ipsum

    <template #content>
      Tresc popovera...
    </template>
  </PopoverButton>
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

    size: {
      control: { type: 'select' },
      options: ['xs', 's', 'm', 'l'],
      description: 'Rozmiar przycisku triggera.',
      table: {
        type: { summary: "'xs' | 's' | 'm' | 'l'" },
        defaultValue: { summary: 'm' },
      },
    },

    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Wariant przycisku triggera.',
      table: {
        type: { summary: "'primary' | 'secondary' | 'ghost' | 'danger'" },
        defaultValue: { summary: 'primary' },
      },
    },

    disabled: {
      control: { type: 'boolean' },
      description: 'Wylacza przycisk triggera.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    matchTriggerWidth: {
      control: { type: 'boolean' },
      description: 'Dopasowuje szerokosc panelu popovera do szerokosci triggera.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    ariaLabel: {
      control: { type: 'text' },
      description: 'ARIA label dla triggera (wymagane).',
      table: {
        type: { summary: 'string' },
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

type Story = StoryObj<typeof PopoverButtonComponent>;

const buttonVariants = [
  { variant: 'primary' as ButtonVariant, label: 'Primary' },
  { variant: 'secondary' as ButtonVariant, label: 'Secondary' },
  { variant: 'ghost' as ButtonVariant, label: 'Ghost' },
  { variant: 'danger' as ButtonVariant, label: 'Danger' },
];

export const PopoverButton: Story = {
  render: (args) => ({
    components: { StoryContent, PopoverButtonComponent },
    setup() {
      const settings = getSettings(meta);
      return { args, settings };
    },
    template: `
      <StoryContent :settings>
        <PopoverButtonComponent v-bind="args">
          Lorem ipsum dolor sit amet

          <template #content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac nulla et ligula elementum viverra. Phasellus ultricies lectus eu accumsan convallis.
          </template>
        </PopoverButtonComponent>
      </StoryContent>
    `,
  }),
  args: {
    placement: 'top' as Placement,
    size: 'm' as ButtonSize,
    variant: 'primary' as ButtonVariant,
    disabled: false,
    matchTriggerWidth: false,
    ariaLabel: 'Otworz popover',
    dataTestId: 'popover-button',
  },
};

export const Variants: Story = {
  render: () => ({
    components: { StoryContent, PopoverButtonComponent },
    setup() {
      return {
        settings: getSettings(meta),
        buttonVariants,
      };
    },
    template: `
      <StoryContent :settings>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
          <PopoverButtonComponent
            v-for="item in buttonVariants"
            :key="item.variant"
            ariaLabel="Otworz popover"
            placement="top"
            size="m"
            :variant="item.variant"
            :matchTriggerWidth="false"
          >
            {{ item.label }}

            <template #content>
              Przykladowa tresc popovera.
            </template>
          </PopoverButtonComponent>
        </div>
      </StoryContent>
    `,
  }),
};
