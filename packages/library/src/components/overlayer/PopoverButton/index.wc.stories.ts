import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import PopoverButtonVueComponent from './index.ce.vue';
import { PopoverButtonElement, definePopoverButton } from './index.wc';

definePopoverButton();

const meta = {
  title: '8. Overlayer/PopoverButton',
  component: PopoverButtonElement.tagName,
  args: createVueCustomElementStoryArgs(PopoverButtonVueComponent),
  argTypes: createVueCustomElementArgTypes(PopoverButtonVueComponent),
  parameters: {
    name: 'PopoverButton',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue PopoverButton.',
    code: `
<script type="module">
  import '@peaui/ui/wc/overlayer/PopoverButton';
  import '@peaui/ui/styles.css';
</script>

<peaui-popover-button></peaui-popover-button>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(PopoverButtonElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
