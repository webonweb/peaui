import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import Avatar from './index';

const meta = {
  title: 'React/data-display/Avatar',
  component: Avatar,
  args: getReactStoryArgs('Avatar'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true, interactive: true } };
