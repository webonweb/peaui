import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FullscreenContainerVueComponent from './index.ce.vue';
import { FullscreenContainerElement, defineFullscreenContainer } from './index.wc';

defineFullscreenContainer();

const meta = {
  title: '6. Layout/FullscreenContainer',
  component: FullscreenContainerElement.tagName,
  args: createVueCustomElementStoryArgs(FullscreenContainerVueComponent),
  argTypes: createVueCustomElementArgTypes(FullscreenContainerVueComponent),
  parameters: {
    name: 'FullscreenContainer',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue FullscreenContainer.',
    code: `
<script type="module">
  import '@peaui/ui/wc/layout/FullscreenContainer';
</script>

<peaui-fullscreen-container></peaui-fullscreen-container>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(FullscreenContainerElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
