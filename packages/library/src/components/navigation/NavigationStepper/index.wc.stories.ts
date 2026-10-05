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

export const RtlResizableContainer: Story = {
  render: () => {
    const container = document.createElement('div');
    container.dir = 'rtl';
    container.style.cssText = 'resize:horizontal;overflow:auto;width:24rem;max-width:100%';
    container.append(
      renderVueCustomElementStory(NavigationStepperElement.tagName, {
        options: Array.from({ length: 8 }, (_, i) => ({
          key: `step-${i}`,
          label: `Long step ${i + 1}`,
          status: 'complete' as const,
        })),
      }),
    );
    return container;
  },
};
