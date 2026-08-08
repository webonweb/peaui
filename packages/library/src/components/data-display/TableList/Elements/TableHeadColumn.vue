<script setup lang="ts">
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import InfoTooltip from '@/components/overlayer/InfoTooltip/index.vue';
import { stripHtmlUsingDom } from '@/helpers/functions.helper';
import { slugify } from '@/helpers/string.helper';
import { computed } from 'vue';
import type { TableColumn } from '../index.vue';
import {
  buildTableTestId,
  createTableSortState,
  getTableColumnIdentifier,
  getTableSortKey,
  getTableSortType,
  normalizeTableSortStates,
  TABLE_LIST_CLASS,
  TABLE_LIST_DEFAULT_COLUMN_WIDTH,
  type TableLockedColumnMeta,
  type TableSortDirection,
  type TableSortState,
} from '../shared';

const {
  canMultiSort = false,
  columns,
  dataTestId,
  lockedColumns,
  lockedState,
  sortColumn,
  sortColumns = [],
  sortType,
} = defineProps<{
  canMultiSort?: boolean;
  columns: TableColumn[];
  editable?: boolean;
  lockedColumns?: Record<string, TableLockedColumnMeta | undefined>;
  lockedState?: Record<string, boolean | undefined>;
  sortColumn?: string;
  sortColumns?: TableSortState[];
  sortType: 'ASC' | 'DESC';
  dataTestId?: string;
}>();

const emit = defineEmits<{
  (e: 'on:sort', column: string): void;
  (e: 'on:lock', column: string): void;
}>();

const visibleColumns = computed(() =>
  columns.filter((column) => (column.visible === undefined ? true : column.visible)),
);

const activeSortColumns = computed(() =>
  canMultiSort
    ? normalizeTableSortStates(sortColumns)
    : sortColumn
      ? [createTableSortState(sortColumn, sortType)]
      : [],
);

function getColumnKey(column: TableColumn): string {
  return stripHtmlUsingDom(getTableColumnIdentifier(column));
}

function getColumnSlug(column: TableColumn): string {
  return stripHtmlUsingDom(slugify(column.label || ''));
}

function getColumnCellTestId(column: TableColumn): string | undefined {
  return buildTableTestId(dataTestId, 'head-cell', getColumnKey(column), getColumnSlug(column));
}

function getColumnButtonTestId(column: TableColumn): string | undefined {
  return buildTableTestId(dataTestId, 'head-button', getColumnKey(column), getColumnSlug(column));
}

function getColumnSortKey(column: TableColumn): string {
  return column.subKey || column.key;
}

function getColumnLockTestId(column: TableColumn): string | undefined {
  return buildTableTestId(dataTestId, 'head-lock', getColumnKey(column), getColumnSlug(column));
}

function getColumnLockButtonTestId(column: TableColumn): string | undefined {
  return buildTableTestId(
    dataTestId,
    'head-lock-button',
    getColumnKey(column),
    getColumnSlug(column),
  );
}

function getActiveSortState(
  column: TableColumn,
): { direction: TableSortDirection; index: number } | undefined {
  const columnSortKey = getColumnSortKey(column);
  const index = activeSortColumns.value.findIndex(
    (sortState) => getTableSortKey(sortState) === columnSortKey,
  );

  if (index === -1) {
    return undefined;
  }

  const direction = getTableSortType(activeSortColumns.value[index]);

  if (!direction) {
    return undefined;
  }

  return { direction, index };
}

function isActiveSortColumn(column: TableColumn): boolean {
  return Boolean(getActiveSortState(column));
}

function getSortPriority(column: TableColumn): number | undefined {
  const activeSortState = getActiveSortState(column);

  return activeSortState ? activeSortState.index + 1 : undefined;
}

function getSortDataType(column: TableColumn): 'asc' | 'desc' | undefined {
  const activeSortState = getActiveSortState(column);

  if (!activeSortState) {
    return undefined;
  }

  return activeSortState.direction !== 'DESC' ? 'asc' : 'desc';
}

function getRotationIconSort(column: TableColumn): string {
  const activeSortState = getActiveSortState(column);

  return activeSortState?.direction !== 'DESC'
    ? `${TABLE_LIST_CLASS}__head-sort-icon--asc`
    : `${TABLE_LIST_CLASS}__head-sort-icon--desc`;
}

function getLockedColumn(column: TableColumn): TableLockedColumnMeta | undefined {
  const identifier = getTableColumnIdentifier(column);

  return lockedColumns?.[identifier] || lockedColumns?.[column.key];
}

function getLockedCellClasses(column: TableColumn): string[] {
  const lockedColumn = getLockedColumn(column);

  if (!lockedColumn) {
    return [];
  }

  return [
    `${TABLE_LIST_CLASS}__head-cell--locked`,
    `${TABLE_LIST_CLASS}__head-cell--locked-${lockedColumn.side}`,
  ];
}

