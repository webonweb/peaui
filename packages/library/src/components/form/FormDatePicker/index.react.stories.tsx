import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormDatePicker from './index';

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
