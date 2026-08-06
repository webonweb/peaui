<script lang="ts">
export interface TableManageColumn {
  default?: string | number;
  disabled?: boolean;
  integer?: boolean;
  max?: number | ((record: Record<string, any>) => number);
  maxLength?: number;
  min?: number;
  onUpdate?: (record: any, index?: number) => any;
  options?: any[] | ((record: Record<string, any>, options?: any[]) => any[]);
  placement?: 'top' | 'bottom' | 'left' | 'right';
  required?: boolean;
  step?: number;
  canWrite?: boolean;
  withSelectAll?: boolean;
  placeholder?: string;
  type: 'select' | 'number' | 'text' | 'multiselect';
  mask?: string;
  regex?: RegExp;
}

type WithOverrides<Base, Overrides extends Partial<Record<keyof Base, unknown>> = {}> = Omit<
  Base,
  keyof Overrides
> &
  Overrides;

type PrimitiveRecord = Record<string, string | number | boolean>;
type TableColumnType =
  | 'array'
  | 'date'
  | 'edit'
  | 'editAction'
  | 'EditActionColumn'
  | 'editable'
  | 'expandable'
  | 'empty'
  | 'index'
  | 'link'
  | 'status'
  | 'stepper'
  | 'tag'
  | 'text'
  | 'action'
  | ((record: Record<string, any>) => string);

export type TableStepperStepStatus = 'default' | 'current' | 'disabled' | 'complete';
export type TableTagVariant = 'blue' | 'green' | 'red' | 'orange' | 'grey' | 'violet' | 'outline';

export interface TableStepperStepCollapse {
  activeElements: number;
  count: number;
}

export interface TableStepperStep {
  collapse?: TableStepperStepCollapse;
  isSeparate?: boolean;
  key: string;
  label: string;
  onRedirect?: () => void;
  status: TableStepperStepStatus;
}

export interface TableColumnBase {
  actionName?: string;
  canCopy?: boolean;
  withLock?: boolean;
  border?: 'left' | 'right';
  canSort?: boolean;
  deep?: string;
  hint?: boolean;
  key: string;
  label: string;
  manage?: TableManageColumn;
  subKey?: string;
  statusDictionary?: Record<string, TableTagVariant>;
  visible?: boolean;
  inline?: boolean;
  resolve?: (
    data: PrimitiveRecord,
  ) => Record<string, string>[] | Record<string, Record<string, string | undefined>[]>;
  steps?: <T = Record<string, any>>(record: T, collapse?: boolean) => TableStepperStep[];
  template?: <TEntry, TRecord = Record<string, any>>(
    entry: string | TEntry,
    record?: TRecord,
  ) => string;
  type?: TableColumnType;
  visibleColumn?: (record: Record<string, unknown>) => boolean;
  width?: number;
  actionLabel?: string;
  hintColumn?: string;
}

export type TableColumn<
  Overrides extends Partial<Record<keyof TableColumnBase, unknown>> = {},
  Extra extends Record<string, unknown> = {},
> = WithOverrides<TableColumnBase, Overrides> & Extra;
</script>

<script lang="ts" setup>
import { UIKIT_NAME } from '@/constants';
import { ERROR_MESSAGES } from '@/constants/error.const';
import { mergeArrayObjects } from '@/helpers/array.helper';
import { unflatten } from '@/helpers/object.helper';
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  useSlots,
  watch,
} from 'vue';
import { array, number, object, string, type ObjectShape } from 'yup';

import SectionHeading from '@/components/data-display/SectionHeading/index.vue';
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';
import EmptyState from '@/components/feedback/EmptyState/index.vue';
import SpinnerLoader from '@/components/feedback/SpinnerLoader/index.vue';
import ModalDialog from '@/components/overlayer/ModalDialog/index.vue';
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
  TABLE_LIST_ACTIONS_STICKY_WIDTH,
  TABLE_LIST_DEFAULT_COLUMN_WIDTH,
  TABLE_LIST_EDITABLE_ACTIONS_STICKY_WIDTH,
  TABLE_LIST_MAX_MULTI_SORTS,
  TABLE_LIST_MIN_VISIBLE_COLUMNS,
  buildTableTestId,
  createTableSortState,
  getTableColumnIdentifier,
  getTableRecordKey,
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
  id = 'list',
  ariaLabel = 'Tabela danych',
  canCreate = true,
  canCheckRows = false,
  canHideColumns = false,
  canMultiSort = false,
  canSelectRows = true,
  columns,
  editable,
  emptyDescription = true,
  emptyDescriptionInline,
  records,
  isDetials,
  rowsPerPage = 10,
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
  isDetials?: boolean;
  additional?: Record<string, any>;
  canCreate?: boolean;
  canSelectRows?: boolean;
  canCheckRows?: boolean;
  canHideColumns?: boolean;
  canMultiSort?: boolean;
  columns: TableColumn[] | any[];
  editable?: boolean;
  emptyDescription?: boolean;
  emptyDescriptionInline?: string;
  records: any[];
  rowsPerPage?: number;
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

