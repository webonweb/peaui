/** @jsxImportSource react */
import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import ButtonAction from '../../data-entry/ButtonAction';
import CounterBadge from '../../data-display/CounterBadge';
import ScrollArea from '../../layout/ScrollArea';
import EmptyState from '../EmptyState';
import SkeletonLoading from '../SkeletonLoading';
import {
  filterNotificationCenterItems,
  formatNotificationCenterDate,
  getNotificationCenterDateTime,
  getNotificationCenterFilters,
  getNotificationCenterPriorityLabel,
  getNotificationCenterUnreadCount,
  groupNotificationCenterItems,
  getNotificationCenterGroupKey,
  resolveNotificationCenterLabels,
  type NotificationCenterAction,
  type NotificationCenterActionPayload,
  type NotificationCenterBaseProps,
  type NotificationCenterFilter,
  type NotificationCenterGroup,
  type NotificationCenterItem,
  type NotificationCenterItemId,
  type NotificationCenterLoadMorePayload,
  type NotificationCenterSelectPayload,
} from './notification-center.shared';
import './styles.scss';

export type NotificationCenterItemRenderContext = {
  item: NotificationCenterItem;
  selected: boolean;
  select: () => void;
};

export type NotificationCenterProps = NotificationCenterBaseProps & {
  className?: string;
  style?: CSSProperties;
  renderHeader?: (context: {
    unreadCount: number;
    markAllRead: () => void;
    pending: boolean;
  }) => ReactNode;
  renderFilters?: (context: {
    filters: readonly NotificationCenterFilter[];
    activeFilter: string;
    selectFilter: (filterId: string) => void;
  }) => ReactNode;
  renderGroupHeader?: (group: NotificationCenterGroup) => ReactNode;
  renderItem?: (context: NotificationCenterItemRenderContext) => ReactNode;
  renderItemIcon?: (item: NotificationCenterItem) => ReactNode;
  renderItemActions?: (context: {
    item: NotificationCenterItem;
    emitAction: (action: NotificationCenterAction) => void;
  }) => ReactNode;
  renderEmpty?: (filtered: boolean) => ReactNode;
  renderLoading?: () => ReactNode;
  renderError?: (context: { error: string; retry: () => void }) => ReactNode;
  renderFooter?: (context: { hasMore: boolean; loadMore: () => void }) => ReactNode;
  onActiveFilterChange?: (filterId: string) => void;
  onSelectedIdChange?: (id: NotificationCenterItemId) => void;
  onSelect?: (payload: NotificationCenterSelectPayload) => void;
  onAction?: (payload: NotificationCenterActionPayload) => void;
  onMarkRead?: (item: NotificationCenterItem) => void;
  onMarkUnread?: (item: NotificationCenterItem) => void;
  onMarkAllRead?: () => void;
  onLoadMore?: (payload: NotificationCenterLoadMorePayload) => void;
  onFilterChange?: (filterId: string) => void;
  onRetry?: () => void;
};

export type NotificationCenterHandle = {
  requestLoadMore: () => void;
  resetLoadRequest: () => void;
};

