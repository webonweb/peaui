import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import TableListHeaderVueComponent from './index.ce.vue';
import { TableListHeaderElement, defineTableListHeader } from './index.wc';

defineTableListHeader();

const meta = {
  title: '2. Data Display/TableListHeader',
  component: TableListHeaderElement.tagName,
  args: createVueCustomElementStoryArgs(TableListHeaderVueComponent),
  argTypes: createVueCustomElementArgTypes(TableListHeaderVueComponent),
  parameters: {
    name: 'TableListHeader',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue TableListHeader.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-display/TableListHeader';
</script>

<peaui-table-list-header></peaui-table-list-header>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(TableListHeaderElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
