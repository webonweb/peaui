import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import PopoverOverlayerVueComponent from './index.ce.vue';
import { PopoverOverlayerElement, definePopoverOverlayer } from './index.wc';

definePopoverOverlayer();

const meta = {
  title: '8. Overlayer/PopoverOverlayer',
  component: PopoverOverlayerElement.tagName,
  args: createVueCustomElementStoryArgs(PopoverOverlayerVueComponent),
  argTypes: createVueCustomElementArgTypes(PopoverOverlayerVueComponent),
  parameters: {
    name: 'PopoverOverlayer',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue PopoverOverlayer.',
    code: `
<script type="module">
  import '@peaui/ui/wc/overlayer/PopoverOverlayer';
  import '@peaui/ui/styles.css';
</script>

<peaui-popover-overlayer></peaui-popover-overlayer>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(PopoverOverlayerElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
