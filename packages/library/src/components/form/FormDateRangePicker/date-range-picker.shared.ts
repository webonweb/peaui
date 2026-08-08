import {
  addDays,
  formatDisplayDate,
  formatModelDate,
  getCalendarLabels,
  getDateParts,
  getTodayModelDate,
  parseDisplayDate,
  parseModelDate,
  shiftMonth,
  type FormDateTimePickerDateFormat,
} from '../FormDateTimePicker/date-time-picker.shared';

export type DateRangeValue = [string | undefined, string | undefined];
export type FormDateRangePickerCalendars = 1 | 2;
export type FormDateRangePickerVariant = 'single-input' | 'two-inputs';
export type FormDateRangePickerSelectionOrder = 'swap' | 'reject' | 'resetEnd';
export type FormDateRangePickerPlacement = 'top' | 'bottom';
export type FormDateRangePickerDateFormat = FormDateTimePickerDateFormat;
export type FormDateRangePickerInvalidReason =
  | 'empty'
  | 'partial'
  | 'format'
  | 'order'
  | 'range'
  | 'disabled';
export type FormDateRangePickerSection = 'start' | 'end' | 'value';

export type FormDateRangePickerInvalidDetail = {
  input: string | DateRangeValue | undefined;
  reason: FormDateRangePickerInvalidReason;
  section: FormDateRangePickerSection;
};

export type DateRangePreset = {
  disabled?: boolean;
  id: string;
  label: string;
  value: DateRangeValue;
};

export type DateRangeFormatContext = {
  endpoint: 'start' | 'end';
  locale: string;
};

export type DateRangeFormatter = (value: string, context: DateRangeFormatContext) => string;
export type DateRangeParser = (
  input: string,
  context: DateRangeFormatContext,
) => string | undefined;

export type DateRangeValidationOptions = {
  isDateDisabled?: (date: string) => boolean;
  maxDate?: string;
  minDate?: string;
};

export type DateRangeCalendarDay = {
  date: string;
  day: number;
  disabled: boolean;
  end: boolean;
  inPreview: boolean;
  inRange: boolean;
  outsideMonth: boolean;
  start: boolean;
  today: boolean;
};

export type DateRangeSelectionResult = {
  invalid?: FormDateRangePickerInvalidReason;
  value: DateRangeValue;
};

export function cloneDateRange(value: DateRangeValue | undefined): DateRangeValue {
  return [value?.[0], value?.[1]];
}

export function isCompleteDateRange(value: DateRangeValue | undefined): value is [string, string] {
  return Boolean(value?.[0] && value[1]);
}

export function compareDates(first: string, second: string): number {
  return first.localeCompare(second);
}

export function isDateUnavailable(date: string, options: DateRangeValidationOptions): boolean {
  if (!parseModelDate(date)) return true;
  if (options.minDate && date < options.minDate) return true;
  if (options.maxDate && date > options.maxDate) return true;
  return options.isDateDisabled?.(date) === true;
}

export function validateDateRange(
  value: DateRangeValue | undefined,
  options: DateRangeValidationOptions,
  required = false,
): FormDateRangePickerInvalidReason | undefined {
  const start = value?.[0];
  const end = value?.[1];
  if (!start && !end) return required ? 'empty' : undefined;
  if (!start || !end) return 'partial';
  if (!parseModelDate(start) || !parseModelDate(end)) return 'format';
  if (start > end) return 'order';
  if ((options.minDate && start < options.minDate) || (options.maxDate && end > options.maxDate)) {
    return 'range';
  }
  if (isDateUnavailable(start, options) || isDateUnavailable(end, options)) return 'disabled';
  return undefined;
}

export function selectRangeDate(
  current: DateRangeValue | undefined,
  date: string,
  policy: FormDateRangePickerSelectionOrder,
): DateRangeSelectionResult {
  const start = current?.[0];
  const end = current?.[1];
  if (!start || end) return { value: [date, undefined] };
  if (date >= start) return { value: [start, date] };
  if (policy === 'swap') return { value: [date, start] };
  if (policy === 'resetEnd') return { value: [date, undefined] };
  return { invalid: 'order', value: cloneDateRange(current) };
}

export function normalizeManualRange(
  value: DateRangeValue,
  policy: FormDateRangePickerSelectionOrder,
): DateRangeSelectionResult {
  const [start, end] = value;
  if (!start || !end || start <= end) return { value: cloneDateRange(value) };
  if (policy === 'swap') return { value: [end, start] };
  if (policy === 'resetEnd') return { value: [start, undefined] };
  return { invalid: 'order', value: cloneDateRange(value) };
}

