<script lang="ts">
import type { TableColumn, TableManageColumn, TableRecord } from './table.types';
export type * from './table.types';
</script>

<script lang="ts" setup>
import { UIKIT_NAME } from '@/constants';
import { ERROR_MESSAGES } from '@/constants/error.const';
import { mergeArrayObjects } from '@/helpers/array.helper';
import { unflatten } from '@/helpers/object.helper';
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  shallowRef,
  useAttrs,
  useId,
  useSlots,
  watch,
} from 'vue';

import SectionHeading from '@/components/data-display/SectionHeading/index.vue';
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';
import EmptyState from '@/components/feedback/EmptyState/index.vue';
import SpinnerLoader from '@/components/feedback/SpinnerLoader/index.vue';
import ModalDialog from '@/components/overlayer/ModalDialog/index.vue';
import PaginationControl from '@/components/navigation/PaginationControl/index.vue';
import { getTablePage } from './table-page.shared';
import { buildTableLockedColumnsMap } from './table-locking.shared';
import TableBodyActionsColumn from './Elements/TableBodyActionsColumn.vue';
import TableBodyAddtionalRow from './Elements/TableBodyAddtionalRow.vue';
import TableBodyCheckColumn from './Elements/TableBodyCheckColumn.vue';
import TableBodyColumn from './Elements/TableBodyColumn.vue';
import TableBodyEditableActionsColumn from './Elements/TableBodyEditableActionsColumn.vue';
import TableBodyEditableColumn from './Elements/TableBodyEditableColumn.vue';
import TableBodyEditableCreateRecordRow from './Elements/TableBodyEditableCreateRecordRow.vue';
import TableBodySelectColumn from './Elements/TableBodySelectColumn.vue';
import TableHeadActionsColumn from './Elements/TableHeadActionsColumn.vue';
import TableHeadColumn from './Elements/TableHeadColumn.vue';
import TableHeadSelectColumn from './Elements/TableHeadSelectColumn.vue';
import {
  getDeepEditableValue,
  replaceEditableValues,
  setDeepEditableValue,
  validateEditableValue,
} from './editable-validation.shared';
import {
  TABLE_LIST_ACTIONS_STICKY_WIDTH,
  TABLE_LIST_EDITABLE_ACTIONS_STICKY_WIDTH,
  TABLE_LIST_MAX_MULTI_SORTS,
  TABLE_LIST_MIN_VISIBLE_COLUMNS,
  buildTableTestId,
  createTableSortState,
  getTableColumnIdentifier,
  getTableRecordKey,
  getTableRecordIdentity,
  findTableRecordIndex,
  getTableSortKey,
  getTableSortType,
  normalizeTableSortStates,
  type TableLockedColumnMeta,
  type TableSortDirection,
  type TableSortState,
} from './shared';

defineOptions({
  inheritAttrs: false,
});

const classNameComponent = `${UIKIT_NAME}-table-list`;
const tableSelectionScopeId = `table-selection-${useId()}`;
const lockedColumns = ref<Record<string, boolean>>({});
const columnVisibilityOverrides = ref<Record<string, boolean | undefined>>({});

const {
  id,
  ariaLabel = 'Tabela danych',
  canCreate = true,
  canCheckRows = false,
  canHideColumns = false,
  canMultiSort = false,
  canSelectRows = true,
  columns = [],
  editable,
  emptyDescription = true,
  emptyDescriptionInline,
  records = [],
  isDetails,
  isDetials,
  rowsPerPage = 10,
  paginate = false,
  paginationLabel = 'Strony tabeli',
  selectedRows = [],
  sortColumn = 'updatedAt',
  sortColumns = [],
  sortType = 'DESC',
  additional,
  currentCheckedRow,
  buttonEditableCreateText = 'Dodaj',
  titleRemoveLabel = 'Czy na pewno chcesz usunąć wybrany rekord?',
  descriptionRemoveLabel = 'Usunięcie spowoduje trwałe usunięcie rekordu.',
  isLoading = false,
  scroll = false,
  dataTestId,
} = defineProps<{
  id?: string;
  ariaLabel?: string;
  /** Enables expandable detail rows. */
  isDetails?: boolean;
  /** @deprecated Use `isDetails`. */
  isDetials?: boolean;
  additional?: Record<string, unknown>;
  canCreate?: boolean;
  canSelectRows?: boolean;
  canCheckRows?: boolean;
  canHideColumns?: boolean;
  canMultiSort?: boolean;
  columns: TableColumn[];
  editable?: boolean;
  emptyDescription?: boolean;
  emptyDescriptionInline?: string;
  records: Record<string, unknown>[];
  rowsPerPage?: number;
  /** Render one client-side page of records. Leave false for server-side pagination. */
  paginate?: boolean;
  paginationLabel?: string;
  currentCheckedRow?: number | string;
  rowsTotal?: number;
  selectedRows?: string[];
  sortColumn?: string;
  sortColumns?: TableSortState[];
  sortType?: TableSortDirection;
  buttonEditableCreateText?: string;
  titleRemoveLabel?: string;
  descriptionRemoveLabel?: string;
  isLoading?: boolean;
  scroll?: boolean;
  dataTestId?: string;
}>();

