import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import TableList from './index';
import {
  tableListAllTypeColumns,
  tableListEditableColumns,
  tableListStoryColumns,
  tableListStoryRecords,
  tableListWorkflowColumns,
} from './story-fixtures';

const meta = {
  title: 'React/data-display/TableList',
  component: TableList,
  args: getReactStoryArgs('TableList'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TableList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SelectableRows: Story = {
  args: { canSelectRows: true, selectedRows: ['2'] },
};

export const SingleSelection: Story = {
  args: { canCheckRows: true, canSelectRows: false, currentCheckedRow: '2' },
};

export const MultiColumnSort: Story = {
  args: {
    canMultiSort: true,
    columns: tableListStoryColumns,
    sortColumns: [
      { key: 'name', direction: 'asc' },
      { key: 'updatedAt', direction: 'desc' },
    ],
  },
};

export const AllColumnTypes: Story = {
  args: { columns: tableListAllTypeColumns, records: tableListStoryRecords, scroll: true },
};

export const WorkflowAndDetails: Story = {
  args: {
    columns: tableListWorkflowColumns,
    isDetials: true,
    records: tableListStoryRecords,
  },
};

export const ColumnVisibility: Story = {
  args: {
    canHideColumns: true,
    columns: tableListStoryColumns.map((column, index) => ({
      ...column,
      withLock: index === 0,
    })),
    records: tableListStoryRecords,
  },
};

export const Editable: Story = {
  args: {
    canCreate: true,
    canSelectRows: false,
    columns: tableListEditableColumns,
    editable: true,
    records: tableListStoryRecords,
  },
};

export const EmptyState: Story = {
  args: { canCreate: true, emptyDescriptionInline: 'Brak rekordów.', records: [] },
};

export const Loading: Story = {
  args: { isLoading: true, scroll: true },
};
