import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import { guidedTourDemoSteps } from './guided-tour.demo';
import GuidedTourVueComponent from './index.ce.vue';
import { defineGuidedTour, GuidedTourElement } from './index.wc';

defineGuidedTour();

const meta = {
  title: '8. Overlayer/GuidedTour',
  component: GuidedTourElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(GuidedTourVueComponent),
    open: false,
    step: 0,
    steps: guidedTourDemoSteps,
  },
  argTypes: createVueCustomElementArgTypes(GuidedTourVueComponent),
  parameters: {
    name: 'GuidedTour',
    description:
      'Web Component korzystajacy z tej samej kontrolowanej implementacji GuidedTour co Vue i React.',
    code: `
<script type="module">
  import '@peaui/ui/wc/overlayer/GuidedTour';
</script>

<button data-tour-target="search">Start tour</button>
<peaui-guided-tour></peaui-guided-tour>

<script>
  const tour = document.querySelector('peaui-guided-tour');
  tour.steps = [{ id: 'search', target: '[data-tour-target="search"]', title: 'Search' }];
  tour.open = true;
</script>`,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(GuidedTourElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const NestedPopoverEscape: Story = {
  render: () => {
    const container = document.createElement('div');
    const start = document.createElement('button');
    const tour = new GuidedTourElement();
    start.textContent = 'Start tour';
    Object.assign(tour, {
      open: true,
      mode: 'modal',
      steps: [{ id: 'nested', title: 'Nested popup' }],
    });
    start.addEventListener('click', () => {
      tour.open = true;
    });
    tour.innerHTML =
      '<span slot="content"><button type="button" popovertarget="tour-nested-popup">Open nested popup</button><div id="tour-nested-popup" popover="auto"><button type="button">Nested action</button></div></span>';
    container.append(start, tour);
    return container;
  },
};

export const Default: Story = {};
export const Modal: Story = {
  args: {
    mode: 'modal',
    open: true,
    steps: [{ id: 'welcome', title: 'Welcome', description: 'A target-free modal step.' }],
  },
};
export const MissingTarget: Story = {
  args: {
    open: true,
    targetTimeout: 0,
    missingTargetStrategy: 'block',
    steps: [{ id: 'missing', target: '#missing-target', title: 'Missing target' }],
  },
};
