export type TransferListKey = string | number;

export type TransferListItem = Readonly<
  Record<string, unknown> & {
    key?: TransferListKey;
    label?: string;
    description?: string;
    disabled?: boolean;
  }
>;

export type TransferListPanel = 'source' | 'target';
export type TransferListDirection = 'to-source' | 'to-target';
export type TransferListOrientation = 'horizontal' | 'vertical';
export type TransferListSize = 'compact' | 'standard';
export type TransferListKeyResolver = string | ((item: TransferListItem) => unknown);
export type TransferListLabelResolver = string | ((item: TransferListItem) => unknown);
export type TransferListSort =
  false | 'asc' | 'desc' | ((first: TransferListItem, second: TransferListItem) => number);

export type TransferListLoadingState = {
  source?: boolean;
  target?: boolean;
};

export type TransferListLabels = {
  sourceTitle: string;
  targetTitle: string;
  sourceSearchAria: string;
  targetSearchAria: string;
  sourceSearchPlaceholder: string;
  targetSearchPlaceholder: string;
  selectAllSource: string;
  selectAllTarget: string;
  moveSelectedToTarget: string;
  moveSelectedToSource: string;
  moveAllToTarget: string;
  moveAllToSource: string;
  sourceEmpty: string;
  targetEmpty: string;
  noResults: string;
  loading: string;
  moved: string;
  selected: string;
  items: string;
};

export type ResolvedTransferListItem = {
  item: TransferListItem;
  key: TransferListKey;
  label: string;
  description?: string;
  disabled: boolean;
  originalIndex: number;
};

export type TransferListMoveResult = {
  value: TransferListKey[];
  movedKeys: TransferListKey[];
};

export type TransferListMoveDetail = TransferListMoveResult & {
  direction: TransferListDirection;
};

export type TransferListSearchDetail = {
  panel: TransferListPanel;
  query: string;
};

export type TransferListSelectionDetail = {
  panel: TransferListPanel;
  selectedKeys: TransferListKey[];
};

export const DEFAULT_TRANSFER_LIST_LABELS: Readonly<TransferListLabels> = {
  sourceTitle: 'Dostępne',
  targetTitle: 'Przypisane',
  sourceSearchAria: 'Filtruj dostępne elementy',
  targetSearchAria: 'Filtruj przypisane elementy',
  sourceSearchPlaceholder: 'Szukaj w dostępnych',
  targetSearchPlaceholder: 'Szukaj w przypisanych',
  selectAllSource: 'Zaznacz wszystkie widoczne dostępne elementy',
  selectAllTarget: 'Zaznacz wszystkie widoczne przypisane elementy',
  moveSelectedToTarget: 'Przenieś zaznaczone do przypisanych',
  moveSelectedToSource: 'Przenieś zaznaczone do dostępnych',
  moveAllToTarget: 'Przenieś wszystkie widoczne do przypisanych',
  moveAllToSource: 'Przenieś wszystkie widoczne do dostępnych',
  sourceEmpty: 'Brak dostępnych elementów',
  targetEmpty: 'Brak przypisanych elementów',
  noResults: 'Brak wyników dla podanego filtra',
  loading: 'Ładowanie elementów',
  moved: 'Przeniesiono',
  selected: 'zaznaczono',
  items: 'elementów',
};

export function isTransferListKey(value: unknown): value is TransferListKey {
  return typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value));
}

// Map/Set use SameValueZero. Preserve the public Object.is distinction between -0 and +0.
const NEGATIVE_ZERO_KEY = Symbol('negative-zero');
const lookupKey = (key: TransferListKey): TransferListKey | symbol =>
  Object.is(key, -0) ? NEGATIVE_ZERO_KEY : key;
const keySet = (keys: readonly TransferListKey[]) => new Set(keys.map(lookupKey));
export { keySet as createTransferListKeySet, lookupKey as getTransferListKeyIdentity };

export function normalizeTransferListKeys(value: unknown): TransferListKey[] {
  if (!Array.isArray(value)) return [];
  const result: TransferListKey[] = [];
  const seen = new Set<TransferListKey | symbol>();
  for (const key of value) {
    if (!isTransferListKey(key) || seen.has(lookupKey(key))) continue;
    seen.add(lookupKey(key));
    result.push(key);
  }
  return result;
}

