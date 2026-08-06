import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import SelectableCardVueComponent from './index.ce.vue';
import { SelectableCardElement, defineSelectableCard } from './index.wc';

defineSelectableCard();

const meta = {
  title: '3. Data Entry/SelectableCard',
  component: SelectableCardElement.tagName,
  args: createVueCustomElementStoryArgs(SelectableCardVueComponent),
  argTypes: createVueCustomElementArgTypes(SelectableCardVueComponent),
  parameters: {
    name: 'SelectableCard',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue SelectableCard.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-entry/SelectableCard';
  import '@peaui/ui/styles.css';
</script>

<peaui-selectable-card></peaui-selectable-card>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(SelectableCardElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
