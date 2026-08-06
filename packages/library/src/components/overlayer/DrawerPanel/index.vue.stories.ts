import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import DrawerPanelComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof DrawerPanelComponent> = {
  title: '8. Overlayer/DrawerPanel',
  component: DrawerPanelComponent,
  parameters: {
    name: 'DrawerPanel',
    description:
      'DrawerPanel oparty o natywny <dialog>. Otwiera sie z prawej strony z animacja przesuniecia. ' +
      'Sterowanie przez v-model:open i metody showModal()/close().',
    code: `
<script lang="ts" setup>
  import DrawerPanel from "@peaui/ui/overlayer/DrawerPanel";
  import { ref } from "vue";

  const open = ref(true);
</script>

<template>
  <DrawerPanel
    v-model:open="open"
    ariaLabel="Drawer panel"
    dataTestId="drawer-panel"
  >
    Lorem ipsum dolor sit amet
  </DrawerPanel>
</template>
    `,
  },
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'Steruje otwarciem drawer-a (v-model:open).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    ariaLabel: {
      control: { type: 'text' },
      description: 'ARIA label dla drawer-a (wymagane).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },

    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowe data-testid dla drawer-a.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DrawerPanelComponent>;

export const DrawerPanel: Story = {
  render: (args) => ({
    components: { StoryContent, DrawerPanelComponent },
    setup() {
      const settings = getSettings(meta);
      return { args, settings };
    },
    template: `
      <StoryContent :settings>
        <DrawerPanelComponent v-bind="args" v-model:open="args.open">
          Lorem ipsum dolor sit amet
        </DrawerPanelComponent>
      </StoryContent>
    `,
  }),
  args: {
    open: true,
    ariaLabel: 'Drawer panel',
    dataTestId: 'drawer-panel',
  },
};
