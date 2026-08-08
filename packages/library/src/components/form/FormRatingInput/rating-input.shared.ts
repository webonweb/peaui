export type RatingValue = number | null;
export type FormRatingInputStep = 0.5 | 1;
export type FormRatingInputSize = 's' | 'm' | 'l';
export type RatingLabels = Readonly<Record<string, string>>;
export type RatingLabelGetter = (value: RatingValue, max: number) => string | undefined;

export type RatingKeyboardAction = 'decrement' | 'increment' | 'minimum' | 'maximum' | 'clear';

const DEFAULT_MAX = 5;
const MAX_RENDERED_ITEMS = 100;

export function normalizeRatingMax(max: number | undefined): number {
  if (!Number.isFinite(max)) return DEFAULT_MAX;
  return Math.min(MAX_RENDERED_ITEMS, Math.max(1, Math.round(max ?? DEFAULT_MAX)));
}

export function normalizeRatingStep(step: number | undefined): FormRatingInputStep {
  return step === 0.5 ? 0.5 : 1;
}

export function normalizeRatingValue(
  value: number | null | undefined,
  max: number,
  step: FormRatingInputStep,
): RatingValue {
  if (value === null || value === undefined || !Number.isFinite(value) || value <= 0) return null;
  const units = step === 0.5 ? 2 : 1;
  const snapped = Math.round(value * units) / units;
  return Math.min(max, Math.max(step, snapped));
}

export function getRatingItemFill(value: RatingValue, index: number): 0 | 50 | 100 {
  if (value === null) return 0;
  const fill = value - index;
  if (fill >= 1) return 100;
  if (fill >= 0.5) return 50;
  return 0;
}

export function getRatingPointerValue(
  itemIndex: number,
  offsetRatio: number,
  max: number,
  step: FormRatingInputStep,
  rtl = false,
): number {
  const safeIndex = Math.min(max - 1, Math.max(0, Math.round(itemIndex)));
  const ratio = Math.min(1, Math.max(0, rtl ? 1 - offsetRatio : offsetRatio));
  const fraction = step === 0.5 && ratio <= 0.5 ? 0.5 : 1;
  return Math.min(max, safeIndex + fraction);
}

export function getRatingKeyboardValue(
  value: RatingValue,
  action: RatingKeyboardAction,
  options: {
    allowClear: boolean;
    max: number;
    step: FormRatingInputStep;
  },
): RatingValue {
  if (action === 'clear') return options.allowClear ? null : value;
  if (action === 'minimum') return options.step;
  if (action === 'maximum') return options.max;

  const current = value ?? 0;
  if (action === 'increment') return Math.min(options.max, current + options.step);
  const next = current - options.step;
  if (next > 0) return next;
  return options.allowClear ? null : options.step;
}

export function getRatingDescription(
  value: RatingValue,
  max: number,
  options: {
    emptyLabel?: string;
    getLabel?: RatingLabelGetter;
    labels?: RatingLabels;
    locale?: string;
  } = {},
): string {
  if (value === null) return options.emptyLabel?.trim() || `Brak oceny z ${max}`;

  const locale = options.locale?.trim() || 'pl-PL';
  let formatted = String(value);
  try {
    formatted = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
  } catch {
    // The stable numeric fallback keeps the component usable for an invalid locale.
  }
  const custom = options.getLabel?.(value, max)?.trim() || options.labels?.[String(value)]?.trim();
  const base = `${formatted} z ${max}`;
  return custom ? `${base} — ${custom}` : base;
}
