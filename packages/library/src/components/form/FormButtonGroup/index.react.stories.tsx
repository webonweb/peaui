import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FormButtonGroup from './index';

const meta = {
  title: 'React/form/FormButtonGroup',
  component: FormButtonGroup,
  args: getReactStoryArgs('FormButtonGroup'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
