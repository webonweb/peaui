import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import DisclosurePanelVueComponent from './index.ce.vue';
import { DisclosurePanelElement, defineDisclosurePanel } from './index.wc';

defineDisclosurePanel();

const meta = {
  title: '2. Data Display/DisclosurePanel',
  component: DisclosurePanelElement.tagName,
  args: createVueCustomElementStoryArgs(DisclosurePanelVueComponent),
  argTypes: createVueCustomElementArgTypes(DisclosurePanelVueComponent),
  parameters: {
    name: 'DisclosurePanel',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue DisclosurePanel.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-display/DisclosurePanel';
  import '@peaui/ui/styles.css';
</script>

<peaui-disclosure-panel></peaui-disclosure-panel>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(DisclosurePanelElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
