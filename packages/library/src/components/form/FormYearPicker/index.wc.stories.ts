import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FormYearPickerVueComponent from './index.ce.vue';
import { FormYearPickerElement, defineFormYearPicker } from './index.wc';

defineFormYearPicker();

const meta = {
  title: '5. Form/FormYearPicker',
  component: FormYearPickerElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(FormYearPickerVueComponent),
    value: 2026,
  },
  argTypes: createVueCustomElementArgTypes(FormYearPickerVueComponent),
  parameters: {
    name: 'FormYearPicker',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue FormYearPicker.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormYearPicker';
  import '@peaui/ui/styles.css';
</script>

<peaui-form-year-picker></peaui-form-year-picker>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(FormYearPickerElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
