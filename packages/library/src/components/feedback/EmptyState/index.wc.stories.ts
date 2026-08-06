import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import EmptyStateVueComponent from './index.ce.vue';
import { EmptyStateElement, defineEmptyState } from './index.wc';

defineEmptyState();

const meta = {
  title: '4. Feedback/EmptyState',
  component: EmptyStateElement.tagName,
  args: createVueCustomElementStoryArgs(EmptyStateVueComponent),
  argTypes: createVueCustomElementArgTypes(EmptyStateVueComponent),
  parameters: {
    name: 'EmptyState',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue EmptyState.',
    code: `
<script type="module">
  import '@peaui/ui/wc/feedback/EmptyState';
  import '@peaui/ui/styles.css';
</script>

<peaui-empty-state></peaui-empty-state>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(EmptyStateElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
