import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import TableList from './index';
import ButtonAction from '../../data-entry/ButtonAction';
import {
  tableListAllTypeColumns,
  tableListEditableColumns,
  tableListStoryColumns,
  tableListStoryRecords,
  tableListWorkflowColumns,
  tableListReorderColumns,
  tableListReorderRecords,
} from './story-fixtures';

const meta = {
  title: 'React/data-display/TableList',
  component: TableList,
  args: { columns: tableListStoryColumns, records: tableListStoryRecords },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TableList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { scroll: true } };

export const ReorderDuringEditing: Story = {
  render: function ReorderDuringEditing() {
    const [records, setRecords] = useState(tableListReorderRecords);
    return (
      <div>
        <p>Rozpocznij edycję Alice, zmień tekst i odwróć kolejność. Zapis nadal dotyczy Alice.</p>
        <ButtonAction onClick={() => setRecords((current) => [...current].reverse())}>
          Odwróć kolejność
        </ButtonAction>
        <TableList
          records={records}
          columns={tableListReorderColumns}
          editable
          canCreate={false}
          canSelectRows={false}
          onSubmit={(values) => {
            if (
              typeof values !== 'object' ||
              values === null ||
              !('id' in values) ||
              !('name' in values) ||
              typeof values.name !== 'string'
            )
              return;
            const { id, name } = values;
            setRecords((current) =>
              current.map((record, index) => (index === Number(id) ? { ...record, name } : record)),
            );
          }}
        />
      </div>
    );
  },
};

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
    isDetails: true,
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

export const EditableColumns: Story = {
  args: {
    columns: tableListEditableColumns.map((column) => ({ ...column, type: 'editable' })),
    records: tableListStoryRecords,
    canSelectRows: false,
  },
};

export const EmptyState: Story = {
  args: { canCreate: true, records: [] },
};

export const Loading: Story = {
  args: { isLoading: true, scroll: true },
};

/** The same large-data scenario across all adapters, limited to 20 DOM rows. */
export const PaginatedLargeData: Story = {
  args: {
    columns: [{ key: 'name', label: 'Nazwa' }],
    records: Array.from({ length: 5000 }, (_, index) => ({
      id: String(index),
      name: `Rekord ${index + 1}`,
    })),
    paginate: true,
    page: 1,
    rowsPerPage: 20,
    paginationLabel: 'Strony rekordow',
    canSelectRows: true,
    canCheckRows: false,
  },
  render: function Render(args) {
    const [page, setPage] = useState(1);
    return <TableList {...args} page={page} onPageChange={setPage} />;
  },
};
