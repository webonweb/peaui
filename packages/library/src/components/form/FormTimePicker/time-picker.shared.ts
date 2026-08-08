export type FormTimePickerFormat = '12h' | '24h';
export type FormTimePickerVariant = 'input' | 'segmented';
export type FormTimePickerPanelMode = 'dropdown' | 'spinbutton';
export type FormTimePickerPlacement = 'top' | 'bottom';
export type TimePickerPeriod = 'am' | 'pm';
export type TimePickerSegment = 'hour' | 'minute' | 'second' | 'period';
export type TimePickerInvalidReason = 'empty' | 'format' | 'range' | 'step';

export type TimePickerParts = {
  hour: number;
  minute: number;
  second: number;
};

export type TimePickerFormatContext = {
  format: FormTimePickerFormat;
  locale: string;
  showSeconds: boolean;
};

export type TimePickerValidationOptions = TimePickerFormatContext & {
  allowOffStep: boolean;
  hourStep: number;
  max?: string;
  min?: string;
  minuteStep: number;
  secondStep: number;
};

export type TimePickerOption = {
  disabled: boolean;
  label: string;
  value: number | TimePickerPeriod;
};

export type TimePickerInvalidDetail = {
  input: string;
  reason: TimePickerInvalidReason;
};

export type TimePickerParser = (
  input: string,
  context: TimePickerFormatContext,
) => string | TimePickerParts | null | undefined;

export type TimePickerFormatter = (value: string, context: TimePickerFormatContext) => string;

export const DEFAULT_TIME_PARTS: TimePickerParts = {
  hour: 9,
  minute: 0,
  second: 0,
};

export function normalizeStep(value: number | undefined, maximum: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(maximum, Math.max(1, Math.trunc(value ?? 1)));
}

export function isTimeParts(value: unknown): value is TimePickerParts {
  if (value === null || value === undefined || typeof value !== 'object') return false;
  const parts = value as Partial<TimePickerParts>;
  return (
    Number.isInteger(parts.hour) &&
    Number.isInteger(parts.minute) &&
    Number.isInteger(parts.second) &&
    (parts.hour ?? -1) >= 0 &&
    (parts.hour ?? 24) <= 23 &&
    (parts.minute ?? -1) >= 0 &&
    (parts.minute ?? 60) <= 59 &&
    (parts.second ?? -1) >= 0 &&
    (parts.second ?? 60) <= 59
  );
}

export function parseModelTime(value: unknown): TimePickerParts | undefined {
  if (typeof value !== 'string') return undefined;
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim());
  if (!match) return undefined;

  const parts: TimePickerParts = {
    hour: Number(match[1]),
    minute: Number(match[2]),
    second: Number(match[3] ?? 0),
  };
  return isTimeParts(parts) ? parts : undefined;
}

export function parseDisplayTime(
  value: string,
  format: FormTimePickerFormat,
  showSeconds: boolean,
): TimePickerParts | undefined {
  const source = value.trim();
  let pattern: RegExp;
  if (format === '12h') {
    pattern = showSeconds
      ? /^(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)$/i
      : /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
  } else {
    pattern = showSeconds ? /^(\d{1,2}):(\d{2}):(\d{2})$/ : /^(\d{1,2}):(\d{2})$/;
  }
  const match = pattern.exec(source);
  if (!match) return undefined;

  const sourceHour = Number(match[1]);
  const minute = Number(match[2]);
  const second = showSeconds ? Number(match[3]) : 0;
  let hour = sourceHour;

  if (format === '12h') {
    if (sourceHour < 1 || sourceHour > 12) return undefined;
    const period = match[showSeconds ? 4 : 3]?.toLowerCase();
    hour = (sourceHour % 12) + (period === 'pm' ? 12 : 0);
  }

  const parts = { hour, minute, second };
  return isTimeParts(parts) ? parts : undefined;
}

export function formatModelTime(parts: TimePickerParts, showSeconds: boolean): string {
  const base = `${padTimePart(parts.hour)}:${padTimePart(parts.minute)}`;
  return showSeconds ? `${base}:${padTimePart(parts.second)}` : base;
}

export function formatDisplayTime(
  parts: TimePickerParts,
  context: TimePickerFormatContext,
): string {
  const { format, locale, showSeconds } = context;
  if (format === '24h') return formatModelTime(parts, showSeconds);

  const displayHour = parts.hour % 12 || 12;
  const period = getPeriodLabels(locale)[parts.hour >= 12 ? 'pm' : 'am'];
  const base = `${padTimePart(displayHour)}:${padTimePart(parts.minute)}`;
  return `${showSeconds ? `${base}:${padTimePart(parts.second)}` : base} ${period}`;
}

export function getPeriodLabels(locale: string): Record<TimePickerPeriod, string> {
  try {
    const formatter = new Intl.DateTimeFormat(locale || 'pl-PL', {
      hour: 'numeric',
      hour12: true,
      timeZone: 'UTC',
    });
    const getLabel = (hour: number, fallback: string): string =>
      formatter
        .formatToParts(new Date(Date.UTC(2020, 0, 1, hour)))
        .find((part) => part.type === 'dayPeriod')?.value ?? fallback;
    return { am: getLabel(9, 'AM'), pm: getLabel(15, 'PM') };
  } catch {
    return { am: 'AM', pm: 'PM' };
  }
}

