import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormFileUpload from './index';

const meta = {
  title: 'React/form/FormFileUpload',
  component: FormFileUpload,
  args: getReactStoryArgs('FormFileUpload'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormFileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
