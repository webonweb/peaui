import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import TreeList from './index';

const meta = {
  title: 'React/data-display/TreeList',
  component: TreeList,
  args: getReactStoryArgs('TreeList'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TreeList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };
