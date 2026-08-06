import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import SkeletonLoading from './index';

const meta = {
  title: 'React/feedback/SkeletonLoading',
  component: SkeletonLoading,
  args: getReactStoryArgs('SkeletonLoading'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SkeletonLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
