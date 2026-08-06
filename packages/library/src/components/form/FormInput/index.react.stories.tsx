import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormInput from './index';

const meta = {
  title: 'React/form/FormInput',
  component: FormInput,
  args: getReactStoryArgs('FormInput'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
