/** @jsxImportSource react */
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
} from 'react';

import {
  areTransferListKeysEqual,
  filterTransferListItems,
  findTransferListEdgeIndex,
  findTransferListEnabledIndex,
  getTransferListLabels,
  getTransferListPanelItems,
  getTransferListRangeKeys,
  moveTransferListItems,
  normalizeTransferListItems,
  normalizeTransferListKeys,
  normalizeTransferListLoading,
  normalizeTransferListSelection,
  type ResolvedTransferListItem,
  type TransferListDirection,
  type TransferListItem,
  type TransferListKey,
  type TransferListKeyResolver,
  type TransferListLabelResolver,
  type TransferListLabels,
  type TransferListLoadingState,
  type TransferListMoveDetail,
  type TransferListOrientation,
  type TransferListPanel,
  type TransferListSearchDetail,
  type TransferListSelectionDetail,
  type TransferListSize,
  type TransferListSort,
} from '../components/data-entry/TransferList/transfer-list.shared';
import { reactIconData } from './generated-icon-data';

type RuntimeProps = Record<string, unknown> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const cx = (...values: Array<string | false | null | undefined>): string =>
  values
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .join(' ');

const bool = (props: RuntimeProps, name: string, fallback = false): boolean =>
  typeof props[name] === 'boolean' ? props[name] : fallback;

const text = (props: RuntimeProps, name: string, fallback = ''): string => {
  const value = props[name];
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
};

const call = (props: RuntimeProps, name: string, ...args: unknown[]): void => {
  const handler = props[name];
  if (typeof handler === 'function') (handler as (...values: unknown[]) => void)(...args);
};

function assignRef<T>(ref: ForwardedRef<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as MutableRefObject<T | null>).current = value;
}

function TransferIcon({ flip = false, name }: { flip?: boolean; name: string }): ReactElement {
  const icon = reactIconData[name] ?? reactIconData.info;
  return (
    <svg
      aria-hidden="true"
      className="peaui-svg-icon"
      dangerouslySetInnerHTML={{ __html: icon?.body ?? '' }}
      focusable="false"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      viewBox={icon?.viewBox ?? '0 0 24 24'}
    />
  );
}

function TransferSearch({
  ariaLabel,
  blocked,
  onChange,
  placeholder,
  testId,
  value,
}: {
  ariaLabel: string;
  blocked: boolean;
  onChange: (value: string) => void;
  placeholder: string;
  testId?: string;
  value: string;
}): ReactElement {
  return (
    <div className="peaui-search-input peaui-transfer-list__search" data-testid={testId}>
      <div className="peaui-search-input__field" data-disabled={blocked || undefined}>
        <span className="peaui-search-input__field-icon">
          <TransferIcon name="search" />
        </span>
        <input
          aria-label={ariaLabel}
          className="peaui-search-input__input peaui-search-input__input--interactive"
          data-testid={testId ? `${testId}-element` : undefined}
          disabled={blocked}
          onChange={(event) => onChange(event.currentTarget.value)}
          placeholder={placeholder}
          type="search"
          value={value}
        />
        {value ? (
          <button
            aria-label={`${ariaLabel}: wyczyść`}
            className="peaui-search-input__erase-button"
            disabled={blocked}
            onClick={() => onChange('')}
            type="button"
          >
            <span className="peaui-search-input__erase-icon">
              <TransferIcon name="close" />
            </span>
          </button>
        ) : null}
        <button
          aria-label={ariaLabel}
          className="peaui-button-action peaui-button-action--variant-primary peaui-button-action--size-s peaui-search-input__button"
          disabled={blocked}
          onClick={() => onChange(value)}
          type="button"
        >
          <span className="peaui-search-input__button-icon">
            <TransferIcon name="search" />
          </span>
        </button>
      </div>
    </div>
  );
}

