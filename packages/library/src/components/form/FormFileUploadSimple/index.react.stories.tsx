import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormFileUploadSimple from './index';

const meta = {
  title: 'React/form/FormFileUploadSimple',
  component: FormFileUploadSimple,
  args: getReactStoryArgs('FormFileUploadSimple'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormFileUploadSimple>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
