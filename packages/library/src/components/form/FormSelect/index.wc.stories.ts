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

export const ManualEntry: Story = {
  args: {
    canWrite: true,
    required: true,
    value: 'Custom choice',
    options: [{ label: 'Alpha', value: 'a' }],
  },
};

export const RequiredSearch: Story = {
  args: {
    searchable: true,
    required: true,
    canErase: true,
    value: 'a',
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
    value: '',
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
    value: 'Alpha',
  },
};

export const RequiredSelectOnly: Story = {
  args: { searchable: false, required: true, value: undefined },
};
