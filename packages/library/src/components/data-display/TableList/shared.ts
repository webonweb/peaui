import { UIKIT_NAME } from '@/constants';
import { getDeepValue } from '@/helpers/object.helper';
import { sanitizeToSlug } from '@/helpers/string.helper';
import type { TableColumnBase, TableRecord } from './table.types';

export function resolveTableColumnType(
  column: Pick<TableColumnBase, 'type'>,
  record: TableRecord,
): string {
  return typeof column.type === 'function' ? column.type(record) : column.type || 'text';
}

export function resolveTableColumnValue(
  column: Pick<TableColumnBase, 'key' | 'template'>,
  record: TableRecord,
): unknown {
  return column.template
    ? column.template(record[column.key], record)
    : getDeepValue(record, column.key);
}

export function resolveTableTextValue(value: unknown, deep?: string): unknown {
  const resolved =
    deep && typeof value === 'object' && value !== null
      ? getDeepValue(value as TableRecord, deep)
      : value;
  return resolved === null || resolved === undefined || resolved === '' ? '-/-' : resolved;
}

/** Zero and false are present cell values and remain available to copy. */
export function hasTableCopyValue(value: unknown): boolean {
  return value !== null && value !== undefined && value !== '';
}

export const TABLE_LIST_CLASS = `${UIKIT_NAME}-table-list`;
export const TABLE_LIST_DEFAULT_COLUMN_WIDTH = 170;
export const TABLE_LIST_ACTIONS_STICKY_WIDTH = 48;
export const TABLE_LIST_EDITABLE_ACTIONS_STICKY_WIDTH = 84;
export const TABLE_LIST_MAX_MULTI_SORTS = 2;
export const TABLE_LIST_MIN_VISIBLE_COLUMNS = 3;

export type TableLockedColumnSide = 'left' | 'right';
export type TableSortDirection = 'ASC' | 'DESC';
export type TableSortState = Record<string, TableSortDirection>;

export type TableLockedColumnMeta = {
  offset: number;
  side: TableLockedColumnSide;
};

export type TableManageOption = {
  label?: unknown;
  value?: unknown;
} & Record<string, unknown>;

export type TableManageOptions =
  | TableManageOption[]
  | ((record: Record<string, unknown>, options?: TableManageOption[]) => TableManageOption[]);

export type TableColumnIdentifierSource = {
  key: string;
  subKey?: string;
};

export function getTableSortKey(sortState: TableSortState | undefined): string | undefined {
  if (!sortState) {
    return undefined;
  }

  const [key] = Object.keys(sortState);

  return key;
}

export function getTableSortType(
  sortState: TableSortState | undefined,
): TableSortDirection | undefined {
  const key = getTableSortKey(sortState);

  if (key === undefined) {
    return undefined;
  }

  const value = sortState?.[key];

  if (value === 'ASC') {
    return 'ASC';
  }

  return value === 'DESC' ? 'DESC' : undefined;
}

export function createTableSortState(key: string, direction: TableSortDirection): TableSortState {
  return { [key]: direction };
}

export function normalizeTableSortStates(
  sortStates: TableSortState[] | undefined,
): TableSortState[] {
  return (sortStates ?? [])
    .map((sortState) => {
      const key = getTableSortKey(sortState);
      const type = getTableSortType(sortState);

      if (key === undefined || type === undefined) {
        return undefined;
      }

      return createTableSortState(key, type);
    })
    .filter((sortState): sortState is TableSortState => sortState !== undefined)
    .slice(0, TABLE_LIST_MAX_MULTI_SORTS);
}

export function buildTableTestId(
  base: string | undefined,
  ...segments: Array<string | number | null | undefined | false>
): string | undefined {
  if (base === undefined || base === '') {
    return undefined;
  }

  const normalizedSegments = segments
    .filter(
      (segment): segment is string | number =>
        segment !== undefined && segment !== null && segment !== false && `${segment}` !== '',
    )
    .map((segment) => sanitizeToSlug(String(segment)));

  return normalizedSegments.length > 0 ? `${base}-${normalizedSegments.join('-')}` : base;
}

export function getTableRecordKey(
  record: Record<string, unknown> | undefined,
  index: number,
): string {
  const recordId = record?.id;

  if (recordId === undefined || recordId === null || recordId === '') {
    return String(index);
  }

  if (
    typeof recordId === 'string' ||
    typeof recordId === 'number' ||
    typeof recordId === 'boolean'
  ) {
    return String(recordId);
  }

  return String(index);
}

/** Keep editor identity separate from the legacy index emitted by on:submit. */
export function getTableRecordIdentity(record: TableRecord): unknown {
  return record.id === undefined || record.id === null || record.id === '' ? record : record.id;
}

/** Ambiguous identities must not turn an edit into a write to an unrelated record. */
export function findTableRecordIndex(records: readonly TableRecord[], identity: unknown): number {
  let match = -1;
  for (let index = 0; index < records.length; index += 1) {
    if (!Object.is(getTableRecordIdentity(records[index]!), identity)) continue;
    if (match >= 0) return -1;
    match = index;
  }
  return match;
}

export function getTableColumnIdentifier(column: TableColumnIdentifierSource): string {
  return column.subKey || column.key;
}

export function resolveTableManageOptions({
  columnKey,
  currentRecord,
  manageType,
  options,
}: {
  columnKey: string;
  currentRecord: Record<string, unknown>;
  manageType?: string;
  options?: TableManageOptions;
}): TableManageOption[] | undefined {
  if (typeof options === 'undefined') {
    return undefined;
  }

  if (typeof options === 'function') {
    return options(currentRecord);
  }

  if (manageType === 'multiselect') {
    return options;
  }

  const currentValue = getDeepValue(currentRecord, columnKey);

  return options.map((option) => ({
    ...option,
    active: currentValue === (option.value ?? option.label) || currentValue === option.label,
  }));
}
