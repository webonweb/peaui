import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import ListLimitControl from './index';

const meta = {
  title: 'React/navigation/ListLimitControl',
  component: ListLimitControl,
  args: getReactStoryArgs('ListLimitControl'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ListLimitControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
