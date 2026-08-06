import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import ModalDialogVueComponent from './index.ce.vue';
import { ModalDialogElement, defineModalDialog } from './index.wc';

defineModalDialog();

const meta = {
  title: '8. Overlayer/ModalDialog',
  component: ModalDialogElement.tagName,
  args: createVueCustomElementStoryArgs(ModalDialogVueComponent),
  argTypes: createVueCustomElementArgTypes(ModalDialogVueComponent),
  parameters: {
    name: 'ModalDialog',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue ModalDialog.',
    code: `
<script type="module">
  import '@peaui/ui/wc/overlayer/ModalDialog';
  import '@peaui/ui/styles.css';
</script>

<peaui-modal-dialog></peaui-modal-dialog>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(ModalDialogElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
