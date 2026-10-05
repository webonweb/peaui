import type { Meta, StoryObj } from '@storybook/react';

import TableListHeader from './index';
import { tableListHeaderStoryProps } from './story-fixtures';

const meta = {
  title: 'React/data-display/TableListHeader',
  component: TableListHeader,
  args: tableListHeaderStoryProps,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TableListHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FiltersAndExport: Story = {
  args: {
    canSearch: true,
    canFilter: true,
    canExport: true,
    totalRecords: 10,
    countSelectedRecords: 2,
    filtersDrawer: (
      <label>
        Status{' '}
        <select>
          <option>All</option>
          <option>Active</option>
        </select>
      </label>
    ),
  },
};
