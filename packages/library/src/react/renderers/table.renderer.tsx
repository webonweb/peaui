/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-base-to-string, no-nested-ternary */
import {
  type RuntimeProps,
  cx,
  callback,
  copyTextToClipboard,
  text,
  useModel,
  node,
  num,
  bool,
  common,
  isInteractiveTarget,
} from './runtime.shared';
import {
  iconCheck,
  iconClose,
  iconCopy,
  iconPlus,
  iconSort,
  iconHint,
} from '../generated-static-icons';
import {
  type ReactNode,
  type ForwardedRef,
  type ReactElement,
  useState,
  useMemo,
  useEffect,
  useId,
  useRef,
  Fragment,
} from 'react';
import { Svg } from './svg.renderer';
import { Pagination } from './pagination';
import { ListLimitControlRenderer } from './list-limit-control.renderer';
import GridSection from '../../components/layout/GridSection';
import { getPageRange } from '../../helpers/number.helper';
import { formatDateToISODateString } from '../../helpers/date.helper';
import { getDeepValue, setDeepValue } from '../../helpers/object.helper';
import { validateEditableValue } from '../../components/data-display/TableList/editable-validation.shared';
import {
  resolveTableManageOptions,
  resolveTableColumnType,
  resolveTableColumnValue,
  resolveTableTextValue,
  getTableColumnIdentifier,
  getTableRecordIdentity,
  findTableRecordIndex,
} from '../../components/data-display/TableList/shared';
import { ERROR_MESSAGES } from '../../constants/error.const';
import { TextFieldLeafRenderer, SearchInputLeafRenderer } from './text-input.renderer';
import { SelectRenderer } from './select.renderer';
import type {
  TableColumnBase,
  TableManageColumn,
} from '../../components/data-display/TableList/table.types';
import { ButtonExportLeafRenderer } from './button.renderer';
import { Dialog } from './dialog';
import { InfoTooltipRenderer } from './info-tooltip.renderer';
import { ProgressIndicatorLeafRenderer } from './feedback.renderer';
import { getTablePage } from '../../components/data-display/TableList/table-page.shared';

export type TableColumn = Omit<TableColumnBase, 'width' | 'label'> & {
  /** Legacy React aliases remain accepted. */
  align?: string;
  name?: string;
  sortable?: boolean;
  width?: string | number;
  label?: string;
};

export type ReactTableSortDescriptor = {
  direction: 'asc' | 'desc';
  key: string;
};

export function normalizeReactTableSortDescriptors(value: unknown): ReactTableSortDescriptor[] {
  if (!Array.isArray(value)) return [];

  return value
    .flatMap((entry): ReactTableSortDescriptor[] => {
      if (typeof entry !== 'object' || entry === null) return [];

      const record = entry as Record<string, unknown>;
      const descriptorKey = typeof record.key === 'string' ? record.key : undefined;
      const legacyEntry = Object.entries(record).find(
        ([key, direction]) =>
          key !== 'key' &&
          key !== 'direction' &&
          typeof direction === 'string' &&
          ['asc', 'desc'].includes(direction.toLowerCase()),
      );
      const key = descriptorKey ?? legacyEntry?.[0];
      const rawDirection = descriptorKey ? record.direction : legacyEntry?.[1];

      if (!key || typeof rawDirection !== 'string') return [];

      return [
        {
          direction: rawDirection.toLowerCase() === 'desc' ? 'desc' : 'asc',
          key,
        },
      ];
    })
    .slice(0, 2);
}

export function getNextReactTableSortDescriptors(
  current: ReactTableSortDescriptor[],
  key: string,
): ReactTableSortDescriptor[] {
  const currentIndex = current.findIndex((entry) => entry.key === key);

  if (currentIndex === 0) {
    return [
      { key, direction: current[0]?.direction === 'asc' ? 'desc' : 'asc' },
      ...current.slice(1),
    ];
  }

  if (currentIndex > 0) {
    const selected = current[currentIndex];
    return selected ? [selected, ...current.filter((_, index) => index !== currentIndex)] : current;
  }

  const next: ReactTableSortDescriptor[] = [{ key, direction: 'asc' }, ...current];

  return next.slice(0, 2);
}

export function tableCellValue(record: Record<string, unknown>, column: TableColumn): unknown {
  const value = resolveTableColumnValue(column, record);
  if (!column.name || typeof value !== 'object' || value === null) return value;
  return (value as Record<string, unknown>)[column.name];
}

export function resolveTableActions(
  column: TableColumn,
  record: Record<string, unknown>,
): Array<Record<string, unknown>> {
  if (column.visibleColumn?.(record) === false) return [];
  const resolved = column.resolve?.(record);
  return Array.isArray(resolved) ? resolved : [];
}

