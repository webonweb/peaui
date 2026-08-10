import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FormRadioVueComponent from './index.ce.vue';
import { FormRadioElement, defineFormRadio } from './index.wc';

defineFormRadio();

const meta = {
  title: '5. Form/FormRadio',
  component: FormRadioElement.tagName,
  args: createVueCustomElementStoryArgs(FormRadioVueComponent),
  argTypes: createVueCustomElementArgTypes(FormRadioVueComponent),
  parameters: {
    name: 'FormRadio',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue FormRadio.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormRadio';
</script>

<peaui-form-radio></peaui-form-radio>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(FormRadioElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
