import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import GridItem from './index';

const meta = {
  title: 'React/layout/GridItem',
  component: GridItem,
  args: getReactStoryArgs('GridItem'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof GridItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
