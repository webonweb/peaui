export type VirtualListKey = string | number;
export type VirtualListRole = 'list' | 'listbox';
export type VirtualListAlign = 'auto' | 'start' | 'center' | 'end';
export type VirtualListItem = unknown;
export type VirtualListItemKeyResolver =
  string | ((item: VirtualListItem, index: number) => unknown);
export type VirtualListItemLabelResolver =
  string | ((item: VirtualListItem, index: number) => unknown);

export type VirtualListRange = {
  startIndex: number;
  endIndex: number;
  visibleStartIndex: number;
  visibleEndIndex: number;
  total: number;
};

export type VirtualListScrollDetail = {
  direction: 'backward' | 'forward' | 'none';
  offset: number;
  range: VirtualListRange;
};

export type VirtualListReachEndDetail = {
  lastIndex: number;
  total: number;
};

export type VirtualListItemFocusDetail = {
  index: number;
  item: VirtualListItem;
  key: VirtualListKey;
};

export type VirtualListMeasureErrorDetail = {
  message: string;
  property: 'height' | 'itemSize';
  value: unknown;
};

export type VirtualListItemSlotState = {
  active: boolean;
  index: number;
  item: VirtualListItem;
  itemKey: VirtualListKey;
  style: Readonly<Record<string, string>>;
};

export type VirtualListHandle = {
  readonly viewport: HTMLElement | null;
  scrollToIndex(index: number, align?: VirtualListAlign, behavior?: ScrollBehavior): void;
  scrollToOffset(offset: number, behavior?: ScrollBehavior): void;
  getVisibleRange(): VirtualListRange;
};

export type ResolvedVirtualListItem = {
  description?: string;
  index: number;
  item: VirtualListItem;
  key: VirtualListKey;
  label: string;
};

export const VIRTUAL_LIST_DEFAULT_HEIGHT = 320;
export const VIRTUAL_LIST_DEFAULT_ITEM_SIZE = 64;
export const VIRTUAL_LIST_DEFAULT_OVERSCAN = 4;

export function clampVirtualListValue(value: number, minimum: number, maximum: number): number {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(Math.max(value, minimum), maximum);
}

export function normalizeVirtualListItemSize(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? clampVirtualListValue(value, 24, 2048)
    : VIRTUAL_LIST_DEFAULT_ITEM_SIZE;
}

export function normalizeVirtualListOverscan(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.round(clampVirtualListValue(value, 0, 50))
    : VIRTUAL_LIST_DEFAULT_OVERSCAN;
}

export function normalizeVirtualListHeight(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return `${Math.max(96, value)}px`;
  }
  if (typeof value === 'string' && value.trim()) return value.trim();
  return `${VIRTUAL_LIST_DEFAULT_HEIGHT}px`;
}

export function isVirtualListHeightValid(value: unknown): boolean {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0;
  if (typeof value !== 'string' || !value.trim()) return false;
  return typeof CSS === 'undefined' || typeof CSS.supports !== 'function'
    ? true
    : CSS.supports('height', value.trim());
}

export function calculateVirtualListRange(options: {
  itemCount: number;
  itemSize: number;
  overscan: number;
  scrollOffset: number;
  viewportSize: number;
}): VirtualListRange {
  const total = Math.max(0, Math.floor(options.itemCount));
  if (total === 0) {
    return {
      startIndex: 0,
      endIndex: -1,
      visibleStartIndex: 0,
      visibleEndIndex: -1,
      total: 0,
    };
  }

  const itemSize = normalizeVirtualListItemSize(options.itemSize);
  const viewportSize = Math.max(0, options.viewportSize);
  const maximumOffset = Math.max(0, total * itemSize - viewportSize);
  const offset = clampVirtualListValue(options.scrollOffset, 0, maximumOffset);
  const visibleStartIndex = Math.min(total - 1, Math.floor(offset / itemSize));
  const visibleEndIndex = Math.min(
    total - 1,
    Math.max(visibleStartIndex, Math.ceil((offset + viewportSize) / itemSize) - 1),
  );
  const overscan = normalizeVirtualListOverscan(options.overscan);

  return {
    startIndex: Math.max(0, visibleStartIndex - overscan),
    endIndex: Math.min(total - 1, visibleEndIndex + overscan),
    visibleStartIndex,
    visibleEndIndex,
    total,
  };
}

