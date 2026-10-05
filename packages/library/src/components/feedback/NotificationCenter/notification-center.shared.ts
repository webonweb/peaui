export type NotificationCenterItemId = string | number;

/** Injective encoding, including punctuation and Unicode, for per-group DOM IDs. */
export function getNotificationCenterGroupKey(value: string): string {
  return Array.from(value, (character) => character.codePointAt(0)!.toString(16)).join('-');
}

export type NotificationCenterVariant = 'panel' | 'drawer-content' | 'page';
export type NotificationCenterDensity = 'compact' | 'comfortable';
export type NotificationCenterGroupBy = 'none' | 'date' | 'type';
export type NotificationCenterPaginationMode = 'pagination' | 'infinite';
export type NotificationCenterPriority = 'low' | 'normal' | 'high' | 'urgent';
export type NotificationCenterDate = string | number | Date;

export type NotificationCenterAction = {
  id: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
};

export type NotificationCenterItem = {
  id: NotificationCenterItemId;
  title: string;
  description?: string;
  createdAt: NotificationCenterDate;
  dateLabel?: string;
  read: boolean;
  type?: string;
  typeLabel?: string;
  priority?: NotificationCenterPriority;
  disabled?: boolean;
  actions?: readonly NotificationCenterAction[];
  metadata?: Readonly<Record<string, unknown>>;
};

export type NotificationCenterFilter = {
  id: string;
  label: string;
  unreadOnly?: boolean;
  types?: readonly string[];
  priorities?: readonly NotificationCenterPriority[];
  predicate?: (item: NotificationCenterItem) => boolean;
};

export type NotificationCenterLabels = {
  title: string;
  notificationsList: string;
  filters: string;
  all: string;
  unread: string;
  unreadStatus: string;
  markAllRead: string;
  markRead: string;
  markUnread: string;
  emptyTitle: string;
  emptyDescription: string;
  filteredEmptyTitle: string;
  filteredEmptyDescription: string;
  loading: string;
  loadingMore: string;
  loadMore: string;
  retry: string;
  errorTitle: string;
  today: string;
  yesterday: string;
  otherGroup: string;
  noDateGroup: string;
  priority: string;
  lowPriority: string;
  normalPriority: string;
  highPriority: string;
  urgentPriority: string;
};

export type NotificationCenterGroup = {
  id: string;
  label: string;
  items: readonly NotificationCenterItem[];
};

export type NotificationCenterSelectPayload = {
  item: NotificationCenterItem;
  index: number;
};

export type NotificationCenterActionPayload = NotificationCenterSelectPayload & {
  action: NotificationCenterAction;
};

export type NotificationCenterLoadMorePayload = {
  mode: NotificationCenterPaginationMode;
  visibleCount: number;
};

export type NotificationCenterBaseProps = {
  items: readonly NotificationCenterItem[];
  unreadCount?: number;
  filters?: readonly NotificationCenterFilter[];
  activeFilter?: string;
  groupBy?: NotificationCenterGroupBy;
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  error?: string | null;
  selectedId?: NotificationCenterItemId | null;
  locale?: string;
  formatDate?: (date: NotificationCenterDate, item: NotificationCenterItem) => string;
  ariaLabel?: string;
  dataTestId?: string;
  variant?: NotificationCenterVariant;
  density?: NotificationCenterDensity;
  paginationMode?: NotificationCenterPaginationMode;
  markAllPending?: boolean;
  pendingItemIds?: readonly NotificationCenterItemId[];
  referenceDate?: NotificationCenterDate;
  labels?: Partial<NotificationCenterLabels>;
  maxHeight?: string;
};

export const NOTIFICATION_CENTER_DEFAULT_LABELS: NotificationCenterLabels = {
  title: 'Notifications',
  notificationsList: 'Notifications list',
  filters: 'Notification filters',
  all: 'All',
  unread: 'Unread',
  unreadStatus: 'Unread notification',
  markAllRead: 'Mark all as read',
  markRead: 'Mark as read',
  markUnread: 'Mark as unread',
  emptyTitle: 'No notifications',
  emptyDescription: 'New notifications will appear here.',
  filteredEmptyTitle: 'No matching notifications',
  filteredEmptyDescription: 'Try another filter.',
  loading: 'Loading notifications',
  loadingMore: 'Loading more notifications',
  loadMore: 'Load more',
  retry: 'Try again',
  errorTitle: 'Notifications could not be loaded',
  today: 'Today',
  yesterday: 'Yesterday',
  otherGroup: 'Other',
  noDateGroup: 'Without date',
  priority: 'Priority',
  lowPriority: 'Low',
  normalPriority: 'Normal',
  highPriority: 'High',
  urgentPriority: 'Urgent',
};

export function resolveNotificationCenterLabels(
  labels?: Partial<NotificationCenterLabels>,
): NotificationCenterLabels {
  return { ...NOTIFICATION_CENTER_DEFAULT_LABELS, ...labels };
}

