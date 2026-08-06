import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FormFileUploadSimpleVueComponent from './index.ce.vue';
import { FormFileUploadSimpleElement, defineFormFileUploadSimple } from './index.wc';

defineFormFileUploadSimple();

const meta = {
  title: '5. Form/FormFileUploadSimple',
  component: FormFileUploadSimpleElement.tagName,
  args: createVueCustomElementStoryArgs(FormFileUploadSimpleVueComponent),
  argTypes: createVueCustomElementArgTypes(FormFileUploadSimpleVueComponent),
  parameters: {
    name: 'FormFileUploadSimple',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue FormFileUploadSimple.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormFileUploadSimple';
  import '@peaui/ui/styles.css';
</script>

<peaui-form-file-upload-simple></peaui-form-file-upload-simple>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(FormFileUploadSimpleElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