function TableEditableCell({
  column,
  record,
  renderField,
}: {
  column: TableColumn;
  record: Record<string, unknown>;
  renderField: (
    draft: Record<string, unknown>,
    onChange: (value: unknown) => void,
    error?: string,
  ) => ReactNode;
}): ReactElement {
  const [current, setCurrent] = useState(record);
  const [draft, setDraft] = useState(record);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string>();
  const container = useRef<HTMLDivElement>(null);
  const wasActive = useRef(false);
  useEffect(() => {
    setCurrent(record);
    setDraft(record);
    setError(undefined);
  }, [record]);
  useEffect(() => {
    if (active) container.current?.querySelector<HTMLElement>('input, textarea, select')?.focus();
    else if (wasActive.current)
      container.current?.querySelector<HTMLButtonElement>('button')?.focus();
    wasActive.current = active;
  }, [active]);
  const cancel = (): void => {
    setDraft(current);
    setError(undefined);
    setActive(false);
  };
  const save = (): void => {
    if (column.manage?.disabled) return;
    const message = validateEditableValue(
      getDeepValue(draft, column.key),
      column.manage,
      ERROR_MESSAGES,
    );
    setError(message);
    if (message) return;
    column.manage?.onUpdate?.(draft);
    setCurrent(draft);
    setActive(false);
  };
  return (
    <div
      className="peaui-table-list__editable-display"
      role="group"
      aria-label={column.label ?? column.key}
      ref={container}
      onKeyDown={(event) => {
        if (!active || event.defaultPrevented) return;
        if (event.key === 'Escape') {
          event.preventDefault();
          cancel();
        }
      }}
    >
      {active ? (
        <div className="peaui-table-list__editable-editor">
          {renderField(
            draft,
            (value) => {
              const next = { ...draft };
              setDeepValue(next, column.key, value);
              setDraft(next);
              setError(undefined);
            },
            error,
          )}
          <div className="peaui-table-list__editable-editor-actions">
            <button
              type="button"
              className="peaui-table-list__editable-editor-button peaui-table-list__editable-editor-button--submit"
              aria-label="Zapisz zmiane w kolumnie"
              disabled={column.manage?.disabled}
              onClick={save}
            >
              <Svg
                data={iconCheck}
                name="check"
                className="peaui-table-list__editable-editor-icon"
              />
            </button>
            <button
              type="button"
              className="peaui-table-list__editable-editor-button peaui-table-list__editable-editor-button--cancel"
              aria-label="Anuluj edycje kolumny"
              onClick={cancel}
            >
              <Svg
                data={iconClose}
                name="close"
                className="peaui-table-list__editable-editor-icon"
              />
            </button>
          </div>
        </div>
      ) : (
        <>
          <span>{String(resolveTableTextValue(tableCellValue(current, column), column.deep))}</span>
          <button
            type="button"
            className="peaui-table-list__editable-toggle"
            aria-label="Edytuj kolumne"
            disabled={!column.manage || column.manage.disabled}
            onClick={() => {
              setDraft(current);
              setActive(true);
            }}
          >
            <Svg name="edit" className="peaui-table-list__editable-toggle-icon" />
          </button>
        </>
      )}
    </div>
  );
}

