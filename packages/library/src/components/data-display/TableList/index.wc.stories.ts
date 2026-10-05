import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import TableListVueComponent from './index.ce.vue';
import { TableListElement, defineTableList } from './index.wc';
import { ButtonActionElement, defineButtonAction } from '../../data-entry/ButtonAction/index.wc';
import {
  tableListAllTypeColumns,
  tableListEditableColumns,
  tableListStoryColumns,
  tableListStoryRecords,
  tableListWorkflowColumns,
  tableListReorderColumns,
  tableListReorderRecords,
} from './story-fixtures';

defineTableList();
defineButtonAction();

const meta = {
  title: '2. Data Display/TableList',
  component: TableListElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(TableListVueComponent),
    columns: tableListStoryColumns,
    records: tableListStoryRecords,
  },
  argTypes: createVueCustomElementArgTypes(TableListVueComponent),
  parameters: {
    name: 'TableList',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue TableList.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-display/TableList';
</script>

<peaui-table-list></peaui-table-list>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(TableListElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};

export const ReorderDuringEditing: Story = {
  render: () => {
    let records = [...tableListReorderRecords];
    const wrapper = document.createElement('div');
    const hint = document.createElement('p');
    hint.textContent =
      'Rozpocznij edycję Alice, zmień tekst i odwróć kolejność. Zapis nadal dotyczy Alice.';
    const table = new TableListElement();
    Object.assign(table, {
      records,
      columns: tableListReorderColumns,
      editable: true,
      canCreate: false,
      canSelectRows: false,
    });
    const reverse = new ButtonActionElement();
    reverse.textContent = 'Odwróć kolejność';
    reverse.addEventListener('click', () => {
      records = [...records].reverse();
      Object.assign(table, { records });
    });
    table.addEventListener('on:submit', (event) => {
      const values = (event as CustomEvent<Record<string, unknown>>).detail;
      records = records.map((record, index) =>
        index === Number(values.id) ? { ...record, name: String(values.name) } : record,
      );
      Object.assign(table, { records });
    });
    wrapper.append(hint, reverse, table);
    return wrapper;
  },
};

export const EditableColumns: Story = {
  args: {
    columns: tableListEditableColumns.map((column) => ({ ...column, type: 'editable' })),
    records: tableListStoryRecords,
    canSelectRows: false,
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
    sortColumns: [{ name: 'ASC' }, { updatedAt: 'DESC' }],
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

export const EmptyState: Story = {
  args: { canCreate: true, emptyDescriptionInline: 'Brak rekordów.', records: [] },
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
};