export function getVirtualListScrollOffset(options: {
  align?: VirtualListAlign;
  currentOffset: number;
  index: number;
  itemCount: number;
  itemSize: number;
  viewportSize: number;
}): number {
  const itemSize = normalizeVirtualListItemSize(options.itemSize);
  const itemCount = Math.max(0, Math.floor(options.itemCount));
  if (itemCount === 0) return 0;
  const viewportSize = Math.max(0, options.viewportSize);
  const index = Math.round(clampVirtualListValue(options.index, 0, itemCount - 1));
  const itemStart = index * itemSize;
  const itemEnd = itemStart + itemSize;
  const maximumOffset = Math.max(0, itemCount * itemSize - viewportSize);
  let offset = options.currentOffset;

  if (options.align === 'start') offset = itemStart;
  else if (options.align === 'center') offset = itemStart - (viewportSize - itemSize) / 2;
  else if (options.align === 'end') offset = itemEnd - viewportSize;
  else if (itemStart < options.currentOffset) offset = itemStart;
  else if (itemEnd > options.currentOffset + viewportSize) offset = itemEnd - viewportSize;

  return clampVirtualListValue(offset, 0, maximumOffset);
}

function resolveItemValue(
  item: VirtualListItem,
  index: number,
  resolver: VirtualListItemKeyResolver | VirtualListItemLabelResolver | undefined,
  fallbacks: readonly string[],
): unknown {
  if (typeof resolver === 'function') {
    try {
      return resolver(item, index);
    } catch {
      return undefined;
    }
  }
  if (typeof item !== 'object' || item === null) return item;
  const record = item as Readonly<Record<string, unknown>>;
  if (typeof resolver === 'string' && resolver.trim() && record[resolver] !== undefined) {
    return record[resolver];
  }
  for (const fallback of fallbacks) {
    if (record[fallback] !== undefined) return record[fallback];
  }
  return undefined;
}

function isVirtualListKey(value: unknown): value is VirtualListKey {
  return typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value));
}

export function getVirtualListItemKey(
  item: VirtualListItem,
  index: number,
  resolver?: VirtualListItemKeyResolver,
): VirtualListKey {
  const value = resolveItemValue(item, index, resolver, ['id', 'key', 'value']);
  return isVirtualListKey(value) ? value : index;
}

export function getVirtualListItemLabel(
  item: VirtualListItem,
  index: number,
  resolver?: VirtualListItemLabelResolver,
): string {
  const value = resolveItemValue(item, index, resolver, ['label', 'name', 'title', 'value']);
  if (typeof value === 'string' || typeof value === 'number') {
    const label = String(value).trim();
    if (label) return label;
  }
  return `Element ${index + 1}`;
}

export function getVirtualListItemDescription(item: VirtualListItem): string | undefined {
  if (typeof item !== 'object' || item === null) return undefined;
  const description = (item as Readonly<Record<string, unknown>>).description;
  return typeof description === 'string' && description.trim() ? description.trim() : undefined;
}

export function normalizeVirtualListItems(
  items: readonly VirtualListItem[],
  itemKey?: VirtualListItemKeyResolver,
  itemLabel?: VirtualListItemLabelResolver,
): ResolvedVirtualListItem[] {
  const usedKeys = new Set<VirtualListKey>();
  const resolvedKeys = items.map((item, index) => getVirtualListItemKey(item, index, itemKey));
  const reservedKeys = new Set(resolvedKeys);

  return items.map((item, index) => {
    const resolvedKey = resolvedKeys[index]!;
    let key = resolvedKey;
    if (usedKeys.has(key)) {
      const base = `${String(resolvedKey)}-${index}`;
      key = base;
      let suffix = 0;
      while (usedKeys.has(key) || reservedKeys.has(key)) key = `${base}-${++suffix}`;
    }
    usedKeys.add(key);

    return {
      description: getVirtualListItemDescription(item),
      index,
      item,
      key,
      label: getVirtualListItemLabel(item, index, itemLabel),
    };
  });
}

export function areVirtualListRangesEqual(
  first: VirtualListRange | undefined,
  second: VirtualListRange,
): boolean {
  return Boolean(
    first &&
    first.startIndex === second.startIndex &&
    first.endIndex === second.endIndex &&
    first.visibleStartIndex === second.visibleStartIndex &&
    first.visibleEndIndex === second.visibleEndIndex &&
    first.total === second.total,
  );
}
/** Preserve the visible keyed row and its pixel offset when data is inserted before it. */
export function getVirtualListAnchorOffset(
  previous: readonly ResolvedVirtualListItem[],
  next: readonly ResolvedVirtualListItem[],
  offset: number,
  itemSize: number,
): number {
  if (offset <= 0) return offset;
  const index = Math.floor(offset / itemSize);
  const anchor = previous[index];
  if (!anchor) return offset;
  const nextIndex = next.findIndex((item) => Object.is(item.key, anchor.key));
  return nextIndex < 0 ? offset : offset + (nextIndex - index) * itemSize;
}
