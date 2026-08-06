import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FormTextareaVueComponent from './index.ce.vue';
import { FormTextareaElement, defineFormTextarea } from './index.wc';

defineFormTextarea();

const meta = {
  title: '5. Form/FormTextarea',
  component: FormTextareaElement.tagName,
  args: createVueCustomElementStoryArgs(FormTextareaVueComponent),
  argTypes: createVueCustomElementArgTypes(FormTextareaVueComponent),
  parameters: {
    name: 'FormTextarea',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue FormTextarea.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormTextarea';
  import '@peaui/ui/styles.css';
</script>

<peaui-form-textarea></peaui-form-textarea>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(FormTextareaElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