export function formatRangeEndpoint(
  value: string | undefined,
  endpoint: 'start' | 'end',
  options: {
    dateFormat: FormDateRangePickerDateFormat;
    format?: DateRangeFormatter;
    locale: string;
  },
): string {
  if (!value) return '';
  if (options.format) return options.format(value, { endpoint, locale: options.locale });
  return formatDisplayDate(value, options.locale, options.dateFormat);
}

export function parseRangeEndpoint(
  input: string,
  endpoint: 'start' | 'end',
  options: {
    dateFormat: FormDateRangePickerDateFormat;
    locale: string;
    parse?: DateRangeParser;
  },
): string | undefined {
  const source = input.trim();
  if (!source) return undefined;
  const value = options.parse
    ? options.parse(source, { endpoint, locale: options.locale })
    : parseDisplayDate(source, options.locale, options.dateFormat);
  return value && parseModelDate(value) ? value : undefined;
}

export function formatDateRange(
  value: DateRangeValue | undefined,
  options: {
    dateFormat: FormDateRangePickerDateFormat;
    format?: DateRangeFormatter;
    locale: string;
  },
): string {
  const start = formatRangeEndpoint(value?.[0], 'start', options);
  const end = formatRangeEndpoint(value?.[1], 'end', options);
  if (!start) return '';
  return end ? `${start} – ${end}` : start;
}

export function parseDateRange(
  input: string,
  options: {
    dateFormat: FormDateRangePickerDateFormat;
    locale: string;
    parse?: DateRangeParser;
  },
): DateRangeValue | undefined {
  const source = input.trim();
  if (!source) return [undefined, undefined];
  const parts = source.split(/\s+(?:–|—|do|-)\s+/i);
  if (parts.length > 2) return undefined;
  const start = parseRangeEndpoint(parts[0] ?? '', 'start', options);
  if (!start) return undefined;
  if (parts.length === 1) return [start, undefined];
  const end = parseRangeEndpoint(parts[1] ?? '', 'end', options);
  return end ? [start, end] : undefined;
}

export function getPreviewBounds(
  value: DateRangeValue | undefined,
  hoverDate: string | undefined,
): DateRangeValue {
  const start = value?.[0];
  if (!start || value[1] || !hoverDate) return [undefined, undefined];
  return start <= hoverDate ? [start, hoverDate] : [hoverDate, start];
}

export function buildRangeCalendarDays(
  year: number,
  month: number,
  value: DateRangeValue | undefined,
  hoverDate: string | undefined,
  options: DateRangeValidationOptions,
): DateRangeCalendarDay[] {
  const first = new Date(Date.UTC(year, month - 1, 1, 12));
  const mondayOffset = (first.getUTCDay() + 6) % 7;
  const startDate = new Date(Date.UTC(year, month - 1, 1 - mondayOffset, 12));
  const today = getTodayModelDate();
  const [rangeStart, rangeEnd] = value ?? [];
  const [previewStart, previewEnd] = getPreviewBounds(value, hoverDate);
  return Array.from({ length: 42 }, (_, index) => {
    const current = new Date(startDate);
    current.setUTCDate(startDate.getUTCDate() + index);
    const date = formatModelDate({
      year: current.getUTCFullYear(),
      month: current.getUTCMonth() + 1,
      day: current.getUTCDate(),
    });
    return {
      date,
      day: current.getUTCDate(),
      disabled: isDateUnavailable(date, options),
      end: date === rangeEnd,
      inPreview: Boolean(previewStart && previewEnd && date >= previewStart && date <= previewEnd),
      inRange: Boolean(rangeStart && rangeEnd && date >= rangeStart && date <= rangeEnd),
      outsideMonth: current.getUTCMonth() + 1 !== month,
      start: date === rangeStart,
      today: date === today,
    };
  });
}

export function getDateAriaLabel(
  date: string,
  locale: string,
  state?: { end?: boolean; inRange?: boolean; start?: boolean },
): string {
  const parts = getDateParts(date);
  let label = date;
  try {
    label = new Intl.DateTimeFormat(locale || 'pl-PL', {
      dateStyle: 'full',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12)));
  } catch {
    // ISO date remains an unambiguous fallback.
  }
  if (state?.start === true) return `${label}, początek zakresu`;
  if (state?.end === true) return `${label}, koniec zakresu`;
  if (state?.inRange === true) return `${label}, w wybranym zakresie`;
  return label;
}

export function getRangeStatus(value: DateRangeValue | undefined, locale: string): string {
  const [start, end] = value ?? [];
  if (!start) return 'Wybierz datę początkową.';
  if (!end)
    return `Wybrano początek ${formatDisplayDate(start, locale, 'locale')}. Wybierz datę końcową.`;
  return `Wybrano zakres od ${formatDisplayDate(start, locale, 'locale')} do ${formatDisplayDate(end, locale, 'locale')}.`;
}

export { addDays, getCalendarLabels, getDateParts, getTodayModelDate, parseModelDate, shiftMonth };
