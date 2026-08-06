import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import EmptyState from './index';

const meta = {
  title: 'React/feedback/EmptyState',
  component: EmptyState,
  args: getReactStoryArgs('EmptyState'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
