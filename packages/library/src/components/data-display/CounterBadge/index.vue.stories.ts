import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import CounterBadgeComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof CounterBadgeComponent> = {
  title: '2. Data Display/CounterBadge',
  component: CounterBadgeComponent,
  parameters: {
    name: 'CounterBadge',
    description:
      'Komponent do wyswietlania licznika z rola status, wariantem kolorystycznym i rozmiarem.',
    code: `
<script lang="ts" setup>
  import CounterBadge from "@peaui/ui/data-display/CounterBadge";
</script>

<template>
  <CounterBadge
    :value="3"
    variant="info"
    size="s"
  />
</template>
    `,
  },
  argTypes: {
    value: {
      control: { type: 'number' },
      description: 'Wartosc licznika wyswietlana w badge.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: undefined },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['info', 'error', 'success', 'danger'],
      description: 'Wariant wizualny badge.',
      table: {
        type: { summary: "'info' | 'error' | 'success' | 'danger'" },
        defaultValue: { summary: 'info' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['s', 'm', 'l'],
      description: 'Rozmiar badge.',
      table: {
        type: { summary: "'s' | 'm' | 'l'" },
        defaultValue: { summary: 's' },
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
  },
};

export default meta;

type Story = StoryObj<typeof CounterBadgeComponent>;

const counterVariants = [
  { variant: 'info', value: 3 },
  { variant: 'success', value: 12 },
  { variant: 'error', value: 1 },
  { variant: 'danger', value: 24 },
] as const;

const renderStory = (args: Story['args']) => ({
  components: { CounterBadgeComponent, StoryContent },
  setup() {
    return {
      args,
      settings: getSettings(meta),
    };
  },
  template: `
    <StoryContent :settings>
      <CounterBadgeComponent v-bind="args" />
    </StoryContent>
  `,
});

export const CounterBadge: Story = {
  render: renderStory,
  args: {
    value: 3,
    variant: 'info',
    size: 's',
    dataTestId: undefined,
  },
};

export const Sizes: Story = {
  render: () => ({
    components: { CounterBadgeComponent, StoryContent },
    setup() {
      return {
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <div
          style="
            display:flex;
            gap:16px;
            align-items:center;
            flex-wrap:wrap;
          "
        >
          <CounterBadgeComponent :value="3" size="s" variant="info" />
          <CounterBadgeComponent :value="12" size="m" variant="success" />
          <CounterBadgeComponent :value="128" size="l" variant="danger" />
        </div>
      </StoryContent>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { CounterBadgeComponent, StoryContent },
    setup() {
      return {
        settings: getSettings(meta),
        counterVariants,
      };
    },
    template: `
      <StoryContent :settings>
        <div
          style="
            display:flex;
            gap:16px;
            align-items:center;
            flex-wrap:wrap;
          "
        >
          <CounterBadgeComponent
            v-for="item in counterVariants"
            :key="item.variant"
            :value="item.value"
            size="m"
            :variant="item.variant"
          />
        </div>
      </StoryContent>
    `,
  }),
};
