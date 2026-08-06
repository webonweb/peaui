import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import TableListHeader from './index';

const meta = {
  title: 'React/data-display/TableListHeader',
  component: TableListHeader,
  args: getReactStoryArgs('TableListHeader'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TableListHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
