import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormTextarea from './index';

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
