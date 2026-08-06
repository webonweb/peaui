import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import TagChipComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof TagChipComponent> = {
  title: '2. Data Display/TagChip',
  component: TagChipComponent,
  parameters: {
    name: 'TagChip',
    description:
      'Komponent TagChip sluzy do wyswietlania pojedynczego taga jako chip z tekstem, stanem aktywnym oraz mozliwoscia wyboru wrappera przez prop `as`.',
    code: `
<script lang="ts" setup>
  import TagChip from "@peaui/ui/data-display/TagChip";
</script>

<template>
  <TagChip
    label="Lorem ipsum"
    as="button"
  />
</template>
    `,
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xxs', 'xs', 's'],
      description: 'Rozmiar komponentu.',
      table: {
        type: { summary: "'xxs' | 'xs' | 's'" },
        defaultValue: { summary: 'xs' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['blue', 'green', 'red', 'orange', 'grey', 'violet', 'outline'],
      description: 'Wariant kolorystyczny komponentu.',
      table: {
        type: {
          summary: "'blue' | 'green' | 'red' | 'orange' | 'grey' | 'violet' | 'outline'",
        },
        defaultValue: { summary: 'outline' },
      },
    },
    label: {
      control: { type: 'text' },
      description: 'Tekst etykiety.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
        required: true,
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Atrybut data-testid do testow automatycznych.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    active: {
      control: { type: 'boolean' },
      description: 'Czy stan aktywny jest wlaczony.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    as: {
      control: { type: 'select' },
      options: ['button', 'span'],
      description: 'Element HTML uzywany jako wrapper komponentu.',
      table: {
        type: { summary: "'button' | 'span'" },
        defaultValue: { summary: 'button' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TagChipComponent>;

const tagVariants = [
  { variant: 'blue', label: 'Blue' },
  { variant: 'green', label: 'Green' },
  { variant: 'red', label: 'Red' },
  { variant: 'orange', label: 'Orange' },
  { variant: 'grey', label: 'Grey' },
  { variant: 'violet', label: 'Violet' },
  { variant: 'outline', label: 'Outline' },
] as const;

const renderStory = (args: Story['args']) => ({
  components: { TagChipComponent, StoryContent },
  setup() {
    return {
      args,
      settings: getSettings(meta),
    };
  },
  template: `
    <StoryContent :settings>
      <TagChipComponent v-bind="args" />
    </StoryContent>
  `,
});

export const TagChip: Story = {
  render: renderStory,
  args: {
    label: 'Lorem ipsum',
    as: 'button',
  },
};

export const AsSpan: Story = {
  render: renderStory,
  args: {
    label: 'Lorem ipsum',
    as: 'span',
    variant: 'blue',
    active: true,
  },
};

export const Variants: Story = {
  render: () => ({
    components: { TagChipComponent, StoryContent },
    setup() {
      return {
        settings: getSettings(meta),
        tagVariants,
      };
    },
    template: `
      <StoryContent :settings>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
          <TagChipComponent
            v-for="item in tagVariants"
            :key="item.variant"
            :label="item.label"
            :variant="item.variant"
            as="button"
          />
        </div>
      </StoryContent>
    `,
  }),
};