function TransferCheckbox({
  ariaLabel,
  checked,
  disabled,
  id,
  onChange,
  testId,
}: {
  ariaLabel: string;
  checked: boolean;
  disabled: boolean;
  id: string;
  onChange: (checked: boolean) => void;
  testId?: string;
}): ReactElement {
  return (
    <div className="peaui-form-field-checkbox peaui-form-field-checkbox--with-slot">
      <input
        aria-label={ariaLabel}
        checked={checked}
        className={cx(
          'peaui-form-field-checkbox__element',
          disabled && 'peaui-form-field-checkbox__element--disabled',
        )}
        data-testid={testId ? `${testId}-element` : undefined}
        disabled={disabled}
        id={id}
        onChange={(event) => onChange(event.currentTarget.checked)}
        type="checkbox"
      />
      <label
        className={cx(
          'peaui-form-field-checkbox__label peaui-form-field-checkbox__label--normal',
          disabled && 'peaui-form-field-checkbox__label--disabled',
        )}
        htmlFor={id}
      >
        {ariaLabel}
      </label>
    </div>
  );
}

function TransferEmpty({ testId, title }: { testId?: string; title: string }): ReactElement {
  const id = useId().replaceAll(':', '');
  return (
    <section aria-labelledby={`${id}-title`} className="peaui-empty-state" data-testid={testId}>
      <svg
        aria-hidden="true"
        className="peaui-empty-state__icon"
        focusable="false"
        viewBox="0 0 64 41"
      >
        <g fill="none" fillRule="evenodd" transform="translate(0 1)">
          <ellipse className="peaui-empty-state__icon-shadow" cx="32" cy="33" rx="32" ry="7" />
          <g className="peaui-empty-state__icon-outline" fillRule="nonzero">
            <path d="M55 12.76 44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24Z" />
            <path
              className="peaui-empty-state__icon-line"
              d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007Z"
            />
          </g>
        </g>
      </svg>
      <div className="peaui-empty-state__content">
        <h3 className="peaui-empty-state__title" id={`${id}-title`}>
          {title}
        </h3>
      </div>
    </section>
  );
}

function TransferSpinner({ label, testId }: { label: string; testId?: string }): ReactElement {
  return (
    <div
      aria-busy="true"
      className="peaui-spinner-loader peaui-spinner-loader--fullscreen"
      data-testid={testId}
    >
      <div
        aria-atomic="true"
        aria-live="polite"
        className="peaui-spinner-loader__text"
        role="status"
      >
        {label}
      </div>
      <div aria-hidden="true" className="peaui-spinner-loader__spinner" />
    </div>
  );
}

