import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import PhotoEditorVueComponent from './index.ce.vue';
import { PhotoEditorElement, definePhotoEditor } from './index.wc';

definePhotoEditor();

const meta = {
  title: '1. Basic/PhotoEditor',
  component: PhotoEditorElement.tagName,
  args: createVueCustomElementStoryArgs(PhotoEditorVueComponent),
  argTypes: createVueCustomElementArgTypes(PhotoEditorVueComponent),
  parameters: {
    name: 'PhotoEditor',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue PhotoEditor.',
    code: `
<script type="module">
  import '@peaui/ui/wc/basic/PhotoEditior';
  import '@peaui/ui/styles.css';
</script>

<peaui-photo-editor></peaui-photo-editor>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(PhotoEditorElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
