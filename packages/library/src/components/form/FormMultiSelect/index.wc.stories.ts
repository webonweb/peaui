import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FormMultiSelectVueComponent from './index.ce.vue';
import { FormMultiSelectElement, defineFormMultiSelect } from './index.wc';

defineFormMultiSelect();

const meta = {
  title: '5. Form/FormMultiSelect',
  component: FormMultiSelectElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(FormMultiSelectVueComponent),
    canErase: true,
    options: [
      { label: 'Vue', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Web Components', value: 'wc' },
    ],
    value: ['vue', 'react'],
  },
  argTypes: createVueCustomElementArgTypes(FormMultiSelectVueComponent),
  parameters: {
    name: 'FormMultiSelect',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue FormMultiSelect.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormMultiSelect';
  import '@peaui/ui/styles.css';
</script>

<peaui-form-multi-select></peaui-form-multi-select>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(FormMultiSelectElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
