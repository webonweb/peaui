import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import SectionDividerComponent from './index.vue';

const { getSettings } = useSettingsStorie();
const sizes: Array<'s' | 'm' | 'l' | 'xl'> = ['s', 'm', 'l', 'xl'];

const meta: Meta<typeof SectionDividerComponent> = {
  title: '6. Layout/SectionDivider',
  component: SectionDividerComponent,
  parameters: {
    name: 'SectionDivider',
    description:
      'Semantyczny separator sekcji. Domyslnie renderuje poziome hr, a dla wariantu vertical renderuje separator pionowy zgodny z WCAG.',
    code: `
<script lang="ts" setup>
  import SectionDivider from "@peaui/ui/layout/SectionDivider";
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 1rem; width: 100%;">
    <p>Tresc nad separatorem</p>
    <SectionDivider
      direction="horizontal"
      size="m"
      dataTestId="section-divider"
    />
    <p>Tresc pod separatorem</p>
  </div>
</template>
    `,
  },
  argTypes: {
    direction: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
      description: 'Kierunek separatora.',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: 'horizontal' },
      },
    },
    size: {
      control: { type: 'select' },
      options: sizes,
      description: 'Grubosc linii separatora.',
      table: {
        type: { summary: "'s' | 'm' | 'l' | 'xl'" },
        defaultValue: { summary: 's' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Atrybut data-testid przekazywany na root komponentu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SectionDividerComponent>;

export const SectionDivider: Story = {
  render: (args) => ({
    components: { SectionDividerComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <div style="display: flex; flex-direction: column; gap: 1rem; width: 100%;">
          <p>Tresc nad separatorem</p>
          <SectionDividerComponent v-bind="args" />
          <p>Tresc pod separatorem</p>
        </div>
      </StoryContent>
    `,
  }),
  args: {
    direction: 'horizontal',
    size: 's',
    dataTestId: 'section-divider',
  },
};

export const Vertical: Story = {
  render: (args) => ({
    components: { SectionDividerComponent, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <div style="display: flex; align-items: stretch; gap: 1rem; height: 5rem;">
          <div>Lewa kolumna</div>
          <SectionDividerComponent v-bind="args" />
          <div>Prawa kolumna</div>
        </div>
      </StoryContent>
    `,
  }),
  args: {
    direction: 'vertical',
    size: 's',
    dataTestId: 'section-divider-vertical',
  },
};

export const Sizes: Story = {
  render: () => ({
    components: { SectionDividerComponent, StoryContent },
    setup() {
      return { settings: getSettings(meta), sizes };
    },
    template: `
      <StoryContent :settings>
        <div style="display: grid; gap: 2rem; width: 100%;">
          <div style="display: grid; gap: 1rem;">
            <div
              v-for="size in sizes"
              :key="'horizontal-' + size"
              style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;"
            >
              <strong>Horizontal {{ size }}</strong>
              <SectionDividerComponent :size="size" direction="horizontal" />
            </div>
          </div>

          <div style="display: flex; gap: 1.5rem; align-items: stretch; min-height: 5rem;">
            <div
              v-for="size in sizes"
              :key="'vertical-' + size"
              style="display: flex; align-items: stretch; gap: 0.75rem;"
            >
              <span>{{ size }}</span>
              <SectionDividerComponent :size="size" direction="vertical" />
              <span>separator</span>
            </div>
          </div>
        </div>
      </StoryContent>
    `,
  }),
};