const page = defineModel<number>('page', { default: 1 });
const pageRange = computed(() => getTablePage(records.length, page.value, rowsPerPage, paginate));
const pageRecords = computed(() => records.slice(pageRange.value.start, pageRange.value.end));
const visibleRecords = computed(() =>
  pageRecords.value.map((record, index) => ({ record, index: index + pageRange.value.start })),
);

const attrs = useAttrs();
const slots = useSlots();
const isDialogWindowOpen = ref(false);
const currentRecordDelete = ref<{ id?: string | number; record: TableRecord } | null>(null);
const currentEditableAction = ref<'create' | 'update' | undefined>(undefined);
const collapseRecord = ref<string | undefined>(undefined);
const editingRowHeight = ref<number | undefined>(undefined);
const rootReference = ref<HTMLDivElement | null>(null);
const rowReferences = ref<Record<number, HTMLTableRowElement | null>>({});
const horizontalScrollLeft = ref(0);
const horizontalViewportWidth = ref(0);
let rootResizeObserver: ResizeObserver | null = null;
const detailsEnabled = computed(() => isDetails || isDetials);

const emit = defineEmits<{
  (
    e: 'on:action',
    record: string | number | undefined,
    action: string,
    currentRecord?: Record<string, unknown>,
  ): void;
  (e: 'on:createRecord'): void;
  /** Prefer this correctly spelled event for row double-clicks. */
  (
    e: 'on:dblclick',
    record: string | number | undefined,
    currentRecord?: Record<string, unknown>,
  ): void;
  /** @deprecated Use `on:dblclick`. Kept for backwards compatibility. */
  (
    e: 'on:dbclick',
    record: string | number | undefined,
    currentRecord?: Record<string, unknown>,
  ): void;
  (e: 'on:select:row', records: string[]): void;
  (e: 'on:sort', column: string): void;
  (e: 'on:sort', columns: TableSortState[]): void;
  (e: 'on:cancel'): void;
  (e: 'on:check:row', record: Record<string, unknown>): void;
  (e: 'on:submit', record: Record<string, unknown>): void;
  (
    e: 'on:changeValue',
    recordId: string | number | undefined,
    value: string | number | undefined,
  ): void;
}>();

function getDefaultColumnVisibility(columnIdentifier: string): boolean {
  const column = columns.find((entry) => {
    return entry.key !== 'actions' && getTableColumnIdentifier(entry) === columnIdentifier;
  });

  return column?.visible !== false;
}

function getResolvedColumnVisibility(column: TableColumn): boolean {
  const override = columnVisibilityOverrides.value[getTableColumnIdentifier(column)];

  if (override !== undefined) {
    return override;
  }

  return column.visible !== false;
}

const parsedColumns = computed(() =>
  columns
    .filter((column) => column.key !== 'actions')
    .map((column) => ({
      ...column,
      visible: getResolvedColumnVisibility(column),
    })),
);

const visibleDataColumns = computed(() =>
  parsedColumns.value.filter((column) => (column.visible === undefined ? true : column.visible)),
);

const rootClasses = computed(() => [
  classNameComponent,
  {
    [`${classNameComponent}--details`]: detailsEnabled.value,
    [`${classNameComponent}--loading`]: isLoading,
    [`${classNameComponent}--scroll`]: scroll,
  },
]);

const headClasses = computed(() => [
  `${classNameComponent}__head`,
  {
    [`${classNameComponent}__head--sticky`]: scroll,
  },
]);

const headRowClasses = computed(() => [
  `${classNameComponent}__head-row`,
  {
    [`${classNameComponent}__head-row--details`]: detailsEnabled.value,
  },
]);

const normalizedSortColumns = computed(() =>
  canMultiSort ? normalizeTableSortStates(sortColumns) : [],
);

const activeSortColumn = computed(() =>
  canMultiSort ? getTableSortKey(normalizedSortColumns.value[0]) : sortColumn,
);

const activeSortType = computed<TableSortDirection | undefined>(() =>
  canMultiSort ? getTableSortType(normalizedSortColumns.value[0]) : sortType,
);

const activeSortDataType = computed<'asc' | 'desc' | undefined>(() => {
  if (!activeSortType.value) {
    return undefined;
  }

  return activeSortType.value !== 'DESC' ? 'asc' : 'desc';
});

const rootTestId = computed(() => dataTestId);
const tableTestId = computed(() => buildTableTestId(dataTestId, 'table'));
const headTestId = computed(() => buildTableTestId(dataTestId, 'head'));
const bodyTestId = computed(() => buildTableTestId(dataTestId, 'body'));
const emptyStateTestId = computed(() => buildTableTestId(dataTestId, 'empty-state'));
const emptyStateButtonTestId = computed(() => buildTableTestId(dataTestId, 'empty-state-button'));
const dialogTestId = computed(() => buildTableTestId(dataTestId, 'delete-dialog'));
const inlineEmptyTestId = computed(() => buildTableTestId(dataTestId, 'empty-inline'));
const loaderTestId = computed(() => buildTableTestId(dataTestId, 'loader'));
const shouldRenderEmptyState = computed(
  () =>
    !isLoading && !records.length && emptyDescription && currentEditableAction.value !== 'create',
);

