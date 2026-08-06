import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormButtonCheckbox from './index';

const meta = {
  title: 'React/form/FormButtonCheckbox',
  component: FormButtonCheckbox,
  args: getReactStoryArgs('FormButtonCheckbox'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormButtonCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