function resolveItemValue(
  item: TransferListItem,
  resolver: TransferListKeyResolver | TransferListLabelResolver | undefined,
  fallbacks: readonly string[],
): unknown {
  if (typeof resolver === 'function') return resolver(item);
  if (typeof resolver === 'string' && resolver.trim()) return item[resolver];
  for (const fallback of fallbacks) {
    if (item[fallback] !== undefined) return item[fallback];
  }
  return undefined;
}

export function getTransferListItemKey(
  item: TransferListItem,
  resolver?: TransferListKeyResolver,
): TransferListKey | undefined {
  const key = resolveItemValue(item, resolver, ['key', 'id', 'value']);
  return isTransferListKey(key) ? key : undefined;
}

export function getTransferListItemLabel(
  item: TransferListItem,
  resolver?: TransferListLabelResolver,
  key?: TransferListKey,
): string {
  const label = resolveItemValue(item, resolver, ['label', 'name', 'title']);
  if (typeof label === 'string' || typeof label === 'number') return String(label).trim();
  return key === undefined ? '' : String(key);
}

export function normalizeTransferListItems(
  value: unknown,
  options: {
    disabledKeys?: readonly TransferListKey[];
    itemKey?: TransferListKeyResolver;
    itemLabel?: TransferListLabelResolver;
  } = {},
): ResolvedTransferListItem[] {
  if (!Array.isArray(value)) return [];
  const disabledKeys = keySet(normalizeTransferListKeys(options.disabledKeys));
  const seen = new Set<TransferListKey | symbol>();
  const resolved: ResolvedTransferListItem[] = [];

  value.forEach((candidate, originalIndex) => {
    if (typeof candidate !== 'object' || candidate === null) return;
    const item = candidate as TransferListItem;
    const key = getTransferListItemKey(item, options.itemKey);
    if (key === undefined || seen.has(lookupKey(key))) return;
    const label = getTransferListItemLabel(item, options.itemLabel, key);
    if (!label) return;
    seen.add(lookupKey(key));
    resolved.push({
      item,
      key,
      label,
      description:
        typeof item.description === 'string' && item.description.trim()
          ? item.description.trim()
          : undefined,
      disabled: item.disabled === true || disabledKeys.has(lookupKey(key)),
      originalIndex,
    });
  });

  return resolved;
}

export function areTransferListKeysEqual(
  first: readonly TransferListKey[],
  second: readonly TransferListKey[],
): boolean {
  return (
    first.length === second.length && first.every((key, index) => Object.is(key, second[index]))
  );
}

export function sortTransferListItems(
  items: readonly ResolvedTransferListItem[],
  sort: TransferListSort,
  locale = 'pl-PL',
): ResolvedTransferListItem[] {
  if (sort === false) return [...items];
  const collator = new Intl.Collator(locale, { numeric: true, sensitivity: 'base' });
  return [...items].sort((first, second) => {
    let comparison = 0;
    if (typeof sort === 'function') comparison = sort(first.item, second.item);
    else comparison = collator.compare(first.label, second.label) * (sort === 'desc' ? -1 : 1);
    return comparison || first.originalIndex - second.originalIndex;
  });
}

export function getTransferListPanelItems(
  items: readonly ResolvedTransferListItem[],
  value: readonly TransferListKey[],
  panel: TransferListPanel,
  options: {
    locale?: string;
    preserveOrder?: boolean;
    sort?: TransferListSort;
  } = {},
): ResolvedTransferListItem[] {
  const targetKeys = normalizeTransferListKeys(value);
  const targetOrder = new Map(targetKeys.map((key, index) => [lookupKey(key), index]));
  const isTarget = (item: ResolvedTransferListItem) => targetOrder.has(lookupKey(item.key));
  let panelItems = items.filter((item) => (panel === 'target' ? isTarget(item) : !isTarget(item)));

  if (
    panel === 'target' &&
    options.preserveOrder !== false &&
    (options.sort === undefined || options.sort === false)
  ) {
    panelItems = [...panelItems].sort((first, second) => {
      const firstIndex = targetOrder.get(lookupKey(first.key)) ?? -1;
      const secondIndex = targetOrder.get(lookupKey(second.key)) ?? -1;
      return firstIndex - secondIndex;
    });
  }

  return sortTransferListItems(panelItems, options.sort ?? false, options.locale);
}

