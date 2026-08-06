import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import TableList from './index';

const meta = {
  title: 'React/data-display/TableList',
  component: TableList,
  args: getReactStoryArgs('TableList'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TableList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