const selectedRowKeys = computed(() => new Set(selectedRows.map(String)));
const isAllRecordsOnPageChecked = computed<boolean>({
  get: () =>
    pageRecords.value.length > 0 &&
    pageRecords.value.every((item) => selectedRowKeys.value.has(String(item.id ?? ''))),
  set: (value) => value,
});

const actionsButtonsColumn = computed(() =>
  columns.find((column) => column.key === 'actions' && column.visible !== false),
);

const shouldRenderActionsColumn = computed(() => {
  const column = actionsButtonsColumn.value;

  if (!column || !records.length) {
    return false;
  }

  return records.some((record) => {
    if (column.visibleColumn && !column.visibleColumn(record)) {
      return false;
    }

    const resolvedActions = column.resolve ? column.resolve(record) : [];

    return Array.isArray(resolvedActions) && resolvedActions.length > 0;
  });
});

const headLockedColumns = computed<Record<string, TableLockedColumnMeta>>(() =>
  buildLockedColumnsMap(shouldRenderActionsColumn.value ? TABLE_LIST_ACTIONS_STICKY_WIDTH : 0),
);

const bodyLockedColumns = computed<Record<string, TableLockedColumnMeta>>(() =>
  buildLockedColumnsMap(
    currentEditableAction.value !== 'update' && shouldRenderActionsColumn.value
      ? TABLE_LIST_ACTIONS_STICKY_WIDTH
      : 0,
  ),
);

const editableLockedColumns = computed<Record<string, TableLockedColumnMeta>>(() =>
  buildLockedColumnsMap(TABLE_LIST_EDITABLE_ACTIONS_STICKY_WIDTH),
);

const tableColumnSpan = computed(
  () =>
    visibleDataColumns.value.length +
    (canCheckRows && !editable ? 1 : 0) +
    (canSelectRows && !editable ? 1 : 0) +
    (shouldRenderActionsColumn.value ? 1 : 0),
);

const bindings = computed(() => ({
  ...attrs,
}));

const generateInitialValues = () => ({
  id: undefined as number | undefined,
  ...unflatten(
    mergeArrayObjects(
      parsedColumns.value.map((column) => ({
        [column.key]: ((manage: TableManageColumn) => {
          if (!manage) {
            return '';
          }

          switch (manage.type) {
            case 'number':
              return manage.default ? manage.default : undefined;
            case 'multiselect':
              return [];
            default:
              return '';
          }
        })(column.manage as TableManageColumn),
      })),
    ),
  ),
});

const formEditableValues = reactive<Record<string, unknown>>(generateInitialValues());
const editableErrors = ref<Record<string, string | undefined>>({});
const editedRecordIdentity = shallowRef<unknown>();
const editedRecordIndex = computed(() =>
  currentEditableAction.value === 'update'
    ? findTableRecordIndex(records, editedRecordIdentity.value)
    : -1,
);
watch([editedRecordIndex, pageRange], ([index]) => {
  if (currentEditableAction.value !== 'update') return;
  if (index < 0 || index < pageRange.value.start || index >= pageRange.value.end)
    handleCancelEditable();
  else formEditableValues.id = index;
});

function setFieldValue(field: string, value: unknown): void {
  setDeepEditableValue(formEditableValues, field, value);
  if (editableErrors.value[field]) {
    editableErrors.value[field] = undefined;
  }
}

function resetForm({ values }: { values: Record<string, unknown> }): void {
  replaceEditableValues(formEditableValues, values);
  editableErrors.value = {};
}

function validateEditableForm(): boolean {
  const nextErrors: Record<string, string | undefined> = {};

  visibleDataColumns.value.forEach((column) => {
    const value = getDeepEditableValue(formEditableValues, column.key);
    const error = validateEditableValue(value, column.manage, ERROR_MESSAGES);
    if (error) nextErrors[column.key] = error;
  });

  editableErrors.value = nextErrors;
  return Object.keys(nextErrors).length === 0;
}

watch(
  parsedColumns,
  (nextColumns) => {
    const lockEnabledColumnKeys = new Set(
      nextColumns.filter((column) => column.withLock).map((column) => column.key),
    );

    lockedColumns.value = Object.fromEntries(
      Object.entries(lockedColumns.value).filter(([columnKey]) =>
        lockEnabledColumnKeys.has(columnKey),
      ),
    ) as Record<string, boolean>;
  },
  {
    deep: true,
    immediate: true,
  },
);

