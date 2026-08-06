import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FormButtonGroupVueComponent from './index.ce.vue';
import { FormButtonGroupElement, defineFormButtonGroup } from './index.wc';

defineFormButtonGroup();

const meta = {
  title: '5. Form/FormButtonGroup',
  component: FormButtonGroupElement.tagName,
  args: createVueCustomElementStoryArgs(FormButtonGroupVueComponent),
  argTypes: createVueCustomElementArgTypes(FormButtonGroupVueComponent),
  parameters: {
    name: 'FormButtonGroup',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue FormButtonGroup.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormButtonGroup';
  import '@peaui/ui/styles.css';
</script>

<peaui-form-button-group></peaui-form-button-group>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(FormButtonGroupElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
