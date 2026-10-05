export type SelectLabels = {
  placeholder: string;
  searchPlaceholder: string;
  selectPlaceholder: string;
  empty: string;
  emptyWritable: string;
  clear: string;
  selectAll: string;
  deselectAll: string;
};

export const DEFAULT_SELECT_LABELS: Readonly<SelectLabels> = {
  placeholder: 'wybierz/wyszukaj',
  searchPlaceholder: 'wyszukaj opcję',
  selectPlaceholder: 'wybierz opcję',
  empty: '- brak wyników -',
  emptyWritable: '- brak wyników (wartość można wpisać ręcznie) -',
  clear: 'Wyczyść wybór',
  selectAll: 'Zaznacz wszystkie',
  deselectAll: 'Odznacz wszystkie',
};

export function getSelectLabels(labels?: Partial<SelectLabels>): SelectLabels {
  return { ...DEFAULT_SELECT_LABELS, ...labels };
}

export type SelectValueMode = 'value' | 'label';
export type SelectOptionValue = { label: string; value?: unknown; disabled?: boolean };

/** Native forms carry strings; each MultiSelect value becomes a separate entry. */
export function getSelectFormValues(value: unknown, multiple: boolean): string[] {
  let values: unknown[] = [value];
  if (multiple) values = Array.isArray(value) ? value : [];
  return values.flatMap((entry: unknown) => {
    if (entry === undefined || entry === null || (!multiple && entry === '')) return [];
    // Native form values use DOM string conversion; application models remain unchanged.
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return [String(entry)];
  });
}

/** The native proxy validates while focus and error semantics stay on the combobox. */
export function focusInvalidSelect(event: Event, input: HTMLInputElement | null | undefined): void {
  event.preventDefault();
  input?.focus();
}

export function getSelectOptionValue(option: SelectOptionValue, mode: SelectValueMode): unknown {
  return mode === 'label' || option.value === undefined ? option.label : option.value;
}

function selectValueKey(value: unknown, mode: SelectValueMode): unknown {
  if (mode !== 'label') return value;
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? String(value).trim().toLowerCase()
    : value;
}

/** Build once per model change; membership checks are constant time even for large selections. */
export function createSelectValueIndex(
  values: readonly unknown[],
  mode: SelectValueMode,
): ReadonlySet<unknown> {
  return new Set(values.map((value) => selectValueKey(value, mode)));
}

export function isSelectOptionSelected(
  option: SelectOptionValue,
  selected: ReadonlySet<unknown>,
  mode: SelectValueMode,
): boolean {
  return (
    selected.has(selectValueKey(getSelectOptionValue(option, mode), mode)) ||
    (mode === 'label' &&
      option.value !== undefined &&
      selected.has(selectValueKey(option.value, mode)))
  );
}

/** Toggles the requested enabled options, preserving values outside the current filter/catalog. */
export function toggleSelectValues(
  current: readonly unknown[],
  options: readonly SelectOptionValue[],
  mode: SelectValueMode,
): unknown[] {
  const enabled = options.filter((option) => option.disabled !== true);
  if (enabled.length === 0) return [...current];
  const selected = createSelectValueIndex(current, mode);
  if (enabled.every((option) => isSelectOptionSelected(option, selected, mode))) {
    const removed = new Set(
      enabled.flatMap((option) =>
        mode === 'label' && option.value !== undefined
          ? [selectValueKey(option.label, mode), selectValueKey(option.value, mode)]
          : [selectValueKey(getSelectOptionValue(option, mode), mode)],
      ),
    );
    return current.filter((value) => !removed.has(selectValueKey(value, mode)));
  }
  const result = [...current];
  const added = new Set(selected);
  for (const option of enabled) {
    if (isSelectOptionSelected(option, added, mode)) continue;
    const value = getSelectOptionValue(option, mode);
    added.add(selectValueKey(value, mode));
    result.push(value);
  }
  return result;
}
/** Prefer the requested side unless the opposite side offers more room for the list. */
export function resolveSelectPlacement(
  rect: Pick<DOMRect, 'top' | 'bottom'>,
  height: number,
  viewportHeight: number,
  preferred: 'top' | 'bottom' = 'bottom',
): 'top' | 'bottom' {
  const above = rect.top;
  const below = viewportHeight - rect.bottom;
  const preferredSpace = preferred === 'bottom' ? below : above;
  const fallbackSpace = preferred === 'bottom' ? above : below;
  if (preferredSpace >= height || preferredSpace >= fallbackSpace) return preferred;
  return preferred === 'bottom' ? 'top' : 'bottom';
}
