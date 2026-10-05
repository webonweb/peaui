import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import PaginationControlVueComponent from './index.ce.vue';
import { PaginationControlElement, definePaginationControl } from './index.wc';

definePaginationControl();

const meta = {
  title: '7. Navigation/PaginationControl',
  component: PaginationControlElement.tagName,
  args: createVueCustomElementStoryArgs(PaginationControlVueComponent),
  argTypes: createVueCustomElementArgTypes(PaginationControlVueComponent),
  parameters: {
    name: 'PaginationControl',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue PaginationControl.',
    code: `
<script type="module">
  import '@peaui/ui/wc/navigation/PaginationControl';
</script>

<peaui-pagination-control></peaui-pagination-control>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(PaginationControlElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};

export const SixPagesAtSecondPage: Story = { args: { totalPages: 6, page: 2, ariaLabel: 'Pages' } };