export function TableCellContent({
  column,
  props,
  record,
  rowIndex,
}: {
  column: TableColumn;
  props: RuntimeProps;
  record: Record<string, unknown>;
  rowIndex: number;
}): ReactNode {
  const value = tableCellValue(record, column);
  const display = String(resolveTableTextValue(value, column.deep));
  const type = resolveTableColumnType(column, record);

  if (type === 'index')
    return <span className="peaui-table-list__index-column">{rowIndex + 1}</span>;
  if (type === 'empty') return <span className="peaui-table-list__empty-column">-/-</span>;
  if (type === 'array')
    return (
      <span className="peaui-table-list__array-column">
        {Array.isArray(value) && value.length ? value.join(', ') : '-/-'}
      </span>
    );
  if (type === 'date') {
    const date =
      typeof value === 'string' || typeof value === 'number' ? new Date(value) : undefined;
    const formatted =
      date && !Number.isNaN(date.valueOf())
        ? formatDateToISODateString(date.toISOString())
        : display;
    return <time dateTime={typeof value === 'string' ? value : undefined}>{formatted}</time>;
  }
  if (type === 'status' || type === 'tag') {
    const label = type === 'status' ? (value ? 'TAK' : 'NIE') : display;
    const variant =
      type === 'status'
        ? value
          ? 'green'
          : 'red'
        : (column.statusDictionary?.[display] ?? 'green');
    return (
      <span
        className={cx(
          'peaui-tag-chip',
          'peaui-tag-chip--size-xs',
          `peaui-tag-chip--variant-${variant}`,
        )}
      >
        {label}
      </span>
    );
  }
  if (type === 'link') {
    const href = /^(https?:\/\/|\/|#|mailto:|tel:|\.\/|\.\.\/)/.test(display) ? display : undefined;
    const label = `Otwórz powiązanie ${display}`;
    return href ? (
      <a aria-label={label} className="peaui-table-list__link-column" href={href}>
        {display}
      </a>
    ) : (
      <button
        aria-label={label}
        className="peaui-table-list__link-column"
        type="button"
        onClick={() =>
          callback(props, 'onAction')?.(record.id, column.actionName ?? 'link', record)
        }
      >
        {display}
      </button>
    );
  }
  if (type === 'action' || type === 'editAction' || type === 'EditActionColumn') {
    const label = column.actionLabel ?? (type === 'action' ? 'Akcja' : 'Edytuj');
    return (
      <span
        className={
          type === 'action'
            ? 'peaui-table-list__action-column'
            : 'peaui-table-list__edit-action-column'
        }
      >
        {type !== 'action' ? (
          <span className="peaui-table-list__edit-action-value">{display}</span>
        ) : null}
        <button
          aria-label={`${label}: ${String(record.name ?? `wiersz ${rowIndex + 1}`)}`}
          className={cx(
            'peaui-button-action',
            'peaui-button-action--size-xs',
            'peaui-button-action--variant-secondary',
            type === 'action'
              ? 'peaui-table-list__actions-simple-button'
              : 'peaui-table-list__edit-action-button',
          )}
          type="button"
          onClick={() =>
            callback(props, 'onAction')?.(
              record.id,
              column.actionName ?? (type === 'action' ? 'action' : 'edit-inline'),
              record,
            )
          }
        >
          {label}
        </button>
      </span>
    );
  }
  if (type === 'stepper' && column.steps) {
    const steps = column.steps(record);
    return (
      <div
        role="group"
        aria-label={`Etapy dla ${String(record.name ?? `wiersza ${rowIndex + 1}`)}`}
        className="peaui-table-list__stepper-list"
      >
        {steps.map((step, index) => (
          <Fragment key={step.key}>
            {step.isSeparate && index > 0 ? (
              <span className="peaui-table-list__stepper-separator" aria-hidden="true">
                |
              </span>
            ) : null}
            <button
              type="button"
              aria-disabled={step.status === 'disabled' || undefined}
              aria-label={`${step.label}. Status ${step.status}`}
              className={cx(
                'peaui-table-list__stepper-button',
                `peaui-table-list__stepper-button--status-${step.status}`,
                step.isSeparate && 'peaui-table-list__stepper-button--separate',
                index === 0 && 'peaui-table-list__stepper-button--first',
                (index === steps.length - 1 || steps[index + 1]?.isSeparate) &&
                  'peaui-table-list__stepper-button--last',
              )}
              onClick={() => {
                if (step.status === 'disabled') return;
                if (step.onRedirect) step.onRedirect();
                else if (step.collapse) callback(props, 'onAction')?.(record.id, 'expand', record);
              }}
            >
              <span className="peaui-table-list__stepper-label">{step.label}</span>
              {step.collapse ? (
                <ProgressIndicatorLeafRenderer
                  active={step.collapse.activeElements}
                  steps={step.collapse.count}
                  size={20}
                  strokeWidth={2.5}
                />
              ) : null}
            </button>
          </Fragment>
        ))}
      </div>
    );
  }
  if (type === 'expandable') {
    return (
      <button
        aria-label={`Pokaż szczegóły: ${String(record.name ?? `wiersz ${rowIndex + 1}`)}`}
        className="peaui-table-list__expandable-button"
        type="button"
        onClick={() => callback(props, 'onAction')?.(record.id, 'expand', record)}
      >
        <span className="peaui-table-list__expandable-value">{display}</span>
        <span aria-hidden="true">›</span>
      </button>
    );
  }

  const content = (
    <>
      <span className="peaui-table-list__text-value">{display}</span>
      {column.hintColumn ? (
        <InfoTooltipRenderer description={column.hintColumn} placement="top">
          <Svg data={iconHint} className="peaui-table-list__hint-icon" name="hint" />
        </InfoTooltipRenderer>
      ) : null}
    </>
  );
  if (!column.canCopy) return content;
  return (
    <span className="peaui-table-list__body-cell-content peaui-table-list__body-cell-content--copyable">
      {content}
      <button
        aria-label={`Kopiuj ${column.label ?? column.key}: ${display}`}
        className="peaui-table-list__copy-button"
        type="button"
        onClick={() => copyTextToClipboard(display)}
      >
        <Svg data={iconCopy} className="peaui-table-list__copy-icon" name="copy" />
      </button>
    </span>
  );
}

export function TableRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const selectionScope = `table-${useId()}`;
  const [editDraft, setEditing] = useState<{
    identity?: unknown;
    index: number | null;
    values: Record<string, unknown>;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hiddenColumnKeys, setHiddenColumnKeys] = useState<Set<string>>(new Set());
  const [page, setPage] = useModel<number>(props, 'page', 1);
  useEffect(() => setHiddenColumnKeys(new Set()), [props.columns]);

  const columnsRaw = Array.isArray(props.columns) ? props.columns : [];
  const columns: TableColumn[] = columnsRaw.flatMap((entry, index): TableColumn[] => {
    if (typeof entry !== 'object' || entry === null) return [];
    const record = entry as Partial<TableColumn> & { title?: string };
    const key = record.key ?? record.name ?? String(index);
    return [
      {
        ...record,
        key,
        label: record.label ?? record.title ?? key,
        sortable: record.canSort ?? record.sortable,
      },
    ];
  });
  const visibleColumns = columns.filter(
    (column) => column.visible !== false && !hiddenColumnKeys.has(getTableColumnIdentifier(column)),
  );
  const records = useMemo(
    () => (Array.isArray(props.records) ? (props.records as unknown[]) : []),
    [props.records],
  );
  const pageRange = getTablePage(
    records.length,
    page,
    num(props, 'rowsPerPage', 10),
    bool(props, 'paginate'),
  );
  const editMode = editDraft ? (editDraft.index === null ? 'create' : 'update') : 'none';
  const editedIdentity = editDraft?.identity;
  const onCancelEdit = callback(props, 'onCancel');
  const editedIndex = useMemo(
    () =>
      editMode === 'create'
        ? null
        : editMode === 'update'
          ? findTableRecordIndex(records as Record<string, unknown>[], editedIdentity)
          : -1,
    [records, editedIdentity, editMode],
  );
  const editing =
    editDraft &&
    (editedIndex === null || (editedIndex >= pageRange.start && editedIndex < pageRange.end))
      ? { ...editDraft, index: editedIndex }
      : null;
  useEffect(() => {
    if (
      editDraft &&
      editedIndex !== null &&
      (editedIndex < pageRange.start || editedIndex >= pageRange.end)
    ) {
      setEditing(null);
      setErrors({});
      onCancelEdit?.();
    }
  }, [editDraft, editedIndex, pageRange.start, pageRange.end, onCancelEdit]);
  const needsEditingColumn =
    editing !== null && !visibleColumns.some((column) => column.key === 'actions');
  const pageRecords = records.slice(pageRange.start, pageRange.end);
  const editable = bool(props, 'editable');
  const canSelectRows = bool(props, 'canSelectRows', true) && !editable;
  const cancelEdit = (): void => {
    setEditing(null);
    setErrors({});
    callback(props, 'onCancel')?.();
  };
  const submitEdit = (): void => {
    if (!editing) return;
    const nextErrors: Record<string, string> = {};
    for (const column of visibleColumns) {
      const error = validateEditableValue(
        getDeepValue(editing.values, column.key),
        column.manage,
        ERROR_MESSAGES,
      );
      if (error) nextErrors[column.key] = error;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    callback(
      props,
      'onSubmit',
    )?.(editing.index === null ? editing.values : { ...editing.values, id: editing.index });
    cancelEdit();
  };
  const startCreate = (): void => {
    const values: Record<string, unknown> = {};
    for (const column of columns) {
      if (!column.manage) continue;
      const defaultValue =
        column.manage.default ??
        (column.manage.type === 'number'
          ? undefined
          : column.manage.type === 'multiselect'
            ? []
            : '');
      setDeepValue(values, column.key, defaultValue);
    }
    if (props.additional && typeof props.additional === 'object') {
      for (const [key, value] of Object.entries(props.additional)) setDeepValue(values, key, value);
    }
    setErrors({});
    setEditing({ index: null, values });
    callback(props, 'onAction')?.(0, 'create', undefined);
  };
  const fireAction = (record: Record<string, unknown>, rowIndex: number, action: string): void => {
    if (editable && action === 'edit') {
      callback(props, 'onAction')?.(rowIndex, 'beforeEdit', record);
      setEditing({
        index: rowIndex,
        identity: getTableRecordIdentity(record),
        values: { ...record, id: rowIndex },
      });
      setErrors({});
    }
    callback(props, 'onAction')?.(editable ? rowIndex : record.id, action, record);
  };
  const renderEditor = (
    column: TableColumn,
    record: Record<string, unknown>,
    rowIndex?: number,
    onDraftChange?: (value: unknown) => void,
    fieldError?: string,
  ): ReactNode => {
    const manage: TableManageColumn | undefined =
      column.manage ?? (column.inline ? { type: 'text' } : undefined);
    if (!manage) return tableCellValue(record, column) as ReactNode;
    const type = manage.type;
    const id = `${selectionScope}-${getTableColumnIdentifier(column)}-${rowIndex ?? 'new'}`;
    const onValueChange = (value: unknown): void => {
      if (onDraftChange) {
        onDraftChange(value);
        return;
      }
      const values = { ...record };
      setDeepValue(values, column.key, value);
      const onUpdate = manage.onUpdate;
      const updated: unknown =
        typeof onUpdate === 'function'
          ? (onUpdate as (record: Record<string, unknown>, index?: number) => unknown)(
              values,
              rowIndex,
            )
          : undefined;
      if (!column.inline && editing) {
        setEditing({
          ...editing,
          values: updated && typeof updated === 'object' ? { ...updated } : values,
        });
        setErrors((current) =>
          Object.fromEntries(Object.entries(current).filter(([key]) => key !== column.key)),
        );
      }
      callback(props, 'onChangeValue')?.(
        column.inline ? record.id : undefined,
        typeof value === 'number' || typeof value === 'string' ? value : undefined,
      );
    };
    const fieldProps = {
      ...manage,
      id,
      name: getTableColumnIdentifier(column),
      label: column.inline
        ? `${column.label ?? column.key}, wiersz ${(rowIndex ?? 0) + 1}`
        : (column.label ?? column.key),
      value: getDeepValue(record, column.key),
      error: fieldError ?? errors[column.key],
      max: typeof manage.max === 'function' ? manage.max(record) : manage.max,
      options: resolveTableManageOptions({
        columnKey: getTableColumnIdentifier(column),
        currentRecord: record,
        manageType: String(type),
        options: manage.options,
      }),
      onValueChange,
    };
    return type === 'select' || type === 'multiselect' ? (
      <SelectRenderer
        {...fieldProps}
        __name={type === 'select' ? 'FormSelect' : 'FormMultiSelect'}
      />
    ) : (
      <TextFieldLeafRenderer
        {...fieldProps}
        __name={type === 'number' ? 'FormNumber' : 'FormInput'}
      />
    );
  };
  const editingActions = (
    <div className="peaui-table-list__editable-actions-cell">
      <button
        type="button"
        aria-label="Zapisz edytowany rekord"
        className="peaui-table-list__editable-action-button peaui-table-list__editable-action-button--submit"
        onClick={submitEdit}
      >
        <Svg data={iconCheck} name="check" />
      </button>
      <button
        type="button"
        aria-label="Anuluj edycje rekordu"
        className="peaui-table-list__editable-action-button peaui-table-list__editable-action-button--cancel"
        onClick={cancelEdit}
      >
        <Svg data={iconClose} name="close" />
      </button>
    </div>
  );
  const selected = new Set(Array.isArray(props.selectedRows) ? props.selectedRows.map(String) : []);
  const pageRecordKeys = pageRecords.map((record, index) => {
    const id =
      typeof record === 'object' && record !== null && 'id' in record ? record.id : undefined;
    return String(id ?? pageRange.start + index);
  });
  const allPageSelected =
    pageRecordKeys.length > 0 && pageRecordKeys.every((key) => selected.has(key));
  const currentCheckedRow = String(props.currentCheckedRow ?? '');
  const activeSortColumns = bool(props, 'canMultiSort')
    ? normalizeReactTableSortDescriptors(props.sortColumns)
    : [];
  const renderCell =
    typeof props.renderCell === 'function'
      ? (props.renderCell as (
          columnKey: string,
          record: Record<string, unknown>,
          rowIndex: number,
        ) => ReactNode)
      : undefined;
  return (
    <div
      {...common(props)}
      className={cx(
        'peaui-table-list',
        (bool(props, 'isDetails') || bool(props, 'isDetials')) && 'peaui-table-list--details',
        bool(props, 'isLoading') && 'peaui-table-list--loading',
        bool(props, 'scroll') && 'peaui-table-list--scroll',
        props.className,
      )}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      aria-busy={bool(props, 'isLoading') || undefined}
    >
      {bool(props, 'canHideColumns') ? (
        <details className="peaui-table-list__head-actions-popover">
          <summary className="peaui-table-list__head-actions-trigger">Widoczność kolumn</summary>
          <fieldset className="peaui-table-list__head-actions-menu">
            <legend className="peaui-table-list__head-actions-title">Widoczne kolumny</legend>
            {columns.map((column) => (
              <label
                className="peaui-table-list__head-actions-option"
                key={getTableColumnIdentifier(column)}
              >
                <input
                  aria-label={column.label || column.key}
                  checked={!hiddenColumnKeys.has(getTableColumnIdentifier(column))}
                  disabled={
                    column.withLock ||
                    (!hiddenColumnKeys.has(getTableColumnIdentifier(column)) &&
                      visibleColumns.length <= 3)
                  }
                  type="checkbox"
                  onChange={(event) => {
                    setHiddenColumnKeys((current) => {
                      const next = new Set(current);
                      if (event.target.checked) next.delete(getTableColumnIdentifier(column));
                      else if (columns.length - next.size > 3)
                        next.add(getTableColumnIdentifier(column));
                      return next;
                    });
                  }}
                />
                <span>{column.label}</span>
              </label>
            ))}
          </fieldset>
        </details>
      ) : null}
      {bool(props, 'canCreate', editable) && editing?.index !== null ? (
        <button
          className="peaui-table-list__create"
          type="button"
          onClick={() => (editable ? startCreate() : callback(props, 'onCreateRecord')?.())}
        >
          {text(props, 'buttonEditableCreateText', 'Dodaj rekord')}
        </button>
      ) : null}
      <table
        className="peaui-table-list__table"
        aria-label={text(props, 'ariaLabel', 'Tabela danych')}
      >
        <thead
          className={cx(
            'peaui-table-list__head',
            bool(props, 'scroll') && 'peaui-table-list__head--sticky',
          )}
        >
          <tr className="peaui-table-list__head-row">
            {canSelectRows ? (
              <th className="peaui-table-list__select-head-cell" scope="col">
                <input
                  type="checkbox"
                  aria-label="Zaznacz wszystkie rekordy na stronie"
                  checked={allPageSelected}
                  disabled={pageRecordKeys.length === 0}
                  ref={(element) => {
                    if (element)
                      element.indeterminate =
                        !allPageSelected && pageRecordKeys.some((key) => selected.has(key));
                  }}
                  onChange={() =>
                    callback(
                      props,
                      'onSelectRow',
                    )?.(
                      allPageSelected
                        ? [...selected].filter((key) => !pageRecordKeys.includes(key))
                        : [...new Set([...selected, ...pageRecordKeys])],
                    )
                  }
                />
              </th>
            ) : null}
            {bool(props, 'canCheckRows') ? (
              <th className="peaui-table-list__check-head-cell" scope="col">
                <span className="peaui-table-list__sr-only">Wybór pojedynczy</span>
              </th>
            ) : null}
            {visibleColumns.map((column) => {
              const activeMultiSort = activeSortColumns.find(
                (entry) => entry.key === getTableColumnIdentifier(column),
              );
              const activeSortDirection = bool(props, 'canMultiSort')
                ? activeMultiSort?.direction
                : text(props, 'sortColumn') === getTableColumnIdentifier(column)
                  ? text(props, 'sortType', 'desc').toLowerCase() === 'asc'
                    ? 'asc'
                    : 'desc'
                  : undefined;

              return (
                <th
                  key={getTableColumnIdentifier(column)}
                  className={cx(
                    'peaui-table-list__head-cell',
                    column.sortable && 'peaui-table-list__head-cell--sortable',
                    column.border === 'left' && 'peaui-table-list__head-cell--border-left',
                    column.border === 'right' && 'peaui-table-list__head-cell--border-right',
                    column.withLock && 'peaui-table-list__head-cell--locked',
                  )}
                  scope="col"
                  style={{ width: column.width }}
                  aria-sort={
                    activeSortDirection === 'asc'
                      ? 'ascending'
                      : activeSortDirection === 'desc'
                        ? 'descending'
                        : undefined
                  }
                  data-sort-priority={
                    activeMultiSort ? activeSortColumns.indexOf(activeMultiSort) + 1 : undefined
                  }
                >
                  <button
                    className={cx(
                      'peaui-table-list__head-button',
                      column.sortable && 'peaui-table-list__head-button--sortable',
                    )}
                    aria-disabled={!column.sortable || undefined}
                    type="button"
                    onClick={() => {
                      if (!column.sortable) return;

                      callback(
                        props,
                        'onSort',
                      )?.(
                        bool(props, 'canMultiSort')
                          ? getNextReactTableSortDescriptors(
                              activeSortColumns,
                              getTableColumnIdentifier(column),
                            )
                          : getTableColumnIdentifier(column),
                      );
                    }}
                  >
                    <span className="peaui-table-list__head-content">{column.label}</span>
                    {column.sortable ? (
                      <Svg data={iconSort} className="peaui-table-list__sort-icon" name="sort" />
                    ) : null}
                  </button>
                  {column.hint ? (
                    <InfoTooltipRenderer
                      description={node(props, 'hint') ?? column.hintColumn ?? column.label}
                      placement="top"
                    >
                      <Svg data={iconHint} className="peaui-table-list__hint-icon" name="hint" />
                    </InfoTooltipRenderer>
                  ) : null}
                </th>
              );
            })}
            {needsEditingColumn ? <th scope="col">Actions</th> : null}
          </tr>
        </thead>
        <tbody className="peaui-table-list__body">
          {pageRecords.map((entry, pageIndex) => {
            const rowIndex = pageIndex + pageRange.start;
            const record: Record<string, unknown> =
              typeof entry === 'object' && entry !== null
                ? (entry as Record<string, unknown>)
                : { value: entry };
            const id = String(record.id ?? rowIndex);
            return (
              <tr
                key={id}
                className={cx(
                  'peaui-table-list__row',
                  selected.has(id) && 'peaui-table-list__row--selected',
                  (callback(props, 'onRowDoubleClick') || callback(props, 'onDbclick')) &&
                    'peaui-table-list__row--interactive',
                )}
                tabIndex={bool(props, 'canCheckRows') ? 0 : undefined}
                onClick={(event) => {
                  if (bool(props, 'canCheckRows') && !isInteractiveTarget(event.target)) {
                    callback(props, 'onCheckRow')?.(record);
                  }
                }}
                onDoubleClick={() => {
                  callback(props, 'onRowDoubleClick')?.(record.id, record);
                  callback(props, 'onDbclick')?.(record.id, record);
                }}
                onKeyDown={(event) => {
                  if (
                    bool(props, 'canCheckRows') &&
                    ['Enter', ' ', 'Spacebar'].includes(event.key) &&
                    !isInteractiveTarget(event.target)
                  ) {
                    event.preventDefault();
                    callback(props, 'onCheckRow')?.(record);
                  }
                }}
              >
                {canSelectRows ? (
                  <td className="peaui-table-list__select-cell">
                    <input
                      aria-label={`Zaznacz wiersz ${rowIndex + 1}`}
                      checked={selected.has(id)}
                      type="checkbox"
                      onChange={(event) => {
                        const nextSelectedRows = event.target.checked
                          ? [...selected, id]
                          : [...selected].filter((selectedId) => selectedId !== id);
                        callback(props, 'onSelectRow')?.(nextSelectedRows);
                      }}
                    />
                  </td>
                ) : null}
                {bool(props, 'canCheckRows') ? (
                  <td className="peaui-table-list__check-cell">
                    <input
                      aria-label={`Wybierz wiersz ${rowIndex + 1}`}
                      checked={currentCheckedRow === id}
                      name={`${selectionScope}-checked-row`}
                      type="radio"
                      onChange={() => callback(props, 'onCheckRow')?.(record)}
                    />
                  </td>
                ) : null}
                {visibleColumns.map((column) => (
                  <td
                    key={getTableColumnIdentifier(column)}
                    className={cx(
                      'peaui-table-list__body-cell',
                      column.border === 'left' && 'peaui-table-list__body-cell--border-left',
                      column.border === 'right' && 'peaui-table-list__body-cell--border-right',
                      column.withLock && 'peaui-table-list__body-cell--locked',
                    )}
                    style={{ width: column.width }}
                  >
                    {editing?.index === rowIndex ? (
                      column.key === 'actions' ? (
                        editingActions
                      ) : (
                        renderEditor(column, editing.values, rowIndex)
                      )
                    ) : renderCell ? (
                      renderCell(column.key, record, rowIndex)
                    ) : column.resolve ? (
                      <div className="peaui-table-list__actions-simple">
                        {resolveTableActions(column, record).map((action, actionIndex) => {
                          const item = action;
                          const actionKey = String(item.key ?? actionIndex);
                          return (
                            <button
                              aria-label={`${String(item.label ?? actionKey)}: ${String(
                                record.name ?? `wiersz ${rowIndex + 1}`,
                              )}`}
                              className="peaui-table-list__actions-simple-button"
                              key={actionKey}
                              type="button"
                              onClick={() => fireAction(record, rowIndex, actionKey)}
                            >
                              {String(item.label ?? actionKey)}
                            </button>
                          );
                        })}
                      </div>
                    ) : column.inline ? (
                      renderEditor(column, record, rowIndex)
                    ) : resolveTableColumnType(column, record) === 'editable' ? (
                      <TableEditableCell
                        column={column}
                        record={record}
                        renderField={(draft, onChange, error) =>
                          renderEditor(column, draft, rowIndex, onChange, error)
                        }
                      />
                    ) : (
                      TableCellContent({ column, props, record, rowIndex })
                    )}
                  </td>
                ))}
                {needsEditingColumn ? (
                  <td>{editing.index === rowIndex ? editingActions : null}</td>
                ) : null}
              </tr>
            );
          })}
          {editing?.index === null ? (
            <tr className="peaui-table-list__row">
              {canSelectRows ? <td /> : null}
              {bool(props, 'canCheckRows') ? <td /> : null}
              {visibleColumns.map((column) => (
                <td
                  key={getTableColumnIdentifier(column)}
                  className="peaui-table-list__editable-cell"
                >
                  {column.key === 'actions' ? editingActions : renderEditor(column, editing.values)}
                </td>
              ))}
              {needsEditingColumn ? <td>{editingActions}</td> : null}
            </tr>
          ) : null}
        </tbody>
      </table>
      {bool(props, 'paginate') && pageRange.totalPages > 1 ? (
        <div
          className="peaui-table-list__pagination"
          inert={bool(props, 'isLoading') || Boolean(editing)}
        >
          <Pagination
            props={{
              page: pageRange.page,
              totalPages: pageRange.totalPages,
              ariaLabel: text(props, 'paginationLabel', 'Strony tabeli'),
              onPageChange: setPage,
            }}
          />
        </div>
      ) : null}
      {!bool(props, 'isLoading') && records.length === 0 ? (
        <div className="peaui-table-list__empty-inline-cell">
          {text(props, 'emptyDescriptionInline', 'Brak danych')}
        </div>
      ) : null}
      {bool(props, 'isLoading') ? (
        <div className="peaui-table-list__loading" role="status">
          Ładowanie…
        </div>
      ) : null}
      {node(props, 'additionalRow')}
    </div>
  );
}

export function TableListHeaderLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const [filtersOpen, setFiltersOpen] = useModel<boolean>(props, 'filtersOpen', false);
  const additionalDescription =
    node(props, 'additionalDescription') ??
    node(props, 'addtionalDescription') ??
    node(props, 'description');
  const additionalContent = node(props, 'additionalContent') ?? node(props, 'addtionalContent');
  return (
    <header
      ref={forwardedRef}
      className={cx(
        'peaui-table-list-header',
        Boolean(additionalDescription) && 'peaui-table-list-header--with-description',
        props.className,
      )}
    >
      {additionalDescription}
      <div className="peaui-table-list-header__controls">
        <div className="peaui-table-list-header__search-area">
          <strong>{num(props, 'totalRecords')} rekordów</strong>
          {num(props, 'countSelectedRecords') ? (
            <span>{num(props, 'countSelectedRecords')} zaznaczonych</span>
          ) : null}
          {bool(props, 'canSearch') ? (
            <SearchInputLeafRenderer
              ariaLabel="Wyszukaj na liscie"
              className="peaui-table-list-header__search"
              placeholder={text(props, 'searchPlaceholder', 'Wpisz czego szukasz')}
              onSearch={callback(props, 'onSearch')}
            />
          ) : null}
        </div>
        <div className="peaui-table-list-header__actions">
          {bool(props, 'canFilter') ? (
            <button
              className="peaui-table-list-header__filter-button peaui-button-action peaui-button-action--variant-secondary"
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <span className="peaui-table-list-header__filter-button-label">Filtry</span>
              {num(props, 'countFilters') ? (
                <span className="peaui-table-list-header__filter-badge peaui-counter-badge peaui-counter-badge--variant-info">
                  {num(props, 'countFilters')}
                </span>
              ) : null}
            </button>
          ) : null}
          {bool(props, 'canFilter') && num(props, 'countFilters') > 0 ? (
            <button
              aria-label="Wyczyść filtry"
              className="peaui-table-list-header__filter-reset peaui-button-action peaui-button-action--variant-ghost"
              type="button"
              onClick={() => callback(props, 'onResetFilters')?.()}
            >
              <Svg
                data={iconClose}
                className="peaui-table-list-header__filter-reset-icon"
                name="close"
              />
              <span className="peaui-table-list-header__filter-reset-label">Wyczyść filtry</span>
            </button>
          ) : null}
          {bool(props, 'canCreate') ? (
            <button
              aria-label={text(props, 'buttonCreateLabel', 'Dodaj rekord')}
              className="peaui-table-list-header__create-button peaui-button-action peaui-button-action--variant-primary"
              type="button"
              onClick={() => callback(props, 'onCreate')?.()}
            >
              <Svg data={iconPlus} className="peaui-table-list-header__create-icon" name="plus" />
              <span className="peaui-table-list-header__create-label">
                {text(props, 'buttonCreateLabel', 'Dodaj rekord')}
              </span>
            </button>
          ) : null}
          {bool(props, 'canExport') ? (
            <ButtonExportLeafRenderer
              className="peaui-table-list-header__export-button"
              ariaLabel="Eksportuj rekordy listy"
              size="s"
              disabled={num(props, 'totalRecords') === 0}
              forceExport={bool(props, 'forceExport')}
              selectedItemsCount={num(props, 'countSelectedRecords')}
              onExport={callback(props, 'onExport')}
            />
          ) : null}
          {node(props, 'additionalButtons')}
        </div>
      </div>
      {bool(props, 'canFilter') ? (
        <Dialog
          kind="DrawerPanel"
          props={{
            open: filtersOpen,
            onOpenChange: setFiltersOpen,
            ariaLabel: 'Panel filtrowania listy',
            className: 'peaui-table-list-header__filters-drawer',
            children: node(props, 'filtersDrawer'),
          }}
        />
      ) : null}
      {additionalContent}
    </header>
  );
}

