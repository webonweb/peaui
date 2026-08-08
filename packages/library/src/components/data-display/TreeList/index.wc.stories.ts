import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import TreeListVueComponent from './index.ce.vue';
import { TreeListElement, defineTreeList } from './index.wc';

defineTreeList();

const tree = {
  label: 'malopolskie',
  children: {
    krakowski: {
      label: 'krakowski',
      children: {
        skala: { label: 'skala', children: {} },
      },
    },
  },
};

const meta = {
  title: '2. Data Display/TreeList',
  component: TreeListElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(TreeListVueComponent),
    tree,
  },
  argTypes: createVueCustomElementArgTypes(TreeListVueComponent),
  parameters: {
    name: 'TreeList',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue TreeList.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-display/TreeList';
  import '@peaui/ui/styles.css';
</script>

<peaui-tree-list></peaui-tree-list>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(TreeListElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
