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