export const NotificationCenter = forwardRef<NotificationCenterHandle, NotificationCenterProps>(
  function NotificationCenter(
    {
      items,
      unreadCount,
      filters,
      activeFilter = 'all',
      groupBy = 'none',
      loading = false,
      loadingMore = false,
      hasMore = false,
      error = null,
      selectedId = null,
      locale = 'en',
      formatDate,
      ariaLabel = 'Notifications',
      dataTestId,
      variant = 'panel',
      density = 'comfortable',
      paginationMode = 'pagination',
      markAllPending = false,
      pendingItemIds,
      referenceDate = new Date(),
      labels: labelOverrides,
      maxHeight = '32rem',
      className,
      style,
      renderHeader,
      renderFilters,
      renderGroupHeader,
      renderItem,
      renderItemIcon,
      renderItemActions,
      renderEmpty,
      renderLoading,
      renderError,
      renderFooter,
      onActiveFilterChange,
      onSelectedIdChange,
      onSelect,
      onAction,
      onMarkRead,
      onMarkUnread,
      onMarkAllRead,
      onLoadMore,
      onFilterChange,
      onRetry,
    },
    ref,
  ) {
    const instanceId = useId().replace(/:/g, '');
    const requestLocked = useRef(false);
    const [requestPending, setRequestPending] = useState(false);
    const previousLoadingMore = useRef(loadingMore);
    const previousItemsLength = useRef(items.length);

    useEffect(() => {
      if (
        (previousLoadingMore.current && !loadingMore) ||
        previousItemsLength.current !== items.length ||
        !hasMore
      ) {
        requestLocked.current = false;
        setRequestPending(false);
      }
      previousLoadingMore.current = loadingMore;
      previousItemsLength.current = items.length;
    }, [hasMore, items.length, loadingMore]);

    const labels = useMemo(() => resolveNotificationCenterLabels(labelOverrides), [labelOverrides]);
    const availableFilters = useMemo(
      () => getNotificationCenterFilters(filters, labels),
      [filters, labels],
    );
    const currentFilter =
      availableFilters.find((filter) => filter.id === activeFilter) ?? availableFilters[0];
    const resolvedActiveFilter = currentFilter?.id ?? activeFilter;
    const visibleItems = useMemo(
      () => filterNotificationCenterItems(items, currentFilter),
      [items, currentFilter],
    );
    const groups = useMemo(
      () => groupNotificationCenterItems(visibleItems, groupBy, locale, referenceDate, labels),
      [visibleItems, groupBy, locale, referenceDate, labels],
    );
    const effectiveUnreadCount = unreadCount ?? getNotificationCenterUnreadCount(items);

    const isPending = (id: NotificationCenterItemId) => pendingItemIds?.includes(id) ?? false;
    const itemIndex = (item: NotificationCenterItem) =>
      items.findIndex((candidate) => candidate.id === item.id);
    const selectItem = (item: NotificationCenterItem) => {
      if (item.disabled === true || isPending(item.id)) return;
      const payload = { item, index: itemIndex(item) };
      onSelectedIdChange?.(item.id);
      onSelect?.(payload);
    };
    const selectFilter = (filterId: string) => {
      if (filterId === activeFilter) return;
      onActiveFilterChange?.(filterId);
      onFilterChange?.(filterId);
    };
    const emitAction = (item: NotificationCenterItem, action: NotificationCenterAction) => {
      if (item.disabled === true || action.disabled === true || isPending(item.id)) return;
      onAction?.({ item, action, index: itemIndex(item) });
    };
    const toggleRead = (item: NotificationCenterItem) => {
      if (item.disabled === true || isPending(item.id)) return;
      if (item.read) onMarkUnread?.(item);
      else onMarkRead?.(item);
    };
    const displayDate = (item: NotificationCenterItem) =>
      item.dateLabel ||
      formatDate?.(item.createdAt, item) ||
      formatNotificationCenterDate(item.createdAt, locale, referenceDate);
    const requestLoadMore = () => {
      if (!hasMore || loading || loadingMore || requestLocked.current || !onLoadMore) return;
      requestLocked.current = true;
      setRequestPending(true);
      onLoadMore({ mode: paginationMode, visibleCount: visibleItems.length });
    };
    const resetLoadRequest = () => {
      requestLocked.current = false;
      setRequestPending(false);
    };

    useImperativeHandle(ref, () => ({ requestLoadMore, resetLoadRequest }));

    const rootStyle = {
      ...style,
      '--peaui-notification-center-max-height': maxHeight,
    } as CSSProperties;
    const rootClass = [
      'peaui-notification-center',
      `peaui-notification-center--${variant}`,
      `peaui-notification-center--${density}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const defaultHeader = (
      <header className="peaui-notification-center__header">
        <div className="peaui-notification-center__title-row">
          <h2 className="peaui-notification-center__title">{labels.title}</h2>
          {effectiveUnreadCount > 0 ? <CounterBadge value={effectiveUnreadCount} size="s" /> : null}
        </div>
        <ButtonAction
          size="s"
          variant="ghost"
          disabled={effectiveUnreadCount === 0 || markAllPending}
          ariaLabel={labels.markAllRead}
          dataTestId="notification-center-mark-all"
          onClick={onMarkAllRead}
        >
          {labels.markAllRead}
        </ButtonAction>
      </header>
    );

    let content: ReactNode;
    if (loading && items.length === 0) {
      content = renderLoading?.() ?? (
        <div
          className="peaui-notification-center__loading"
          role="status"
          aria-label={labels.loading}
        >
          {[0, 1, 2, 3].map((index) => (
            <SkeletonLoading key={index} size="l" rounded />
          ))}
        </div>
      );
    } else if (error && items.length === 0) {
      content = renderError?.({ error, retry: () => onRetry?.() }) ?? (
        <div className="peaui-notification-center__state" role="alert">
          <EmptyState title={labels.errorTitle} description={error} />
          <ButtonAction size="s" variant="secondary" onClick={onRetry}>
            {labels.retry}
          </ButtonAction>
        </div>
      );
    } else if (visibleItems.length === 0) {
      const filtered = activeFilter !== 'all';
      content = renderEmpty?.(filtered) ?? (
        <EmptyState
          title={filtered ? labels.filteredEmptyTitle : labels.emptyTitle}
          description={filtered ? labels.filteredEmptyDescription : labels.emptyDescription}
        />
      );
    } else {
      content = (
        <div className="peaui-notification-center__groups">
          {groups.map((group) => {
            const headingId = `${instanceId}-${getNotificationCenterGroupKey(group.id)}`;
            return (
              <section
                key={group.id}
                className="peaui-notification-center__group"
                role={groupBy === 'none' ? undefined : 'group'}
                aria-labelledby={groupBy === 'none' ? undefined : headingId}
              >
                {groupBy !== 'none'
                  ? (renderGroupHeader?.(group) ?? (
                      <h3 id={headingId} className="peaui-notification-center__group-title">
                        {group.label}
                      </h3>
                    ))
                  : null}
                <ol className="peaui-notification-center__list" role="list">
                  {group.items.map((item) => {
                    const selected = item.id === selectedId;
                    const priorityLabel = getNotificationCenterPriorityLabel(item.priority, labels);
                    return (
                      <li
                        key={item.id}
                        className={[
                          'peaui-notification-center__item',
                          !item.read && 'peaui-notification-center__item--unread',
                          selected && 'peaui-notification-center__item--selected',
                          item.disabled === true && 'peaui-notification-center__item--disabled',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        data-priority={item.priority || 'normal'}
                      >
                        {renderItem?.({ item, selected, select: () => selectItem(item) }) ?? (
                          <>
                            <button
                              type="button"
                              className="peaui-notification-center__item-main"
                              disabled={item.disabled === true || isPending(item.id)}
                              aria-current={selected ? 'true' : undefined}
                              onClick={() => selectItem(item)}
                            >
                              {renderItemIcon?.(item) ?? (
                                <span
                                  className={[
                                    'peaui-notification-center__indicator',
                                    !item.read && 'peaui-notification-center__indicator--visible',
                                  ]
                                    .filter(Boolean)
                                    .join(' ')}
                                  aria-hidden="true"
                                />
                              )}
                              <span className="peaui-notification-center__content">
                                <span className="peaui-notification-center__item-heading">
                                  <span className="peaui-notification-center__item-title">
                                    {item.title}
                                  </span>
                                  {!item.read ? (
                                    <span className="peaui-sr-only">{labels.unreadStatus}</span>
                                  ) : null}
                                </span>
                                {item.description ? (
                                  <span className="peaui-notification-center__description">
                                    {item.description}
                                  </span>
                                ) : null}
                                <span className="peaui-notification-center__meta">
                                  <time
                                    dateTime={getNotificationCenterDateTime(item.createdAt)}
                                    title={getNotificationCenterDateTime(item.createdAt)}
                                  >
                                    {displayDate(item)}
                                  </time>
                                  {priorityLabel ? (
                                    <span className="peaui-notification-center__priority">
                                      {priorityLabel}
                                    </span>
                                  ) : null}
                                </span>
                              </span>
                            </button>
                            <div className="peaui-notification-center__actions">
                              <ButtonAction
                                size="s"
                                variant="ghost"
                                disabled={item.disabled === true || isPending(item.id)}
                                ariaLabel={item.read ? labels.markUnread : labels.markRead}
                                onClick={() => toggleRead(item)}
                              >
                                {item.read ? labels.markUnread : labels.markRead}
                              </ButtonAction>
                              {renderItemActions?.({
                                item,
                                emitAction: (action) => emitAction(item, action),
                              }) ??
                                item.actions?.map((action) => (
                                  <ButtonAction
                                    key={action.id}
                                    size="s"
                                    variant={action.danger === true ? 'danger' : 'ghost'}
                                    disabled={
                                      item.disabled === true ||
                                      action.disabled === true ||
                                      isPending(item.id)
                                    }
                                    onClick={() => emitAction(item, action)}
                                  >
                                    {action.label}
                                  </ButtonAction>
                                ))}
                            </div>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })}
        </div>
      );
    }

    return (
      <section
        className={rootClass}
        aria-label={ariaLabel}
        aria-busy={loading || loadingMore}
        data-testid={dataTestId}
        style={rootStyle}
      >
        {renderHeader?.({
          unreadCount: effectiveUnreadCount,
          markAllRead: () => onMarkAllRead?.(),
          pending: markAllPending,
        }) ?? defaultHeader}
        {renderFilters?.({
          filters: availableFilters,
          activeFilter: resolvedActiveFilter,
          selectFilter,
        }) ?? (
          <nav className="peaui-notification-center__filters" aria-label={labels.filters}>
            {availableFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={[
                  'peaui-notification-center__filter',
                  filter.id === resolvedActiveFilter && 'peaui-notification-center__filter--active',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-pressed={filter.id === resolvedActiveFilter}
                onClick={() => selectFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </nav>
        )}
        {error && items.length > 0 ? (
          <div className="peaui-notification-center__inline-error" role="alert">
            <span>{error}</span>
            <ButtonAction size="s" variant="ghost" onClick={onRetry}>
              {labels.retry}
            </ButtonAction>
          </div>
        ) : null}
        <ScrollArea
          className="peaui-notification-center__scroll-area"
          type="styled"
          orientation="vertical"
          ariaLabel={labels.notificationsList}
          onReachEnd={paginationMode === 'infinite' ? requestLoadMore : undefined}
        >
          {content}
          {loadingMore ? (
            <div className="peaui-notification-center__loading-more" role="status">
              <SkeletonLoading size="m" rounded />
              <span>{labels.loadingMore}</span>
            </div>
          ) : null}
        </ScrollArea>
        {renderFooter?.({ hasMore, loadMore: requestLoadMore }) ??
          (hasMore && visibleItems.length > 0 ? (
            <footer className="peaui-notification-center__footer">
              <ButtonAction
                size="s"
                variant="secondary"
                disabled={loading || loadingMore || requestPending}
                onClick={requestLoadMore}
              >
                {loadingMore ? labels.loadingMore : labels.loadMore}
              </ButtonAction>
            </footer>
          ) : null)}
      </section>
    );
  },
);

NotificationCenter.displayName = 'NotificationCenter';

export default NotificationCenter;
export type {
  NotificationCenterAction,
  NotificationCenterActionPayload,
  NotificationCenterDate,
  NotificationCenterDensity,
  NotificationCenterFilter,
  NotificationCenterGroup,
  NotificationCenterGroupBy,
  NotificationCenterItem,
  NotificationCenterItemId,
  NotificationCenterLabels,
  NotificationCenterLoadMorePayload,
  NotificationCenterPaginationMode,
  NotificationCenterPriority,
  NotificationCenterSelectPayload,
  NotificationCenterVariant,
} from './notification-center.shared';
