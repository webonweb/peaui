import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import SpinnerLoaderVueComponent from './index.ce.vue';
import { SpinnerLoaderElement, defineSpinnerLoader } from './index.wc';

defineSpinnerLoader();

const meta = {
  title: '4. Feedback/SpinnerLoader',
  component: SpinnerLoaderElement.tagName,
  args: createVueCustomElementStoryArgs(SpinnerLoaderVueComponent),
  argTypes: createVueCustomElementArgTypes(SpinnerLoaderVueComponent),
  parameters: {
    name: 'SpinnerLoader',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue SpinnerLoader.',
    code: `
<script type="module">
  import '@peaui/ui/wc/feedback/SpinnerLoader';
</script>

<peaui-spinner-loader></peaui-spinner-loader>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(SpinnerLoaderElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
