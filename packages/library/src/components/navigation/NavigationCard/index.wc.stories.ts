import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import NavigationCardVueComponent from './index.ce.vue';
import { NavigationCardElement, defineNavigationCard } from './index.wc';

defineNavigationCard();

const meta = {
  title: '7. Navigation/NavigationCard',
  component: NavigationCardElement.tagName,
  args: createVueCustomElementStoryArgs(NavigationCardVueComponent),
  argTypes: createVueCustomElementArgTypes(NavigationCardVueComponent),
  parameters: {
    name: 'NavigationCard',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue NavigationCard.',
    code: `
<script type="module">
  import '@peaui/ui/wc/navigation/NavigationCard';
</script>

<peaui-navigation-card></peaui-navigation-card>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(NavigationCardElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};

export const DownloadLink: Story = {
  render: () => {
    const element = renderVueCustomElementStory(NavigationCardElement.tagName, {
      path: '#report',
      title: 'Download report',
      description: 'Report file',
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