watch(
  () => columns,
  (nextColumns) => {
    const availableColumnKeys = new Set(
      nextColumns
        .filter((column) => column.key !== 'actions')
        .map((column) => getTableColumnIdentifier(column)),
    );

    columnVisibilityOverrides.value = Object.fromEntries(
      Object.entries(columnVisibilityOverrides.value).filter(
        ([columnKey, value]) => availableColumnKeys.has(columnKey) && value !== undefined,
      ),
    ) as Record<string, boolean | undefined>;
  },
  {
    deep: true,
    immediate: true,
  },
);

const onSubmit = async (): Promise<void> => {
  if (currentEditableAction.value === 'update') {
    if (editedRecordIndex.value < 0) {
      handleCancelEditable();
      return;
    }
    formEditableValues.id = editedRecordIndex.value;
  }
  if (!validateEditableForm()) return;
  emit('on:submit', { ...formEditableValues });
  handleCancelEditable();
};

function updateHorizontalMetrics(): void {
  horizontalScrollLeft.value = rootReference.value?.scrollLeft ?? 0;
  horizontalViewportWidth.value = rootReference.value?.clientWidth ?? 0;
}

function handleRootScroll(): void {
  updateHorizontalMetrics();
}

function getRowTestId(record: Record<string, unknown>, index: number): string | undefined {
  return buildTableTestId(dataTestId, 'row', getTableRecordKey(record, index));
}

function getVisibleColumns(): TableColumn[] {
  return parsedColumns.value.filter((column) =>
    column.visible === undefined ? true : column.visible,
  );
}

function buildLockedColumnsMap(baseRightOffset = 0): Record<string, TableLockedColumnMeta> {
  return buildTableLockedColumnsMap(
    getVisibleColumns(),
    lockedColumns.value,
    horizontalScrollLeft.value,
    horizontalViewportWidth.value,
    baseRightOffset,
  );
}

function getRowClasses(
  record: Record<string, unknown>,
  index: number,
): Array<string | false | undefined> {
  return [
    `${classNameComponent}__row`,
    canCheckRows && `${classNameComponent}__row--interactive`,
    editable &&
      currentEditableAction.value === 'update' &&
      formEditableValues.id === index &&
      `${classNameComponent}__row--editing`,
    canSelectRows && selectedRowKeys.value.has(String(record.id ?? ''))
      ? `${classNameComponent}__row--selected`
      : undefined,
  ];
}

function setRowReference(element: unknown, index: number): void {
  rowReferences.value[index] = element instanceof HTMLTableRowElement ? element : null;
}

function rememberRowHeight(index: number): void {
  const rowElement = rowReferences.value[index];

  if (!rowElement) {
    editingRowHeight.value = undefined;
    return;
  }

  const { height } = rowElement.getBoundingClientRect();
  editingRowHeight.value = height > 0 ? height : undefined;
}

function getRowStyles(index: number): Record<string, string> | undefined {
  if (
    !editable ||
    currentEditableAction.value !== 'update' ||
    formEditableValues.id !== index ||
    !editingRowHeight.value
  ) {
    return undefined;
  }

  return {
    '--peaui-table-list-editable-row-height': `${editingRowHeight.value}px`,
  };
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      'button, input, select, textarea, a, label, summary, [role="button"], [role="link"], [role="menuitem"]',
    ),
  );
}

function handleCancelEditable(): void {
  editedRecordIdentity.value = undefined;
  resetForm({
    values: generateInitialValues(),
  });

  currentEditableAction.value = undefined;
  editingRowHeight.value = undefined;
  emit('on:cancel');
}

function resetField(field: string, value: undefined): void {
  setFieldValue(field, value);
}