export function validateTimeParts(
  parts: TimePickerParts,
  options: TimePickerValidationOptions,
): TimePickerInvalidReason | undefined {
  if (!isTimeParts(parts)) return 'format';
  const min = parseModelTime(options.min);
  const max = parseModelTime(options.max);
  const value = timePartsToSeconds(parts);

  if (
    (min && max && timePartsToSeconds(min) > timePartsToSeconds(max)) ||
    (min && value < timePartsToSeconds(min)) ||
    (max && value > timePartsToSeconds(max))
  ) {
    return 'range';
  }

  if (!options.allowOffStep) {
    const hourStep = normalizeStep(options.hourStep, 24);
    const minuteStep = normalizeStep(options.minuteStep, 60);
    const secondStep = normalizeStep(options.secondStep, 60);
    if (
      parts.hour % hourStep !== 0 ||
      parts.minute % minuteStep !== 0 ||
      (options.showSeconds && parts.second % secondStep !== 0)
    ) {
      return 'step';
    }
  }

  return undefined;
}

export function getFirstValidTime(
  options: TimePickerValidationOptions,
): TimePickerParts | undefined {
  const min = parseModelTime(options.min);
  const max = parseModelTime(options.max);
  if (min && max && timePartsToSeconds(min) > timePartsToSeconds(max)) return undefined;

  const hourStep = normalizeStep(options.hourStep, 24);
  const minuteStep = normalizeStep(options.minuteStep, 60);
  const secondStep = normalizeStep(options.secondStep, 60);
  for (let hour = 0; hour < 24; hour += hourStep) {
    for (let minute = 0; minute < 60; minute += minuteStep) {
      for (let second = 0; second < (options.showSeconds ? 60 : 1); second += secondStep) {
        const candidate = { hour, minute, second };
        if (!validateTimeParts(candidate, options)) return candidate;
      }
    }
  }
  return undefined;
}

export function buildSegmentOptions(
  segment: Exclude<TimePickerSegment, 'period'>,
  current: TimePickerParts,
  options: TimePickerValidationOptions,
): TimePickerOption[] {
  const maximum = segment === 'hour' ? 24 : 60;
  let configuredStep = options.secondStep;
  if (segment === 'hour') configuredStep = options.hourStep;
  else if (segment === 'minute') configuredStep = options.minuteStep;
  const step = normalizeStep(configuredStep, maximum);
  const values = new Set<number>();
  for (let value = 0; value < maximum; value += step) values.add(value);
  values.add(current[segment]);

  return [...values]
    .sort((first, second) => first - second)
    .map((value) => {
      const candidate = { ...current, [segment]: value };
      return {
        disabled: Boolean(validateTimeParts(candidate, options)),
        label:
          segment === 'hour' && options.format === '12h'
            ? padTimePart(value % 12 || 12)
            : padTimePart(value),
        value,
      };
    });
}

export function setTimeSegment(
  current: TimePickerParts,
  segment: TimePickerSegment,
  value: number | TimePickerPeriod,
): TimePickerParts {
  if (segment === 'period') {
    const period = value as TimePickerPeriod;
    return {
      ...current,
      hour: (current.hour % 12) + (period === 'pm' ? 12 : 0),
    };
  }
  return { ...current, [segment]: Number(value) };
}

export function getSegmentValue(
  parts: TimePickerParts,
  segment: TimePickerSegment,
  format: FormTimePickerFormat,
): number {
  if (segment === 'period') return parts.hour >= 12 ? 1 : 0;
  if (segment === 'hour' && format === '12h') return parts.hour % 12 || 12;
  return parts[segment];
}

export function getSegmentText(
  parts: TimePickerParts,
  segment: TimePickerSegment,
  context: TimePickerFormatContext,
): string {
  if (segment === 'period') return getPeriodLabels(context.locale)[parts.hour >= 12 ? 'pm' : 'am'];
  return padTimePart(getSegmentValue(parts, segment, context.format));
}

export function getSegmentRange(
  segment: TimePickerSegment,
  format: FormTimePickerFormat,
): { max: number; min: number } {
  if (segment === 'hour') return format === '12h' ? { min: 1, max: 12 } : { min: 0, max: 23 };
  if (segment === 'period') return { min: 0, max: 1 };
  return { min: 0, max: 59 };
}

export function getAdjacentSegmentValue(
  segment: TimePickerSegment,
  current: TimePickerParts,
  direction: 1 | -1,
  options: TimePickerValidationOptions,
): TimePickerParts | undefined {
  if (segment === 'period') {
    const next = setTimeSegment(current, segment, current.hour >= 12 ? 'am' : 'pm');
    return validateTimeParts(next, options) ? undefined : next;
  }

  const candidates = buildSegmentOptions(segment, current, options).filter(
    (option) => !option.disabled,
  );
  if (!candidates.length) return undefined;
  const currentIndex = candidates.findIndex((option) => option.value === current[segment]);
  let startIndex = currentIndex;
  if (currentIndex < 0) startIndex = direction === 1 ? -1 : 0;
  const nextIndex = (startIndex + direction + candidates.length) % candidates.length;
  return setTimeSegment(current, segment, candidates[nextIndex]!.value);
}

export function timePartsToSeconds(parts: TimePickerParts): number {
  return parts.hour * 3600 + parts.minute * 60 + parts.second;
}

function padTimePart(value: number): string {
  return String(value).padStart(2, '0');
}
