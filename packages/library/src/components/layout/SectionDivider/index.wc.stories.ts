import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import SectionDividerVueComponent from './index.ce.vue';
import { SectionDividerElement, defineSectionDivider } from './index.wc';

defineSectionDivider();

const meta = {
  title: '6. Layout/SectionDivider',
  component: SectionDividerElement.tagName,
  args: createVueCustomElementStoryArgs(SectionDividerVueComponent),
  argTypes: createVueCustomElementArgTypes(SectionDividerVueComponent),
  parameters: {
    name: 'SectionDivider',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue SectionDivider.',
    code: `
<script type="module">
  import '@peaui/ui/wc/layout/SectionDivider';
</script>

<peaui-section-divider></peaui-section-divider>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(SectionDividerElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
