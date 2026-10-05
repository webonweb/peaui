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
  iconFilters,
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
  hasTableCopyValue,
  getTableColumnIdentifier,
  getTableRecordIdentity,
  findTableRecordIndex,
  TABLE_LIST_DEFAULT_COLUMN_WIDTH,
  TABLE_LIST_ACTIONS_STICKY_WIDTH,
  TABLE_LIST_MIN_VISIBLE_COLUMNS,
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
import {
  EmptyStateLeafRenderer,
  ProgressIndicatorLeafRenderer,
  SpinnerLoaderLeafRenderer,
} from './feedback.renderer';
import { getTablePage } from '../../components/data-display/TableList/table-page.shared';
import { ButtonActionRenderer } from './button-action.renderer';
import { ChoiceControlsRenderer } from './choice-controls.renderer';
import {
  CounterBadgeLeafRenderer as CounterBadge,
  TagChipLeafRenderer as TagChip,
} from './display.renderer';
import { Popover } from './popover';
import { buildTableLockedColumnsMap } from '../../components/data-display/TableList/table-locking.shared';

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

function TableTypedCellContent({
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
    return (
      <div className="peaui-table-list__date-column">
        <time
          className="peaui-table-list__date-value"
          dateTime={typeof value === 'string' ? value : undefined}
        >
          {formatted}
        </time>
      </div>
    );
  }
  if (type === 'status' || type === 'tag') {
    const label = type === 'status' ? (value ? 'TAK' : 'NIE') : display;
    const variant =
      type === 'status'
        ? value
          ? 'green'
          : 'red'
        : (column.statusDictionary?.[display] ?? 'green');
    return <TagChip size="xs" variant={variant} label={label} />;
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
      <div
        className={
          type === 'action'
            ? 'peaui-table-list__action-column'
            : 'peaui-table-list__edit-action-column'
        }
      >
        {type !== 'action' ? (
          <span className="peaui-table-list__edit-action-value">{display}</span>
        ) : null}
        {type === 'action' ? (
          <ButtonActionRenderer
            size="xs"
            variant="secondary"
            ariaLabel={`${label}: ${String(record.name ?? `wiersz ${rowIndex + 1}`)}`}
            onClick={() =>
              callback(props, 'onAction')?.(record.id, column.actionName ?? 'action', record)
            }
          >
            {label}
          </ButtonActionRenderer>
        ) : (
          <button
            aria-label={`${label}: ${String(record.name ?? `wiersz ${rowIndex + 1}`)}`}
            className={cx(
              'peaui-table-list__actions-simple-button',
              'peaui-table-list__edit-action-button',
            )}
            type="button"
            onClick={() =>
              callback(props, 'onAction')?.(record.id, column.actionName ?? 'edit-inline', record)
            }
          >
            <Svg name="edit2" className="peaui-table-list__actions-simple-icon" />
          </button>
        )}
      </div>
    );
  }
  if (type === 'stepper' && column.steps) {
    const steps = column.steps(record);
    return (
      <div className="peaui-table-list__stepper">
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
                  else if (step.collapse)
                    callback(props, 'onAction')?.(record.id, 'expand', record);
                }}
              >
                <span className="peaui-table-list__stepper-label">{step.label}</span>
                {step.collapse ? (
                  <ProgressIndicatorLeafRenderer
                    className="peaui-table-list__stepper-progress-indicator"
                    active={step.collapse.activeElements}
                    steps={step.collapse.count}
                    size={20}
                    strokeWidth={2.5}
                  />
                ) : null}
                {step.collapse ? (
                  <Svg
                    name="arrow"
                    className={cx(
                      'peaui-table-list__stepper-arrow',
                      props.isExpanded
                        ? 'peaui-table-list__stepper-arrow--expanded'
                        : 'peaui-table-list__stepper-arrow--collapsed',
                    )}
                  />
                ) : null}
                {step.status === 'complete' ? (
                  <Svg name="checkCircle" className="peaui-table-list__stepper-complete-icon" />
                ) : null}
                {step.status === 'disabled' ? (
                  <InfoTooltipRenderer
                    placement="right"
                    description={
                      <>
                        Aby przejść do wybranego kroku, musisz wypełnić <br />
                        poprzedni.
                      </>
                    }
                  >
                    <Svg name="lock" className="peaui-table-list__stepper-lock-icon" />
                  </InfoTooltipRenderer>
                ) : null}
              </button>
            </Fragment>
          ))}
        </div>
      </div>
    );
  }
  if (type === 'expandable') {
    return (
      <div className="peaui-table-list__expandable-column">
        <button
          aria-label={`Pokaż szczegóły: ${String(record.name ?? `wiersz ${rowIndex + 1}`)}`}
          className="peaui-table-list__expandable-button"
          aria-expanded={Boolean(props.isExpanded)}
          type="button"
          onClick={() => callback(props, 'onAction')?.(record.id, 'expand', record)}
        >
          <span className="peaui-table-list__expandable-value">{display}</span>
          <Svg
            name="arrow"
            className={cx(
              'peaui-table-list__expandable-arrow',
              props.isExpanded
                ? 'peaui-table-list__expandable-arrow--expanded'
                : 'peaui-table-list__expandable-arrow--collapsed',
            )}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="peaui-table-list__text-column">
      <span className="peaui-table-list__text-value">{display}</span>
      {column.hintColumn ? (
        <InfoTooltipRenderer description={column.hintColumn} placement="top">
          <Svg data={iconHint} className="peaui-table-list__hint-icon" name="hint" />
        </InfoTooltipRenderer>
      ) : null}
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
  const display = String(resolveTableTextValue(tableCellValue(record, column), column.deep));
  if (resolveTableColumnType(column, record) === 'text' && !column.canCopy && !column.hintColumn) {
    return (
      <span className="peaui-table-list__text-value peaui-table-list__plain-text-column">
        {display}
      </span>
    );
  }
  return (
    <div
      className={cx(
        'peaui-table-list__body-cell-content',
        column.canCopy && 'peaui-table-list__body-cell-content--copyable',
      )}
      style={{
        minWidth: column.width ?? TABLE_LIST_DEFAULT_COLUMN_WIDTH,
        width: column.width ?? '100%',
      }}
    >
      <TableTypedCellContent column={column} props={props} record={record} rowIndex={rowIndex} />
      {column.canCopy && hasTableCopyValue(tableCellValue(record, column)) ? (
        <InfoTooltipRenderer description="Skopiuj tekst z kolumny" placement="right">
          <button
            aria-label={`Kopiuj ${column.label ?? column.key}: ${display}`}
            className="peaui-table-list__copy-button"
            type="button"
            onClick={() => copyTextToClipboard(display)}
          >
            <Svg data={iconCopy} className="peaui-table-list__copy-icon" name="copy" />
          </button>
        </InfoTooltipRenderer>
      ) : null}
    </div>
  );
}

function TableRowActions({
  column,
  record,
  rowIndex,
  onAction,
}: {
  column: TableColumn;
  record: Record<string, unknown>;
  rowIndex: number;
  onAction: (key: string) => void;
}): ReactElement {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLElement>(null);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const actions = resolveTableActions(column, record);
  const simple = actions.length === 1 && Boolean(actions[0]?.simple);
  useEffect(() => {
    if (open) buttons.current[0]?.focus();
  }, [open]);
  const close = (): void => {
    setOpen(false);
    trigger.current?.focus();
  };
  const select = (key: string): void => {
    onAction(key);
    close();
  };
  const actionLabel = (action: Record<string, unknown>, key: string): string =>
    `${String(action.label ?? key)}: ${String(record.name ?? `wiersz ${rowIndex + 1}`)}`;
  if (column.visibleColumn?.(record) === false)
    return <span className="peaui-table-list__actions-simple">&nbsp;</span>;
  if (simple) {
    const action = actions[0]!;
    const key = String(action.key ?? '0');
    return (
      <span className="peaui-table-list__actions-simple">
        <button
          type="button"
          className="peaui-table-list__actions-simple-button"
          aria-label={actionLabel(action, key)}
          onClick={() => onAction(key)}
        >
          <Svg name={String(action.icon ?? '')} className="peaui-table-list__actions-simple-icon" />
        </button>
      </span>
    );
  }
  return (
    <Popover
      kind="PopoverOverlayer"
      forwardedRef={trigger}
      props={{
        open,
        onOpenChange: setOpen,
        placement: 'left',
        matchTriggerWidth: false,
        className: 'peaui-table-list__actions-popover-trigger',
        contentClass: 'peaui-table-list__actions-popover',
        ariaLabel: 'Pokaz akcje dla rekordu',
        children: (
          <span className="peaui-table-list__actions-trigger" aria-hidden="true">
            &bull; &bull; &bull;
          </span>
        ),
        content: (
          <div className="peaui-table-list__actions-menu">
            <div className="peaui-table-list__actions-list">
              {actions.map((action, index) => {
                const key = String(action.key ?? index);
                return (
                  <button
                    key={key}
                    ref={(element) => {
                      buttons.current[index] = element;
                    }}
                    type="button"
                    className="peaui-table-list__actions-button"
                    aria-label={actionLabel(action, key)}
                    onClick={() => select(key)}
                    onKeyDown={(event) => {
                      const target =
                        event.key === 'ArrowDown'
                          ? (index + 1) % actions.length
                          : event.key === 'ArrowUp'
                            ? (index - 1 + actions.length) % actions.length
                            : event.key === 'Home'
                              ? 0
                              : event.key === 'End'
                                ? actions.length - 1
                                : undefined;
                      if (target !== undefined) {
                        event.preventDefault();
                        buttons.current[target]?.focus();
                      } else if (event.key === 'Escape') {
                        event.preventDefault();
                        close();
                      }
                    }}
                  >
                    <Svg
                      name={String(action.icon ?? '')}
                      className="peaui-table-list__actions-button-icon"
                    />
                    <span className="peaui-table-list__actions-button-label">
                      {String(action.label ?? key)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ),
      }}
    />
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
  const [expandedRow, setExpandedRow] = useState<string>();
  const [columnVisibilityOverrides, setColumnVisibilityOverrides] = useState<
    Record<string, boolean>
  >({});
  const [lockedColumnKeys, setLockedColumnKeys] = useState<Record<string, boolean>>({});
  const [horizontalMetrics, setHorizontalMetrics] = useState({ left: 0, width: 0 });
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const update = (): void =>
      setHorizontalMetrics({ left: root.scrollLeft, width: root.clientWidth });
    update();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update);
    observer?.observe(root);
    return () => observer?.disconnect();
  }, [props.isLoading, props.records]);
  const [page, setPage] = useModel<number>(props, 'page', 1);
  useEffect(() => {
    setColumnVisibilityOverrides({});
    setLockedColumnKeys({});
  }, [props.columns]);

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
    (column) =>
      columnVisibilityOverrides[getTableColumnIdentifier(column)] ?? column.visible ?? true,
  );
  const hasActionsColumn = visibleColumns.some(
    (column) =>
      (column.key === 'actions' || column.resolve) &&
      Array.isArray(props.records) &&
      props.records.some(
        (record) =>
          record &&
          typeof record === 'object' &&
          resolveTableActions(column, record as Record<string, unknown>).length > 0,
      ),
  );
  const lockedColumns = buildTableLockedColumnsMap(
    visibleColumns
      .filter((column) => column.key !== 'actions' && !column.resolve)
      .map((column) => ({
        ...column,
        width: typeof column.width === 'number' ? column.width : undefined,
      })),
    lockedColumnKeys,
    horizontalMetrics.left,
    horizontalMetrics.width,
    hasActionsColumn ? TABLE_LIST_ACTIONS_STICKY_WIDTH : 0,
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
  const canCheckRows = bool(props, 'canCheckRows') && !editable;
  const columnSpan =
    visibleColumns.filter((column) => column.key !== 'actions' && !column.resolve).length +
    Number(canSelectRows) +
    Number(canCheckRows) +
    Number(hasActionsColumn);
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
      className: 'peaui-table-list__editable-cell-field',
      ariaLabel: column.inline
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
    <>
      <button
        type="button"
        aria-label="Zapisz edytowany rekord"
        className="peaui-table-list__editable-action-button peaui-table-list__editable-action-button--submit"
        onClick={submitEdit}
      >
        <Svg data={iconCheck} name="check" className="peaui-table-list__editable-action-icon" />
      </button>
      <button
        type="button"
        aria-label="Anuluj edycje rekordu"
        className="peaui-table-list__editable-action-button peaui-table-list__editable-action-button--cancel"
        onClick={cancelEdit}
      >
        <Svg data={iconClose} name="close" className="peaui-table-list__editable-action-icon" />
      </button>
    </>
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
  const dataColumns = columns.filter((column) => column.key !== 'actions' && !column.resolve);
  const visibleDataColumnCount = visibleColumns.filter(
    (column) => column.key !== 'actions' && !column.resolve,
  ).length;
  const columnVisibility =
    bool(props, 'canHideColumns') &&
    (dataColumns.length > TABLE_LIST_MIN_VISIBLE_COLUMNS ||
      dataColumns.some((column) => column.visible === false)) ? (
      <Popover
        kind="PopoverOverlayer"
        props={{
          ariaLabel: 'Zarzadzaj widocznoscia kolumn',
          placement: 'bottom-left',
          className: 'peaui-table-list__head-actions-popover-trigger',
          contentClass: 'peaui-table-list__head-actions-popover',
          children: (
            <span className="peaui-table-list__head-actions-trigger" aria-hidden="true">
              <Svg name="cogs" className="peaui-table-list__head-actions-trigger-icon" />
            </span>
          ),
          content: (
            <div className="peaui-table-list__head-actions-menu">
              <p className="peaui-table-list__head-actions-title">Widoczne kolumny</p>
              <p className="peaui-table-list__head-actions-description">
                Pozostaw przynajmniej {TABLE_LIST_MIN_VISIBLE_COLUMNS} kolumny widoczne.
              </p>
              <ul className="peaui-table-list__head-actions-list">
                {dataColumns.map((column) => {
                  const key = getTableColumnIdentifier(column);
                  const checked = visibleColumns.includes(column);
                  const disabled =
                    checked &&
                    (Boolean(lockedColumnKeys[column.key]) ||
                      visibleDataColumnCount <= TABLE_LIST_MIN_VISIBLE_COLUMNS);
                  return (
                    <li key={key} className="peaui-table-list__head-actions-item">
                      <label
                        className={cx(
                          'peaui-table-list__head-actions-option',
                          disabled && 'peaui-table-list__head-actions-option--disabled',
                        )}
                      >
                        <input
                          aria-label={column.label || column.key}
                          className="peaui-table-list__head-actions-checkbox"
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={(event) => {
                            const nextChecked = event.target.checked;
                            setColumnVisibilityOverrides((current) => ({
                              ...current,
                              [key]: nextChecked,
                            }));
                          }}
                        />
                        <span className="peaui-table-list__head-actions-option-label">
                          {column.label}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ),
        }}
      />
    ) : null;
  if (
    !bool(props, 'isLoading') &&
    !editing &&
    records.length === 0 &&
    bool(props, 'emptyDescription', true)
  ) {
    return (
      <EmptyStateLeafRenderer
        {...common(props)}
        forwardedRef={forwardedRef}
        role="status"
        title="Lista jest pusta"
        description="Nie znaleziono żadnych rekordów. Dodaj nowy rekord lub zmień kryteria wyszukiwania."
        additional={
          bool(props, 'canCreate', true) ? (
            <ButtonActionRenderer
              size="xs"
              variant="secondary"
              ariaLabel="Dodaj nowy rekord"
              onClick={() => {
                if (editable) startCreate();
                callback(props, 'onCreateRecord')?.();
              }}
            >
              Dodaj nowy rekord
            </ButtonActionRenderer>
          ) : (
            <></>
          )
        }
      />
    );
  }
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
      ref={(element) => {
        rootRef.current = element;
        if (typeof forwardedRef === 'function') forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
      }}
      aria-busy={bool(props, 'isLoading') || undefined}
      role={bool(props, 'scroll') ? 'region' : common(props).role}
      aria-label={
        bool(props, 'scroll')
          ? text(props, 'ariaLabel', 'Tabela danych')
          : common(props)['aria-label']
      }
      tabIndex={bool(props, 'scroll') ? 0 : common(props).tabIndex}
      onScroll={(event) =>
        setHorizontalMetrics({
          left: event.currentTarget.scrollLeft,
          width: event.currentTarget.clientWidth,
        })
      }
    >
      {bool(props, 'isLoading') ? <SpinnerLoaderLeafRenderer /> : null}
      <table
        className="peaui-table-list__table"
        aria-label={text(props, 'ariaLabel', 'Tabela danych')}
        inert={bool(props, 'isLoading')}
      >
        <thead
          className={cx(
            'peaui-table-list__head',
            bool(props, 'scroll') && 'peaui-table-list__head--sticky',
          )}
        >
          <tr
            className={cx(
              'peaui-table-list__head-row',
              (bool(props, 'isDetails') || bool(props, 'isDetials')) &&
                'peaui-table-list__head-row--details',
            )}
          >
            {canCheckRows ? (
              <th className="peaui-table-list__check-head-cell" scope="col">
                <span className="peaui-table-list__sr-only">Wybór pojedynczy</span>
              </th>
            ) : null}
            {canSelectRows ? (
              <th className="peaui-table-list__select-head-cell" scope="col">
                <ChoiceControlsRenderer
                  __name="FormCheckbox"
                  id={`${selectionScope}-select-all`}
                  name="select-all-rows"
                  aria-label="Zaznacz wszystkie rekordy na stronie"
                  value={allPageSelected}
                  disabled={pageRecordKeys.length === 0}
                  indeterminate={
                    !allPageSelected && pageRecordKeys.some((key) => selected.has(key))
                  }
                  onValueChange={() =>
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
            {visibleColumns.map((column) => {
              if (column.key === 'actions' || column.resolve)
                return hasActionsColumn ? (
                  <th
                    key={getTableColumnIdentifier(column)}
                    scope="col"
                    className="peaui-table-list__actions-head-cell"
                  >
                    {columnVisibility}
                    <span className="peaui-table-list__sr-only">Dodatkowe akcje dla rekordow</span>
                  </th>
                ) : null;
              const activeMultiSort = activeSortColumns.find(
                (entry) => entry.key === getTableColumnIdentifier(column),
              );
              const activeSortDirection = bool(props, 'canMultiSort')
                ? activeMultiSort?.direction
                : text(props, 'sortColumn', 'updatedAt') === getTableColumnIdentifier(column)
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
                    lockedColumns[column.key] && 'peaui-table-list__head-cell--locked',
                    lockedColumns[column.key] &&
                      `peaui-table-list__head-cell--locked-${lockedColumns[column.key]?.side}`,
                  )}
                  scope="col"
                  style={{
                    minWidth: column.width ?? TABLE_LIST_DEFAULT_COLUMN_WIDTH,
                    width: column.width ?? '100%',
                    ...(lockedColumns[column.key]
                      ? { [lockedColumns[column.key]!.side]: lockedColumns[column.key]!.offset }
                      : {}),
                  }}
                  aria-sort={
                    activeSortDirection === 'asc'
                      ? 'ascending'
                      : activeSortDirection === 'desc'
                        ? 'descending'
                        : 'none'
                  }
                  data-sort-priority={
                    activeMultiSort ? activeSortColumns.indexOf(activeMultiSort) + 1 : undefined
                  }
                >
                  <div className="peaui-table-list__head-content">
                    <button
                      className={cx(
                        'peaui-table-list__head-button',
                        column.sortable
                          ? 'peaui-table-list__head-button--sortable'
                          : 'peaui-table-list__head-button--static',
                        activeSortDirection && 'peaui-table-list__head-button--active',
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
                      <span className="peaui-table-list__head-label">{column.label}</span>
                      {activeSortDirection ? (
                        <Svg
                          data={iconSort}
                          className={cx(
                            'peaui-table-list__head-sort-icon',
                            `peaui-table-list__head-sort-icon--${activeSortDirection}`,
                          )}
                          name="sort"
                        />
                      ) : null}
                    </button>
                    <div className="peaui-table-list__head-controls">
                      {column.withLock ? (
                        <InfoTooltipRenderer
                          description={
                            lockedColumnKeys[column.key] ? 'Odblokuj kolumne' : 'Zablokuj kolumne'
                          }
                          placement="top"
                        >
                          <button
                            type="button"
                            className={cx(
                              'peaui-table-list__head-lock-trigger',
                              lockedColumnKeys[column.key] &&
                                'peaui-table-list__head-lock-trigger--active',
                            )}
                            aria-label={
                              lockedColumnKeys[column.key] ? 'Odblokuj kolumne' : 'Zablokuj kolumne'
                            }
                            aria-pressed={Boolean(lockedColumnKeys[column.key])}
                            onClick={() =>
                              setLockedColumnKeys((current) => ({
                                ...current,
                                [column.key]: !current[column.key],
                              }))
                            }
                          >
                            <Svg
                              name={lockedColumnKeys[column.key] ? 'lock-closed' : 'lock-open'}
                              className="peaui-table-list__head-lock-icon"
                            />
                          </button>
                        </InfoTooltipRenderer>
                      ) : null}
                      {column.hint ? (
                        <InfoTooltipRenderer
                          description={node(props, 'hint') ?? column.hintColumn ?? column.label}
                          placement="top"
                        >
                          <Svg
                            data={iconHint}
                            className="peaui-table-list__hint-icon"
                            name="hint"
                          />
                        </InfoTooltipRenderer>
                      ) : null}
                      {!hasActionsColumn &&
                      columnVisibility &&
                      column ===
                        visibleColumns
                          .filter((entry) => entry.key !== 'actions' && !entry.resolve)
                          .at(-1) ? (
                        <div>{columnVisibility}</div>
                      ) : null}
                    </div>
                  </div>
                </th>
              );
            })}
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
            const cellProps: RuntimeProps = {
              ...props,
              isExpanded: expandedRow === id,
              onAction: (recordId: unknown, action: string, actionRecord: unknown) => {
                if (action === 'expand')
                  setExpandedRow((current) => (current === id ? undefined : id));
                callback(props, 'onAction')?.(recordId, action, actionRecord);
              },
            };
            return (
              <Fragment key={id}>
                <tr
                  className={cx(
                    'peaui-table-list__row',
                    selected.has(id) && 'peaui-table-list__row--selected',
                    (canCheckRows ||
                      callback(props, 'onRowDoubleClick') ||
                      callback(props, 'onDbclick')) &&
                      'peaui-table-list__row--interactive',
                    editing?.index === rowIndex && 'peaui-table-list__row--editing',
                  )}
                  tabIndex={canCheckRows ? 0 : undefined}
                  onClick={(event) => {
                    if (canCheckRows && !isInteractiveTarget(event.target)) {
                      callback(props, 'onCheckRow')?.(record);
                    }
                  }}
                  onDoubleClick={() => {
                    callback(props, 'onRowDoubleClick')?.(record.id, record);
                    callback(props, 'onDbclick')?.(record.id, record);
                  }}
                  onKeyDown={(event) => {
                    if (
                      canCheckRows &&
                      ['Enter', ' ', 'Spacebar'].includes(event.key) &&
                      !isInteractiveTarget(event.target)
                    ) {
                      event.preventDefault();
                      callback(props, 'onCheckRow')?.(record);
                    }
                  }}
                >
                  {canCheckRows ? (
                    <td className="peaui-table-list__check-cell">
                      <input
                        aria-label={`Wybierz wiersz ${rowIndex + 1}`}
                        className="peaui-table-list__check-input"
                        checked={currentCheckedRow === id}
                        name={`${selectionScope}-checked-row`}
                        type="radio"
                        onChange={() => callback(props, 'onCheckRow')?.(record)}
                      />
                    </td>
                  ) : null}
                  {canSelectRows ? (
                    <td className="peaui-table-list__select-cell">
                      <ChoiceControlsRenderer
                        __name="FormCheckbox"
                        id={`${selectionScope}-select-${id}`}
                        name="selected-rows"
                        aria-label={`Zaznacz wiersz ${rowIndex + 1}`}
                        value={selected.has(id)}
                        onValueChange={(value: boolean) => {
                          const nextSelectedRows = value
                            ? [...selected, id]
                            : [...selected].filter((selectedId) => selectedId !== id);
                          callback(props, 'onSelectRow')?.(nextSelectedRows);
                        }}
                      />
                    </td>
                  ) : null}
                  {visibleColumns
                    .filter(
                      (column) =>
                        !(column.key === 'actions' || column.resolve) ||
                        (hasActionsColumn && (!editing || editing.index === rowIndex)),
                    )
                    .map((column) => (
                      <td
                        key={getTableColumnIdentifier(column)}
                        className={cx(
                          column.key === 'actions' || column.resolve
                            ? editing?.index === rowIndex
                              ? 'peaui-table-list__editable-actions-cell'
                              : 'peaui-table-list__actions-cell'
                            : editing?.index === rowIndex
                              ? 'peaui-table-list__editable-cell'
                              : 'peaui-table-list__body-cell',
                          column.border === 'left' && 'peaui-table-list__body-cell--border-left',
                          column.border === 'right' && 'peaui-table-list__body-cell--border-right',
                          lockedColumns[column.key] && 'peaui-table-list__body-cell--locked',
                          lockedColumns[column.key] &&
                            `peaui-table-list__body-cell--locked-${lockedColumns[column.key]?.side}`,
                        )}
                        style={
                          column.key === 'actions' || column.resolve
                            ? undefined
                            : {
                                minWidth: column.width ?? TABLE_LIST_DEFAULT_COLUMN_WIDTH,
                                width: column.width ?? '100%',
                                ...(lockedColumns[column.key]
                                  ? {
                                      [lockedColumns[column.key]!.side]:
                                        lockedColumns[column.key]!.offset,
                                    }
                                  : {}),
                              }
                        }
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
                          <TableRowActions
                            column={column}
                            record={record}
                            rowIndex={rowIndex}
                            onAction={(key) => fireAction(record, rowIndex, key)}
                          />
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
                          TableCellContent({ column, props: cellProps, record, rowIndex })
                        )}
                      </td>
                    ))}
                  {needsEditingColumn && editing.index === rowIndex ? (
                    <td className="peaui-table-list__editable-actions-cell">{editingActions}</td>
                  ) : null}
                </tr>
                {expandedRow === id ? (
                  <tr className="peaui-table-list__expanded-row">
                    <td className="peaui-table-list__expanded-cell" colSpan={columnSpan}>
                      {node(props, 'detailsRecord') ?? node(props, 'detialsRecord')}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
          {editable && bool(props, 'canCreate', true) && editing?.index !== null ? (
            <tr>
              <td
                className="peaui-table-list__create-row-cell"
                colSpan={columnSpan}
                aria-label="Dodawanie rekordu"
              >
                <ButtonActionRenderer
                  className="peaui-table-list__create-row-button"
                  size="xs"
                  disabled={Boolean(editing)}
                  onClick={startCreate}
                >
                  {text(props, 'buttonEditableCreateText', 'Dodaj')}
                </ButtonActionRenderer>
              </td>
            </tr>
          ) : null}
          {editing?.index === null ? (
            <tr className="peaui-table-list__row">
              {canSelectRows ? <td /> : null}
              {canCheckRows ? <td /> : null}
              {visibleColumns
                .filter((column) => column.key !== 'actions' && !column.resolve)
                .map((column) => (
                  <td
                    key={getTableColumnIdentifier(column)}
                    className="peaui-table-list__editable-cell"
                    style={{
                      minWidth: column.width ?? TABLE_LIST_DEFAULT_COLUMN_WIDTH,
                      width: column.width ?? '100%',
                    }}
                  >
                    {renderEditor(column, editing.values)}
                  </td>
                ))}
              <td className="peaui-table-list__editable-actions-cell">{editingActions}</td>
            </tr>
          ) : null}
          {records.length === 0 && text(props, 'emptyDescriptionInline') ? (
            <tr>
              <td className="peaui-table-list__empty-inline-cell" colSpan={columnSpan}>
                {text(props, 'emptyDescriptionInline')}
              </td>
            </tr>
          ) : null}
          {node(props, 'additionalRow') ? (
            <tr className="peaui-table-list__additional-row">{node(props, 'additionalRow')}</tr>
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
  const additionalButtons = node(props, 'additionalButtons');
  return (
    <div
      {...common(props)}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      role="region"
      aria-label="Nagłówek listy tabeli"
      data-testid={text(props, 'dataTestId', 'table-list-header')}
      className={cx(
        'peaui-table-list-header',
        additionalDescription
          ? 'peaui-table-list-header--with-description'
          : 'peaui-table-list-header--without-description',
        props.className,
      )}
    >
      <div className="peaui-table-list-header__controls">
        {bool(props, 'canSearch') || bool(props, 'canFilter') ? (
          <div className="peaui-table-list-header__search-area">
            <div className="peaui-table-list-header__search">
              {bool(props, 'canSearch') ? (
                <SearchInputLeafRenderer
                  ariaLabel="Wyszukaj na liscie"
                  dataTestId="table-list-header-search"
                  placeholder={text(props, 'searchPlaceholder', 'Wpisz czego szukasz')}
                  onSearch={callback(props, 'onSearch')}
                />
              ) : null}
            </div>
            {bool(props, 'canFilter') ? (
              <ButtonActionRenderer
                className="peaui-table-list-header__filter-button"
                dataTestId="table-list-header-filter-button"
                size="s"
                variant="secondary"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <Svg
                  data={iconFilters}
                  className="peaui-table-list-header__filter-reset-icon"
                  name="filters"
                />
                <span className="peaui-table-list-header__filter-button-label">Filtruj</span>
                {num(props, 'countFilters') ? (
                  <CounterBadge
                    className="peaui-table-list-header__filter-badge"
                    value={num(props, 'countFilters')}
                    variant="info"
                  />
                ) : null}
              </ButtonActionRenderer>
            ) : null}
            {bool(props, 'canFilter') && num(props, 'countFilters') > 0 ? (
              <ButtonActionRenderer
                ariaLabel="Wyczyść filtry"
                className="peaui-table-list-header__filter-reset"
                dataTestId="table-list-header-filter-reset"
                size="s"
                variant="ghost"
                onClick={() => callback(props, 'onResetFilters')?.()}
              >
                <Svg
                  data={iconClose}
                  className="peaui-table-list-header__filter-reset-icon"
                  name="close"
                />
                <span className="peaui-table-list-header__filter-reset-label">Wyczysc filtry</span>
              </ButtonActionRenderer>
            ) : null}
            {bool(props, 'canFilter') ? (
              <Dialog
                kind="DrawerPanel"
                props={{
                  open: filtersOpen,
                  ariaLabel: 'Panel filtrowania listy',
                  className: 'peaui-table-list-header__filters-drawer',
                  dataTestId: 'table-list-header-filters-drawer',
                  onOpenChange: setFiltersOpen,
                  children: node(props, 'filtersDrawer'),
                }}
              />
            ) : null}
          </div>
        ) : null}
        {bool(props, 'canCreate') || bool(props, 'canExport') || additionalButtons ? (
          <div className="peaui-table-list-header__actions">
            {bool(props, 'canCreate') ? (
              <ButtonActionRenderer
                ariaLabel={text(props, 'buttonCreateLabel', 'Dodaj rekord')}
                className="peaui-table-list-header__create-button"
                dataTestId="table-list-header-create"
                size="s"
                variant="primary"
                onClick={() => callback(props, 'onCreate')?.()}
              >
                <Svg data={iconPlus} className="peaui-table-list-header__create-icon" name="plus" />
                <span className="peaui-table-list-header__create-label">
                  {text(props, 'buttonCreateLabel', 'Dodaj rekord')}
                </span>
              </ButtonActionRenderer>
            ) : null}
            {additionalButtons}
            {bool(props, 'canExport') ? (
              <ButtonExportLeafRenderer
                className="peaui-table-list-header__export-button"
                ariaLabel="Eksportuj rekordy listy"
                dataTestId="table-list-header-export"
                size="s"
                disabled={num(props, 'totalRecords') === 0}
                forceExport={bool(props, 'forceExport')}
                selectedItemsCount={num(props, 'countSelectedRecords')}
                onExport={callback(props, 'onExport')}
              />
            ) : null}
          </div>
        ) : null}
      </div>
      {additionalContent}
      {additionalDescription}
    </div>
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
        {`Wyświetlane: ${getPageRange(page, rowsPerPage, rowsNumber)} / ${rowsNumber}`}
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
