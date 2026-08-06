import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import SkeletonLoadingComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const meta: Meta<typeof SkeletonLoadingComponent> = {
  title: '4. Feedback/SkeletonLoading',
  component: SkeletonLoadingComponent,
  parameters: {
    name: 'SkeletonLoading',
    description:
      'Wizualny placeholder ladowania tresci. Obsluguje rozmiary od xs do l, opcjonalne pelne zaokraglenie oraz semantyke statusu dla technologii asystujacych.',
    code: `
<script lang="ts" setup>
  import SkeletonLoading from "@peaui/ui/feedback/SkeletonLoading";
</script>

<template>
  <div style="width: 240px;">
    <SkeletonLoading size="m" rounded dataTestId="skeleton-loading" />
  </div>
</template>
    `,
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 's', 'm', 'l'],
      description: 'Wysokosc placeholdera.',
      table: {
        type: { summary: "'xs' | 's' | 'm' | 'l'" },
        defaultValue: { summary: 'm' },
      },
    },
    rounded: {
      control: { type: 'boolean' },
      description: 'Nadaje placeholderowi pelne zaokraglenie bokow.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Komunikat odczytywany przez czytniki ekranu.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Trwa ladowanie tresci.' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowy data-testid komponentu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SkeletonLoadingComponent>;

export const SkeletonLoading: Story = {
  render: (args) => ({
    components: { SkeletonLoadingComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <div style="width: 240px;">
          <SkeletonLoadingComponent v-bind="args" />
        </div>
      </StoryContent>
    `,
  }),
  args: {
    size: 'm',
    rounded: false,
    ariaLabel: 'Trwa ladowanie tresci.',
    dataTestId: 'skeleton-loading',
  },
};

export const Rounded: Story = {
  render: SkeletonLoading.render,
  args: {
    size: 'm',
    rounded: true,
    ariaLabel: 'Trwa ladowanie tresci.',
    dataTestId: 'skeleton-loading-rounded',
  },
};

export const Sizes: Story = {
  render: (args) => ({
    components: { SkeletonLoadingComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
        sizes: ['l', 'm', 's', 'xs'],
      };
    },
    template: `
      <StoryContent :settings>
        <div style="display: grid; gap: 16px; width: 320px;">
          <div v-for="size in sizes" :key="size" style="display: grid; gap: 8px;">
            <span style="font-size: 14px; font-weight: 500;">{{ size.toUpperCase() }}</span>
            <SkeletonLoadingComponent v-bind="args" :size="size" />
          </div>
        </div>
      </StoryContent>
    `,
  }),
  args: {
    rounded: false,
    ariaLabel: 'Trwa ladowanie tresci.',
  },
};

export const LargeFormMock: Story = {
  render: (args) => ({
    components: { SkeletonLoadingComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <div
          style="
            display: grid;
            gap: 24px;
            width: 100%;
            max-width: 960px;
            padding: 32px;
            border: 1px solid var(--peaui-color-grey-200);
            border-radius: 16px;
            background: var(--peaui-color-grey-0);
          "
        >
          <div style="display: grid; gap: 12px; max-width: 360px;">
            <SkeletonLoadingComponent v-bind="args" size="l" style="width: 50%;" />
            <SkeletonLoadingComponent v-bind="args" size="s" style="width: 75%;" />
          </div>

          <div
            style="
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 20px 24px;
            "
          >
            <div v-for="index in 6" :key="index" style="display: grid; gap: 10px;">
              <SkeletonLoadingComponent v-bind="args" size="xs" style="width: 34%;" />
              <SkeletonLoadingComponent v-bind="args" rounded size="l" />
            </div>
          </div>

          <div style="display: grid; gap: 12px;">
            <SkeletonLoadingComponent v-bind="args" size="xs" style="width: 22%;" />
            <SkeletonLoadingComponent
              v-bind="args"
              rounded
              size="l"
              style="height: 120px;"
            />
          </div>

          <div
            style="
              display: flex;
              justify-content: flex-end;
              gap: 12px;
              padding-top: 8px;
            "
          >
            <SkeletonLoadingComponent
              v-bind="args"
              rounded
              size="l"
              style="width: 132px;"
            />
            <SkeletonLoadingComponent
              v-bind="args"
              rounded
              size="l"
              style="width: 168px;"
            />
          </div>
        </div>
      </StoryContent>
    `,
  }),
  args: {
    rounded: false,
    ariaLabel: 'Trwa ladowanie formularza.',
    dataTestId: 'skeleton-loading-form',
  },
};