const attrs = useAttrs();
const slots = useSlots();
const isDialogWindowOpen = ref(false);
const currentRecordDelete = ref<Record<string, any> | null>(null);
const currentEditableAction = ref<'create' | 'update' | undefined>(undefined);
const collapseRecord = ref<string | undefined>(undefined);
const editingRowHeight = ref<number | undefined>(undefined);
const rootReference = ref<HTMLDivElement | null>(null);
const rowReferences = ref<Record<number, HTMLTableRowElement | null>>({});
const horizontalScrollLeft = ref(0);
const horizontalViewportWidth = ref(0);
let rootResizeObserver: ResizeObserver | null = null;

const emit = defineEmits<{
  (
    e: 'on:action',
    record: string | number | undefined,
    action: string,
    currentRecord?: Record<string, any>,
  ): void;
  (e: 'on:createRecord'): void;
  /** Prefer this correctly spelled event for row double-clicks. */
  (
    e: 'on:dblclick',
    record: string | number | undefined,
    currentRecord?: Record<string, any>,
  ): void;
  /** @deprecated Use `on:dblclick`. Kept for backwards compatibility. */
  (e: 'on:dbclick', record: string | number | undefined, currentRecord?: Record<string, any>): void;
  (e: 'on:select:row', records: string[]): void;
  (e: 'on:sort', column: string): void;
  (e: 'on:sort', columns: TableSortState[]): void;
  (e: 'on:cancel'): void;
  (e: 'on:check:row', record: Record<string, any>): void;
  (e: 'on:submit', record: Record<string, any>): void;
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
    [`${classNameComponent}--details`]: isDetials,
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
    [`${classNameComponent}__head-row--details`]: isDetials,
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
const shouldRenderEmptyState = computed(() => !isLoading && !records.length && emptyDescription);

const isAllRecordsOnPageChecked = computed<boolean>({
  get: () =>
    records.filter((item) => selectedRows.includes(item.id as string)).length ===
    (records.length < rowsPerPage ? records.length : rowsPerPage),
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

const generateInitialValuesValidation = () => {
  const shape = unflatten(
    mergeArrayObjects(
      visibleDataColumns.value
        .filter((column) => column.manage && column.manage.required)
        .map((column) => ({
          [column.key]: ((manage: TableManageColumn) => {
            if (!manage) {
              return '';
            }

            switch (manage.type) {
              case 'number':
                return number()
                  .transform((value: any) => (isNaN(value) ? undefined : value))
                  .test('is-required', ERROR_MESSAGES.required, (value: number | undefined) => {
                    return !column.manage?.required
                      ? true
                      : value === 0
                        ? true
                        : value !== undefined && value !== null && !isNaN(value);
                  });
              case 'multiselect':
                return array().test(
                  'is-required',
                  ERROR_MESSAGES.required,
                  (value: unknown[] | undefined) => {
                    return !column.manage?.required
                      ? true
                      : Array.isArray(value) && value.length > 0;
                  },
                );
              default:
                return string().test('is-required', ERROR_MESSAGES.required, (value) => {
                  if (column.manage?.mask && column.manage.regex) {
                    return new RegExp(column.manage.regex).test(value || '');
                  }

                  return column.manage?.required ? (value || '').trim() !== '' : true;
                });
            }
          })(column.manage as TableManageColumn),
        })),
    ),
    (value) => object(value as ObjectShape),
  ) as ObjectShape;

  return object(shape);
};

const validationSchema = computed(() => toTypedSchema(generateInitialValuesValidation()));

const {
  handleSubmit,
  errors,
  setFieldValue,
  values: formEditableValues,
  resetForm,
} = useForm<any>({
  initialValues: generateInitialValues(),
  validationSchema,
  validateOnMount: false,
  keepValuesOnUnmount: false,
});

const editableErrors = ref<Record<string, string | undefined>>({});

watch(
  errors,
  (nextErrors) => {
    editableErrors.value = {
      ...nextErrors,
    };
  },
  {
    deep: true,
    immediate: true,
  },
);

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

const onSubmit = handleSubmit(async (values) => {
  emit('on:submit', values as Record<string, any>);
  handleCancelEditable();
});

function updateHorizontalMetrics(): void {
  horizontalScrollLeft.value = rootReference.value?.scrollLeft ?? 0;
  horizontalViewportWidth.value = rootReference.value?.clientWidth ?? 0;
}

function handleRootScroll(): void {
  updateHorizontalMetrics();
}

function getRowTestId(record: Record<string, any>, index: number): string | undefined {
  return buildTableTestId(dataTestId, 'row', getTableRecordKey(record, index));
}

function getColumnWidth(column: TableColumn): number {
  return column.width ?? TABLE_LIST_DEFAULT_COLUMN_WIDTH;
}

function getVisibleColumns(): TableColumn[] {
  return parsedColumns.value.filter((column) =>
    column.visible === undefined ? true : column.visible,
  );
}

function buildLockedColumnsMap(baseRightOffset = 0): Record<string, TableLockedColumnMeta> {
  const nextLockedColumns: Record<string, TableLockedColumnMeta> = {};
  const visibleColumns = getVisibleColumns();
  const viewportLeft = horizontalScrollLeft.value;
  const viewportRight = horizontalScrollLeft.value + horizontalViewportWidth.value;
  const lockedColumnsPositions = visibleColumns.map((column, index) => {
    const width = getColumnWidth(column);
    const start = visibleColumns
      .slice(0, index)
      .reduce((sum, currentColumn) => sum + getColumnWidth(currentColumn), 0);

    return {
      column,
      end: start + width,
      start,
      width,
    };
  });
  const activeLockedColumns = lockedColumnsPositions.filter(
    ({ column }) => column.withLock && lockedColumns.value[column.key],
  );
  let leftOffset = 0;
  let rightOffset = baseRightOffset;

  function assignLeft(columnKey: string, width: number): void {
    nextLockedColumns[columnKey] = {
      offset: leftOffset,
      side: 'left',
    };
    leftOffset += width;
  }

  function assignRight(columnKey: string, width: number): void {
    nextLockedColumns[columnKey] = {
      offset: rightOffset,
      side: 'right',
    };
    rightOffset += width;
  }

  function getPreferredSide({ end, start }: { end: number; start: number }): 'left' | 'right' {
    const leftBoundary = viewportLeft + leftOffset;
    const rightBoundary = viewportRight - rightOffset;

    if (start < leftBoundary) {
      return 'left';
    }

    if (end > rightBoundary) {
      return 'right';
    }

    const distanceToLeft = Math.abs(start - leftBoundary);
    const distanceToRight = Math.abs(rightBoundary - end);

    return distanceToLeft <= distanceToRight ? 'left' : 'right';
  }

  let leftIndex = 0;
  let rightIndex = activeLockedColumns.length - 1;

  while (leftIndex <= rightIndex) {
    const leftCandidate = activeLockedColumns[leftIndex];
    const rightCandidate = activeLockedColumns[rightIndex];

    if (leftCandidate === undefined || rightCandidate === undefined) {
      break;
    }

    const leftForced = leftCandidate.start < viewportLeft + leftOffset;
    const rightForced = rightCandidate.end > viewportRight - rightOffset;
    const preferLeft = getPreferredSide(leftCandidate) === 'left';
    const preferRight = getPreferredSide(rightCandidate) === 'right';

    if (leftIndex === rightIndex) {
      if (leftForced) {
        assignLeft(leftCandidate.column.key, leftCandidate.width);
      } else if (rightForced) {
        assignRight(rightCandidate.column.key, rightCandidate.width);
      } else if (preferLeft) {
        assignLeft(leftCandidate.column.key, leftCandidate.width);
      } else {
        assignRight(rightCandidate.column.key, rightCandidate.width);
      }

      break;
    }

    if (leftForced && rightForced) {
      assignLeft(leftCandidate.column.key, leftCandidate.width);
      assignRight(rightCandidate.column.key, rightCandidate.width);
      leftIndex += 1;
      rightIndex -= 1;
      continue;
    }

    if (leftForced) {
      assignLeft(leftCandidate.column.key, leftCandidate.width);
      leftIndex += 1;
      continue;
    }

    if (rightForced) {
      assignRight(rightCandidate.column.key, rightCandidate.width);
      rightIndex -= 1;
      continue;
    }

    if (preferLeft && preferRight) {
      assignLeft(leftCandidate.column.key, leftCandidate.width);
      assignRight(rightCandidate.column.key, rightCandidate.width);
      leftIndex += 1;
      rightIndex -= 1;
      continue;
    }

    if (preferLeft) {
      assignLeft(leftCandidate.column.key, leftCandidate.width);
      leftIndex += 1;
      continue;
    }

    if (preferRight) {
      assignRight(rightCandidate.column.key, rightCandidate.width);
      rightIndex -= 1;
      continue;
    }

    const leftOccupiedWidth = leftOffset;
    const rightOccupiedWidth = rightOffset - baseRightOffset;

    if (leftOccupiedWidth <= rightOccupiedWidth) {
      assignLeft(leftCandidate.column.key, leftCandidate.width);
      leftIndex += 1;
      continue;
    }

    assignRight(rightCandidate.column.key, rightCandidate.width);
    rightIndex -= 1;
  }

  return nextLockedColumns;
}

function getRowClasses(
  record: Record<string, any>,
  index: number,
): Array<string | false | undefined> {
  return [
    `${classNameComponent}__row`,
    canCheckRows && `${classNameComponent}__row--interactive`,
    editable &&
      currentEditableAction.value === 'update' &&
      formEditableValues.id === index &&
      `${classNameComponent}__row--editing`,
    canSelectRows && selectedRows.includes(record.id as string)
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

function isRecordValue(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getInlineUpdatedRecord(
  value: string | number | undefined | object,
  column: TableColumn,
  index?: number,
): Record<string, any> | undefined {
  if (!column.inline || index === undefined || !records[index]) {
    return undefined;
  }

  return {
    ...records[index],
    ...(isRecordValue(value) ? value : { [column.key]: value }),
  };
}

function rerunStepsForRecord(record: Record<string, any> | undefined): void {
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
  emit('on:changeValue', index === undefined ? undefined : records[index]?.id, emittedValue);

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

function handleToggleSelectAllRows(): void {
  if (isAllRecordsOnPageChecked.value) {
    emit(
      'on:select:row',
      selectedRows.filter(
        (item) => !(records.map((record) => record.id) as string[]).includes(item),
      ),
    );
    return;
  }

  const toAssign = records
    .filter((record) => !selectedRows.includes(record.id as string))
    .map((record) => record.id) as string[];

  emit('on:select:row', selectedRows.concat(toAssign));
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

function handleRowAction(record: Record<string, any>, action: string, index: number): void {
  if (editable) {
    if (action === 'edit') {
      rememberRowHeight(index);

      nextTick(() => {
        emit('on:action', index, 'beforeEdit', record);
        currentEditableAction.value = 'update';
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
      id: record.id,
      record,
    };
    return;
  }

  emit('on:action', record.id, action, record);
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

function getResolvedColumnType(record: Record<string, any>, column: TableColumn): string {
  if (typeof column.type === 'function') {
    return column.type(record);
  }

  return column.type || 'text';
}

function handleBodyColumnClick(
  record: Record<string, any>,
  column: TableColumn,
  collapseId?: string,
): void {
  const resolvedType = getResolvedColumnType(record, column);

  if (resolvedType === 'action') {
    emit('on:action', record.id, column.actionName || 'edit', record);
    return;
  }

  if (resolvedType === 'editAction' || resolvedType === 'EditActionColumn') {
    emit('on:action', record.id, column.actionName || 'edit-inline', record);
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

  emit('on:dbclick', record.id, record);
}

function handleBodyColumnDblClick(record: Record<string, any>, column: TableColumn): void {
  const resolvedType = getResolvedColumnType(record, column);

  if (editable || resolvedType === 'editable' || resolvedType === 'expandable' || column.steps) {
    return;
  }

  emit('on:dblclick', record.id, record);
  emit('on:dbclick', record.id, record);
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

function handleRowClick(event: MouseEvent, record: Record<string, any>): void {
  if (!canHandleRowSelection(event)) {
    return;
  }

  emit('on:check:row', record);
}

function handleRowKeydown(event: KeyboardEvent, record: Record<string, any>): void {
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
      v-bind:id="id"
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
        <template v-for="(record, index) in records" :key="record?.id ?? index">
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
              :id="record?.id ?? ''"
              :row="currentCheckedRow"
              :table-scope-id="tableSelectionScopeId"
              @on:check:row="emit('on:check:row', record)"
            />

            <TableBodySelectColumn
              v-if="canSelectRows && !editable"
              :dataTestId="buildTableTestId(dataTestId, 'select', getTableRecordKey(record, index))"
              :id="String(record.id ?? '')"
              :selected="canSelectRows ? selectedRows.includes(record.id as string) : false"
              :selected-rows="selectedRows"
              :table-scope-id="tableSelectionScopeId"
              @on:select:row="(selected) => emit('on:select:row', selected)"
            />

            <TableBodyColumn
              v-for="(column, columnIndex) in parsedColumns.filter((item) =>
                item.visible === undefined ? true : item.visible,
              )"
              v-if="formEditableValues.id !== index"
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
              @on:click="(collapseId: string) => handleBodyColumnClick(record, column, collapseId)"
              @on:update="
                (value, currentColumn) => handleUpdateValueColumn(value, currentColumn, index)
              "
            />

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
                <slot :record name="detials-record" />
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
        @click="emit('on:createRecord')"
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
                  currentRecordDelete?.record?.name ? currentRecordDelete.record.name : '',
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
