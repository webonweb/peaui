import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import ModalDialogComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof ModalDialogComponent> = {
  title: '8. Overlayer/ModalDialog',
  component: ModalDialogComponent,
  parameters: {
    name: 'ModalDialog',
    description:
      'Komponent ModalDialog oparty o natywny element <dialog>. Otwieranie/zamykanie realizowane jest przez v-model:open ' +
      'i metody showModal()/close(). Animacje wykonywane są przez Web Animations API. ESC jest blokowany przez @cancel.prevent.',
    code: `
<script lang="ts" setup>
  import ModalDialog from "@peaui/ui/overlayer/ModalDialog";
  import { ref } from "vue";

  const open = ref(true);
</script>

<template>
  <ModalDialog
    v-model:open="open"
    ariaLabel="Modal dialog"
    dataTestId="modal-dialog"
  >
    Lorem ipsum dolor sit amet
  </ModalDialog>
</template>
    `,
  },
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'Steruje otwarciem modala (v-model:open).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    ariaLabel: {
      control: { type: 'text' },
      description: 'ARIA label dla dialogu (wymagane).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },

    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowe data-testid dla dialogu.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ModalDialogComponent>;

export const ModalDialog: Story = {
  render: (args) => ({
    components: { StoryContent, ModalDialogComponent },
    setup() {
      const settings = getSettings(meta);
      return { args, settings };
    },
    template: `
      <StoryContent :settings>
        <ModalDialogComponent v-bind="args" v-model:open="args.open">
          Lorem ipsum dolor sit amet
        </ModalDialogComponent>
      </StoryContent>
    `,
  }),
  args: {
    open: true,
    ariaLabel: 'Modal dialog',
    dataTestId: 'modal-dialog',
  },
};
