import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormMultiSelect from './index';

const meta = {
  title: 'React/form/FormMultiSelect',
  component: FormMultiSelect,
  args: getReactStoryArgs('FormMultiSelect'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormMultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
