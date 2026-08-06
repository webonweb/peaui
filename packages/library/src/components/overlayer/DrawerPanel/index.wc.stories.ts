import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import DrawerPanelVueComponent from './index.ce.vue';
import { DrawerPanelElement, defineDrawerPanel } from './index.wc';

defineDrawerPanel();

const meta = {
  title: '8. Overlayer/DrawerPanel',
  component: DrawerPanelElement.tagName,
  args: createVueCustomElementStoryArgs(DrawerPanelVueComponent),
  argTypes: createVueCustomElementArgTypes(DrawerPanelVueComponent),
  parameters: {
    name: 'DrawerPanel',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue DrawerPanel.',
    code: `
<script type="module">
  import '@peaui/ui/wc/overlayer/DrawerPanel';
  import '@peaui/ui/styles.css';
</script>

<peaui-drawer-panel></peaui-drawer-panel>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(DrawerPanelElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
