import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import CounterBadgeVueComponent from './index.ce.vue';
import { CounterBadgeElement, defineCounterBadge } from './index.wc';

defineCounterBadge();

const meta = {
  title: '2. Data Display/CounterBadge',
  component: CounterBadgeElement.tagName,
  args: createVueCustomElementStoryArgs(CounterBadgeVueComponent),
  argTypes: createVueCustomElementArgTypes(CounterBadgeVueComponent),
  parameters: {
    name: 'CounterBadge',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue CounterBadge.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-display/CounterBadge';
</script>

<peaui-counter-badge></peaui-counter-badge>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(CounterBadgeElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
