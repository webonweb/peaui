/** @jsxImportSource react */
import {
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type ForwardedRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import {
  areVirtualListRangesEqual,
  calculateVirtualListRange,
  getVirtualListScrollOffset,
  isVirtualListHeightValid,
  normalizeVirtualListHeight,
  normalizeVirtualListItems,
  normalizeVirtualListItemSize,
  normalizeVirtualListOverscan,
  type ResolvedVirtualListItem,
  type VirtualListAlign,
  type VirtualListHandle,
  type VirtualListItem,
  type VirtualListItemFocusDetail,
  type VirtualListItemKeyResolver,
  type VirtualListItemLabelResolver,
  type VirtualListItemSlotState,
  type VirtualListMeasureErrorDetail,
  type VirtualListRange,
  type VirtualListReachEndDetail,
  type VirtualListRole,
  type VirtualListScrollDetail,
} from '../components/data-display/VirtualList/virtual-list.shared';
import type {
  ScrollAreaHandle,
  ScrollAreaPosition,
  ScrollAreaResizeDetail,
} from '../components/layout/ScrollArea/scroll-area.shared';
import { ScrollAreaRenderer } from './scroll-area.renderer';

type VirtualListRuntimeProps = {
  'data-testid'?: string;
  activeIndex?: number | null;
  after?: ReactNode;
  ariaLabel?: string;
  before?: ReactNode;
  children?: ReactNode;
  className?: string;
  dataTestId?: string;
  defaultActiveIndex?: number | null;
  empty?: ReactNode;
  emptyDescription?: string;
  emptyTitle?: string;
  endLabel?: string;
  error?: string;
  footer?: ReactNode;
  forwardedRef?: ForwardedRef<VirtualListHandle>;
  hasMore?: boolean;
  height?: number | string;
  itemKey?: VirtualListItemKeyResolver;
  itemLabel?: VirtualListItemLabelResolver;
  items?: readonly VirtualListItem[];
  itemSize?: number;
  loading?: boolean;
  loadingContent?: ReactNode;
  onActiveIndexChange?: (index: number | null) => void;
  onItemFocus?: (detail: VirtualListItemFocusDetail) => void;
  onMeasureError?: (detail: VirtualListMeasureErrorDetail) => void;
  onReachEnd?: (detail: VirtualListReachEndDetail) => void;
  onScroll?: (detail: VirtualListScrollDetail) => void;
  onVisibleRangeChange?: (detail: VirtualListRange) => void;
  overscan?: number;
  renderItem?: (state: VirtualListItemSlotState) => ReactNode;
  semanticRole?: VirtualListRole;
  style?: CSSProperties;
};

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

function EmptyState({ description, title }: { description: string; title: string }): ReactElement {
  const id = `peaui-virtual-list-empty-${useId().replaceAll(':', '')}`;
  return (
    <section
      aria-describedby={`${id}-description`}
      aria-labelledby={`${id}-title`}
      className="peaui-empty-state"
    >
      <svg
        aria-hidden="true"
        className="peaui-empty-state__icon"
        focusable="false"
        viewBox="0 0 64 41"
        xmlns="http://www.w3.org/2000/svg"
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
        <p className="peaui-empty-state__description" id={`${id}-description`}>
          {description}
        </p>
      </div>
    </section>
  );
}

function LoadingState(): ReactElement {
  return (
    <div aria-busy="true" className="peaui-spinner-loader peaui-spinner-loader--fullscreen">
      <div
        aria-atomic="true"
        aria-live="polite"
        className="peaui-spinner-loader__text"
        role="status"
      >
        Ładowanie... Proszę czekać.
      </div>
      <div aria-hidden="true" className="peaui-spinner-loader__spinner" />
    </div>
  );
}

export function VirtualListRenderer({
  forwardedRef,
  ...props
}: VirtualListRuntimeProps): ReactElement {
  const generatedId = useId().replaceAll(':', '');
  const resolvedId = `peaui-virtual-list-${generatedId}`;
  const listId = `${resolvedId}-items`;
  const scrollAreaRef = useRef<ScrollAreaHandle>(null);
  const previousRangeRef = useRef<VirtualListRange | undefined>(undefined);
  const previousOffsetRef = useRef(0);
  const reachedEndForCountRef = useRef(-1);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [viewportSize, setViewportSize] = useState(
    typeof props.height === 'number' ? Math.max(96, props.height) : 320,
  );
  const [retainedFocusIndex, setRetainedFocusIndex] = useState<number | null>(null);
  const [uncontrolledActiveIndex, setUncontrolledActiveIndex] = useState<number | null>(
    props.defaultActiveIndex ?? null,
  );
  const items = Array.isArray(props.items) ? props.items : [];
  const itemSize = normalizeVirtualListItemSize(props.itemSize ?? 64);
  const overscan = normalizeVirtualListOverscan(props.overscan ?? 4);
  const role = props.semanticRole ?? 'list';
  const ariaLabel = props.ariaLabel?.trim() || 'Lista wirtualna';
  const isLoading = props.loading === true;
  const hasMore = props.hasMore === true;
  const hasError = typeof props.error === 'string' && props.error.length > 0;
  const activeIndex = props.activeIndex === undefined ? uncontrolledActiveIndex : props.activeIndex;
  const resolvedItems = useMemo(
    () => normalizeVirtualListItems(items, props.itemKey ?? 'id', props.itemLabel ?? 'label'),
    [items, props.itemKey, props.itemLabel],
  );
  const range = calculateVirtualListRange({
    itemCount: resolvedItems.length,
    itemSize,
    overscan,
    scrollOffset,
    viewportSize,
  });
  const hasReachedEnd =
    resolvedItems.length > 0 && range.visibleEndIndex >= resolvedItems.length - 1;
  const renderedIndices = useMemo(() => {
    const indices = new Set<number>();
    for (let index = range.startIndex; index <= range.endIndex; index += 1) {
      if (index >= 0) indices.add(index);
    }
    if (
      retainedFocusIndex !== null &&
      retainedFocusIndex >= 0 &&
      retainedFocusIndex < resolvedItems.length
    ) {
      indices.add(retainedFocusIndex);
    }
    if (
      role === 'listbox' &&
      activeIndex !== null &&
      activeIndex >= 0 &&
      activeIndex < resolvedItems.length
    ) {
      indices.add(activeIndex);
    }
    return [...indices].sort((first, second) => first - second);
  }, [
    activeIndex,
    range.endIndex,
    range.startIndex,
    resolvedItems.length,
    retainedFocusIndex,
    role,
  ]);
  const renderedItems = renderedIndices.flatMap((index) => {
    const item = resolvedItems[index];
    return item ? [item] : [];
  });
  const dataTestId = props.dataTestId ?? props['data-testid'];

  const emitRangeIfChanged = (nextRange: VirtualListRange): void => {
    if (areVirtualListRangesEqual(previousRangeRef.current, nextRange)) return;
    previousRangeRef.current = { ...nextRange };
    props.onVisibleRangeChange?.(nextRange);
  };

  const maybeReachEnd = (nextRange: VirtualListRange): void => {
    const count = resolvedItems.length;
    if (
      !hasMore ||
      count === 0 ||
      nextRange.visibleEndIndex < count - 1 ||
      reachedEndForCountRef.current === count
    ) {
      return;
    }
    reachedEndForCountRef.current = count;
    props.onReachEnd?.({ lastIndex: count - 1, total: count });
  };

  const scrollToOffset = (offset: number, behavior: ScrollBehavior = 'auto'): void => {
    const maximum = Math.max(0, resolvedItems.length * itemSize - viewportSize);
    const next = Math.min(Math.max(Number.isFinite(offset) ? offset : 0, 0), maximum);
    setScrollOffset(next);
    scrollAreaRef.current?.scrollTo({ top: next, behavior });
  };

  const scrollToIndex = (
    index: number,
    align: VirtualListAlign = 'auto',
    behavior: ScrollBehavior = 'auto',
  ): void => {
    scrollToOffset(
      getVirtualListScrollOffset({
        align,
        currentOffset: scrollOffset,
        index,
        itemCount: resolvedItems.length,
        itemSize,
        viewportSize,
      }),
      behavior,
    );
  };

  useImperativeHandle(
    forwardedRef,
    (): VirtualListHandle => ({
      get viewport() {
        return scrollAreaRef.current?.viewport ?? null;
      },
      getVisibleRange() {
        return { ...range };
      },
      scrollToIndex,
      scrollToOffset,
    }),
  );

  useEffect(() => {
    emitRangeIfChanged(range);
    maybeReachEnd(range);
  }, [
    range.endIndex,
    range.startIndex,
    range.total,
    range.visibleEndIndex,
    range.visibleStartIndex,
  ]);

  useEffect(() => {
    reachedEndForCountRef.current = -1;
    if (activeIndex !== null && activeIndex >= resolvedItems.length) {
      const next = resolvedItems.length > 0 ? resolvedItems.length - 1 : null;
      if (props.activeIndex === undefined) setUncontrolledActiveIndex(next);
      props.onActiveIndexChange?.(next);
    }
  }, [resolvedItems.length]);

  useEffect(() => {
    if (normalizeVirtualListItemSize(props.itemSize ?? 64) !== (props.itemSize ?? 64)) {
      props.onMeasureError?.({
        message: 'itemSize musi być dodatnią, skończoną liczbą.',
        property: 'itemSize',
        value: props.itemSize,
      });
    }
    if (!isVirtualListHeightValid(props.height ?? 320)) {
      props.onMeasureError?.({
        message: 'height musi być dodatnią liczbą albo poprawnym rozmiarem CSS.',
        property: 'height',
        value: props.height,
      });
    }
  }, [props.height, props.itemSize]);

  const handleScroll = (position: ScrollAreaPosition): void => {
    const nextOffset = position.y;
    let direction: VirtualListScrollDetail['direction'] = 'none';
    if (nextOffset > previousOffsetRef.current) direction = 'forward';
    else if (nextOffset < previousOffsetRef.current) direction = 'backward';
    previousOffsetRef.current = nextOffset;
    setScrollOffset(nextOffset);
    const nextRange = calculateVirtualListRange({
      itemCount: resolvedItems.length,
      itemSize,
      overscan,
      scrollOffset: nextOffset,
      viewportSize,
    });
    emitRangeIfChanged(nextRange);
    maybeReachEnd(nextRange);
    props.onScroll?.({ direction, offset: nextOffset, range: nextRange });
  };

  const handleResize = (detail: ScrollAreaResizeDetail): void => {
    if (detail.clientHeight > 0) setViewportSize(detail.clientHeight);
  };

  const setActiveItem = (index: number, shouldFocus = false): void => {
    const item = resolvedItems[index];
    if (!item) return;
    if (props.activeIndex === undefined) setUncontrolledActiveIndex(index);
    props.onActiveIndexChange?.(index);
    scrollToIndex(index, 'auto');
    props.onItemFocus?.({ index, item: item.item, key: item.key });
    if (shouldFocus) queueMicrotask(() => document.getElementById(listId)?.focus());
  };

  const handleListboxKeydown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    if (role !== 'listbox' || resolvedItems.length === 0) return;
    const current =
      activeIndex === null
        ? range.visibleStartIndex
        : Math.min(Math.max(activeIndex, 0), resolvedItems.length - 1);
    const page = Math.max(1, Math.floor(viewportSize / itemSize));
    let next: number | undefined;
    if (event.key === 'ArrowDown') next = current + 1;
    else if (event.key === 'ArrowUp') next = current - 1;
    else if (event.key === 'PageDown') next = current + page;
    else if (event.key === 'PageUp') next = current - page;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = resolvedItems.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActiveItem(Math.min(Math.max(next, 0), resolvedItems.length - 1));
  };

  const handleItemFocus = (item: ResolvedVirtualListItem): void => {
    setRetainedFocusIndex(item.index);
    props.onItemFocus?.({ index: item.index, item: item.item, key: item.key });
  };

  const handleItemBlur = (
    event: ReactFocusEvent<HTMLDivElement>,
    item: ResolvedVirtualListItem,
  ): void => {
    const currentTarget = event.currentTarget;
    queueMicrotask(() => {
      if (!currentTarget.contains(document.activeElement)) {
        setRetainedFocusIndex((current) => (current === item.index ? null : current));
      }
    });
  };

  const rootClassName = cx(
    'peaui-virtual-list',
    `peaui-virtual-list--${role}`,
    isLoading && 'peaui-virtual-list--loading',
    resolvedItems.length === 0 && 'peaui-virtual-list--empty',
    hasError && 'peaui-virtual-list--error',
    props.className,
  );
  const activeDescendant =
    role === 'listbox' && activeIndex !== null && renderedIndices.includes(activeIndex)
      ? `${resolvedId}-item-${activeIndex}`
      : undefined;
  const hasBefore = props.before !== undefined && props.before !== null && props.before !== false;
  const hasAfter = props.after !== undefined && props.after !== null && props.after !== false;
  const hasFooter = props.footer !== undefined && props.footer !== null && props.footer !== false;
  let scrollContent: ReactNode;

  if (isLoading && resolvedItems.length === 0) {
    scrollContent = (
      <div className="peaui-virtual-list__state">{props.loadingContent ?? <LoadingState />}</div>
    );
  } else if (hasError && resolvedItems.length === 0) {
    scrollContent = (
      <div className="peaui-virtual-list__state">
        <p className="peaui-virtual-list__error" role="alert">
          {props.error}
        </p>
      </div>
    );
  } else if (resolvedItems.length === 0) {
    scrollContent = (
      <div className="peaui-virtual-list__state">
        {props.empty ?? (
          <EmptyState
            description={props.emptyDescription ?? 'Lista nie zawiera jeszcze żadnych elementów.'}
            title={props.emptyTitle ?? 'Brak elementów'}
          />
        )}
      </div>
    );
  } else {
    scrollContent = (
      <div
        aria-activedescendant={activeDescendant}
        aria-label={role === 'listbox' ? ariaLabel : undefined}
        aria-multiselectable={role === 'listbox' ? false : undefined}
        className="peaui-virtual-list__items"
        id={listId}
        role={role}
        style={{ blockSize: `${resolvedItems.length * itemSize}px` }}
        tabIndex={role === 'listbox' ? 0 : undefined}
        onKeyDown={handleListboxKeydown}
      >
        {renderedItems.map((item) => {
          const state: VirtualListItemSlotState = {
            active: activeIndex === item.index,
            index: item.index,
            item: item.item,
            itemKey: item.key,
            style: {
              blockSize: `${itemSize}px`,
              transform: `translateY(${item.index * itemSize}px)`,
            },
          };
          return (
            <div
              aria-posinset={item.index + 1}
              aria-selected={role === 'listbox' ? activeIndex === item.index : undefined}
              aria-setsize={resolvedItems.length}
              className={cx(
                'peaui-virtual-list__item',
                activeIndex === item.index && 'peaui-virtual-list__item--active',
              )}
              data-index={item.index}
              data-key={String(item.key)}
              id={`${resolvedId}-item-${item.index}`}
              key={item.key}
              role={role === 'listbox' ? 'option' : 'listitem'}
              style={state.style}
              onBlur={(event) => handleItemBlur(event, item)}
              onClick={() => role === 'listbox' && setActiveItem(item.index, true)}
              onFocus={() => handleItemFocus(item)}
            >
              {props.renderItem?.(state) ?? (
                <>
                  <span className="peaui-virtual-list__item-label">{item.label}</span>
                  {item.description !== undefined ? (
                    <span className="peaui-virtual-list__item-description">{item.description}</span>
                  ) : null}
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  let trailingStatus: ReactNode = null;
  if (isLoading && resolvedItems.length > 0) {
    trailingStatus = (
      <div className="peaui-virtual-list__status">{props.loadingContent ?? <LoadingState />}</div>
    );
  } else if (hasReachedEnd && !hasMore) {
    trailingStatus = <p className="peaui-virtual-list__end">{props.endLabel ?? 'Koniec listy'}</p>;
  }

  return (
    <div className={rootClassName} data-testid={dataTestId} style={props.style}>
      {hasBefore ? <div className="peaui-virtual-list__before">{props.before}</div> : null}

      <ScrollAreaRenderer
        ariaLabel={ariaLabel}
        className="peaui-virtual-list__scroll-area"
        dataTestId={dataTestId !== undefined ? `${dataTestId}-scroll-area` : undefined}
        forwardedRef={scrollAreaRef}
        orientation="vertical"
        scrollbarVisibility="auto"
        style={{ blockSize: normalizeVirtualListHeight(props.height ?? 320) }}
        tabIndex={role === 'list' ? 0 : undefined}
        type="styled"
        onResize={handleResize}
        onScroll={handleScroll}
      >
        {scrollContent}
      </ScrollAreaRenderer>

      {trailingStatus}

      {hasError && resolvedItems.length > 0 ? (
        <p className="peaui-virtual-list__error" role="alert">
          {props.error}
        </p>
      ) : null}
      {hasAfter ? <div className="peaui-virtual-list__after">{props.after}</div> : null}
      {hasFooter ? <div className="peaui-virtual-list__footer">{props.footer}</div> : null}
    </div>
  );
}
