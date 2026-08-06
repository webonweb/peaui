import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import SpinnerLoader from './index';

const meta = {
  title: 'React/feedback/SpinnerLoader',
  component: SpinnerLoader,
  args: getReactStoryArgs('SpinnerLoader'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SpinnerLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
