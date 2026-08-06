import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';

import TableList from './index.vue';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

const TableHeadSelectColumnStub = defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['on:toggle:select:row'],
  template:
    '<th :data-disabled="disabled" data-testid="head-select" @click="$emit(\'on:toggle:select:row\')"></th>',
});

const TableHeadColumnStub = defineComponent({
  props: {
    canMultiSort: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      required: true,
    },
    dataTestId: {
      type: String,
      default: undefined,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    lockedColumns: {
      type: Object,
      default: undefined,
    },
    lockedState: {
      type: Object,
      default: undefined,
    },
    sortColumn: {
      type: String,
      default: undefined,
    },
    sortColumns: {
      type: Array,
      default: undefined,
    },
    sortType: {
      type: String,
      default: undefined,
    },
  },
  emits: ['on:lock', 'on:sort'],
  template: `
    <template v-for="column in columns.filter((entry) => entry.key !== 'actions')" :key="column.key">
      <th
        :data-testid="\`head-columns-\${column.key}\`"
        :data-can-multi-sort="canMultiSort"
        :data-sort-column="sortColumn"
        :data-sort-columns="JSON.stringify(sortColumns || [])"
        :data-sort-type="sortType"
      >
        <button
          :data-testid="\`head-columns-button-\${column.key}\`"
          @click="$emit('on:sort', column.subKey || column.key)"
        >
          {{ column.key }}
        </button>
      </th>
    </template>
  `,
});

const TableHeadColumnLockStub = defineComponent({
  props: {
    columns: {
      type: Array,
      required: true,
    },
    dataTestId: {
      type: String,
      default: undefined,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    lockedColumns: {
      type: Object,
      default: undefined,
    },
    lockedState: {
      type: Object,
      default: undefined,
    },
    sortColumn: {
      type: String,
      default: undefined,
    },
    sortColumns: {
      type: Array,
      default: undefined,
    },
    sortType: {
      type: String,
      default: undefined,
    },
    canMultiSort: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['on:lock', 'on:sort'],
  template: `
    <template v-for="column in columns" :key="column.key">
      <th
        :data-testid="\`lock-head-\${column.key}\`"
        :data-side="lockedColumns?.[column.key]?.side"
        :data-offset="lockedColumns?.[column.key]?.offset"
      >
        <button :data-testid="\`lock-toggle-\${column.key}\`" @click="$emit('on:lock', column.key)">
          toggle
        </button>
      </th>
    </template>
  `,
});

const TableHeadActionsColumnStub = defineComponent({
  template: '<th data-testid="head-actions"></th>',
});

const TableHeadColumnVisibilityStub = defineComponent({
  props: {
    canMultiSort: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      required: true,
    },
    dataTestId: {
      type: String,
      default: undefined,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    lockedColumns: {
      type: Object,
      default: undefined,
    },
    lockedState: {
      type: Object,
      default: undefined,
    },
    sortColumn: {
      type: String,
      default: undefined,
    },
    sortColumns: {
      type: Array,
      default: undefined,
    },
    sortType: {
      type: String,
      default: undefined,
    },
  },
  emits: ['on:lock', 'on:sort'],
  template: `
    <template
      v-for="column in columns.filter((entry) => entry.key !== 'actions' && entry.visible !== false)"
      :key="column.subKey || column.key"
    >
      <th :data-testid="\`visibility-head-\${column.subKey || column.key}\`">
        <button
          :data-testid="\`visibility-sort-\${column.subKey || column.key}\`"
          @click="$emit('on:sort', column.subKey || column.key)"
        >
          {{ column.key }}
        </button>
        <button
          v-if="column.withLock"
          :data-testid="\`visibility-lock-\${column.subKey || column.key}\`"
          @click="$emit('on:lock', column.key)"
        >
          {{ lockedState?.[column.key] ? 'locked' : 'unlocked' }}
        </button>
      </th>
    </template>
  `,
});

const TableHeadActionsColumnVisibilityStub = defineComponent({
  props: {
    canHideColumns: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['on:toggle:column'],
  template: `
    <th data-testid="head-actions">
      <button
        v-for="column in canHideColumns ? columns.filter((entry) => entry.key !== 'actions') : []"
        :key="column.subKey || column.key"
        :data-testid="\`toggle-column-\${column.subKey || column.key}\`"
        @click="$emit('on:toggle:column', column.subKey || column.key, column.visible === false)"
      >
        {{ column.key }}
      </button>
    </th>
  `,
});

const TableBodyCheckColumnStub = defineComponent({
  emits: ['on:check:row'],
  template:
    '<td><button data-testid="check-column" @click="$emit(\'on:check:row\')">check</button></td>',
});

const TableBodySelectColumnStub = defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    selectedRows: {
      type: Array,
      required: true,
    },
  },
  emits: ['on:select:row'],
  setup(props, { emit }) {
    return () =>
      h('td', [
        h(
          'button',
          {
            'data-testid': 'select-column',
            onClick: () => emit('on:select:row', [...(props.selectedRows as string[]), props.id]),
          },
          'select',
        ),
      ]);
  },
});

const TableBodyColumnStub = defineComponent({
  emits: ['on:click', 'on:update'],
  template: `
    <td>
      <button data-testid="cell-button" @click="$emit('on:click')">cell</button>
    </td>
  `,
});

const TableBodyInlineUpdateColumnStub = defineComponent({
  props: {
    column: {
      type: Object,
      required: true,
    },
  },
  emits: ['on:click', 'on:update'],
  setup(props, { emit }) {
    return () =>
      h('td', [
        props.column.inline
          ? h(
              'button',
              {
                'data-testid': `inline-update-${props.column.key}`,
                onClick: () =>
                  emit(
                    'on:update',
                    {
                      [props.column.key]: props.column.key === 'category' ? 'Techniczny' : 'Beta',
                    },
                    props.column,
                  ),
              },
              'update',
            )
          : h(
              'button',
              {
                'data-testid': 'cell-button',
                onClick: () => emit('on:click'),
              },
              'cell',
            ),
      ]);
  },
});

const TableBodyExpandableColumnStub = defineComponent({
  props: {
    column: {
      type: Object,
      required: true,
    },
    record: {
      type: Object,
      required: true,
    },
  },
  emits: ['on:click', 'on:update'],
  template: `
    <td>
      <button
        v-if="column.type === 'expandable'"
        :data-testid="\`expandable-cell-\${record.id}\`"
        @click="$emit('on:click', String(record.id))"
      >
        toggle
      </button>
      <button v-else data-testid="cell-button" @click="$emit('on:click')">cell</button>
    </td>
  `,
});

const TableBodyColumnLockStub = defineComponent({
  props: {
    column: {
      type: Object,
      required: true,
    },
    lockedColumn: {
      type: Object,
      default: undefined,
    },
  },
  emits: ['on:click', 'on:update'],
  template: `
    <td
      :data-testid="\`lock-body-\${column.key}\`"
      :data-side="lockedColumn?.side"
      :data-offset="lockedColumn?.offset"
    >
      {{ column.key }}
    </td>
  `,
});

