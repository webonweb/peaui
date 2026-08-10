import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import ProgressIndicatorVueComponent from './index.ce.vue';
import { ProgressIndicatorElement, defineProgressIndicator } from './index.wc';

defineProgressIndicator();

const meta = {
  title: '4. Feedback/ProgressIndicator',
  component: ProgressIndicatorElement.tagName,
  args: createVueCustomElementStoryArgs(ProgressIndicatorVueComponent),
  argTypes: createVueCustomElementArgTypes(ProgressIndicatorVueComponent),
  parameters: {
    name: 'ProgressIndicator',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue ProgressIndicator.',
    code: `
<script type="module">
  import '@peaui/ui/wc/feedback/ProgressIndicator';
</script>

<peaui-progress-indicator></peaui-progress-indicator>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(ProgressIndicatorElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
