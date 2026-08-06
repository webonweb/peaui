import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import ListLimitControlVueComponent from './index.ce.vue';
import { ListLimitControlElement, defineListLimitControl } from './index.wc';

defineListLimitControl();

const meta = {
  title: '7. Navigation/ListLimitControl',
  component: ListLimitControlElement.tagName,
  args: createVueCustomElementStoryArgs(ListLimitControlVueComponent),
  argTypes: createVueCustomElementArgTypes(ListLimitControlVueComponent),
  parameters: {
    name: 'ListLimitControl',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue ListLimitControl.',
    code: `
<script type="module">
  import '@peaui/ui/wc/navigation/ListLimitControl';
  import '@peaui/ui/styles.css';
</script>

<peaui-list-limit-control></peaui-list-limit-control>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(ListLimitControlElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
