import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import NavigationIconCardVueComponent from './index.ce.vue';
import { NavigationIconCardElement, defineNavigationIconCard } from './index.wc';

defineNavigationIconCard();

const meta = {
  title: '7. Navigation/NavigationIconCard',
  component: NavigationIconCardElement.tagName,
  args: createVueCustomElementStoryArgs(NavigationIconCardVueComponent),
  argTypes: createVueCustomElementArgTypes(NavigationIconCardVueComponent),
  parameters: {
    name: 'NavigationIconCard',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue NavigationIconCard.',
    code: `
<script type="module">
  import '@peaui/ui/wc/navigation/NavigationIconCard';
</script>

<peaui-navigation-icon-card></peaui-navigation-icon-card>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(NavigationIconCardElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { icon: 'home', text: 'Unavailable', path: '' },
  parameters: {
    docs: {
      description: {
        story: 'An empty path exposes a disabled named link outside the Tab order.',
      },
    },
  },
};

export const DownloadLink: Story = {
  render: () => {
    const element = renderVueCustomElementStory(NavigationIconCardElement.tagName, {
      path: '#report',
      icon: 'home',
      text: 'Download report',
    });
    element.replaceChildren();
    for (const [key, value] of Object.entries({
      target: '_blank',
      rel: 'noopener',
      download: 'report.txt',
    }))
      element.setAttribute(key, value);
    return element;
  },
};
