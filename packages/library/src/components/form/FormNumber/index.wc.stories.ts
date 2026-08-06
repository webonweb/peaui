import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FormNumberVueComponent from './index.ce.vue';
import { FormNumberElement, defineFormNumber } from './index.wc';

defineFormNumber();

const meta = {
  title: '5. Form/FormNumber',
  component: FormNumberElement.tagName,
  args: createVueCustomElementStoryArgs(FormNumberVueComponent),
  argTypes: createVueCustomElementArgTypes(FormNumberVueComponent),
  parameters: {
    name: 'FormNumber',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue FormNumber.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormNumber';
  import '@peaui/ui/styles.css';
</script>

<peaui-form-number></peaui-form-number>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(FormNumberElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