function searchableText(value: string, locale: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase(locale);
}

export function filterTransferListItems(
  items: readonly ResolvedTransferListItem[],
  query: string,
  locale = 'pl-PL',
): ResolvedTransferListItem[] {
  const phrase = searchableText(query.trim(), locale);
  if (phrase.length === 0) return [...items];
  return items.filter((item) =>
    searchableText(`${item.label} ${item.description ?? ''}`, locale).includes(phrase),
  );
}

export function normalizeTransferListSelection(
  value: unknown,
  items: readonly ResolvedTransferListItem[],
): TransferListKey[] {
  const enabledKeys = keySet(items.filter((item) => !item.disabled).map((item) => item.key));
  return normalizeTransferListKeys(value).filter((key) => enabledKeys.has(lookupKey(key)));
}

export function getTransferListRangeKeys(
  items: readonly ResolvedTransferListItem[],
  startIndex: number,
  endIndex: number,
): TransferListKey[] {
  if (items.length === 0) return [];
  const start = Math.max(0, Math.min(items.length - 1, Math.min(startIndex, endIndex)));
  const end = Math.max(0, Math.min(items.length - 1, Math.max(startIndex, endIndex)));
  return items
    .slice(start, end + 1)
    .filter((item) => item.disabled !== true)
    .map((item) => item.key);
}

export function findTransferListEnabledIndex(
  items: readonly ResolvedTransferListItem[],
  currentIndex: number,
  direction: 1 | -1,
): number {
  for (
    let index = currentIndex + direction;
    index >= 0 && index < items.length;
    index += direction
  ) {
    if (items[index]?.disabled !== true) return index;
  }
  return -1;
}

export function findTransferListEdgeIndex(
  items: readonly ResolvedTransferListItem[],
  edge: 'first' | 'last',
): number {
  if (edge === 'first') return items.findIndex((item) => item.disabled !== true);
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (items[index]?.disabled !== true) return index;
  }
  return -1;
}

export function moveTransferListItems(options: {
  direction: TransferListDirection;
  items: readonly ResolvedTransferListItem[];
  keys: readonly TransferListKey[];
  preserveOrder?: boolean;
  value: readonly TransferListKey[];
}): TransferListMoveResult {
  const current = normalizeTransferListKeys(options.value);
  const requested = keySet(normalizeTransferListKeys(options.keys));
  const currentKeys = keySet(current);
  const isTarget = (key: TransferListKey) => currentKeys.has(lookupKey(key));
  const movable = options.items.filter((item) => {
    if (item.disabled || !requested.has(lookupKey(item.key))) return false;
    return options.direction === 'to-target' ? !isTarget(item.key) : isTarget(item.key);
  });
  const movedKeys = movable.map((item) => item.key);
  if (movedKeys.length === 0) return { movedKeys: [], value: current };

  if (options.direction === 'to-source') {
    const moved = keySet(movedKeys);
    return {
      movedKeys,
      value: current.filter((key) => !moved.has(lookupKey(key))),
    };
  }

  let value = [...current, ...movedKeys];
  if (options.preserveOrder === false) {
    const selectedKeys = keySet(value);
    const itemKeys = keySet(options.items.map((item) => item.key));
    const knownKeys = options.items
      .map((item) => item.key)
      .filter((key) => selectedKeys.has(lookupKey(key)));
    const unknownKeys = value.filter((key) => !itemKeys.has(lookupKey(key)));
    value = [...knownKeys, ...unknownKeys];
  }
  return { movedKeys, value };
}

export function normalizeTransferListLoading(value: unknown): Required<TransferListLoadingState> {
  if (value === true) return { source: true, target: true };
  if (typeof value !== 'object' || value === null) return { source: false, target: false };
  const state = value as TransferListLoadingState;
  return { source: state.source === true, target: state.target === true };
}

export function getTransferListLabels(
  value: Partial<TransferListLabels> | undefined,
): TransferListLabels {
  return { ...DEFAULT_TRANSFER_LIST_LABELS, ...value };
}
