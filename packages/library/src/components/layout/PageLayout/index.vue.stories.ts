import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import PageLayoutComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

type StoryArgs = {
  dataTestId?: string;
  ariaLabel?: string;
  isHeaderSticky?: boolean;
};

const meta: Meta<typeof PageLayoutComponent> = {
  title: '6. Layout/PageLayout',
  component: PageLayoutComponent,
  parameters: {
    name: 'PageLayout',
    description:
      'Main layout wrapper with optional top slot and additional slot inside main. Uses semantic header and main.',
    code: `
<script setup lang="ts">
  import PageLayout from "@peaui/ui/layout/PageLayout";
</script>

<template>
  <PageLayout ariaLabel="Page top" :isHeaderSticky="true" dataTestId="page-layout">
    <template #top>
      <div>Top area</div>
    </template>

    <template #additional>
      <div>Additional content</div>
    </template>

    <div>Page content</div>
  </PageLayout>
</template>
    `,
  },
  argTypes: {
    ariaLabel: {
      control: { type: 'text' },
      description: 'ARIA label for the top header section.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    isHeaderSticky: {
      control: { type: 'boolean' },
      description: 'Makes the header stick to the top while scrolling.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Base data-test-id for tests.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PageLayoutComponent>;

export const PageLayout: Story = {
  render: (args: StoryArgs) => ({
    components: { StoryContent, PageLayoutComponent },
    setup() {
      const settings = getSettings(meta);
      return { args, settings };
    },
    template: `
      <StoryContent :settings>
        <div style="width:500px">
          <PageLayoutComponent v-bind="args">
            <template #top>
              <div>Top area</div>
            </template>

            <template #additional>
              <div>Additional content</div>
            </template>

            <div>Page content</div>

            <template #footer>
              <div>dfgdfg</div>
            </template>

          </PageLayoutComponent>
        </div>
      </StoryContent>
    `,
  }),
  args: {
    ariaLabel: 'Page top',
    isHeaderSticky: true,
    dataTestId: 'page-layout',
  },
};