export function getNotificationCenterFilters(
  filters: readonly NotificationCenterFilter[] | undefined,
  labels: NotificationCenterLabels,
): readonly NotificationCenterFilter[] {
  if (filters?.length) return [...filters];
  return [
    { id: 'all', label: labels.all },
    { id: 'unread', label: labels.unread, unreadOnly: true },
  ];
}

export function filterNotificationCenterItems(
  items: readonly NotificationCenterItem[],
  filter?: NotificationCenterFilter,
): NotificationCenterItem[] {
  if (!filter) return [...items];

  return items.filter((item) => {
    if (filter.unreadOnly === true && item.read) return false;
    if (filter.types?.length && (!item.type || !filter.types.includes(item.type))) return false;
    if (
      filter.priorities?.length &&
      (!item.priority || !filter.priorities.includes(item.priority))
    ) {
      return false;
    }
    return filter.predicate ? filter.predicate(item) : true;
  });
}

export function getNotificationCenterUnreadCount(items: readonly NotificationCenterItem[]): number {
  return items.reduce((count, item) => count + (item.read ? 0 : 1), 0);
}

export function toNotificationCenterDate(value: NotificationCenterDate): Date | null {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getNotificationCenterDateTime(value: NotificationCenterDate): string | undefined {
  return toNotificationCenterDate(value)?.toISOString();
}

function startOfLocalDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

// Bound retained locales in long-lived clients and SSR processes.
const dateFormatters = new Map<string, Intl.DateTimeFormat>();
const groupFormatters = new Map<string, Intl.DateTimeFormat>();
const relativeFormatters = new Map<string, Intl.RelativeTimeFormat>();

function cachedFormatter<T>(cache: Map<string, T>, locale: string, create: () => T): T {
  const cached = cache.get(locale);
  if (cached !== undefined) return cached;
  const formatter = create();
  if (cache.size >= 16) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(locale, formatter);
  return formatter;
}

export function formatNotificationCenterDate(
  value: NotificationCenterDate,
  locale = 'en',
  referenceDate: NotificationCenterDate = new Date(),
): string {
  const date = toNotificationCenterDate(value);
  const reference = toNotificationCenterDate(referenceDate) ?? new Date();
  if (!date) return '';

  const dayDifference = Math.round(
    (startOfLocalDay(date) - startOfLocalDay(reference)) / 86_400_000,
  );
  if (Math.abs(dayDifference) <= 6) {
    return cachedFormatter(
      relativeFormatters,
      locale,
      () => new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }),
    ).format(dayDifference, 'day');
  }

  return cachedFormatter(
    dateFormatters,
    locale,
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
  ).format(date);
}

function dateGroupLabel(
  date: Date,
  locale: string,
  referenceDate: NotificationCenterDate,
  labels: NotificationCenterLabels,
): string {
  const reference = toNotificationCenterDate(referenceDate) ?? new Date();
  const difference = Math.round((startOfLocalDay(date) - startOfLocalDay(reference)) / 86_400_000);
  if (difference === 0) return labels.today;
  if (difference === -1) return labels.yesterday;
  return cachedFormatter(
    groupFormatters,
    locale,
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'long' }),
  ).format(date);
}

export function groupNotificationCenterItems(
  items: readonly NotificationCenterItem[],
  groupBy: NotificationCenterGroupBy,
  locale: string,
  referenceDate: NotificationCenterDate,
  labels: NotificationCenterLabels,
): NotificationCenterGroup[] {
  if (groupBy === 'none') {
    return items.length ? [{ id: 'all', label: labels.notificationsList, items: [...items] }] : [];
  }

  const groups = new Map<string, { label: string; items: NotificationCenterItem[] }>();
  items.forEach((item) => {
    let id: string;
    let label: string;

    if (groupBy === 'type') {
      id = `type-${item.type || 'other'}`;
      label = item.typeLabel || item.type || labels.otherGroup;
    } else {
      const date = toNotificationCenterDate(item.createdAt);
      id = date
        ? `date-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        : 'date-none';
      const existingGroup = groups.get(id);
      if (existingGroup) {
        existingGroup.items.push(item);
        return;
      }
      label = date ? dateGroupLabel(date, locale, referenceDate, labels) : labels.noDateGroup;
    }

    const current = groups.get(id);
    if (current) current.items.push(item);
    else groups.set(id, { label, items: [item] });
  });

  return [...groups].map(([id, group]) => ({ id, label: group.label, items: group.items }));
}

export function getNotificationCenterPriorityLabel(
  priority: NotificationCenterPriority | undefined,
  labels: NotificationCenterLabels,
): string | undefined {
  if (!priority || priority === 'normal') return undefined;
  const names: Record<NotificationCenterPriority, string> = {
    low: labels.lowPriority,
    normal: labels.normalPriority,
    high: labels.highPriority,
    urgent: labels.urgentPriority,
  };
  return `${labels.priority}: ${names[priority]}`;
}
