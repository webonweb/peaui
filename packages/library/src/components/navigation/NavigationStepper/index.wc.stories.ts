import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import NavigationStepperVueComponent from './index.ce.vue';
import { NavigationStepperElement, defineNavigationStepper } from './index.wc';

defineNavigationStepper();

const meta = {
  title: '7. Navigation/NavigationStepper',
  component: NavigationStepperElement.tagName,
  args: createVueCustomElementStoryArgs(NavigationStepperVueComponent),
  argTypes: createVueCustomElementArgTypes(NavigationStepperVueComponent),
  parameters: {
    name: 'NavigationStepper',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue NavigationStepper.',
    code: `
<script type="module">
  import '@peaui/ui/wc/navigation/NavigationStepper';
  import '@peaui/ui/styles.css';
</script>

<peaui-navigation-stepper></peaui-navigation-stepper>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(NavigationStepperElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
