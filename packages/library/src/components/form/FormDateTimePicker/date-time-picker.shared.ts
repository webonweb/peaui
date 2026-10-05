import {
  formatDisplayTime,
  formatModelTime,
  parseDisplayTime,
  parseModelTime,
  validateTimeParts,
  type FormTimePickerFormat,
  type TimePickerValidationOptions,
} from '../FormTimePicker/time-picker.shared';

export type LocalDateTimeValue = {
  date: string;
  time: string;
};

export type FormDateTimePickerVariant = 'single-input' | 'split-input';
export type FormDateTimePickerLayout = 'side-by-side' | 'stacked';
export type FormDateTimePickerPlacement = 'top' | 'bottom';
export type FormDateTimePickerDateFormat = 'iso' | 'locale';
export type FormDateTimePickerInvalidReason =
  'empty' | 'partial' | 'date' | 'time' | 'range' | 'disabled';
export type FormDateTimePickerSection = 'date' | 'time' | 'value';

export type FormDateTimePickerInvalidDetail = {
  input: string | Partial<LocalDateTimeValue> | undefined;
  reason: FormDateTimePickerInvalidReason;
  section: FormDateTimePickerSection;
};

export type CalendarDay = {
  date: string;
  day: number;
  disabled: boolean;
  outsideMonth: boolean;
  selected: boolean;
  today: boolean;
};

export type DateTimeValidationOptions = {
  allowOffStep: boolean;
  format: FormTimePickerFormat;
  hourStep: number;
  isDateTimeDisabled?: (value: LocalDateTimeValue) => boolean;
  locale: string;
  max?: LocalDateTimeValue;
  min?: LocalDateTimeValue;
  minuteStep: number;
  secondStep: number;
  showSeconds: boolean;
};

type DateParts = { day: number; month: number; year: number };

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseModelDate(value: unknown): DateParts | undefined {
  if (typeof value !== 'string') return undefined;
  const match = ISO_DATE.exec(value.trim());
  if (!match) return undefined;
  const parts = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  if (parts.month < 1 || parts.month > 12 || parts.day < 1) return undefined;
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12));
  if (
    date.getUTCFullYear() !== parts.year ||
    date.getUTCMonth() !== parts.month - 1 ||
    date.getUTCDate() !== parts.day
  ) {
    return undefined;
  }
  return parts;
}

