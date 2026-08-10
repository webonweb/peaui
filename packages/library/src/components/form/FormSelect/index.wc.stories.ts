import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FormSelectVueComponent from './index.ce.vue';
import { FormSelectElement, defineFormSelect } from './index.wc';

defineFormSelect();

const meta = {
  title: '5. Form/FormSelect',
  component: FormSelectElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(FormSelectVueComponent),
    canErase: true,
    options: [
      { label: 'Aktywny', value: 'active' },
      { label: 'Nieaktywny', value: 'inactive' },
    ],
    value: 'active',
  },
  argTypes: createVueCustomElementArgTypes(FormSelectVueComponent),
  parameters: {
    name: 'FormSelect',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue FormSelect.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormSelect';
</script>

<peaui-form-select></peaui-form-select>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(FormSelectElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
