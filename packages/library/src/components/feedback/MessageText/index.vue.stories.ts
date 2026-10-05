import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import MessageTextComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof MessageTextComponent> = {
  title: '4. Feedback/MessageText',
  component: MessageTextComponent,
  parameters: {
    name: 'MessageText',
    description:
      'Tekst komunikatu z wariantem, rozmiarem oraz opcjonalna ikona wariantowa lub wlasna.',
    code: `
<script lang="ts" setup>
  import MessageText from "@peaui/ui/feedback/MessageText";
</script>

<template>
  <MessageText
    id="message-text"
    variant="default"
    size="s"
    ownIcon="plus"
  >
    Tresc komunikatu
  </MessageText>
</template>
    `,
  },
  argTypes: {
    id: {
      control: { type: 'text' },
      description: 'Wymagane. Uzywane do zbudowania id root: `${id}-${variant}`.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'data-testid na root. Dodatkowo: -icon, -title.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'info', 'error', 'success', 'danger', 'white'],
      description:
        'Wariant stylu. Statusy maja dopasowana ikone; white korzysta z odwracanego tokenu tekstu na powierzchni grey-900, zgodnie z motywem.',
      table: {
        type: { summary: "'info' | 'error' | 'success' | 'danger' | 'default' | 'white'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: { type: 'select' },
      options: [
        'xxs',
        'xs',
        's',
        'm',
        'l',
        'xl',
        'heading-xs',
        'heading-s',
        'heading-m',
        'heading-l',
      ],
      description: 'Rozmiar tekstu.',
      table: {
        type: {
          summary:
            "'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'heading-xs' | 'heading-s' | 'heading-m' | 'heading-l'",
        },
        defaultValue: { summary: 's' },
      },
    },
    ownIcon: {
      control: { type: 'text' },
      description: 'Opcjonalna nazwa ikony renderowanej przez komponent SvgIcon.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MessageTextComponent>;

const messageVariants = [
  { variant: 'default', text: 'Wariant domyslny bez ikony statusowej.' },
  { variant: 'info', text: 'Wariant informacyjny z ikona.' },
  { variant: 'success', text: 'Wariant sukcesu z ikona.' },
  { variant: 'error', text: 'Wariant bledu z ikona.' },
  { variant: 'danger', text: 'Wariant ostrzegawczy z ikona.' },
] as const;

const renderStory = (args: Story['args']) => ({
  components: { MessageTextComponent, StoryContent },
  setup() {
    return { args, settings: getSettings(meta) };
  },
  template: `
    <StoryContent :settings>
      <MessageTextComponent v-bind="args">
        Tresc komunikatu
      </MessageTextComponent>
    </StoryContent>
  `,
});

export const MessageText: Story = {
  render: renderStory,
  args: {
    id: 'message-text',
    variant: 'default',
    size: 's',
    dataTestId: 'message-text',
  },
};

export const OwnIcon: Story = {
  render: renderStory,
  args: {
    id: 'message-text-own-icon',
    variant: 'default',
    size: 's',
    ownIcon: 'plus',
    dataTestId: 'message-text-own-icon',
  },
};

export const WhiteVariant: Story = {
  render: (args) => ({
    components: { MessageTextComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <div style="padding: 1.5rem; border-radius: 0.75rem; background: var(--peaui-color-grey-900);">
          <MessageTextComponent v-bind="args">
            Komunikat na odwroconej powierzchni; tekst i tlo grey-900 reaguja na motyw.
          </MessageTextComponent>
        </div>
      </StoryContent>
    `,
  }),
  args: {
    id: 'message-text-white',
    variant: 'white',
    size: 's',
    ownIcon: 'plus',
    dataTestId: 'message-text-white',
  },
};

export const Variants: Story = {
  render: () => ({
    components: { MessageTextComponent, StoryContent },
    setup() {
      return { settings: getSettings(meta), messageVariants };
    },
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:12px;">
          <MessageTextComponent
            v-for="item in messageVariants"
            :key="item.variant"
            :id="'message-text-variants-' + item.variant"
            size="s"
            :variant="item.variant"
          >
            {{ item.text }}
          </MessageTextComponent>
        </div>
      </StoryContent>
    `,
  }),
};