const TableBodyColumnVisibilityStub = defineComponent({
  props: {
    column: {
      type: Object,
      required: true,
    },
  },
  emits: ['on:click', 'on:update'],
  template: `
    <td :data-testid="\`visibility-body-\${column.subKey || column.key}\`">
      {{ column.key }}
    </td>
  `,
});

const TableBodyEditableColumnStub = defineComponent({
  props: {
    errors: {
      type: Object,
      default: undefined,
    },
  },
  template:
    '<td data-testid="editable-column"><span data-testid="editable-errors">{{ JSON.stringify(errors || {}) }}</span></td>',
});

const TableBodyEditableColumnLockStub = defineComponent({
  props: {
    columns: {
      type: Array,
      required: true,
    },
    dataTestId: {
      type: String,
      default: undefined,
    },
    errors: {
      type: Object,
      default: undefined,
    },
    formValues: {
      type: Object,
      default: undefined,
    },
    lockedColumns: {
      type: Object,
      default: undefined,
    },
  },
  emits: ['on:update'],
  template: `
    <td
      v-for="column in columns.filter((entry) => entry.key !== 'actions')"
      :key="column.key"
      :data-testid="\`lock-editable-\${column.key}\`"
      :data-side="lockedColumns?.[column.key]?.side"
      :data-offset="lockedColumns?.[column.key]?.offset"
    >
      {{ column.key }}
    </td>
  `,
});

const TableBodyActionsColumnStub = defineComponent({
  emits: ['on:fire:action'],
  template:
    '<td><button data-testid="row-action" @click="$emit(\'on:fire:action\', \'edit\')">action</button></td>',
});

const TableBodyEditableActionsColumnStub = defineComponent({
  emits: ['on:cancel:action', 'on:submit:update'],
  template:
    '<td data-testid="editable-actions"><button data-testid="editable-submit" @click="$emit(\'on:submit:update\')">save</button></td>',
});

const TableBodyEditableCreateRecordRowStub = defineComponent({
  props: {
    dataTestId: {
      type: String,
      default: undefined,
    },
  },
  emits: ['on:create'],
  template:
    '<tr><td><button :data-testid="dataTestId" @click="$emit(\'on:create\')">create</button></td></tr>',
});

const TableBodyAddtionalRowStub = defineComponent({
  template: '<tr data-testid="additional-row"><slot /></tr>',
});

const ButtonActionStub = defineComponent({
  props: {
    dataTestId: {
      type: String,
      default: undefined,
    },
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        'button',
        {
          'data-testid': props.dataTestId,
          onClick: (event: MouseEvent) => emit('click', event),
        },
        slots.default?.(),
      );
  },
});

const SpinnerLoaderStub = defineComponent({
  props: {
    dataTestId: {
      type: String,
      default: undefined,
    },
  },
  template: '<div :data-testid="dataTestId || \'spinner-loader\'">spinner</div>',
});

const InfoDescriptionStub = defineComponent({
  props: {
    dataTestId: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    return () => h('section', { 'data-testid': props.dataTestId }, [slots.additional?.()]);
  },
});

const ModalDialogStub = defineComponent({
  props: {
    dataTestId: {
      type: String,
      default: undefined,
    },
    ariaLabel: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    return () => {
      const headerId = props.dataTestId ? `${props.dataTestId}-header` : undefined;

      return h(
        'div',
        {
          'data-testid': props.dataTestId,
          'aria-labelledby': slots.header ? headerId : undefined,
          'aria-label': slots.header ? undefined : props.ariaLabel,
        },
        [
          slots.header ? h('div', { id: headerId, 'data-testid': headerId }, slots.header()) : null,
          slots.default?.(),
        ],
      );
    };
  },
});

const SectionHeadingStub = defineComponent({
  template: '<div><slot name="title" /></div>',
});

const GridSectionStub = defineComponent({
  template: '<div><slot /></div>',
});

const GridItemStub = defineComponent({
  template: '<div><slot /></div>',
});

function factory(props?: Partial<InstanceType<typeof TableList>['$props']>) {
  return mount(TableList, {
    props: {
      ariaLabel: 'Tabela rekordow',
      columns: [
        { key: 'name', label: 'Nazwa', type: 'text' },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [],
        },
      ],
      records: [{ id: '1', name: 'Alfa' }],
      dataTestId: 'table-list',
      ...props,
    } as never,
    global: {
      stubs: {
        ButtonAction: ButtonActionStub,
        ModalDialog: ModalDialogStub,
        GridItem: GridItemStub,
        GridSection: GridSectionStub,
        EmptyState: InfoDescriptionStub,
        SectionHeading: SectionHeadingStub,
        SpinnerLoader: SpinnerLoaderStub,
        SvgIcon: true,
        TableBodyActionsColumn: TableBodyActionsColumnStub,
        TableBodyAddtionalRow: TableBodyAddtionalRowStub,
        TableBodyCheckColumn: TableBodyCheckColumnStub,
        TableBodyColumn: TableBodyColumnStub,
        TableBodyEditableActionsColumn: TableBodyEditableActionsColumnStub,
        TableBodyEditableColumn: TableBodyEditableColumnStub,
        TableBodyEditableCreateRecordRow: TableBodyEditableCreateRecordRowStub,
        TableBodySelectColumn: TableBodySelectColumnStub,
        TableHeadActionsColumn: TableHeadActionsColumnStub,
        TableHeadColumn: TableHeadColumnStub,
        TableHeadSelectColumn: TableHeadSelectColumnStub,
      },
    },
  });
}

function factoryWithRealEditableColumn(props?: Partial<InstanceType<typeof TableList>['$props']>) {
  return mount(TableList, {
    props: {
      ariaLabel: 'Tabela rekordow',
      columns: [
        { key: 'name', label: 'Nazwa', type: 'text' },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [],
        },
      ],
      records: [{ id: '1', name: 'Alfa' }],
      dataTestId: 'table-list',
      ...props,
    } as never,
    global: {
      stubs: {
        ButtonAction: ButtonActionStub,
        ModalDialog: ModalDialogStub,
        GridItem: GridItemStub,
        GridSection: GridSectionStub,
        EmptyState: InfoDescriptionStub,
        SectionHeading: SectionHeadingStub,
        SpinnerLoader: SpinnerLoaderStub,
        SvgIcon: true,
        TableBodyActionsColumn: TableBodyActionsColumnStub,
        TableBodyAddtionalRow: TableBodyAddtionalRowStub,
        TableBodyCheckColumn: TableBodyCheckColumnStub,
        TableBodyColumn: TableBodyColumnStub,
        TableBodyEditableActionsColumn: TableBodyEditableActionsColumnStub,
        TableBodyEditableCreateRecordRow: TableBodyEditableCreateRecordRowStub,
        TableBodySelectColumn: TableBodySelectColumnStub,
        TableHeadActionsColumn: TableHeadActionsColumnStub,
        TableHeadColumn: TableHeadColumnStub,
        TableHeadSelectColumn: TableHeadSelectColumnStub,
      },
    },
  });
}

