import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FormButtonCheckboxVueComponent from './index.ce.vue';
import { FormButtonCheckboxElement, defineFormButtonCheckbox } from './index.wc';

defineFormButtonCheckbox();

const meta = {
  title: '5. Form/FormButtonCheckbox',
  component: FormButtonCheckboxElement.tagName,
  args: createVueCustomElementStoryArgs(FormButtonCheckboxVueComponent),
  argTypes: createVueCustomElementArgTypes(FormButtonCheckboxVueComponent),
  parameters: {
    name: 'FormButtonCheckbox',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue FormButtonCheckbox.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormButtonCheckbox';
</script>

<peaui-form-button-checkbox></peaui-form-button-checkbox>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(FormButtonCheckboxElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
