import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormYearPicker from './index';

const meta = {
  title: 'React/form/FormYearPicker',
  component: FormYearPicker,
  args: getReactStoryArgs('FormYearPicker'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormYearPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
