import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import BreadcrumbsVueComponent from './index.ce.vue';
import { BreadcrumbsElement, defineBreadcrumbs } from './index.wc';

defineBreadcrumbs();

const meta = {
  title: '7. Navigation/Breadcrumbs',
  component: BreadcrumbsElement.tagName,
  args: createVueCustomElementStoryArgs(BreadcrumbsVueComponent),
  argTypes: createVueCustomElementArgTypes(BreadcrumbsVueComponent),
  parameters: {
    name: 'Breadcrumbs',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue Breadcrumbs.',
    code: `
<script type="module">
  import '@peaui/ui/wc/navigation/Breadcrumbs';
</script>

<peaui-breadcrumbs></peaui-breadcrumbs>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(BreadcrumbsElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
