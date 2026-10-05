/** @jsxImportSource react */
import { useVirtualListWindow } from './use-virtual-list-window';
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
  createTransferListKeySet,
  getTransferListKeyIdentity,
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
  type TransferListMoveDetail,
  type TransferListOrientation,
  type TransferListPanel,
  type TransferListSearchDetail,
  type TransferListSelectionDetail,
  type TransferListSize,
  type TransferListSort,
} from '../components/data-entry/TransferList/transfer-list.shared';
import { Svg } from './renderers/svg.renderer';
import { renderSvgMarkup as StaticSvg } from './renderers/svg-markup.renderer';
import { SearchInputLeafRenderer } from './renderers/text-input.renderer';
import { ChoiceControlsRenderer } from './renderers/choice-controls.renderer';
import {
  EmptyStateLeafRenderer,
  MessageTextLeafRenderer,
  SpinnerLoaderLeafRenderer,
} from './renderers/feedback.renderer';
import { ButtonActionRenderer } from './renderers/button-action.renderer';
import { iconCheck } from './generated-static-icons';

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
  else if (ref) ref.current = value;
}

function TransferSearch({
  ariaLabel,
  onChange,
  placeholder,
  testId,
  value,
}: {
  ariaLabel: string;
  onChange: (value: string) => void;
  placeholder: string;
  testId?: string;
  value: string;
}): ReactElement {
  return (
    <SearchInputLeafRenderer
      className="peaui-transfer-list__search"
      ariaLabel={ariaLabel}
      placeholder={placeholder}
      dataTestId={testId}
      debounceTime={0}
      value={value}
      onValueChange={onChange}
    />
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
    <ChoiceControlsRenderer
      __name="FormCheckbox"
      ariaLabel={ariaLabel}
      value={checked}
      disabled={disabled}
      id={id}
      name={id}
      onValueChange={onChange}
      dataTestId={testId}
    >
      {ariaLabel}
    </ChoiceControlsRenderer>
  );
}
function TransferEmpty({ testId, title }: { testId?: string; title: string }): ReactElement {
  return <EmptyStateLeafRenderer dataTestId={testId} title={title} />;
}
function TransferSpinner({ label, testId }: { label: string; testId?: string }): ReactElement {
  return <SpinnerLoaderLeafRenderer aria-label={label} dataTestId={testId} />;
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
  const loading = normalizeTransferListLoading(props.loading ?? false);
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
  const sourceMembership = useMemo(
    () => createTransferListKeySet(sourceSelection),
    [sourceSelection],
  );
  const targetMembership = useMemo(
    () => createTransferListKeySet(targetSelection),
    [targetSelection],
  );
  const selectionIndex = (panel: TransferListPanel) =>
    panel === 'source' ? sourceMembership : targetMembership;
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
  const previousVisibleSource = useRef(visibleSource);
  const previousVisibleTarget = useRef(visibleTarget);
  const sourceAnchor = useRef(-1);
  const targetAnchor = useRef(-1);
  const sourceListbox = useRef<HTMLDivElement>(null);
  const targetListbox = useRef<HTMLDivElement>(null);
  const virtual = bool(props, 'virtual');
  const rowHeight = typeof props.optionHeight === 'number' ? props.optionHeight : 64;
  const sourceWindow = useVirtualListWindow(
    visibleSource,
    sourceActive,
    true,
    virtual,
    rowHeight,
    sourceListbox,
  );
  const targetWindow = useVirtualListWindow(
    visibleTarget,
    targetActive,
    true,
    virtual,
    rowHeight,
    targetListbox,
  );
  const panelWindow = (panel: TransferListPanel) =>
    panel === 'source' ? sourceWindow : targetWindow;
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
      eligible.every((item) => selectionIndex(panel).has(getTransferListKeyIdentity(item.key)))
    );
  };

  const toggleAll = (panel: TransferListPanel, checked: boolean): void => {
    if (blocked(panel)) return;
    const visibleKeys = eligibleVisible(panel).map((item) => item.key);
    const visibleKeySet = createTransferListKeySet(visibleKeys);
    const next = checked
      ? [...selection(panel), ...visibleKeys]
      : selection(panel).filter((key) => !visibleKeySet.has(getTransferListKeyIdentity(key)));
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
    const selected = selectionIndex(panel).has(getTransferListKeyIdentity(item.key));
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
    const movedKeySet = createTransferListKeySet(result.movedKeys);
    updateValue(result.value);
    updateSelection(
      panel,
      selection(panel).filter((key) => !movedKeySet.has(getTransferListKeyIdentity(key))),
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
    if (previousVisibleSource.current === visibleSource) return;
    previousVisibleSource.current = visibleSource;
    setSourceActive((current) =>
      current >= 0 && visibleSource[current] && !visibleSource[current].disabled
        ? current
        : findTransferListEdgeIndex(visibleSource, 'first'),
    );
  }, [visibleSource]);

  useEffect(() => {
    if (previousVisibleTarget.current === visibleTarget) return;
    previousVisibleTarget.current = visibleTarget;
    setTargetActive((current) =>
      current >= 0 && visibleTarget[current] && !visibleTarget[current].disabled
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
              {`${labels.selected}: ${selection(panel).length}`}
            </span>
          </div>
          <div className="peaui-transfer-list__viewport">
            <div
              aria-activedescendant={
                active(panel) >= 0 &&
                (!virtual ||
                  panelWindow(panel).visibleOptions.some((entry) => entry.index === active(panel)))
                  ? optionId(panel, active(panel))
                  : undefined
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
              onScroll={panelWindow(panel).handleScroll}
              onKeyDown={(event) => handleKeydown(panel, event)}
              ref={panel === 'source' ? sourceListbox : targetListbox}
              role="listbox"
              tabIndex={panelBlocked ? -1 : 0}
            >
              {panelWindow(panel).beforeSize > 0 ? (
                <div
                  role="presentation"
                  aria-hidden="true"
                  style={{ height: panelWindow(panel).beforeSize }}
                />
              ) : null}
              {panelWindow(panel).visibleOptions.map(({ item, index }) => {
                const selected = selectionIndex(panel).has(getTransferListKeyIdentity(item.key));
                const itemRenderer = props.renderItem;
                return (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- The owning listbox handles keyboard selection with aria-activedescendant.
                  <div
                    style={panelWindow(panel).optionStyle}
                    aria-setsize={virtual ? panelVisible.length : undefined}
                    aria-posinset={virtual ? index + 1 : undefined}
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
                      {selected ? <StaticSvg data={iconCheck} /> : null}
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
              {panelWindow(panel).afterSize > 0 ? (
                <div
                  role="presentation"
                  aria-hidden="true"
                  style={{ height: panelWindow(panel).afterSize }}
                />
              ) : null}
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
      <ButtonActionRenderer
        aria-label={label}
        size="s"
        variant={mode === 'selected' ? 'primary' : 'secondary'}
        className={cx(
          'peaui-transfer-list__control',
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
        <Svg
          name={`core/${mode === 'all' ? 'chevrons' : 'arrow'}-${toTarget ? 'right' : 'left'}`}
        />
      </ButtonActionRenderer>
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
        <MessageTextLeafRenderer
          aria-live="polite"
          id={errorId}
          dataTestId={dataTestId ? `${dataTestId}-error` : undefined}
          variant="error"
          size="xs"
        >
          {error}
        </MessageTextLeafRenderer>
      ) : null}
      <p aria-atomic="true" aria-live="polite" className="peaui-transfer-list__live" role="status">
        {announcement}
      </p>
    </div>
  );
}
