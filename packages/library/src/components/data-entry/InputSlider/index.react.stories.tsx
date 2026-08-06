import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import InputSlider from './index';

const meta = {
  title: 'React/data-entry/InputSlider',
  component: InputSlider,
  args: getReactStoryArgs('InputSlider'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof InputSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
