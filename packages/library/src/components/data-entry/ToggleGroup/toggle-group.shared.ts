export type ToggleGroupValue = string | number;

export type ToggleGroupFocusableItem = {
  disabled?: boolean;
  loading?: boolean;
};

export function isToggleGroupValue(value: unknown): value is ToggleGroupValue {
  return typeof value === 'string' || typeof value === 'number';
}

export function normalizeToggleGroupSelection(
  type: 'single' | 'multiple',
  value: unknown,
): ToggleGroupValue[] {
  if (type === 'single') return isToggleGroupValue(value) ? [value] : [];
  if (!Array.isArray(value)) return [];

  return value
    .filter(isToggleGroupValue)
    .filter(
      (item, index, values) =>
        values.findIndex((candidate) => Object.is(candidate, item)) === index,
    );
}

export function isToggleGroupItemAvailable(item: ToggleGroupFocusableItem | undefined): boolean {
  if (!item) return false;
  return item.disabled !== true && item.loading !== true;
}

export function findToggleGroupEdgeIndex(
  items: readonly ToggleGroupFocusableItem[],
  edge: 'first' | 'last',
): number {
  if (edge === 'first') return items.findIndex(isToggleGroupItemAvailable);

  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (isToggleGroupItemAvailable(items[index])) return index;
  }

  return -1;
}

export function findNextToggleGroupIndex(
  items: readonly ToggleGroupFocusableItem[],
  currentIndex: number,
  direction: 1 | -1,
  loop: boolean,
): number {
  if (items.length === 0) return -1;

  let index = currentIndex;
  for (let step = 0; step < items.length; step += 1) {
    index += direction;
    if (index < 0 || index >= items.length) {
      if (!loop) return -1;
      index = index < 0 ? items.length - 1 : 0;
    }
    if (isToggleGroupItemAvailable(items[index])) return index;
  }

  return -1;
}

export function findToggleGroupReplacementIndex(
  items: readonly ToggleGroupFocusableItem[],
  preferredIndex: number,
): number {
  if (items.length === 0) return -1;
  const start = Math.min(Math.max(preferredIndex, 0), items.length - 1);

  for (let distance = 0; distance < items.length; distance += 1) {
    const after = start + distance;
    if (after < items.length && isToggleGroupItemAvailable(items[after])) return after;
    const before = start - distance;
    if (before >= 0 && isToggleGroupItemAvailable(items[before])) return before;
  }

  return -1;
}