function factoryWithInlineUpdateBodyColumn(
  props?: Partial<InstanceType<typeof TableList>['$props']>,
) {
  return mount(TableList, {
    props: {
      ariaLabel: 'Tabela rekordow',
      columns: [
        {
          key: 'category',
          label: 'Kategoria',
          inline: true,
          type: 'editable',
          manage: {
            options: [
              { label: 'Formalny', value: 'formalny' },
              { label: 'Techniczny', value: 'techniczny' },
            ],
            onUpdate: vi.fn((record) => record),
            type: 'select',
          },
        },
        {
          key: 'stepper',
          label: 'Etapy',
          type: 'stepper',
          steps: vi.fn(() => []),
        },
      ],
      records: [{ id: '1', category: 'Formalny' }],
      dataTestId: 'table-list',
      ...props,
    } as never,
    global: {
      stubs: {
        ButtonAction: ButtonActionStub,
        ModalDialog: ModalDialogStub,
        GridItem: GridItemStub,
        GridSection: GridSectionStub,
        EmptyState: InfoDescriptionStub,
        SectionHeading: SectionHeadingStub,
        SpinnerLoader: SpinnerLoaderStub,
        SvgIcon: true,
        TableBodyActionsColumn: TableBodyActionsColumnStub,
        TableBodyAddtionalRow: TableBodyAddtionalRowStub,
        TableBodyCheckColumn: TableBodyCheckColumnStub,
        TableBodyColumn: TableBodyInlineUpdateColumnStub,
        TableBodyEditableActionsColumn: TableBodyEditableActionsColumnStub,
        TableBodyEditableColumn: TableBodyEditableColumnStub,
        TableBodyEditableCreateRecordRow: TableBodyEditableCreateRecordRowStub,
        TableBodySelectColumn: TableBodySelectColumnStub,
        TableHeadActionsColumn: TableHeadActionsColumnStub,
        TableHeadColumn: TableHeadColumnStub,
        TableHeadSelectColumn: TableHeadSelectColumnStub,
      },
    },
  });
}

function factoryWithExpandableBodyColumn(
  props?: Partial<InstanceType<typeof TableList>['$props']>,
) {
  return mount(TableList, {
    props: {
      ariaLabel: 'Tabela rekordow',
      columns: [
        { key: 'name', label: 'Nazwa', type: 'text' },
        { key: 'details', label: 'Szczegoly', type: 'expandable' },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [],
        },
      ],
      records: [{ id: '1', name: 'Alfa', details: 'Rozwin' }],
      dataTestId: 'table-list',
      ...props,
    } as never,
    slots: {
      'detials-record': ({ record }: { record: Record<string, any> }) =>
        h('div', { 'data-testid': 'expanded-content' }, record.name),
    },
    global: {
      stubs: {
        ButtonAction: ButtonActionStub,
        ModalDialog: ModalDialogStub,
        GridItem: GridItemStub,
        GridSection: GridSectionStub,
        EmptyState: InfoDescriptionStub,
        SectionHeading: SectionHeadingStub,
        SpinnerLoader: SpinnerLoaderStub,
        SvgIcon: true,
        TableBodyActionsColumn: TableBodyActionsColumnStub,
        TableBodyAddtionalRow: TableBodyAddtionalRowStub,
        TableBodyCheckColumn: TableBodyCheckColumnStub,
        TableBodyColumn: TableBodyExpandableColumnStub,
        TableBodyEditableActionsColumn: TableBodyEditableActionsColumnStub,
        TableBodyEditableColumn: TableBodyEditableColumnStub,
        TableBodyEditableCreateRecordRow: TableBodyEditableCreateRecordRowStub,
        TableBodySelectColumn: TableBodySelectColumnStub,
        TableHeadActionsColumn: TableHeadActionsColumnStub,
        TableHeadColumn: TableHeadColumnStub,
        TableHeadSelectColumn: TableHeadSelectColumnStub,
      },
    },
  });
}

function factoryWithLockingStubs(props?: Partial<InstanceType<typeof TableList>['$props']>) {
  return mount(TableList, {
    props: {
      ariaLabel: 'Tabela rekordow',
      columns: [
        { key: 'name', label: 'Nazwa', type: 'text', width: 220, withLock: true },
        { key: 'status', label: 'Status', type: 'text', width: 120, withLock: true },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [{ key: 'edit', label: 'Edytuj', icon: 'edit' }],
        },
      ],
      records: [{ id: '1', name: 'Alfa', status: 'Aktywny' }],
      dataTestId: 'table-list',
      ...props,
    } as never,
    global: {
      stubs: {
        ButtonAction: ButtonActionStub,
        ModalDialog: ModalDialogStub,
        GridItem: GridItemStub,
        GridSection: GridSectionStub,
        EmptyState: InfoDescriptionStub,
        SectionHeading: SectionHeadingStub,
        SpinnerLoader: SpinnerLoaderStub,
        SvgIcon: true,
        TableBodyActionsColumn: TableBodyActionsColumnStub,
        TableBodyAddtionalRow: TableBodyAddtionalRowStub,
        TableBodyCheckColumn: TableBodyCheckColumnStub,
        TableBodyColumn: TableBodyColumnLockStub,
        TableBodyEditableActionsColumn: TableBodyEditableActionsColumnStub,
        TableBodyEditableColumn: TableBodyEditableColumnLockStub,
        TableBodyEditableCreateRecordRow: TableBodyEditableCreateRecordRowStub,
        TableBodySelectColumn: TableBodySelectColumnStub,
        TableHeadActionsColumn: TableHeadActionsColumnStub,
        TableHeadColumn: TableHeadColumnLockStub,
        TableHeadSelectColumn: TableHeadSelectColumnStub,
      },
    },
  });
}

function factoryWithManyLockingStubs(props?: Partial<InstanceType<typeof TableList>['$props']>) {
  return mount(TableList, {
    props: {
      ariaLabel: 'Tabela rekordow',
      columns: [
        { key: 'name', label: 'Nazwa', type: 'text', width: 120, withLock: true },
        { key: 'status', label: 'Status', type: 'text', width: 120, withLock: true },
        { key: 'city', label: 'Miasto', type: 'text', width: 120, withLock: true },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [{ key: 'edit', label: 'Edytuj', icon: 'edit' }],
        },
      ],
      records: [{ id: '1', name: 'Alfa', status: 'Aktywny', city: 'Warszawa' }],
      dataTestId: 'table-list',
      ...props,
    } as never,
    global: {
      stubs: {
        ButtonAction: ButtonActionStub,
        ModalDialog: ModalDialogStub,
        GridItem: GridItemStub,
        GridSection: GridSectionStub,
        EmptyState: InfoDescriptionStub,
        SectionHeading: SectionHeadingStub,
        SpinnerLoader: SpinnerLoaderStub,
        SvgIcon: true,
        TableBodyActionsColumn: TableBodyActionsColumnStub,
        TableBodyAddtionalRow: TableBodyAddtionalRowStub,
        TableBodyCheckColumn: TableBodyCheckColumnStub,
        TableBodyColumn: TableBodyColumnLockStub,
        TableBodyEditableActionsColumn: TableBodyEditableActionsColumnStub,
        TableBodyEditableColumn: TableBodyEditableColumnLockStub,
        TableBodyEditableCreateRecordRow: TableBodyEditableCreateRecordRowStub,
        TableBodySelectColumn: TableBodySelectColumnStub,
        TableHeadActionsColumn: TableHeadActionsColumnStub,
        TableHeadColumn: TableHeadColumnLockStub,
        TableHeadSelectColumn: TableHeadSelectColumnStub,
      },
    },
  });
}