function getBorderCellClasses(column: TableColumn): string[] {
  if (column.border !== 'left' && column.border !== 'right') {
    return [];
  }

  return [`${TABLE_LIST_CLASS}__head-cell--border-${column.border}`];
}

function getLockedCellStyles(column: TableColumn): Record<string, string> {
  const lockedColumn = getLockedColumn(column);
  const width = column.width ?? TABLE_LIST_DEFAULT_COLUMN_WIDTH;

  return {
    minWidth: `${width}px`,
    width: column.width ? `${column.width}px` : '100%',
    ...(lockedColumn ? { [lockedColumn.side]: `${lockedColumn.offset}px` } : {}),
  };
}

function isLocked(column: TableColumn): boolean {
  const identifier = getTableColumnIdentifier(column);

  return Boolean(lockedState?.[identifier] ?? lockedState?.[column.key]);
}

function getColumnLockLabel(column: TableColumn): string {
  return isLocked(column) ? 'Odblokuj kolumne' : 'Zablokuj kolumne';
}

function getAriaSort(column: TableColumn): 'ascending' | 'descending' | 'none' {
  const activeSortState = getActiveSortState(column);

  if (!activeSortState) {
    return 'none';
  }

  return activeSortState.direction !== 'DESC' ? 'ascending' : 'descending';
}

function handleSortColumn(column: TableColumn): void {
  if (!column.canSort) {
    return;
  }

  emit('on:sort', column.subKey || column.key);
}

function handleToggleLockColumn(column: TableColumn): void {
  emit('on:lock', column.key);
}
</script>

<template>
  <th
    v-for="(column, index) in visibleColumns"
    :key="`${getTableColumnIdentifier(column)}-${index}`"
    :class="[
      `${TABLE_LIST_CLASS}__head-cell`,
      column.canSort && `${TABLE_LIST_CLASS}__head-cell--sortable`,
      ...getBorderCellClasses(column),
      ...getLockedCellClasses(column),
    ]"
    :data-sort-priority="canMultiSort ? getSortPriority(column) : undefined"
    :data-sort-type="getSortDataType(column)"
    :data-testid="getColumnCellTestId(column)"
    :data-can-sort="column.canSort"
    :style="getLockedCellStyles(column)"
    :aria-sort="getAriaSort(column)"
    scope="col"
  >
    <div :class="`${TABLE_LIST_CLASS}__head-content`">
      <button
        type="button"
        :class="[
          `${TABLE_LIST_CLASS}__head-button`,
          isActiveSortColumn(column) && `${TABLE_LIST_CLASS}__head-button--active`,
          column.canSort
            ? `${TABLE_LIST_CLASS}__head-button--sortable`
            : `${TABLE_LIST_CLASS}__head-button--static`,
        ]"
        :data-testid="getColumnButtonTestId(column)"
        :aria-label="`Sortuj tabele po ${stripHtmlUsingDom(column.label)}`"
        :aria-disabled="column.canSort ? undefined : 'true'"
        @click.prevent="handleSortColumn(column)"
      >
        <span :class="`${TABLE_LIST_CLASS}__head-label`" v-html="column.label" />

        <SvgIcon
          v-if="isActiveSortColumn(column)"
          :class="[`${TABLE_LIST_CLASS}__head-sort-icon`, getRotationIconSort(column)]"
          name="sort"
          aria-hidden="true"
        />
      </button>

      <div :class="`${TABLE_LIST_CLASS}__head-controls`">
        <InfoTooltip
          v-if="column.withLock"
          :key="`${getTableColumnIdentifier(column)}-${isLocked(column) ? 'locked' : 'unlocked'}`"
          placement="top"
          :dataTestId="getColumnLockTestId(column)"
        >
          <button
            type="button"
            :class="[
              `${TABLE_LIST_CLASS}__head-lock-trigger`,
              isLocked(column) && `${TABLE_LIST_CLASS}__head-lock-trigger--active`,
            ]"
            :data-testid="getColumnLockButtonTestId(column)"
            :aria-label="getColumnLockLabel(column)"
            :aria-pressed="isLocked(column)"
            @click.prevent="handleToggleLockColumn(column)"
          >
            <SvgIcon
              :key="isLocked(column) ? 'lock-closed' : 'lock-open'"
              :class="`${TABLE_LIST_CLASS}__head-lock-icon`"
              :name="isLocked(column) ? 'lock-closed' : 'lock-open'"
              aria-hidden="true"
            />
          </button>

          <template #description>{{ getColumnLockLabel(column) }}</template>
        </InfoTooltip>

        <InfoTooltip v-if="column.hint" placement="top">
          <SvgIcon :class="`${TABLE_LIST_CLASS}__hint-icon`" name="hint" aria-hidden="true" />

          <template #description>
            <slot :column="column" name="hint">{{ column.hintColumn || column.label }}</slot>
          </template>
        </InfoTooltip>
      </div>
    </div>
  </th>
</template>
