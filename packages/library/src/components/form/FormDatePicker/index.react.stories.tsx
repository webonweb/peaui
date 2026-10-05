import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormDatePicker from './index';
import ButtonAction from '../../data-entry/ButtonAction';

const meta = {
  title: 'React/form/FormDatePicker',
  component: FormDatePicker,
  args: getReactStoryArgs('FormDatePicker'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const NativeRequired: Story = {
  args: {
    id: 'required-date',
    name: 'date',
    label: 'Required date',
    required: true,
    value: undefined,
  },
  render: (args) => (
    <form onSubmit={(event) => event.preventDefault()}>
      <FormDatePicker {...args} />
      <ButtonAction type="submit">Submit</ButtonAction>
    </form>
  ),
};
