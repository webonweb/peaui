import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormPassword from './index';

const meta = {
  title: 'React/form/FormPassword',
  component: FormPassword,
  args: getReactStoryArgs('FormPassword'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
