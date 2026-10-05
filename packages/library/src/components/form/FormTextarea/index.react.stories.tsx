import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormTextarea from './index';
import ButtonAction from '../../data-entry/ButtonAction';

const meta = {
  title: 'React/form/FormTextarea',
  component: FormTextarea,
  args: getReactStoryArgs('FormTextarea'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const NativeReset: Story = {
  args: { id: 'reset-description', name: 'description', label: 'Description' },
  render: (args) => (
    <form>
      <FormTextarea
        {...args}
        value={undefined}
        defaultValue="Initial description"
        autoComplete="street-address"
        minLength={5}
      />
      <ButtonAction type="reset">Reset</ButtonAction>
    </form>
  ),
};
