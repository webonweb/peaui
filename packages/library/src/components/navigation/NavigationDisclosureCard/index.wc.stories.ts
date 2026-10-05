import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import NavigationDisclosureCardVueComponent from './index.ce.vue';
import { NavigationDisclosureCardElement, defineNavigationDisclosureCard } from './index.wc';

defineNavigationDisclosureCard();

const meta = {
  title: '7. Navigation/NavigationDisclosureCard',
  component: NavigationDisclosureCardElement.tagName,
  args: createVueCustomElementStoryArgs(NavigationDisclosureCardVueComponent),
  argTypes: createVueCustomElementArgTypes(NavigationDisclosureCardVueComponent),
  parameters: {
    name: 'NavigationDisclosureCard',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue NavigationDisclosureCard.',
    code: `
<script type="module">
  import '@peaui/ui/wc/navigation/NavigationDisclosureCard';
</script>

<peaui-navigation-disclosure-card></peaui-navigation-disclosure-card>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(NavigationDisclosureCardElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};

export const ExplicitLinkName: Story = {
  args: {
    id: 'named-card',
    title: '',
    description: '',
    path: '#account',
    ariaLabel: 'Account details',
  },
};
