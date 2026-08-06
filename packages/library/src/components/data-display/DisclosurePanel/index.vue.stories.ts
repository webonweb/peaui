import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import DisclosurePanelComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof DisclosurePanelComponent> = {
  title: '2. Data Display/DisclosurePanel',
  component: DisclosurePanelComponent,
  parameters: {
    name: 'DisclosurePanel',
    description:
      'Prosty panel oparty o <details>/<summary>, ktory rozsuwa i chowa zawartosc. ' +
      'Dla dostepnosci wykorzystuje semantyke HTML oraz role=region.',
    code: `
<script lang="ts" setup>
  import DisclosurePanel from "@peaui/ui/data-display/DisclosurePanel";
  import { ref } from "vue";

  const open = ref(false);
</script>

<template>
  <DisclosurePanel v-model:open="open" title="Szczegoly" dataTestId="disclosure-panel">
    <template #additional>
      <span>Info</span>
    </template>
    <div>Przykladowa zawartosc panelu</div>
  </DisclosurePanel>
</template>
    `,
  },
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'Steruje otwarciem panelu (v-model:open).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    title: {
      control: { type: 'text' },
      description: 'Tekst tytulu (gdy nie uzywasz slota title).',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'ARIA label dla przycisku, gdy brak tytulu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Blokuje mozliwosc rozwiniecia panelu.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowe data-testid dla panelu.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DisclosurePanelComponent>;

export const DisclosurePanel: Story = {
  render: (args) => ({
    components: { StoryContent, DisclosurePanelComponent },
    setup() {
      const settings = getSettings(meta);
      return { args, settings };
    },
    template: `
      <StoryContent :settings>
        <DisclosurePanelComponent v-bind="args" v-model:open="args.open">
          <template #additional>
            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at metus ut ligula condimentum blandit a quis tellus. Proin vestibulum pretium dui. </span>
          </template>
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at metus ut ligula condimentum blandit a quis tellus. Proin vestibulum pretium dui. Suspendisse sed velit vel orci pharetra accumsan. Aliquam commodo augue ac tortor hendrerit, nec pharetra urna venenatis. Suspendisse sodales nisi in molestie dignissim. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur ut felis arcu. Aenean venenatis gravida porttitor. Nam commodo, leo sit amet ornare consequat, arcu tellus aliquet risus, sed tincidunt sem libero id diam. Donec sit amet velit tempus, rutrum velit vitae, eleifend odio. Sed accumsan pellentesque nisl sed vehicula. Pellentesque consectetur, ex in euismod aliquam, libero felis fermentum risus, porttitor mattis velit lorem vel arcu. Vivamus aliquet nisl at enim feugiat, in dictum risus imperdiet. Ut gravida bibendum nibh, fermentum ornare ex egestas volutpat. Vivamus porttitor ornare quam at finibus. Sed nec dui diam</div>
        </DisclosurePanelComponent>
      </StoryContent>
    `,
  }),
  args: {
    open: false,
    title: 'Szczegoly',
    ariaLabel: undefined,
    disabled: false,
    dataTestId: 'disclosure-panel',
  },
};