function isRecordValue(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getInlineUpdatedRecord(
  value: string | number | undefined | object,
  column: TableColumn,
  index?: number,
): Record<string, unknown> | undefined {
  if (!column.inline || index === undefined || !records[index]) {
    return undefined;
  }

  return {
    ...records[index],
    ...(isRecordValue(value) ? value : { [column.key]: value }),
  };
}

function rerunStepsForRecord(record: Record<string, unknown> | undefined): void {
  if (!record) {
    return;
  }

  columns.forEach((entry) => {
    if (typeof entry.steps === 'function') {
      entry.steps(record);
    }
  });
}

function handleUpdateValueColumn(
  value: string | number | undefined | object,
  column: TableColumn,
  index?: number,
): void {
  setFieldValue(column.key, value);

  const rawColumnValue = isRecordValue(value) ? value[column.key] : value;
  const emittedValue =
    typeof rawColumnValue === 'string' || typeof rawColumnValue === 'number'
      ? rawColumnValue
      : undefined;
  emit(
    'on:changeValue',
    index === undefined ? undefined : getRecordId(records[index]),
    emittedValue,
  );

  if (column.manage?.onUpdate) {
    const inlineUpdatedRecord = getInlineUpdatedRecord(value, column, index);
    const nextValues = column.manage.onUpdate(
      column.inline ? (inlineUpdatedRecord ?? formEditableValues) : formEditableValues,
      index,
    );

    if (column.inline && column.manage.type === 'select') {
      rerunStepsForRecord(
        isRecordValue(nextValues)
          ? {
              ...(inlineUpdatedRecord ?? {}),
              ...nextValues,
            }
          : inlineUpdatedRecord,
      );
    }

    resetForm({
      values: {
        ...nextValues,
      },
    });
  }
}

function handleCreateEditableRecord(): void {
  currentEditableAction.value = 'create';
  editingRowHeight.value = undefined;

  emit('on:action', 0, 'create', undefined);
  parsedColumns.value.forEach((column) => {
    if (column.manage?.default) {
      setFieldValue(column.key, column.manage.default);
      return;
    }

    const value =
      column.manage?.type === 'number'
        ? undefined
        : column.manage?.type === 'multiselect'
          ? []
          : '';
    setFieldValue(column.key, value);
  });

  if (additional) {
    Object.keys(additional).forEach((key) => setFieldValue(key, additional[key]));
  }
}

function handleEmptyCreateRecord(): void {
  if (editable) handleCreateEditableRecord();
  emit('on:createRecord');
}

function handleToggleSelectAllRows(): void {
  const recordKeys = new Set(pageRecords.value.map((record) => String(record.id ?? '')));
  if (isAllRecordsOnPageChecked.value) {
    emit(
      'on:select:row',
      selectedRows.filter((item) => !recordKeys.has(item)),
    );
    return;
  }

  const toAssign = pageRecords.value
    .filter((record) => !selectedRowKeys.value.has(String(record.id ?? '')))
    .map((record) => String(record.id ?? ''));

  emit('on:select:row', [...selectedRowKeys.value, ...toAssign]);
}

function toggleSortDirection(direction: TableSortDirection): TableSortDirection {
  return direction === 'ASC' ? 'DESC' : 'ASC';
}

function buildNextMultiSort(column: string): TableSortState[] {
  const currentSortColumns = normalizedSortColumns.value;
  const currentSortIndex = currentSortColumns.findIndex(
    (sortState) => getTableSortKey(sortState) === column,
  );

  if (currentSortIndex === 0) {
    const currentDirection = getTableSortType(currentSortColumns[0]) ?? 'ASC';

    return [
      createTableSortState(column, toggleSortDirection(currentDirection)),
      ...currentSortColumns.slice(1),
    ];
  }

  if (currentSortIndex > 0) {
    const currentDirection = getTableSortType(currentSortColumns[currentSortIndex]) ?? 'ASC';
    const nextSortColumns = currentSortColumns.filter((_, index) => index !== currentSortIndex);

    return [createTableSortState(column, currentDirection), ...nextSortColumns].slice(
      0,
      TABLE_LIST_MAX_MULTI_SORTS,
    );
  }

  return [createTableSortState(column, 'ASC'), ...currentSortColumns].slice(
    0,
    TABLE_LIST_MAX_MULTI_SORTS,
  );
}

function handleSort(column: string): void {
  if (!canMultiSort) {
    emit('on:sort', column);
    return;
  }

  emit('on:sort', buildNextMultiSort(column));
}

function getRecordId(record: TableRecord | undefined): string | number | undefined {
  const id = record?.id;
  return typeof id === 'string' || typeof id === 'number' ? id : undefined;
}

function handleRowAction(record: Record<string, unknown>, action: string, index: number): void {
  if (editable) {
    if (action === 'edit') {
      rememberRowHeight(index);

      void nextTick(() => {
        emit('on:action', index, 'beforeEdit', record);
        currentEditableAction.value = 'update';
        editedRecordIdentity.value = getTableRecordIdentity(record);
        resetForm({
          values: {
            ...record,
            id: index,
          },
        });
        emit('on:action', index, action, record);
      });
      return;
    }

    emit('on:action', index, action, record);
    return;
  }

  if (action === 'delete') {
    isDialogWindowOpen.value = true;
    currentRecordDelete.value = {
      id: getRecordId(record),
      record,
    };
    return;
  }

  emit('on:action', getRecordId(record), action, record);
}

function handleOnDeleteSubmit(): void {
  if (currentRecordDelete.value) {
    emit('on:action', currentRecordDelete.value.id, 'delete', currentRecordDelete.value.record);
  }

  isDialogWindowOpen.value = false;
  currentRecordDelete.value = null;
}

function handleToggleCollapseRecord(idValue: string): void {
  collapseRecord.value = collapseRecord.value === idValue ? undefined : idValue;
}

function getResolvedColumnType(record: Record<string, unknown>, column: TableColumn): string {
  if (typeof column.type === 'function') {
    return column.type(record);
  }

  return column.type || 'text';
}

function handleBodyColumnClick(
  record: Record<string, unknown>,
  column: TableColumn,
  collapseId?: string,
): void {
  const resolvedType = getResolvedColumnType(record, column);

  if (resolvedType === 'action') {
    emit('on:action', getRecordId(record), column.actionName || 'edit', record);
    return;
  }

  if (resolvedType === 'editAction' || resolvedType === 'EditActionColumn') {
    emit('on:action', getRecordId(record), column.actionName || 'edit-inline', record);
    return;
  }

  if (resolvedType === 'editable') {
    return;
  }

  if (collapseId) {
    handleToggleCollapseRecord(collapseId);
    return;
  }

  if (column.steps || resolvedType === 'expandable') {
    return;
  }

  emit('on:dbclick', getRecordId(record), record);
}

function handleBodyColumnDblClick(record: Record<string, unknown>, column: TableColumn): void {
  const resolvedType = getResolvedColumnType(record, column);

  if (editable || resolvedType === 'editable' || resolvedType === 'expandable' || column.steps) {
    return;
  }

  emit('on:dblclick', getRecordId(record), record);
  emit('on:dbclick', getRecordId(record), record);
}

function handleToggleLockColumn(columnKey: string): void {
  const column = parsedColumns.value.find((entry) => entry.key === columnKey);

  if (!column?.withLock) {
    return;
  }

  lockedColumns.value = {
    ...lockedColumns.value,
    [columnKey]: !lockedColumns.value[columnKey],
  };

  if (!lockedColumns.value[columnKey]) {
    const { [columnKey]: _, ...restLockedColumns } = lockedColumns.value;
    lockedColumns.value = restLockedColumns;
  }
}

function handleToggleColumnVisibility(columnIdentifier: string, nextVisible: boolean): void {
  if (!canHideColumns) {
    return;
  }

  const column = parsedColumns.value.find((entry) => {
    return getTableColumnIdentifier(entry) === columnIdentifier;
  });

  if (!column) {
    return;
  }

  const isVisible = column.visible === undefined ? true : column.visible;
  const isLocked = Boolean(
    lockedColumns.value[getTableColumnIdentifier(column)] ?? lockedColumns.value[column.key],
  );

  if (!nextVisible && isVisible) {
    if (isLocked || visibleDataColumns.value.length <= TABLE_LIST_MIN_VISIBLE_COLUMNS) {
      return;
    }
  }

  const defaultVisible = getDefaultColumnVisibility(columnIdentifier);

  columnVisibilityOverrides.value = {
    ...columnVisibilityOverrides.value,
    [columnIdentifier]: nextVisible === defaultVisible ? undefined : nextVisible,
  };
}

function canHandleRowSelection(event: Event): boolean {
  return canCheckRows && !editable && !isInteractiveTarget(event.target);
}

function getRowTabIndex(): number | undefined {
  return canCheckRows && !editable ? 0 : undefined;
}

function handleRowClick(event: MouseEvent, record: Record<string, unknown>): void {
  if (!canHandleRowSelection(event)) {
    return;
  }

  emit('on:check:row', record);
}

function handleRowKeydown(event: KeyboardEvent, record: Record<string, unknown>): void {
  if (!['Enter', ' ', 'Spacebar'].includes(event.key)) {
    return;
  }

  if (!canHandleRowSelection(event)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  emit('on:check:row', record);
}

defineExpose({
  handleCancelEditable,
  resetField,
});

onMounted(() => {
  updateHorizontalMetrics();

  if (rootReference.value) {
    rootReference.value.addEventListener('scroll', handleRootScroll, {
      passive: true,
    });
  }

  if (typeof ResizeObserver !== 'undefined' && rootReference.value) {
    rootResizeObserver = new ResizeObserver(() => {
      updateHorizontalMetrics();
    });
    rootResizeObserver.observe(rootReference.value);
  }
});

onBeforeUnmount(() => {
  rootReference.value?.removeEventListener('scroll', handleRootScroll);
  rootResizeObserver?.disconnect();
});

watch(
  [visibleDataColumns, currentEditableAction, shouldRenderActionsColumn],
  async () => {
    await nextTick();
    updateHorizontalMetrics();
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>

<template>
  <div
    v-if="!shouldRenderEmptyState"
    ref="rootReference"
    v-bind="bindings"
    :class="rootClasses"
    :data-testid="rootTestId"
    :aria-busy="isLoading ? 'true' : undefined"
    :role="scroll ? 'region' : undefined"
    :aria-label="scroll ? ariaLabel : undefined"
    :tabindex="scroll ? 0 : undefined"
  >
    <SpinnerLoader v-if="isLoading" :dataTestId="loaderTestId" />

    <table
      v-bind:id="id ?? tableSelectionScopeId.replace('table-selection-', 'table-')"
      :class="`${classNameComponent}__table`"
      :data-testid="tableTestId"
      :data-sort-by-column="activeSortColumn"
      :data-sort-type="activeSortDataType"
      :aria-label="ariaLabel"
      :inert="isLoading"
    >
      <thead :class="headClasses" :data-testid="headTestId">
        <tr :class="headRowClasses">
          <th v-if="canCheckRows" :class="`${classNameComponent}__check-head-cell`">
            <span :class="`${classNameComponent}__sr-only`">Pole wyboru rekordu</span>
          </th>

          <TableHeadSelectColumn
            v-if="canSelectRows && !editable"
            :dataTestId="buildTableTestId(dataTestId, 'select-all')"
            :disabled="records.length === 0"
            :is-all-selected="isAllRecordsOnPageChecked"
            :is-partially-selected="
              !isAllRecordsOnPageChecked &&
              pageRecords.some((record) => selectedRowKeys.has(String(record.id ?? '')))
            "
            @on:toggle:select:row="handleToggleSelectAllRows"
          />

          <TableHeadColumn
            :can-multi-sort="canMultiSort"
            :columns="parsedColumns"
            :dataTestId="buildTableTestId(dataTestId, 'columns')"
            :editable
            :locked-columns="headLockedColumns"
            :locked-state="lockedColumns"
            :sort-column="sortColumn"
            :sort-columns="normalizedSortColumns"
            :sort-type="sortType"
            @on:lock="handleToggleLockColumn"
            @on:sort="handleSort"
          >
            <template v-if="canHideColumns && !shouldRenderActionsColumn" #actions>
              <TableHeadActionsColumn
                as="div"
                :can-hide-columns="canHideColumns"
                :columns="parsedColumns"
                :dataTestId="buildTableTestId(dataTestId, 'actions-head')"
                :locked-state="lockedColumns"
                @on:toggle:column="handleToggleColumnVisibility"
              />
            </template>
            <template #hint="{ column }">
              <slot v-if="column" :name="[`hint.${column.key}`]">
                {{ column.hintColumn || column.label }}
              </slot>
            </template>
          </TableHeadColumn>

          <TableHeadActionsColumn
            v-if="shouldRenderActionsColumn"
            :can-hide-columns="canHideColumns"
            :columns="parsedColumns"
            :dataTestId="buildTableTestId(dataTestId, 'actions-head')"
            :locked-state="lockedColumns"
            @on:toggle:column="handleToggleColumnVisibility"
          />
        </tr>
      </thead>

      <tbody :class="`${classNameComponent}__body`" :data-testid="bodyTestId">
        <template
          v-for="{ record, index } in visibleRecords"
          :key="getTableRecordKey(record, index)"
        >
          <tr
            :ref="(element) => setRowReference(element, index)"
            :class="getRowClasses(record, index)"
            :data-testid="getRowTestId(record, index)"
            :data-id="record?.id"
            :style="getRowStyles(index)"
            :tabindex="getRowTabIndex()"
            @click="handleRowClick($event, record)"
            @keydown="handleRowKeydown($event, record)"
          >
            <TableBodyCheckColumn
              v-if="canCheckRows && !editable"
              :dataTestId="buildTableTestId(dataTestId, 'check', getTableRecordKey(record, index))"
              :id="String(getRecordId(record) ?? '')"
              :row="currentCheckedRow"
              :table-scope-id="tableSelectionScopeId"
              @on:check:row="emit('on:check:row', record)"
            />

            <TableBodySelectColumn
              v-if="canSelectRows && !editable"
              :dataTestId="buildTableTestId(dataTestId, 'select', getTableRecordKey(record, index))"
              :id="String(record.id ?? '')"
              :selected="canSelectRows ? selectedRowKeys.has(String(record.id ?? '')) : false"
              :selected-rows="selectedRows"
              :table-scope-id="tableSelectionScopeId"
              @on:select:row="(selected) => emit('on:select:row', selected)"
            />

            <template v-if="formEditableValues.id !== index">
              <TableBodyColumn
                v-for="(column, columnIndex) in visibleDataColumns"
                :key="`${record?.id ?? index}-${getTableColumnIdentifier(column)}-${columnIndex}`"
                :column
                :dataTestId="
                  buildTableTestId(
                    dataTestId,
                    'record',
                    getTableRecordKey(record, index),
                    getTableColumnIdentifier(column),
                  )
                "
                :index
                :is-expanded="collapseRecord === String(record?.id ?? '')"
                :locked-column="bodyLockedColumns[column.key]"
                :record
                @dblclick="handleBodyColumnDblClick(record, column)"
                @on:click="
                  (collapseId: string) => handleBodyColumnClick(record, column, collapseId)
                "
                @on:update="
                  (value, currentColumn) => handleUpdateValueColumn(value, currentColumn, index)
                "
              />
            </template>
            <TableBodyEditableColumn
              v-if="formEditableValues.id === index && currentEditableAction === 'update'"
              :columns="parsedColumns"
              :dataTestId="
                buildTableTestId(dataTestId, 'editable-row', getTableRecordKey(record, index))
              "
              :errors="editableErrors"
              :form-values="formEditableValues"
              :locked-columns="editableLockedColumns"
              @on:update="handleUpdateValueColumn"
            />

            <TableBodyActionsColumn
              v-if="
                shouldRenderActionsColumn &&
                actionsButtonsColumn &&
                currentEditableAction !== 'update' &&
                formEditableValues.id !== index
              "
              :actions-buttons-column="actionsButtonsColumn"
              :dataTestId="
                buildTableTestId(dataTestId, 'actions', getTableRecordKey(record, index))
              "
              :record
              @on:fire:action="(action: string) => handleRowAction(record, action, index)"
            />

            <TableBodyEditableActionsColumn
              v-if="
                editable && currentEditableAction === 'update' && formEditableValues.id === index
              "
              :dataTestId="
                buildTableTestId(dataTestId, 'editable-actions', getTableRecordKey(record, index))
              "
              @on:cancel:action="handleCancelEditable"
              @on:submit:update="onSubmit"
            />
          </tr>

          <Transition name="fade-in">
            <tr
              v-if="collapseRecord === String(record?.id ?? '') && record?.id !== undefined"
              :class="`${classNameComponent}__expanded-row`"
            >
              <td :class="`${classNameComponent}__expanded-cell`" :colspan="tableColumnSpan">
                <slot v-if="slots['details-record']" :record name="details-record" />
                <slot v-else :record name="detials-record" />
              </td>
            </tr>
          </Transition>
        </template>

        <TableBodyEditableCreateRecordRow
          v-if="editable && currentEditableAction !== 'create' && canCreate"
          :button-text="buttonEditableCreateText"
          :colspan="tableColumnSpan"
          :current-editable-action="currentEditableAction"
          :dataTestId="buildTableTestId(dataTestId, 'create-row')"
          @on:create="handleCreateEditableRecord"
        />

        <tr
          v-if="editable && currentEditableAction === 'create'"
          :class="`${classNameComponent}__row`"
        >
          <TableBodyEditableColumn
            :columns="parsedColumns"
            :dataTestId="buildTableTestId(dataTestId, 'editable-create')"
            :errors="editableErrors"
            :form-values="formEditableValues"
            :locked-columns="editableLockedColumns"
            @on:update="handleUpdateValueColumn"
          />

          <TableBodyEditableActionsColumn
            v-if="editable && currentEditableAction === 'create'"
            :dataTestId="buildTableTestId(dataTestId, 'editable-create-actions')"
            @on:cancel:action="handleCancelEditable"
            @on:submit:update="onSubmit"
          />
        </tr>

        <tr v-if="emptyDescriptionInline && !records.length">
          <td
            :class="`${classNameComponent}__empty-inline-cell`"
            :colspan="tableColumnSpan"
            :data-testid="inlineEmptyTestId"
          >
            {{ emptyDescriptionInline || 'Brak rekordów do wyświetlenia.' }}
          </td>
        </tr>

        <TableBodyAddtionalRow v-if="slots.additionalRow">
          <slot name="additionalRow" />
        </TableBodyAddtionalRow>
      </tbody>
    </table>
    <div
      v-if="paginate && pageRange.totalPages > 1"
      :class="`${classNameComponent}__pagination`"
      :inert="isLoading || currentEditableAction !== undefined"
    >
      <PaginationControl
        :ariaLabel="paginationLabel"
        :page="pageRange.page"
        :total-pages="pageRange.totalPages"
        @update:page="page = $event"
      />
    </div>
  </div>

  <EmptyState
    v-if="shouldRenderEmptyState"
    role="status"
    :dataTestId="emptyStateTestId"
    description="Nie znaleziono żadnych rekordów. Dodaj nowy rekord lub zmień kryteria wyszukiwania."
    title="Lista jest pusta"
  >
    <template #additional>
      <ButtonAction
        v-if="canCreate"
        :dataTestId="emptyStateButtonTestId"
        ariaLabel="Dodaj nowy rekord"
        size="xs"
        variant="secondary"
        @click="handleEmptyCreateRecord"
      >
        Dodaj nowy rekord
      </ButtonAction>
    </template>
  </EmptyState>

  <ModalDialog
    v-model:open="isDialogWindowOpen"
    :dataTestId="dialogTestId"
    ariaLabel="Potwierdzenie usuniecia rekordu"
  >
    <template #header>
      <div :class="`${classNameComponent}__dialog-header`">
        <SectionHeading size="m">
          <template #title>
            <span :class="`${classNameComponent}__dialog-title`">
              {{
                titleRemoveLabel.replace(
                  '${name}',
                  typeof currentRecordDelete?.record.name === 'string'
                    ? currentRecordDelete.record.name
                    : '',
                )
              }}
            </span>
          </template>
        </SectionHeading>
      </div>
    </template>

    <div :class="`${classNameComponent}__dialog`">
      <div :class="`${classNameComponent}__dialog-content`">
        <p :class="`${classNameComponent}__dialog-description`">
          {{ descriptionRemoveLabel }}
        </p>

        <div :class="`${classNameComponent}__dialog-actions`">
          <ButtonAction
            :dataTestId="buildTableTestId(dataTestId, 'delete-confirm')"
            size="xs"
            ariaLabel="Tak"
            @click="handleOnDeleteSubmit"
          >
            Tak
          </ButtonAction>

          <ButtonAction
            :dataTestId="buildTableTestId(dataTestId, 'delete-cancel')"
            size="xs"
            variant="secondary"
            ariaLabel="Nie"
            @click="isDialogWindowOpen = false"
          >
            Nie
          </ButtonAction>
        </div>
      </div>
    </div>
  </ModalDialog>
</template>