function factoryWithColumnVisibilityStubs(
  props?: Partial<InstanceType<typeof TableList>['$props']>,
) {
  return mount(TableList, {
    props: {
      ariaLabel: 'Tabela rekordow',
      canHideColumns: true,
      columns: [
        { key: 'name', label: 'Nazwa', type: 'text', width: 120 },
        { key: 'status', label: 'Status', type: 'text', width: 120 },
        { key: 'city', label: 'Miasto', type: 'text', width: 120 },
        { key: 'owners', label: 'Opiekunowie', type: 'text', width: 120 },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [{ key: 'edit', label: 'Edytuj', icon: 'edit' }],
        },
      ],
      records: [{ id: '1', name: 'Alfa', status: 'Aktywny', city: 'Warszawa', owners: 'Jan' }],
      dataTestId: 'table-list',
      ...props,
    } as never,
    global: {
      stubs: {
        ButtonAction: ButtonActionStub,
        ModalDialog: ModalDialogStub,
        GridItem: GridItemStub,
        GridSection: GridSectionStub,
        EmptyState: InfoDescriptionStub,
        SectionHeading: SectionHeadingStub,
        SpinnerLoader: SpinnerLoaderStub,
        SvgIcon: true,
        TableBodyActionsColumn: TableBodyActionsColumnStub,
        TableBodyAddtionalRow: TableBodyAddtionalRowStub,
        TableBodyCheckColumn: TableBodyCheckColumnStub,
        TableBodyColumn: TableBodyColumnVisibilityStub,
        TableBodyEditableActionsColumn: TableBodyEditableActionsColumnStub,
        TableBodyEditableColumn: TableBodyEditableColumnStub,
        TableBodyEditableCreateRecordRow: TableBodyEditableCreateRecordRowStub,
        TableBodySelectColumn: TableBodySelectColumnStub,
        TableHeadActionsColumn: TableHeadActionsColumnVisibilityStub,
        TableHeadColumn: TableHeadColumnVisibilityStub,
        TableHeadSelectColumn: TableHeadSelectColumnStub,
      },
    },
  });
}

async function setTableHorizontalViewport(
  wrapper: ReturnType<typeof factoryWithLockingStubs>,
  width: number,
  scrollLeft: number,
) {
  const tableRoot = wrapper.get('[data-testid="table-list"]');
  const rootElement = tableRoot.element as HTMLDivElement;

  Object.defineProperty(rootElement, 'clientWidth', {
    configurable: true,
    value: width,
  });

  Object.defineProperty(rootElement, 'scrollLeft', {
    configurable: true,
    value: scrollLeft,
    writable: true,
  });

  rootElement.scrollLeft = scrollLeft;

  await tableRoot.trigger('scroll');
  await flushPromises();
}

