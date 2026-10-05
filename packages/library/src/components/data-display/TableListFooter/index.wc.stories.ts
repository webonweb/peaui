import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import TableListFooterVueComponent from './index.ce.vue';
import { TableListFooterElement, defineTableListFooter } from './index.wc';

defineTableListFooter();

const meta = {
  title: '2. Data Display/TableListFooter',
  component: TableListFooterElement.tagName,
  args: createVueCustomElementStoryArgs(TableListFooterVueComponent),
  argTypes: createVueCustomElementArgTypes(TableListFooterVueComponent),
  parameters: {
    name: 'TableListFooter',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue TableListFooter.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-display/TableListFooter';
</script>

<peaui-table-list-footer></peaui-table-list-footer>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(TableListFooterElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const NinePages: Story = { args: { rowsNumber: 90, rowsPerPage: 10, total: 9, page: 1 } };
