import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FormCheckboxVueComponent from './index.ce.vue';
import { FormCheckboxElement, defineFormCheckbox } from './index.wc';

defineFormCheckbox();

const meta = {
  title: '5. Form/FormCheckbox',
  component: FormCheckboxElement.tagName,
  args: createVueCustomElementStoryArgs(FormCheckboxVueComponent),
  argTypes: createVueCustomElementArgTypes(FormCheckboxVueComponent),
  parameters: {
    name: 'FormCheckbox',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue FormCheckbox.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormCheckbox';
  import '@peaui/ui/styles.css';
</script>

<peaui-form-checkbox></peaui-form-checkbox>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(FormCheckboxElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
