import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FormDatePickerVueComponent from './index.ce.vue';
import { FormDatePickerElement, defineFormDatePicker } from './index.wc';

defineFormDatePicker();

const meta = {
  title: '5. Form/FormDatePicker',
  component: FormDatePickerElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(FormDatePickerVueComponent),
    value: '2026-08-05',
  },
  argTypes: createVueCustomElementArgTypes(FormDatePickerVueComponent),
  parameters: {
    name: 'FormDatePicker',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue FormDatePicker.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormDatePicker';
  import '@peaui/ui/styles.css';
</script>

<peaui-form-date-picker></peaui-form-date-picker>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(FormDatePickerElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
