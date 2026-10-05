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
export const SmallTargetsAndViewportEdge: Story = {
  args: { size: 'xs', direction: 'end', open: true, overflowMode: 'popover' },
};
export const LargeClosedGroup: Story = {
  args: {
    open: false,
    overflowMode: 'popover',
    maxVisible: 3,
    items: Array.from({ length: 1000 }, (_, id) => ({ id, name: `Member ${id}` })),
  },
};