export function formatModelDate(parts: DateParts): string {
  return `${String(parts.year).padStart(4, '0')}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
}

export function getTodayModelDate(): string {
  const now = new Date();
  return formatModelDate({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
}

export function formatDisplayDate(
  value: string,
  locale: string,
  format: FormDateTimePickerDateFormat,
): string {
  const parts = parseModelDate(value);
  if (!parts || format === 'iso') return value;
  try {
    return new Intl.DateTimeFormat(locale || 'pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12)));
  } catch {
    return value;
  }
}

export function parseDisplayDate(
  value: string,
  locale: string,
  format: FormDateTimePickerDateFormat,
): string | undefined {
  const source = value.trim();
  if (format === 'iso') return parseModelDate(source) ? source : undefined;
  try {
    const reference = new Intl.DateTimeFormat(locale || 'pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    }).formatToParts(new Date(Date.UTC(2001, 10, 22, 12)));
    const order = reference.filter((part) => ['day', 'month', 'year'].includes(part.type));
    const separators = reference
      .filter((part) => part.type === 'literal')
      .map((part) => part.value);
    const separatorPattern = separators.length ? separators.map(escapeRegExp).join('|') : '[./-]';
    const match = new RegExp(
      `^(\\d{1,4})(?:${separatorPattern})(\\d{1,2})(?:${separatorPattern})(\\d{1,4})$`,
    ).exec(source);
    if (!match || order.length !== 3) return undefined;
    const values: Record<string, number> = {};
    order.forEach((part, index) => {
      values[part.type] = Number(match[index + 1]);
    });
    const candidate = formatModelDate({
      day: values.day ?? 0,
      month: values.month ?? 0,
      year: values.year ?? 0,
    });
    return parseModelDate(candidate) ? candidate : undefined;
  } catch {
    return parseModelDate(source) ? source : undefined;
  }
}

export function formatDateTimeDisplay(
  value: LocalDateTimeValue | undefined,
  options: {
    dateFormat: FormDateTimePickerDateFormat;
    format: FormTimePickerFormat;
    locale: string;
    showSeconds: boolean;
  },
): string {
  if (!value) return '';
  const timeParts = parseModelTime(value.time);
  const time = timeParts
    ? formatDisplayTime(timeParts, {
        format: options.format,
        locale: options.locale,
        showSeconds: options.showSeconds,
      })
    : value.time;
  return `${formatDisplayDate(value.date, options.locale, options.dateFormat)} ${time}`.trim();
}

export function parseDateTimeDisplay(
  input: string,
  options: {
    dateFormat: FormDateTimePickerDateFormat;
    format: FormTimePickerFormat;
    locale: string;
    showSeconds: boolean;
  },
): Partial<LocalDateTimeValue> | undefined {
  const source = input.trim();
  if (!source) return {};
  let timePattern = options.showSeconds ? /(\d{1,2}:\d{2}:\d{2})$/ : /(\d{1,2}:\d{2})$/;
  if (options.format === '12h') {
    timePattern = options.showSeconds
      ? /(\d{1,2}:\d{2}:\d{2}\s*(?:AM|PM))$/i
      : /(\d{1,2}:\d{2}\s*(?:AM|PM))$/i;
  }
  const match = timePattern.exec(source);
  if (!match) {
    const date = parseDisplayDate(source, options.locale, options.dateFormat);
    return date ? { date } : undefined;
  }
  const dateInput = source.slice(0, match.index).trim();
  const date = parseDisplayDate(dateInput, options.locale, options.dateFormat);
  const parts = parseDisplayTime(match[1]!, options.format, options.showSeconds);
  if (!date || !parts) return undefined;
  return { date, time: formatModelTime(parts, options.showSeconds) };
}

export function validateLocalDateTime(
  value: Partial<LocalDateTimeValue> | undefined,
  options: DateTimeValidationOptions,
): FormDateTimePickerInvalidReason | undefined {
  if (!value?.date && !value?.time) return undefined;
  if (!value.date || !value.time) return 'partial';
  if (!parseModelDate(value.date)) return 'date';
  const timeParts = parseModelTime(value.time);
  if (!timeParts) return 'time';

  const timeOptions: TimePickerValidationOptions = {
    allowOffStep: options.allowOffStep,
    format: options.format,
    hourStep: options.hourStep,
    locale: options.locale,
    max: getTimeBoundary(value.date, options.max, 'max'),
    min: getTimeBoundary(value.date, options.min, 'min'),
    minuteStep: options.minuteStep,
    secondStep: options.secondStep,
    showSeconds: options.showSeconds,
  };
  const timeReason = validateTimeParts(timeParts, timeOptions);
  if (timeReason === 'range') return 'range';
  if (timeReason) return 'time';

  const complete = value as LocalDateTimeValue;
  if (options.min && compareLocalDateTime(complete, options.min) < 0) return 'range';
  if (options.max && compareLocalDateTime(complete, options.max) > 0) return 'range';
  if (options.isDateTimeDisabled?.(complete) === true) return 'disabled';
  return undefined;
}

export function compareLocalDateTime(
  first: LocalDateTimeValue,
  second: LocalDateTimeValue,
): number {
  return `${first.date}T${normalizeModelTime(first.time)}`.localeCompare(
    `${second.date}T${normalizeModelTime(second.time)}`,
  );
}

export function getTimeBoundary(
  date: string,
  boundary: LocalDateTimeValue | undefined,
  kind: 'min' | 'max',
): string | undefined {
  if (!boundary) return undefined;
  if (date === boundary.date) return boundary.time;
  if (kind === 'min' && date < boundary.date) return '23:59:59';
  if (kind === 'max' && date > boundary.date) return '00:00:00';
  return undefined;
}

export function isCalendarDateDisabled(
  date: string,
  time: string | undefined,
  options: DateTimeValidationOptions,
): boolean {
  if (!parseModelDate(date)) return true;
  if (options.min && date < options.min.date) return true;
  if (options.max && date > options.max.date) return true;
  if (!time || !options.isDateTimeDisabled) return false;
  return options.isDateTimeDisabled({ date, time });
}

export function buildCalendarDays(
  year: number,
  month: number,
  selected: string | undefined,
  time: string | undefined,
  options: DateTimeValidationOptions,
): CalendarDay[] {
  const first = new Date(Date.UTC(year, month - 1, 1, 12));
  const mondayOffset = (first.getUTCDay() + 6) % 7;
  const start = new Date(Date.UTC(year, month - 1, 1 - mondayOffset, 12));
  const today = getTodayModelDate();
  return Array.from({ length: 42 }, (_, index) => {
    const current = new Date(start);
    current.setUTCDate(start.getUTCDate() + index);
    const date = formatModelDate({
      year: current.getUTCFullYear(),
      month: current.getUTCMonth() + 1,
      day: current.getUTCDate(),
    });
    return {
      date,
      day: current.getUTCDate(),
      disabled: isCalendarDateDisabled(date, time, options),
      outsideMonth: current.getUTCMonth() + 1 !== month,
      selected: date === selected,
      today: date === today,
    };
  });
}

export function getCalendarLabels(
  locale: string,
  year: number,
  month: number,
): {
  month: string;
  weekdays: Array<{ long: string; short: string }>;
} {
  const safeLocale = locale || 'pl-PL';
  try {
    const monthLabel = new Intl.DateTimeFormat(safeLocale, {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month - 1, 1, 12)));
    const weekdayFormatter = new Intl.DateTimeFormat(safeLocale, {
      weekday: 'short',
      timeZone: 'UTC',
    });
    const longWeekdayFormatter = new Intl.DateTimeFormat(safeLocale, {
      weekday: 'long',
      timeZone: 'UTC',
    });
    const monday = new Date(Date.UTC(2024, 0, 1, 12));
    const weekdays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setUTCDate(monday.getUTCDate() + index);
      return { short: weekdayFormatter.format(date), long: longWeekdayFormatter.format(date) };
    });
    return { month: monthLabel, weekdays };
  } catch {
    return {
      month: `${String(month).padStart(2, '0')}.${year}`,
      weekdays: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'].map((short) => ({
        long: short,
        short,
      })),
    };
  }
}

export function shiftMonth(
  year: number,
  month: number,
  offset: number,
): { month: number; year: number } {
  const date = new Date(Date.UTC(year, month - 1 + offset, 1, 12));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
}

export function addDays(value: string, offset: number): string {
  const parts = parseModelDate(value);
  if (!parts) return value;
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + offset, 12));
  return formatModelDate({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  });
}

export function getDateParts(value: string | undefined): DateParts {
  return parseModelDate(value) ?? parseModelDate(getTodayModelDate())!;
}

function normalizeModelTime(value: string): string {
  const parts = parseModelTime(value);
  return parts ? formatModelTime(parts, true) : value;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
