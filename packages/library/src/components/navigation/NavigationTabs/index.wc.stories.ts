import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import NavigationTabsVueComponent from './index.ce.vue';
import { NavigationTabsElement, defineNavigationTabs } from './index.wc';

defineNavigationTabs();

const meta = {
  title: '7. Navigation/NavigationTabs',
  component: NavigationTabsElement.tagName,
  args: createVueCustomElementStoryArgs(NavigationTabsVueComponent),
  argTypes: createVueCustomElementArgTypes(NavigationTabsVueComponent),
  parameters: {
    name: 'NavigationTabs',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue NavigationTabs.',
    code: `
<script type="module">
  import '@peaui/ui/wc/navigation/NavigationTabs';
</script>

<peaui-navigation-tabs></peaui-navigation-tabs>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(NavigationTabsElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
