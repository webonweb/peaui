import type { SelectValueMode } from '../../form/FormSelect/select.shared';
import type { TableManageOptions } from './shared';

export type TableManageColumn = {
  default?: string | number;
  disabled?: boolean;
  integer?: boolean;
  max?: number | ((record: Record<string, unknown>) => number);
  maxLength?: number;
  min?: number;
  onUpdate?: (record: Record<string, unknown>, index?: number) => Record<string, unknown> | void;
  options?: TableManageOptions;
  /** Select model contract; use label only while migrating existing data. */
  valueMode?: SelectValueMode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  required?: boolean;
  step?: number;
  canWrite?: boolean;
  withSelectAll?: boolean;
  placeholder?: string;
  type: 'select' | 'number' | 'text' | 'multiselect';
  mask?: string;
  regex?: RegExp;
};

type WithOverrides<
  Base,
  Overrides extends Partial<Record<keyof Base, unknown>> = Record<never, never>,
> = Omit<Base, keyof Overrides> & Overrides;

export type TableRecord = Record<string, unknown>;
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
  | ((record: Record<string, unknown>) => string);

export type TableStepperStepStatus = 'default' | 'current' | 'disabled' | 'complete';
export type TableTagVariant = 'blue' | 'green' | 'red' | 'orange' | 'grey' | 'violet' | 'outline';

export type TableStepperStepCollapse = {
  activeElements: number;
  count: number;
};

export type TableStepperStep = {
  collapse?: TableStepperStepCollapse;
  isSeparate?: boolean;
  key: string;
  label: string;
  onRedirect?: () => void;
  status: TableStepperStepStatus;
};

export type TableColumnBase = {
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
    data: TableRecord,
  ) => Record<string, unknown>[] | Record<string, Record<string, string | undefined>[]>;
  steps?: (record: TableRecord, collapse?: boolean) => TableStepperStep[];
  template?: (entry: unknown, record?: TableRecord) => string;
  type?: TableColumnType;
  visibleColumn?: (record: Record<string, unknown>) => boolean;
  width?: number;
  actionLabel?: string;
  hintColumn?: string;
};

export type TableColumn<
  Overrides extends Partial<Record<keyof TableColumnBase, unknown>> = Record<never, never>,
  Extra extends Record<string, unknown> = Record<never, never>,
> = WithOverrides<TableColumnBase, Overrides> & Extra;