export function TransferListRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedId = useId().replaceAll(':', '');
  const id = text(props, 'id', `peaui-transfer-list-${generatedId}`);
  const items = useMemo(
    () => (Array.isArray(props.items) ? (props.items as TransferListItem[]) : []),
    [props.items],
  );
  const itemKey = (props.itemKey ?? 'key') as TransferListKeyResolver;
  const itemLabel = (props.itemLabel ?? 'label') as TransferListLabelResolver;
  const disabledKeys = useMemo(
    () => (Array.isArray(props.disabledKeys) ? (props.disabledKeys as TransferListKey[]) : []),
    [props.disabledKeys],
  );
  const searchable = bool(props, 'searchable', true);
  const preserveOrder = bool(props, 'preserveOrder', true);
  const disabled = bool(props, 'disabled');
  const sort = (props.sort ?? false) as TransferListSort;
  const orientation = text(props, 'orientation', 'horizontal') as TransferListOrientation;
  const size = text(props, 'size', 'standard') as TransferListSize;
  const locale = text(props, 'locale', 'pl-PL');
  const ariaLabel =
    text(props, 'aria-label') || text(props, 'ariaLabel', 'Przenoszenie elementów między listami');
  const error = text(props, 'error');
  const hasError = error.trim().length > 0;
  const errorId = `${id}-error`;
  const dataTestId = text(props, 'dataTestId') || text(props, 'data-testid') || undefined;
  const labels = useMemo(
    () => getTransferListLabels((props.labels ?? {}) as Partial<TransferListLabels>),
    [props.labels],
  );
  const loading = normalizeTransferListLoading(
    (props.loading ?? false) as boolean | TransferListLoadingState,
  );
  const normalizedItems = useMemo(
    () => normalizeTransferListItems(items, { disabledKeys, itemKey, itemLabel }),
    [disabledKeys, itemKey, itemLabel, items],
  );

  const valueControlled = Object.prototype.hasOwnProperty.call(props, 'value');
  const sourceControlled = Object.prototype.hasOwnProperty.call(props, 'sourceSelected');
  const targetControlled = Object.prototype.hasOwnProperty.call(props, 'targetSelected');
  const [internalValue, setInternalValue] = useState<TransferListKey[]>(() =>
    normalizeTransferListKeys(props.defaultValue),
  );
  const [internalSourceSelection, setInternalSourceSelection] = useState<TransferListKey[]>(() =>
    normalizeTransferListKeys(props.defaultSourceSelected),
  );
  const [internalTargetSelection, setInternalTargetSelection] = useState<TransferListKey[]>(() =>
    normalizeTransferListKeys(props.defaultTargetSelected),
  );
  const valueInput = valueControlled ? props.value : internalValue;
  const sourceSelectionInput = sourceControlled ? props.sourceSelected : internalSourceSelection;
  const targetSelectionInput = targetControlled ? props.targetSelected : internalTargetSelection;
  const value = useMemo(() => normalizeTransferListKeys(valueInput), [valueInput]);
  const requestedSourceSelection = useMemo(
    () => normalizeTransferListKeys(sourceSelectionInput),
    [sourceSelectionInput],
  );
  const requestedTargetSelection = useMemo(
    () => normalizeTransferListKeys(targetSelectionInput),
    [targetSelectionInput],
  );
  const sourceItems = useMemo(
    () =>
      getTransferListPanelItems(normalizedItems, value, 'source', { locale, preserveOrder, sort }),
    [locale, normalizedItems, preserveOrder, sort, value],
  );
  const targetItems = useMemo(
    () =>
      getTransferListPanelItems(normalizedItems, value, 'target', { locale, preserveOrder, sort }),
    [locale, normalizedItems, preserveOrder, sort, value],
  );
  const sourceSelection = useMemo(
    () => normalizeTransferListSelection(requestedSourceSelection, sourceItems),
    [requestedSourceSelection, sourceItems],
  );
  const targetSelection = useMemo(
    () => normalizeTransferListSelection(requestedTargetSelection, targetItems),
    [requestedTargetSelection, targetItems],
  );
  const [sourceQuery, setSourceQuery] = useState('');
  const [targetQuery, setTargetQuery] = useState('');
  const visibleSource = useMemo(
    () => filterTransferListItems(sourceItems, sourceQuery, locale),
    [locale, sourceItems, sourceQuery],
  );
  const visibleTarget = useMemo(
    () => filterTransferListItems(targetItems, targetQuery, locale),
    [locale, targetItems, targetQuery],
  );
  const [sourceActive, setSourceActive] = useState(-1);
  const [targetActive, setTargetActive] = useState(-1);
  const sourceAnchor = useRef(-1);
  const targetAnchor = useRef(-1);
  const sourceListbox = useRef<HTMLDivElement>(null);
  const targetListbox = useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = useState('');

  const panelItems = (panel: TransferListPanel): ResolvedTransferListItem[] =>
    panel === 'source' ? sourceItems : targetItems;
  const visibleItems = (panel: TransferListPanel): ResolvedTransferListItem[] =>
    panel === 'source' ? visibleSource : visibleTarget;
  const selection = (panel: TransferListPanel): TransferListKey[] =>
    panel === 'source' ? sourceSelection : targetSelection;
  const active = (panel: TransferListPanel): number =>
    panel === 'source' ? sourceActive : targetActive;
  const setActive = (panel: TransferListPanel, index: number): void => {
    if (panel === 'source') setSourceActive(index);
    else setTargetActive(index);
  };
  const anchor = (panel: TransferListPanel): MutableRefObject<number> =>
    panel === 'source' ? sourceAnchor : targetAnchor;
  const listbox = (panel: TransferListPanel): MutableRefObject<HTMLDivElement | null> =>
    panel === 'source' ? sourceListbox : targetListbox;
  const blocked = (panel: TransferListPanel): boolean => disabled || loading[panel];
  const titleId = (panel: TransferListPanel): string => `${id}-${panel}-title`;
  const listboxId = (panel: TransferListPanel): string => `${id}-${panel}-listbox`;
  const optionId = (panel: TransferListPanel, index: number): string =>
    `${id}-${panel}-option-${index}`;

  const updateValue = (next: TransferListKey[]): void => {
    if (!valueControlled) setInternalValue(next);
    call(props, 'onValueChange', next);
  };

  const updateSelection = (panel: TransferListPanel, keys: readonly TransferListKey[]): void => {
    const next = normalizeTransferListSelection(keys, panelItems(panel));
    if (areTransferListKeysEqual(selection(panel), next)) return;
    if (panel === 'source') {
      if (!sourceControlled) setInternalSourceSelection(next);
      call(props, 'onSourceSelectedChange', next);
    } else {
      if (!targetControlled) setInternalTargetSelection(next);
      call(props, 'onTargetSelectedChange', next);
    }
    const detail: TransferListSelectionDetail = { panel, selectedKeys: next };
    call(props, 'onSelectionChange', detail);
  };

  const eligibleVisible = (panel: TransferListPanel): ResolvedTransferListItem[] =>
    visibleItems(panel).filter((item) => !item.disabled);
  const allVisibleSelected = (panel: TransferListPanel): boolean => {
    const eligible = eligibleVisible(panel);
    return (
      eligible.length > 0 &&
      eligible.every((item) => selection(panel).some((key) => Object.is(key, item.key)))
    );
  };

  const toggleAll = (panel: TransferListPanel, checked: boolean): void => {
    if (blocked(panel)) return;
    const visibleKeys = eligibleVisible(panel).map((item) => item.key);
    const next = checked
      ? [...selection(panel), ...visibleKeys]
      : selection(panel).filter(
          (key) => !visibleKeys.some((visibleKey) => Object.is(visibleKey, key)),
        );
    updateSelection(panel, next);
  };

  const toggleItem = (
    panel: TransferListPanel,
    item: ResolvedTransferListItem,
    index: number,
    extend: boolean,
  ): void => {
    if (blocked(panel) || item.disabled) return;
    setActive(panel, index);
    if (extend && anchor(panel).current >= 0) {
      updateSelection(
        panel,
        getTransferListRangeKeys(visibleItems(panel), anchor(panel).current, index),
      );
      return;
    }
    anchor(panel).current = index;
    const selected = selection(panel).some((key) => Object.is(key, item.key));
    updateSelection(
      panel,
      selected
        ? selection(panel).filter((key) => !Object.is(key, item.key))
        : [...selection(panel), item.key],
    );
  };

  const scrollActive = (panel: TransferListPanel, index: number): void => {
    requestAnimationFrame(() => {
      const option = listbox(panel).current?.querySelector<HTMLElement>(
        `[data-option-index="${index}"]`,
      );
      if (typeof option?.scrollIntoView === 'function') {
        option.scrollIntoView({ block: 'nearest' });
      }
    });
  };

  const moveActive = (panel: TransferListPanel, direction: 1 | -1, extend: boolean): void => {
    const next = findTransferListEnabledIndex(visibleItems(panel), active(panel), direction);
    if (next < 0) return;
    setActive(panel, next);
    if (extend) {
      if (anchor(panel).current < 0) anchor(panel).current = active(panel);
      updateSelection(
        panel,
        getTransferListRangeKeys(visibleItems(panel), anchor(panel).current, next),
      );
    }
    scrollActive(panel, next);
  };

  const moveEdge = (panel: TransferListPanel, edge: 'first' | 'last', extend: boolean): void => {
    const next = findTransferListEdgeIndex(visibleItems(panel), edge);
    if (next < 0) return;
    setActive(panel, next);
    if (extend) {
      if (anchor(panel).current < 0) anchor(panel).current = active(panel);
      updateSelection(
        panel,
        getTransferListRangeKeys(visibleItems(panel), anchor(panel).current, next),
      );
    }
    scrollActive(panel, next);
  };

  const handleKeydown = (
    panel: TransferListPanel,
    event: ReactKeyboardEvent<HTMLDivElement>,
  ): void => {
    if (blocked(panel)) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      toggleAll(panel, !allVisibleSelected(panel));
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActive(panel, 1, event.shiftKey);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActive(panel, -1, event.shiftKey);
    } else if (event.key === 'Home') {
      event.preventDefault();
      moveEdge(panel, 'first', event.shiftKey);
    } else if (event.key === 'End') {
      event.preventDefault();
      moveEdge(panel, 'last', event.shiftKey);
    } else if (event.key === ' ' || event.key === 'Enter') {
      const item = visibleItems(panel)[active(panel)];
      if (!item) return;
      event.preventDefault();
      toggleItem(panel, item, active(panel), event.shiftKey);
    }
  };

  const performMove = (direction: TransferListDirection, mode: 'selected' | 'all'): void => {
    const panel: TransferListPanel = direction === 'to-target' ? 'source' : 'target';
    if (blocked(panel)) return;
    const keys =
      mode === 'selected' ? selection(panel) : eligibleVisible(panel).map((item) => item.key);
    const result = moveTransferListItems({
      direction,
      items: normalizedItems,
      keys,
      preserveOrder,
      value,
    });
    if (result.movedKeys.length === 0) return;
    updateValue(result.value);
    updateSelection(
      panel,
      selection(panel).filter(
        (key) => !result.movedKeys.some((movedKey) => Object.is(movedKey, key)),
      ),
    );
    const destination = direction === 'to-target' ? labels.targetTitle : labels.sourceTitle;
    setAnnouncement(`${labels.moved} ${result.movedKeys.length}: ${destination}.`);
    const detail: TransferListMoveDetail = { direction, ...result };
    call(props, 'onMove', detail);
  };

  const updateSearch = (panel: TransferListPanel, query: string): void => {
    if (panel === 'source') setSourceQuery(query);
    else setTargetQuery(query);
    setActive(panel, findTransferListEdgeIndex(panelItems(panel), 'first'));
    const detail: TransferListSearchDetail = { panel, query };
    call(props, 'onSearch', detail);
  };

  useEffect(() => {
    if (!sourceControlled && !areTransferListKeysEqual(internalSourceSelection, sourceSelection))
      setInternalSourceSelection(sourceSelection);
    if (!targetControlled && !areTransferListKeysEqual(internalTargetSelection, targetSelection))
      setInternalTargetSelection(targetSelection);
  }, [
    internalSourceSelection,
    internalTargetSelection,
    sourceControlled,
    sourceSelection,
    targetControlled,
    targetSelection,
  ]);

  useEffect(() => {
    setSourceActive((current) =>
      current >= 0 && current < visibleSource.length
        ? current
        : findTransferListEdgeIndex(visibleSource, 'first'),
    );
  }, [visibleSource]);

  useEffect(() => {
    setTargetActive((current) =>
      current >= 0 && current < visibleTarget.length
        ? current
        : findTransferListEdgeIndex(visibleTarget, 'first'),
    );
  }, [visibleTarget]);

  const renderHeader = (panel: TransferListPanel): ReactNode => {
    const renderer = props[panel === 'source' ? 'renderSourceHeader' : 'renderTargetHeader'];
    if (typeof renderer === 'function') {
      return (renderer as (state: { count: number; selectedCount: number }) => ReactNode)({
        count: panelItems(panel).length,
        selectedCount: selection(panel).length,
      });
    }
    return panel === 'source' ? labels.sourceTitle : labels.targetTitle;
  };

  const renderPanel = (panel: TransferListPanel): ReactElement => {
    const panelVisible = visibleItems(panel);
    const panelQuery = panel === 'source' ? sourceQuery : targetQuery;
    const panelLoading = loading[panel];
    const panelBlocked = blocked(panel);
    const emptyRenderer = props[panel === 'source' ? 'renderSourceEmpty' : 'renderTargetEmpty'];
    const loadingRenderer = props.renderLoading;
    let panelStatus: ReactNode = null;

    if (panelLoading) {
      panelStatus = (
        <div className="peaui-transfer-list__loading">
          {typeof loadingRenderer === 'function' ? (
            (loadingRenderer as (state: { panel: TransferListPanel }) => ReactNode)({ panel })
          ) : (
            <TransferSpinner
              label={labels.loading}
              testId={dataTestId ? `${dataTestId}-${panel}-loading` : undefined}
            />
          )}
        </div>
      );
    } else if (panelVisible.length === 0) {
      let emptyTitle = labels.targetEmpty;
      if (panelQuery.length > 0) emptyTitle = labels.noResults;
      else if (panel === 'source') emptyTitle = labels.sourceEmpty;

      panelStatus = (
        <div className="peaui-transfer-list__empty">
          {typeof emptyRenderer === 'function' ? (
            (emptyRenderer as (state: { query: string }) => ReactNode)({ query: panelQuery })
          ) : (
            <TransferEmpty
              testId={dataTestId ? `${dataTestId}-${panel}-empty` : undefined}
              title={emptyTitle}
            />
          )}
        </div>
      );
    }
    return (
      <section
        aria-busy={panelLoading || undefined}
        className={`peaui-transfer-list__panel peaui-transfer-list__panel--${panel}`}
        data-panel={panel}
        key={panel}
      >
        <header className="peaui-transfer-list__panel-header">
          <h3 className="peaui-transfer-list__panel-title" id={titleId(panel)}>
            {renderHeader(panel)}
          </h3>
          <span className="peaui-transfer-list__panel-count">
            {panelItems(panel).length} {labels.items}
          </span>
        </header>
        <div className="peaui-transfer-list__panel-content" inert={panelBlocked ? true : undefined}>
          {searchable ? (
            <TransferSearch
              ariaLabel={panel === 'source' ? labels.sourceSearchAria : labels.targetSearchAria}
              blocked={panelBlocked}
              onChange={(query) => updateSearch(panel, query)}
              placeholder={
                panel === 'source' ? labels.sourceSearchPlaceholder : labels.targetSearchPlaceholder
              }
              testId={dataTestId ? `${dataTestId}-${panel}-search` : undefined}
              value={panelQuery}
            />
          ) : null}
          <div className="peaui-transfer-list__selection-summary">
            <TransferCheckbox
              ariaLabel={panel === 'source' ? labels.selectAllSource : labels.selectAllTarget}
              checked={allVisibleSelected(panel)}
              disabled={panelBlocked || eligibleVisible(panel).length === 0}
              id={`${id}-${panel}-select-all`}
              onChange={(checked) => toggleAll(panel, checked)}
              testId={dataTestId ? `${dataTestId}-${panel}-select-all` : undefined}
            />
            <span className="peaui-transfer-list__selected-count">
              {labels.selected}: {selection(panel).length}
            </span>
          </div>
          <div className="peaui-transfer-list__viewport">
            <div
              aria-activedescendant={
                active(panel) >= 0 ? optionId(panel, active(panel)) : undefined
              }
              aria-describedby={hasError ? errorId : undefined}
              aria-labelledby={titleId(panel)}
              aria-multiselectable="true"
              className="peaui-transfer-list__listbox"
              data-testid={dataTestId ? `${dataTestId}-${panel}-listbox` : undefined}
              id={listboxId(panel)}
              onFocus={() => {
                if (active(panel) < 0)
                  setActive(panel, findTransferListEdgeIndex(panelVisible, 'first'));
              }}
              onKeyDown={(event) => handleKeydown(panel, event)}
              ref={panel === 'source' ? sourceListbox : targetListbox}
              role="listbox"
              tabIndex={panelBlocked ? -1 : 0}
            >
              {panelVisible.map((item, index) => {
                const selected = selection(panel).some((key) => Object.is(key, item.key));
                const itemRenderer = props.renderItem;
                return (
                  <div
                    aria-disabled={item.disabled || undefined}
                    aria-selected={selected}
                    className={cx(
                      'peaui-transfer-list__option',
                      active(panel) === index && 'peaui-transfer-list__option--active',
                      selected && 'peaui-transfer-list__option--selected',
                      item.disabled && 'peaui-transfer-list__option--disabled',
                    )}
                    data-key={item.key}
                    data-option-index={index}
                    id={optionId(panel, index)}
                    key={item.key}
                    onClick={(event) => toggleItem(panel, item, index, event.shiftKey)}
                    onPointerMove={() => !item.disabled && setActive(panel, index)}
                    role="option"
                  >
                    <span aria-hidden="true" className="peaui-transfer-list__option-marker">
                      {selected ? <TransferIcon name="check" /> : null}
                    </span>
                    <span className="peaui-transfer-list__option-content">
                      {typeof itemRenderer === 'function' ? (
                        (
                          itemRenderer as (state: {
                            item: TransferListItem;
                            itemKey: TransferListKey;
                            label: string;
                            description?: string;
                            panel: TransferListPanel;
                            selected: boolean;
                            disabled: boolean;
                          }) => ReactNode
                        )({
                          item: item.item,
                          itemKey: item.key,
                          label: item.label,
                          description: item.description,
                          panel,
                          selected,
                          disabled: item.disabled,
                        })
                      ) : (
                        <>
                          <span className="peaui-transfer-list__option-label">{item.label}</span>
                          {item.description ? (
                            <span className="peaui-transfer-list__option-description">
                              {item.description}
                            </span>
                          ) : null}
                        </>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
            {panelStatus}
          </div>
        </div>
      </section>
    );
  };

  const control = (
    direction: TransferListDirection,
    mode: 'selected' | 'all',
    label: string,
    disabledButton: boolean,
  ): ReactElement => {
    const toTarget = direction === 'to-target';
    return (
      <button
        aria-label={label}
        className={cx(
          'peaui-button-action peaui-button-action--size-s peaui-transfer-list__control',
          `peaui-button-action--variant-${mode === 'selected' ? 'primary' : 'secondary'}`,
          `peaui-transfer-list__control--${mode}-${toTarget ? 'target' : 'source'}`,
          disabledButton && 'peaui-button-action--is-disabled',
        )}
        data-testid={
          dataTestId ? `${dataTestId}-move-${mode}-${toTarget ? 'target' : 'source'}` : undefined
        }
        disabled={disabledButton}
        onClick={() => performMove(direction, mode)}
        type="button"
      >
        <TransferIcon
          flip={mode === 'all' ? toTarget : !toTarget}
          name={mode === 'all' ? 'doubleArrowRounded' : 'arrowRight'}
        />
      </button>
    );
  };

  const controls = props.renderControls;
  const controlActions = {
    moveSelectedToTarget: () => performMove('to-target', 'selected'),
    moveSelectedToSource: () => performMove('to-source', 'selected'),
    moveAllToTarget: () => performMove('to-target', 'all'),
    moveAllToSource: () => performMove('to-source', 'all'),
  };
  const externalDescription = text(props, 'aria-describedby');
  const describedBy = [externalDescription, hasError ? errorId : ''].filter(Boolean).join(' ');

  return (
    <div
      aria-describedby={describedBy || undefined}
      aria-disabled={disabled || undefined}
      aria-invalid={hasError || undefined}
      aria-label={ariaLabel}
      className={cx(
        'peaui-transfer-list',
        `peaui-transfer-list--${orientation}`,
        `peaui-transfer-list--${size}`,
        disabled && 'peaui-transfer-list--disabled',
        hasError && 'peaui-transfer-list--invalid',
        props.className,
      )}
      data-testid={dataTestId}
      dir={text(props, 'dir') || undefined}
      id={id}
      ref={(element) => assignRef(forwardedRef, element)}
      role="group"
      style={props.style}
    >
      <div className="peaui-transfer-list__layout">
        {renderPanel('source')}
        <div className="peaui-transfer-list__controls">
          {typeof controls === 'function' ? (
            (controls as (actions: typeof controlActions) => ReactNode)(controlActions)
          ) : (
            <>
              {control(
                'to-target',
                'all',
                labels.moveAllToTarget,
                disabled || loading.source || eligibleVisible('source').length === 0,
              )}
              {control(
                'to-target',
                'selected',
                labels.moveSelectedToTarget,
                disabled || loading.source || sourceSelection.length === 0,
              )}
              {control(
                'to-source',
                'selected',
                labels.moveSelectedToSource,
                disabled || loading.target || targetSelection.length === 0,
              )}
              {control(
                'to-source',
                'all',
                labels.moveAllToSource,
                disabled || loading.target || eligibleVisible('target').length === 0,
              )}
            </>
          )}
        </div>
        {renderPanel('target')}
      </div>
      {hasError ? (
        <div
          aria-live="polite"
          className="peaui-message-text peaui-message-text--size-xs peaui-message-text--variant-error"
          id={errorId}
        >
          <svg
            aria-hidden="true"
            className="peaui-message-text__icon"
            fill="none"
            focusable="false"
            viewBox="0 0 16 16"
          >
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" />
            <path d="M8 4.5v4M8 11.2v.3" stroke="currentColor" strokeLinecap="round" />
          </svg>
          <p className="peaui-message-text__content">{error}</p>
        </div>
      ) : null}
      <p aria-atomic="true" aria-live="polite" className="peaui-transfer-list__live" role="status">
        {announcement}
      </p>
    </div>
  );
}
