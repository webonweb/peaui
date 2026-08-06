import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import CounterBadge from './index';

const meta = {
  title: 'React/data-display/CounterBadge',
  component: CounterBadge,
  args: getReactStoryArgs('CounterBadge'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CounterBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
