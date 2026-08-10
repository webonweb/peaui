import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import TableListVueComponent from './index.ce.vue';
import { TableListElement, defineTableList } from './index.wc';
import {
  tableListAllTypeColumns,
  tableListEditableColumns,
  tableListStoryColumns,
  tableListStoryRecords,
  tableListWorkflowColumns,
} from './story-fixtures';

defineTableList();

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
