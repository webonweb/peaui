import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FormContainerVueComponent from './index.ce.vue';
import { FormContainerElement, defineFormContainer } from './index.wc';

defineFormContainer();

const meta = {
  title: '5. Form/FormContainer',
  component: FormContainerElement.tagName,
  args: createVueCustomElementStoryArgs(FormContainerVueComponent),
  argTypes: createVueCustomElementArgTypes(FormContainerVueComponent),
  parameters: {
    name: 'FormContainer',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue FormContainer.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormContainer';
  import '@peaui/ui/styles.css';
</script>

<peaui-form-container></peaui-form-container>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(FormContainerElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