describe('TableList (index.vue)', () => {
  it('renders BEM root, table semantics and derived data test ids', () => {
    const wrapper = factory({ scroll: true });

    expect(wrapper.get('[data-testid="table-list"]').classes()).toContain('peaui-table-list');
    expect(wrapper.get('[data-testid="table-list"]').attributes('role')).toBe('region');
    expect(wrapper.get('[data-testid="table-list"]').attributes('aria-label')).toBe(
      'Tabela rekordow',
    );
    expect(wrapper.get('[data-testid="table-list-table"]').attributes('aria-label')).toBe(
      'Tabela rekordow',
    );
    expect(wrapper.find('[data-testid="table-list-head"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="table-list-body"]').exists()).toBe(true);
  });

  it('renders spinner overlay, sets aria-busy and hides empty state when isLoading=true', () => {
    const wrapper = factory({
      emptyDescription: true,
      isLoading: true,
      records: [],
    });

    expect(wrapper.find('[data-testid="table-list-loader"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="table-list"]').classes()).toContain(
      'peaui-table-list--loading',
    );
    expect(wrapper.get('[data-testid="table-list"]').attributes('aria-busy')).toBe('true');
    expect(wrapper.get('[data-testid="table-list"]').attributes()).not.toHaveProperty('inert');
    expect(wrapper.get('[data-testid="table-list-table"]').attributes()).toHaveProperty('inert');
    expect(wrapper.find('[data-testid="table-list-empty-state"]').exists()).toBe(false);
  });

  it('does not render actions column when there are no available row actions', () => {
    const wrapper = factory();

    expect(wrapper.find('[data-testid="head-actions"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="row-action"]').exists()).toBe(false);
  });

  it('emits sort and select-all events from header controls', async () => {
    const wrapper = factory({ canSelectRows: true, selectedRows: [] });

    await wrapper.get('[data-testid="head-select"]').trigger('click');
    await wrapper.get('[data-testid="head-columns-button-name"]').trigger('click');

    expect(wrapper.emitted('on:select:row')).toEqual([[['1']]]);
    expect(wrapper.emitted('on:sort')).toEqual([['name']]);
  });

  it('emits up to two sort definitions when canMultiSort is enabled', async () => {
    const wrapper = factory({
      canMultiSort: true,
      columns: [
        { key: 'name', label: 'Nazwa', type: 'text', canSort: true },
        { key: 'status', label: 'Status', type: 'text', canSort: true },
        { key: 'city', label: 'Miasto', type: 'text', canSort: true },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [],
        },
      ],
      sortColumns: [{ name: 'ASC' }],
    });

    await wrapper.get('[data-testid="head-columns-button-status"]').trigger('click');

    expect(wrapper.emitted('on:sort')?.[0]).toEqual([[{ status: 'ASC' }, { name: 'ASC' }]]);

    await wrapper.setProps({
      sortColumns: [{ status: 'ASC' }, { name: 'ASC' }],
    });
    await wrapper.get('[data-testid="head-columns-button-status"]').trigger('click');

    expect(wrapper.emitted('on:sort')?.[1]).toEqual([[{ status: 'DESC' }, { name: 'ASC' }]]);

    await wrapper.setProps({
      sortColumns: [{ status: 'DESC' }, { name: 'ASC' }],
    });
    await wrapper.get('[data-testid="head-columns-button-city"]').trigger('click');

    expect(wrapper.emitted('on:sort')?.[2]).toEqual([[{ city: 'ASC' }, { status: 'DESC' }]]);
  });

  it('toggles expanded row when expandable column is clicked', async () => {
    const wrapper = factoryWithExpandableBodyColumn();

    expect(wrapper.find('[data-testid="expanded-content"]').exists()).toBe(false);

    await wrapper.get('[data-testid="expandable-cell-1"]').trigger('click');

    expect(wrapper.find('[data-testid="expanded-content"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="expanded-content"]').text()).toContain('Alfa');

    await wrapper.get('[data-testid="expandable-cell-1"]').trigger('click');

    expect(wrapper.find('[data-testid="expanded-content"]').exists()).toBe(false);
  });

  it('emits edit-inline action when edit action column button is clicked', async () => {
    const record = {
      id: '1',
      name: 'Alfa',
      workflowStatus: 'Aktywny',
    };
    const wrapper = factory({
      columns: [
        { key: 'name', label: 'Nazwa', type: 'text' },
        { key: 'workflowStatus', label: 'Status', type: 'editAction' },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [],
        },
      ],
      records: [record],
    });

    await wrapper.findAll('[data-testid="cell-button"]')[1]!.trigger('click');

    expect(wrapper.emitted('on:action')).toEqual([['1', 'edit-inline', record]]);
  });

  it('emits custom action name for edit action column when actionName is configured', async () => {
    const record = {
      id: '1',
      name: 'Alfa',
      workflowStatus: 'Roboczy',
    };
    const wrapper = factory({
      columns: [
        { key: 'name', label: 'Nazwa', type: 'text' },
        {
          key: 'workflowStatus',
          label: 'Status',
          actionName: 'open-inline-editor',
          type: 'editAction',
        },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [],
        },
      ],
      records: [record],
    });

    await wrapper.findAll('[data-testid="cell-button"]')[1]!.trigger('click');

    expect(wrapper.emitted('on:action')).toEqual([['1', 'open-inline-editor', record]]);
  });

  it('falls back to edit-inline action for edit action column when actionName is not configured', async () => {
    const record = {
      id: '1',
      name: 'Alfa',
      workflowStatus: 'Roboczy',
    };
    const wrapper = factory({
      columns: [
        { key: 'name', label: 'Nazwa', type: 'text' },
        {
          key: 'workflowStatus',
          label: 'Status',
          type: 'editAction',
        },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [],
        },
      ],
      records: [record],
    });

    await wrapper.findAll('[data-testid="cell-button"]')[1]!.trigger('click');

    expect(wrapper.emitted('on:action')).toEqual([['1', 'edit-inline', record]]);
  });

  it('emits custom action name for action column when actionName is configured', async () => {
    const record = {
      id: '1',
      name: 'Alfa',
      open: 'Otworz rekord',
    };
    const wrapper = factory({
      columns: [
        { key: 'name', label: 'Nazwa', type: 'text' },
        {
          key: 'open',
          label: 'Szybka akcja',
          actionLabel: 'Otworz',
          actionName: 'open-details',
          type: 'action',
        },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [],
        },
      ],
      records: [record],
    });

    await wrapper.findAll('[data-testid="cell-button"]')[1]!.trigger('click');

    expect(wrapper.emitted('on:action')).toEqual([['1', 'open-details', record]]);
  });

  it('falls back to edit action for action column when actionName is not configured', async () => {
    const record = {
      id: '1',
      name: 'Alfa',
      open: 'Otworz rekord',
    };
    const wrapper = factory({
      columns: [
        { key: 'name', label: 'Nazwa', type: 'text' },
        {
          key: 'open',
          label: 'Szybka akcja',
          actionLabel: 'Otworz',
          type: 'action',
        },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [],
        },
      ],
      records: [record],
    });

    await wrapper.findAll('[data-testid="cell-button"]')[1]!.trigger('click');

    expect(wrapper.emitted('on:action')).toEqual([['1', 'edit', record]]);
  });

  it('hides selected column from head and body when visibility action is triggered', async () => {
    const wrapper = factoryWithColumnVisibilityStubs();

    expect(wrapper.find('[data-testid="visibility-head-status"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="visibility-body-status"]').exists()).toBe(true);

    await wrapper.get('[data-testid="toggle-column-status"]').trigger('click');

    expect(wrapper.find('[data-testid="visibility-head-status"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="visibility-body-status"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="visibility-head-name"]').exists()).toBe(true);
  });

  it('hides only the selected column when duplicated keys use distinct subKey values', async () => {
    const wrapper = factoryWithColumnVisibilityStubs({
      columns: [
        {
          key: 'status',
          subKey: 'status-primary',
          label: 'Status glowny',
          type: 'text',
          width: 120,
        },
        {
          key: 'status',
          subKey: 'status-secondary',
          label: 'Status dodatkowy',
          type: 'text',
          width: 120,
        },
        { key: 'city', label: 'Miasto', type: 'text', width: 120 },
        { key: 'owners', label: 'Opiekunowie', type: 'text', width: 120 },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [{ key: 'edit', label: 'Edytuj', icon: 'edit' }],
        },
      ],
      records: [
        {
          id: '1',
          status: 'Aktywny',
          city: 'Warszawa',
          owners: 'Jan',
        },
      ],
    });

    expect(wrapper.find('[data-testid="visibility-head-status-primary"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="visibility-head-status-secondary"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="visibility-body-status-primary"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="visibility-body-status-secondary"]').exists()).toBe(true);

    await wrapper.get('[data-testid="toggle-column-status-secondary"]').trigger('click');

    expect(wrapper.find('[data-testid="visibility-head-status-primary"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="visibility-body-status-primary"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="visibility-head-status-secondary"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="visibility-body-status-secondary"]').exists()).toBe(false);
  });

  it('does not hide column when only three visible columns remain', async () => {
    const wrapper = factoryWithColumnVisibilityStubs({
      columns: [
        { key: 'name', label: 'Nazwa', type: 'text', width: 120 },
        { key: 'status', label: 'Status', type: 'text', width: 120 },
        { key: 'city', label: 'Miasto', type: 'text', width: 120 },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [{ key: 'edit', label: 'Edytuj', icon: 'edit' }],
        },
      ],
    });

    await wrapper.get('[data-testid="toggle-column-status"]').trigger('click');

    expect(wrapper.find('[data-testid="visibility-head-status"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="visibility-body-status"]').exists()).toBe(true);
  });

  it('does not hide currently locked column when visibility action is triggered', async () => {
    const wrapper = factoryWithColumnVisibilityStubs({
      columns: [
        { key: 'name', label: 'Nazwa', type: 'text', width: 120 },
        { key: 'status', label: 'Status', type: 'text', width: 120, withLock: true },
        { key: 'city', label: 'Miasto', type: 'text', width: 120 },
        { key: 'owners', label: 'Opiekunowie', type: 'text', width: 120 },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [{ key: 'edit', label: 'Edytuj', icon: 'edit' }],
        },
      ],
    });

    await wrapper.get('[data-testid="visibility-lock-status"]').trigger('click');
    await wrapper.get('[data-testid="toggle-column-status"]').trigger('click');

    expect(wrapper.find('[data-testid="visibility-head-status"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="visibility-body-status"]').exists()).toBe(true);
  });

  it('does not render column visibility controls when canHideColumns is false', () => {
    const wrapper = factoryWithColumnVisibilityStubs({
      canHideColumns: false,
    });

    expect(wrapper.find('[data-testid="head-actions"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="toggle-column-status"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="visibility-head-status"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="visibility-body-status"]').exists()).toBe(true);
  });

  it('checks row on click and keyboard while ignoring interactive descendants', async () => {
    const wrapper = factory({ canCheckRows: true, canSelectRows: false });

    expect(wrapper.get('.peaui-table-list__check-head-cell').text()).toContain(
      'Pole wyboru rekordu',
    );

    await wrapper.get('[data-testid="cell-button"]').trigger('click');
    await wrapper.get('[data-testid="cell-button"]').trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('on:check:row')).toBeUndefined();

    const row = wrapper.get('[data-testid="table-list-row-1"]');

    expect(row.attributes('tabindex')).toBe('0');

    await row.trigger('keydown', { key: 'ArrowDown' });
    expect(wrapper.emitted('on:check:row')).toBeUndefined();

    await row.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('on:check:row')).toHaveLength(1);
    expect(wrapper.emitted('on:check:row')?.[0]?.[0]).toEqual({ id: '1', name: 'Alfa' });

    await row.trigger('keydown', { key: ' ' });
    expect(wrapper.emitted('on:check:row')).toHaveLength(2);
    expect(wrapper.emitted('on:check:row')?.[1]?.[0]).toEqual({ id: '1', name: 'Alfa' });

    await row.trigger('click');
    expect(wrapper.emitted('on:check:row')).toHaveLength(3);
    expect(wrapper.emitted('on:check:row')?.[2]?.[0]).toEqual({ id: '1', name: 'Alfa' });
  });

  it('emits the corrected and legacy row double-click events', async () => {
    const wrapper = factory({ canSelectRows: false });
    const record = { id: '1', name: 'Alfa' };

    await wrapper.get('[data-testid="cell-button"]').trigger('dblclick');

    expect(wrapper.emitted('on:dblclick')).toEqual([['1', record]]);
    expect(wrapper.emitted('on:dbclick')).toEqual([['1', record]]);
  });

  it('renders inline empty row and empty state with create action data test ids', async () => {
    const inlineWrapper = factory({
      records: [],
      emptyDescription: false,
      emptyDescriptionInline: 'Brak danych',
    });

    expect(inlineWrapper.get('[data-testid="table-list-empty-inline"]').text()).toContain(
      'Brak danych',
    );

    const emptyWrapper = factory({
      records: [],
      emptyDescription: true,
    });

    expect(emptyWrapper.find('[data-testid="table-list-empty-state"]').exists()).toBe(true);
    expect(emptyWrapper.find('[data-testid="table-list"]').exists()).toBe(false);
    expect(emptyWrapper.find('[data-testid="table-list-table"]').exists()).toBe(false);
    expect(emptyWrapper.find('[data-testid="table-list-head"]').exists()).toBe(false);
    await emptyWrapper.get('[data-testid="table-list-empty-state-button"]').trigger('click');
    expect(emptyWrapper.emitted('on:createRecord')).toHaveLength(1);
  });

  it('renders delete dialog with header slot as accessible name source and action data test ids', () => {
    const wrapper = factory();

    expect(wrapper.find('[aria-label="Zamknij okno dialogowe"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="table-list-delete-dialog"]').exists()).toBe(true);
    expect(
      wrapper.get('[data-testid="table-list-delete-dialog"]').attributes('aria-labelledby'),
    ).toBe('table-list-delete-dialog-header');
    expect(
      wrapper.get('[data-testid="table-list-delete-dialog"]').attributes('aria-label'),
    ).toBeUndefined();
    expect(wrapper.get('[data-testid="table-list-delete-dialog-header"]').text()).toContain(
      'Czy na pewno chcesz usunąć wybrany rekord?',
    );
    expect(wrapper.find('[data-testid="table-list-delete-cancel"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="table-list-delete-confirm"]').exists()).toBe(true);
    expect(
      wrapper.find('[data-testid="table-list-delete-confirm"]').element.nextElementSibling,
    ).toBe(wrapper.find('[data-testid="table-list-delete-cancel"]').element);
  });

  it('reruns step columns for the updated row after inline select onUpdate', async () => {
    const onUpdate = vi.fn((record: Record<string, any>) => record);
    const steps = vi.fn(() => []);
    const wrapper = factoryWithInlineUpdateBodyColumn({
      columns: [
        {
          key: 'category',
          label: 'Kategoria',
          inline: true,
          type: 'editable',
          manage: {
            options: [
              { label: 'Formalny', value: 'formalny' },
              { label: 'Techniczny', value: 'techniczny' },
            ],
            onUpdate,
            type: 'select',
          },
        },
        {
          key: 'stepper',
          label: 'Etapy',
          type: 'stepper',
          steps,
        },
      ],
      records: [{ category: 'Formalny', id: '1' }],
    });

    await wrapper.get('[data-testid="inline-update-category"]').trigger('click');

    expect(onUpdate).toHaveBeenCalledWith(
      {
        category: 'Techniczny',
        id: '1',
      },
      0,
    );
    expect(steps).toHaveBeenCalledWith({
      category: 'Techniczny',
      id: '1',
    });
    expect(wrapper.emitted('on:changeValue')).toEqual([['1', 'Techniczny']]);
    expect(onUpdate.mock.invocationCallOrder[0]).toBeLessThan(steps.mock.invocationCallOrder[0]);
  });

  it('does not rerun step columns after non-select inline onUpdate', async () => {
    const onUpdate = vi.fn((record: Record<string, any>) => record);
    const steps = vi.fn(() => []);
    const wrapper = factoryWithInlineUpdateBodyColumn({
      columns: [
        {
          key: 'name',
          label: 'Nazwa',
          inline: true,
          type: 'editable',
          manage: {
            onUpdate,
            type: 'text',
          },
        },
        {
          key: 'stepper',
          label: 'Etapy',
          type: 'stepper',
          steps,
        },
      ],
      records: [{ id: '1', name: 'Alfa' }],
    });

    await wrapper.get('[data-testid="inline-update-name"]').trigger('click');

    expect(onUpdate).toHaveBeenCalledWith(
      {
        id: '1',
        name: 'Beta',
      },
      0,
    );
    expect(steps).not.toHaveBeenCalled();
  });

  it('disables select-all checkbox when there are no records', () => {
    const wrapper = factory({
      canSelectRows: true,
      records: [],
      emptyDescription: false,
    });

    expect(wrapper.get('[data-testid="head-select"]').attributes('data-disabled')).toBe('true');
  });

  it('renders editable table with create row when editable mode is enabled', () => {
    const wrapper = factory({
      canSelectRows: false,
      columns: [
        {
          key: 'name',
          label: 'Nazwa',
          type: 'text',
          manage: {
            required: true,
            type: 'text',
          },
        },
        {
          key: 'limit',
          label: 'Limit',
          type: 'text',
          manage: {
            required: true,
            type: 'number',
          },
        },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [{ key: 'edit', label: 'Edytuj', icon: 'edit' }],
        },
      ],
      editable: true,
      records: [{ id: '1', name: 'Alfa', limit: 5 }],
    });

    expect(wrapper.find('[data-testid="table-list-table"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="table-list-create-row"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="table-list-body"]').exists()).toBe(true);
  });

  it('preserves row height when switching an existing row into edit mode', async () => {
    const wrapper = factory({
      canSelectRows: false,
      columns: [
        {
          key: 'name',
          label: 'Nazwa',
          type: 'text',
          manage: {
            required: true,
            type: 'text',
          },
        },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [{ key: 'edit', label: 'Edytuj', icon: 'edit' }],
        },
      ],
      editable: true,
      records: [{ id: '1', name: 'Alfa' }],
    });

    const row = wrapper.get('[data-testid="table-list-row-1"]');
    vi.spyOn(row.element, 'getBoundingClientRect').mockReturnValue({
      bottom: 84,
      height: 84,
      left: 0,
      right: 0,
      toJSON: () => ({}),
      top: 0,
      width: 0,
      x: 0,
      y: 0,
    } as DOMRect);

    await wrapper.get('[data-testid="row-action"]').trigger('click');
    await flushPromises();

    expect(wrapper.get('[data-testid="table-list-row-1"]').classes()).toContain(
      'peaui-table-list__row--editing',
    );
    expect(wrapper.get('[data-testid="table-list-row-1"]').attributes('style')).toContain(
      '--peaui-table-list-editable-row-height: 84px;',
    );
  });

  it('blocks invalid editable submit', async () => {
    const wrapper = factory({
      canSelectRows: false,
      columns: [
        {
          key: 'name',
          label: 'Nazwa',
          type: 'text',
          manage: {
            required: true,
            type: 'text',
          },
        },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [{ key: 'edit', label: 'Edytuj', icon: 'edit' }],
        },
      ],
      editable: true,
      records: [{ id: '1', name: 'Alfa' }],
    });

    await wrapper.get('[data-testid="table-list-create-row"]').trigger('click');
    await wrapper.get('[data-testid="editable-submit"]').trigger('click');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(wrapper.emitted('on:submit')).toBeUndefined();
  });

  it('moves locked columns between right and left sticky edges based on scroll position', async () => {
    const wrapper = factoryWithLockingStubs();

    await setTableHorizontalViewport(wrapper, 300, 0);
    await wrapper.get('[data-testid="lock-toggle-status"]').trigger('click');

    expect(wrapper.get('[data-testid="lock-head-status"]').attributes('data-side')).toBe('right');
    expect(wrapper.get('[data-testid="lock-head-status"]').attributes('data-offset')).toBe('48');
    expect(wrapper.get('[data-testid="lock-body-status"]').attributes('data-side')).toBe('right');
    expect(wrapper.get('[data-testid="lock-body-status"]').attributes('data-offset')).toBe('48');

    await setTableHorizontalViewport(wrapper, 300, 124);

    expect(wrapper.get('[data-testid="lock-head-status"]').attributes('data-side')).toBe('right');
    expect(wrapper.get('[data-testid="lock-head-status"]').attributes('data-offset')).toBe('48');
    expect(wrapper.get('[data-testid="lock-body-status"]').attributes('data-side')).toBe('right');
    expect(wrapper.get('[data-testid="lock-body-status"]').attributes('data-offset')).toBe('48');

    await setTableHorizontalViewport(wrapper, 300, 260);

    expect(wrapper.get('[data-testid="lock-head-status"]').attributes('data-side')).toBe('left');
    expect(wrapper.get('[data-testid="lock-head-status"]').attributes('data-offset')).toBe('0');
    expect(wrapper.get('[data-testid="lock-body-status"]').attributes('data-side')).toBe('left');
    expect(wrapper.get('[data-testid="lock-body-status"]').attributes('data-offset')).toBe('0');

    await setTableHorizontalViewport(wrapper, 300, 420);

    expect(wrapper.get('[data-testid="lock-head-status"]').attributes('data-side')).toBe('left');
    expect(wrapper.get('[data-testid="lock-head-status"]').attributes('data-offset')).toBe('0');
    expect(wrapper.get('[data-testid="lock-body-status"]').attributes('data-side')).toBe('left');
    expect(wrapper.get('[data-testid="lock-body-status"]').attributes('data-offset')).toBe('0');

    await wrapper.get('[data-testid="lock-toggle-status"]').trigger('click');

    expect(
      wrapper.get('[data-testid="lock-head-status"]').attributes('data-offset'),
    ).toBeUndefined();
    expect(
      wrapper.get('[data-testid="lock-body-status"]').attributes('data-offset'),
    ).toBeUndefined();
  });

  it('keeps multiple locked columns sticky at the same time', async () => {
    const wrapper = factoryWithLockingStubs();

    await setTableHorizontalViewport(wrapper, 300, 0);
    await wrapper.get('[data-testid="lock-toggle-name"]').trigger('click');
    await wrapper.get('[data-testid="lock-toggle-status"]').trigger('click');

    expect(wrapper.get('[data-testid="lock-head-name"]').attributes('data-side')).toBe('right');
    expect(wrapper.get('[data-testid="lock-head-name"]').attributes('data-offset')).toBe('168');
    expect(wrapper.get('[data-testid="lock-head-status"]').attributes('data-side')).toBe('right');
    expect(wrapper.get('[data-testid="lock-head-status"]').attributes('data-offset')).toBe('48');

    expect(wrapper.get('[data-testid="lock-body-name"]').attributes('data-side')).toBe('right');
    expect(wrapper.get('[data-testid="lock-body-name"]').attributes('data-offset')).toBe('168');
    expect(wrapper.get('[data-testid="lock-body-status"]').attributes('data-side')).toBe('right');
    expect(wrapper.get('[data-testid="lock-body-status"]').attributes('data-offset')).toBe('48');

    await setTableHorizontalViewport(wrapper, 300, 420);

    expect(wrapper.get('[data-testid="lock-head-name"]').attributes('data-side')).toBe('left');
    expect(wrapper.get('[data-testid="lock-head-status"]').attributes('data-side')).toBe('left');
    expect(wrapper.get('[data-testid="lock-body-name"]').attributes('data-side')).toBe('left');
    expect(wrapper.get('[data-testid="lock-body-status"]').attributes('data-side')).toBe('left');
  });

  it('uses right action offset for locked editable rows when a column leaves viewport on the right', async () => {
    const wrapper = factoryWithLockingStubs({
      canCreate: true,
      canSelectRows: false,
      editable: true,
      records: [{ id: '1', name: 'Alfa', status: 'Aktywny' }],
    });

    await setTableHorizontalViewport(wrapper, 300, 124);
    await wrapper.get('[data-testid="table-list-create-row"]').trigger('click');
    await wrapper.get('[data-testid="lock-toggle-status"]').trigger('click');

    expect(wrapper.get('[data-testid="lock-editable-status"]').attributes('data-side')).toBe(
      'right',
    );
    expect(wrapper.get('[data-testid="lock-editable-status"]').attributes('data-offset')).toBe(
      '84',
    );
  });

  it('keeps all locked columns sticky when several columns are locked near the table end', async () => {
    const wrapper = factoryWithManyLockingStubs();

    await setTableHorizontalViewport(wrapper, 300, 260);
    await wrapper.get('[data-testid="lock-toggle-name"]').trigger('click');
    await wrapper.get('[data-testid="lock-toggle-status"]').trigger('click');
    await wrapper.get('[data-testid="lock-toggle-city"]').trigger('click');

    expect(wrapper.get('[data-testid="lock-head-name"]').attributes('data-side')).toBe('left');
    expect(wrapper.get('[data-testid="lock-head-name"]').attributes('data-offset')).toBe('0');
    expect(wrapper.get('[data-testid="lock-head-status"]').attributes('data-side')).toBe('left');
    expect(wrapper.get('[data-testid="lock-head-status"]').attributes('data-offset')).toBe('120');
    expect(wrapper.get('[data-testid="lock-head-city"]').attributes('data-side')).toBe('left');
    expect(wrapper.get('[data-testid="lock-head-city"]').attributes('data-offset')).toBe('240');

    expect(wrapper.get('[data-testid="lock-body-name"]').attributes('data-side')).toBe('left');
    expect(wrapper.get('[data-testid="lock-body-name"]').attributes('data-offset')).toBe('0');
    expect(wrapper.get('[data-testid="lock-body-status"]').attributes('data-side')).toBe('left');
    expect(wrapper.get('[data-testid="lock-body-status"]').attributes('data-offset')).toBe('120');
    expect(wrapper.get('[data-testid="lock-body-city"]').attributes('data-side')).toBe('left');
    expect(wrapper.get('[data-testid="lock-body-city"]').attributes('data-offset')).toBe('240');
  });

  it('renders validation error for required fields in TableBodyEditableColumn', async () => {
    const wrapper = factoryWithRealEditableColumn({
      canSelectRows: false,
      columns: [
        {
          key: 'name',
          label: 'Nazwa',
          type: 'text',
          manage: {
            required: true,
            type: 'text',
          },
        },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [{ key: 'edit', label: 'Edytuj', icon: 'edit' }],
        },
      ],
      editable: true,
      records: [{ id: '1', name: 'Alfa' }],
    });

    await wrapper.get('[data-testid="table-list-create-row"]').trigger('click');
    await vi.dynamicImportSettled();
    await flushPromises();
    await wrapper.get('[data-testid="editable-submit"]').trigger('click');
    await vi.dynamicImportSettled();
    await flushPromises();

    expect(wrapper.emitted('on:submit')).toBeUndefined();
    expect(
      wrapper.get('[data-testid="table-list-editable-create-field-name-error"]').text(),
    ).toContain('Pole jest wymagane');
  });

  it('keeps validation active after closing and reopening create row', async () => {
    const wrapper = factoryWithRealEditableColumn({
      canSelectRows: false,
      columns: [
        {
          key: 'name',
          label: 'Nazwa',
          type: 'text',
          manage: {
            required: true,
            type: 'text',
          },
        },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [{ key: 'edit', label: 'Edytuj', icon: 'edit' }],
        },
      ],
      editable: true,
      records: [{ id: '1', name: 'Alfa' }],
    });

    await wrapper.get('[data-testid="table-list-create-row"]').trigger('click');
    await vi.dynamicImportSettled();
    await flushPromises();
    await wrapper.get('[data-testid="editable-submit"]').trigger('click');
    await vi.dynamicImportSettled();
    await flushPromises();

    expect(
      wrapper.get('[data-testid="table-list-editable-create-field-name-error"]').text(),
    ).toContain('Pole jest wymagane');

    (wrapper.vm as unknown as { handleCancelEditable: () => void }).handleCancelEditable();
    await flushPromises();

    await wrapper.get('[data-testid="table-list-create-row"]').trigger('click');
    await vi.dynamicImportSettled();
    await flushPromises();
    await wrapper.get('[data-testid="editable-submit"]').trigger('click');
    await vi.dynamicImportSettled();
    await flushPromises();

    expect(
      wrapper.get('[data-testid="table-list-editable-create-field-name-error"]').text(),
    ).toContain('Pole jest wymagane');
  });

  it('updates text field value in TableBodyEditableColumn create row', async () => {
    const wrapper = factoryWithRealEditableColumn({
      canSelectRows: false,
      columns: [
        {
          key: 'name',
          label: 'Nazwa',
          type: 'text',
          manage: {
            required: true,
            type: 'text',
          },
        },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [{ key: 'edit', label: 'Edytuj', icon: 'edit' }],
        },
      ],
      editable: true,
      records: [{ id: '1', name: 'Alfa' }],
    });

    await wrapper.get('[data-testid="table-list-create-row"]').trigger('click');
    await vi.dynamicImportSettled();
    await flushPromises();
    await wrapper
      .get('[data-testid="table-list-editable-create-field-name-element"]')
      .setValue('Beta');
    await vi.dynamicImportSettled();
    await flushPromises();

    expect(
      (
        wrapper.vm as unknown as {
          $: { setupState: { formEditableValues: Record<string, unknown> } };
        }
      ).$.setupState.formEditableValues.name,
    ).toBe('Beta');
    expect(
      wrapper.get<HTMLInputElement>('[data-testid="table-list-editable-create-field-name-element"]')
        .element.value,
    ).toBe('Beta');
  });

  it('keeps remaining validation errors after updating number field', async () => {
    const wrapper = factoryWithRealEditableColumn({
      canSelectRows: false,
      columns: [
        {
          key: 'name',
          label: 'Nazwa',
          type: 'text',
          manage: {
            required: true,
            type: 'text',
          },
        },
        {
          key: 'limit',
          label: 'Limit',
          type: 'text',
          manage: {
            required: true,
            type: 'number',
          },
        },
        {
          key: 'actions',
          label: 'Akcje',
          resolve: () => [{ key: 'edit', label: 'Edytuj', icon: 'edit' }],
        },
      ],
      editable: true,
      records: [{ id: '1', name: 'Alfa', limit: 1 }],
    });

    await wrapper.get('[data-testid="table-list-create-row"]').trigger('click');
    await vi.dynamicImportSettled();
    await flushPromises();
    await wrapper.get('[data-testid="editable-submit"]').trigger('click');
    await vi.dynamicImportSettled();
    await flushPromises();

    expect(
      wrapper.get('[data-testid="table-list-editable-create-field-name-error"]').text(),
    ).toContain('Pole jest wymagane');
    expect(
      wrapper.get('[data-testid="table-list-editable-create-field-limit-error"]').text(),
    ).toContain('Pole jest wymagane');

    const numberInput = wrapper.get<HTMLInputElement>(
      '[data-testid="table-list-editable-create-field-limit-element"]',
    );

    await numberInput.setValue('5');
    await numberInput.trigger('blur');
    await vi.dynamicImportSettled();
    await flushPromises();

    expect(
      (
        wrapper.vm as unknown as {
          $: { setupState: { formEditableValues: Record<string, unknown> } };
        }
      ).$.setupState.formEditableValues.limit,
    ).toBe(5);
    expect(
      wrapper.get('[data-testid="table-list-editable-create-field-name-error"]').text(),
    ).toContain('Pole jest wymagane');
  });
});
