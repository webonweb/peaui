import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormSelect from './index';

const meta = {
  title: 'React/form/FormSelect',
  component: FormSelect,
  args: getReactStoryArgs('FormSelect'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

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
    defaultValue: '',
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
    defaultValue: 'Alpha',
  },
};

export const RequiredSelectOnly: Story = {
  args: { searchable: false, required: true, value: undefined },
};

export const ManualEntry: Story = {
  args: {
    canWrite: true,
    required: true,
    value: undefined,
    defaultValue: 'Custom choice',
    options: [{ label: 'Alpha', value: 'a' }],
  },
};

export const RequiredSearch: Story = {
  args: {
    searchable: true,
    required: true,
    canErase: true,
    value: undefined,
    defaultValue: 'a',
    options: [{ label: 'Alpha', value: 'a' }],
  },
};
