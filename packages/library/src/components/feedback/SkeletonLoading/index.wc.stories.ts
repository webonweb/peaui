import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import SkeletonLoadingVueComponent from './index.ce.vue';
import { SkeletonLoadingElement, defineSkeletonLoading } from './index.wc';

defineSkeletonLoading();

const meta = {
  title: '4. Feedback/SkeletonLoading',
  component: SkeletonLoadingElement.tagName,
  args: createVueCustomElementStoryArgs(SkeletonLoadingVueComponent),
  argTypes: createVueCustomElementArgTypes(SkeletonLoadingVueComponent),
  parameters: {
    name: 'SkeletonLoading',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue SkeletonLoading.',
    code: `
<script type="module">
  import '@peaui/ui/wc/feedback/SkeletonLoading';
  import '@peaui/ui/styles.css';
</script>

<peaui-skeleton-loading></peaui-skeleton-loading>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(SkeletonLoadingElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
