import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import CalculationResultsVueComponent from './index.ce.vue';
import { CalculationResultsElement, defineCalculationResults } from './index.wc';

defineCalculationResults();

const meta = {
  title: '2. Data Display/CalculationResults',
  component: CalculationResultsElement.tagName,
  args: createVueCustomElementStoryArgs(CalculationResultsVueComponent),
  argTypes: createVueCustomElementArgTypes(CalculationResultsVueComponent),
  parameters: {
    name: 'CalculationResults',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue CalculationResults.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-display/CalculationResults';
</script>

<peaui-calculation-results></peaui-calculation-results>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(CalculationResultsElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};

export const Loading: Story = { args: { isLoading: true, showCalculateButton: true } };