export function TableListFooterLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const uid = useId();
  const rowsNumber = num(props, 'rowsNumber');
  const rowsPerPage = Math.max(1, num(props, 'rowsPerPage', 10));
  const page = Math.max(1, num(props, 'page', 1));
  const total = num(props, 'total');
  const under = bool(props, 'under');
  const testId = text(props, 'dataTestId');
  const summaryId = `table-list-current-page-range-${uid}`;
  if (rowsNumber <= 0) return <></>;
  const pagination =
    total > 0 && rowsNumber > rowsPerPage ? (
      <Pagination
        props={{
          className: cx(
            'peaui-table-list-footer__pagination',
            under && 'peaui-table-list-footer__pagination--under',
          ),
          dataTestId: testId ? `${testId}-pagination${under ? '-under' : ''}` : undefined,
          ariaLabel: 'Stronicowanie listy',
          page,
          totalPages: Math.ceil(rowsNumber / rowsPerPage),
          onPageChange: (next: number) => callback(props, 'onChangePage')?.(next),
        }}
      />
    ) : null;
  return (
    <GridSection
      {...common(props)}
      ref={forwardedRef}
      columns={3}
      gap={1}
      role="group"
      aria-label="Stopka listy tabeli"
      aria-describedby={summaryId}
      data-current-page={page}
      data-rows-number={rowsNumber}
      data-rows-per-page={rowsPerPage}
      data-total-pages={total}
      className={cx(
        'peaui-table-list-footer',
        bool(props, 'isFlex') && 'peaui-table-list-footer--flex',
        props.className,
      )}
    >
      <div
        id={summaryId}
        className="peaui-table-list-footer__summary"
        role="status"
        aria-live="polite"
        data-testid={testId ? `${testId}-summary` : undefined}
      >
        Wyświetlane: {getPageRange(page, rowsPerPage, rowsNumber)} / {rowsNumber}
      </div>
      {!under && pagination ? (
        pagination
      ) : (
        <div className="peaui-table-list-footer__placeholder" aria-hidden="true" />
      )}
      <ListLimitControlRenderer
        className="peaui-table-list-footer__limit"
        id={`table-list-footer-limit-${uid}`}
        dataTestId={testId ? `${testId}-limit` : undefined}
        limit={rowsPerPage}
        label="Ilosc rekordow na stronie listy"
        position="top"
        onLimitChange={(limit: number) => callback(props, 'onChangeLimit')?.(limit)}
      >
        Pokaż na stronie
      </ListLimitControlRenderer>
      {under ? pagination : null}
    </GridSection>
  );
}
