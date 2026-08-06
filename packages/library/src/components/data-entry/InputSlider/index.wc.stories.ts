import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import InputSliderVueComponent from './index.ce.vue';
import { InputSliderElement, defineInputSlider } from './index.wc';

defineInputSlider();

const meta = {
  title: '3. Data Entry/InputSlider',
  component: InputSliderElement.tagName,
  args: createVueCustomElementStoryArgs(InputSliderVueComponent),
  argTypes: createVueCustomElementArgTypes(InputSliderVueComponent),
  parameters: {
    name: 'InputSlider',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue InputSlider.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-entry/InputSlider';
  import '@peaui/ui/styles.css';
</script>

<peaui-input-slider></peaui-input-slider>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(InputSliderElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
