import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import SearchInputVueComponent from './index.ce.vue';
import { SearchInputElement, defineSearchInput } from './index.wc';

defineSearchInput();

const meta = {
  title: '3. Data Entry/SearchInput',
  component: SearchInputElement.tagName,
  args: createVueCustomElementStoryArgs(SearchInputVueComponent),
  argTypes: createVueCustomElementArgTypes(SearchInputVueComponent),
  parameters: {
    name: 'SearchInput',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue SearchInput.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-entry/SearchInput';
  import '@peaui/ui/styles.css';
</script>

<peaui-search-input></peaui-search-input>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(SearchInputElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
