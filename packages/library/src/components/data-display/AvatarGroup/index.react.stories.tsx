import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import AvatarGroup from './index';

const meta = {
  title: 'React/data-display/AvatarGroup',
  component: AvatarGroup,
  args: getReactStoryArgs('AvatarGroup'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
