import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import TableListFooter from './index';

const meta = {
  title: 'React/data-display/TableListFooter',
  component: TableListFooter,
  args: getReactStoryArgs('TableListFooter'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TableListFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NinePages: Story = { args: { rowsNumber: 90, rowsPerPage: 10, total: 9, page: 1 } };
