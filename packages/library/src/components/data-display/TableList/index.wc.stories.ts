import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import TableListVueComponent from './index.ce.vue';
import { TableListElement, defineTableList } from './index.wc';

defineTableList();

const meta = {
  title: '2. Data Display/TableList',
  component: TableListElement.tagName,
  args: createVueCustomElementStoryArgs(TableListVueComponent),
  argTypes: createVueCustomElementArgTypes(TableListVueComponent),
  parameters: {
    name: 'TableList',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue TableList.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-display/TableList';
  import '@peaui/ui/styles.css';
</script>

<peaui-table-list></peaui-table-list>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(TableListElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
