import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import ButtonExportVueComponent from './index.ce.vue';
import { ButtonExportElement, defineButtonExport } from './index.wc';

defineButtonExport();

const meta = {
  title: '3. Data Entry/ButtonExport',
  component: ButtonExportElement.tagName,
  args: createVueCustomElementStoryArgs(ButtonExportVueComponent),
  argTypes: createVueCustomElementArgTypes(ButtonExportVueComponent),
  parameters: {
    name: 'ButtonExport',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue ButtonExport.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-entry/ButtonExport';
</script>

<peaui-button-export></peaui-button-export>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(ButtonExportElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
