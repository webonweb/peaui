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

export const RequiredSearch: Story = {
  args: {
    searchable: true,
    required: true,
    canErase: true,
    value: ['a'],
    options: [{ label: 'Alpha', value: 'a' }],
  },
};

export const Localized: Story = {
  args: {
    id: 'localized',
    name: 'localized',
    label: 'Choice',
    labels: {
      placeholder: 'Choose',
      searchPlaceholder: 'Search',
      selectPlaceholder: 'Choose an option',
      empty: 'No matches',
      emptyWritable: 'No matches. Type a value.',
      clear: 'Clear selection',
      selectAll: 'Select all',
      deselectAll: 'Deselect all',
    },
    options: [],
    withSelectAll: true,
  },
};

export const Virtualized: Story = {
  args: {
    virtual: true,
    optionHeight: 48,
    options: Array.from({ length: 5000 }, (_, value) => ({
      key: value,
      value,
      label: `Option ${value}`,
    })),
    id: 'virtual-options',
    name: 'virtual-options',
    value: [],
  },
};

export const LabelMigration: Story = {
  args: {
    id: 'label-migration',
    name: 'label-migration',
    valueMode: 'label',
    options: [
      { label: 'Alpha', value: 'a' },
      { label: 'Beta', value: 'b' },
    ],
    value: ['Alpha'],
  },
};

export const RequiredSelectOnly: Story = { args: { searchable: false, required: true, value: [] } };
