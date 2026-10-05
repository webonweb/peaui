import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FormFileUploadVueComponent from './index.ce.vue';
import { FormFileUploadElement, defineFormFileUpload } from './index.wc';

defineFormFileUpload();

const meta = {
  title: '5. Form/FormFileUpload',
  component: FormFileUploadElement.tagName,
  args: createVueCustomElementStoryArgs(FormFileUploadVueComponent),
  argTypes: createVueCustomElementArgTypes(FormFileUploadVueComponent),
  parameters: {
    name: 'FormFileUpload',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue FormFileUpload.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormFileUpload';
</script>

<peaui-form-file-upload></peaui-form-file-upload>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(FormFileUploadElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};

export const LegacyFileModel: Story = { args: { valueMode: 'file' } };
