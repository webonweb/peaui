/** @jsxImportSource react */
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
} from 'react';

import {
  DEFAULT_TIME_PARTS,
  formatDisplayTime,
  formatModelTime,
  getAdjacentSegmentValue,
  getSegmentRange,
  getSegmentText,
  getSegmentValue,
  normalizeStep,
  parseDisplayTime,
  parseModelTime,
  setTimeSegment,
  type FormTimePickerFormat,
  type TimePickerParts,
  type TimePickerSegment,
  type TimePickerValidationOptions,
} from '../components/form/FormTimePicker/time-picker.shared';
import {
  addDays,
  buildCalendarDays,
  formatDateTimeDisplay,
  formatDisplayDate,
  getCalendarLabels,
  getDateParts,
  getTimeBoundary,
  getTodayModelDate,
  parseDateTimeDisplay,
  parseDisplayDate,
  shiftMonth,
  validateLocalDateTime,
  type DateTimeValidationOptions,
  type FormDateTimePickerDateFormat,
  type FormDateTimePickerInvalidDetail,
  type FormDateTimePickerLayout,
  type FormDateTimePickerPlacement,
  type FormDateTimePickerVariant,
  type LocalDateTimeValue,
} from '../components/form/FormDateTimePicker/date-time-picker.shared';
import { reactIconData } from './generated-icon-data';

type RuntimeProps = Record<string, unknown> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

type NativePopoverElement = HTMLDivElement & {
  hidePopover?: () => void;
  showPopover?: () => void;
};

const cx = (...values: Array<string | false | null | undefined>): string =>
  values
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .join(' ');

const text = (props: RuntimeProps, name: string, fallback = ''): string => {
  const value = props[name];
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
};

const bool = (props: RuntimeProps, name: string, fallback = false): boolean => {
  const value = props[name];
  return typeof value === 'boolean' ? value : fallback;
};

const num = (props: RuntimeProps, name: string, fallback: number): number => {
  const value = props[name];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
};

const call = (props: RuntimeProps, name: string, ...args: unknown[]): void => {
  const handler = props[name];
  if (typeof handler === 'function') (handler as (...values: unknown[]) => void)(...args);
};

function useRuntimeModel<T>(
  props: RuntimeProps,
  name: string,
  fallback: T,
): readonly [T, (value: T) => void] {
  const capitalized = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  const controlled = Object.prototype.hasOwnProperty.call(props, name);
  const valueFromProps = props[name] as T | undefined;
  const defaultValue = props[`default${capitalized}`] as T | undefined;
  const [internal, setInternal] = useState<T>(defaultValue ?? fallback);
  const value = controlled ? (valueFromProps as T) : internal;
  const update = (next: T): void => {
    if (!controlled) setInternal(next);
    call(props, `on${capitalized}Change`, next);
  };
  return [value, update] as const;
}

function useNativePopover(open: boolean): MutableRefObject<NativePopoverElement | null> {
  const ref = useRef<NativePopoverElement | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof element.showPopover !== 'function' || typeof element.hidePopover !== 'function') {
      element.hidden = !open;
      return;
    }
    element.hidden = false;
    try {
      const visible = element.matches(':popover-open');
      if (open && !visible) element.showPopover();
      if (!open && visible) element.hidePopover();
    } catch {
      element.hidden = !open;
    }
  }, [open]);
  return ref;
}

function assignRef<T>(ref: ForwardedRef<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as MutableRefObject<T | null>).current = value;
}

function Icon({ name, className }: { name: string; className?: string }): ReactElement {
  const icon = reactIconData[name] ?? reactIconData.info;
  return (
    <svg
      aria-hidden="true"
      className={cx('peaui-svg-icon', className)}
      dangerouslySetInnerHTML={{ __html: icon?.body ?? '' }}
      focusable="false"
      viewBox={icon?.viewBox ?? '0 0 24 24'}
    />
  );
}

function invalidMessage(reason: FormDateTimePickerInvalidDetail['reason'] | undefined): string {
  if (reason === 'empty') return 'Wybierz datę i czas.';
  if (reason === 'partial') return 'Uzupełnij zarówno datę, jak i czas.';
  if (reason === 'date') return 'Wpisz poprawną datę.';
  if (reason === 'time') return 'Wpisz poprawny czas zgodny z dozwolonym interwałem.';
  if (reason === 'range') return 'Wybrana data i czas są poza dozwolonym zakresem.';
  if (reason === 'disabled') return 'Ta data i godzina są niedostępne.';
  return '';
}

function hasContent(value: unknown): boolean {
  return value !== undefined && value !== null && value !== false && value !== '';
}

export function FormDateTimePickerRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedId = useId().replaceAll(':', '');
  const id = text(props, 'id', `peaui-date-time-${generatedId}`);
  const name = text(props, 'name', id);
  const label = text(props, 'label');
  const locale = text(props, 'locale', 'pl-PL');
  const dateFormat = text(props, 'dateFormat', 'locale') as FormDateTimePickerDateFormat;
  const format = text(props, 'format', '24h') as FormTimePickerFormat;
  const variant = text(props, 'variant', 'single-input') as FormDateTimePickerVariant;
  const layout = text(props, 'layout', 'side-by-side') as FormDateTimePickerLayout;
  const placement = text(props, 'placement', 'bottom') as FormDateTimePickerPlacement;
  const showSeconds = bool(props, 'showSeconds');
  const showTimeZone = bool(props, 'showTimeZone');
  const confirm = bool(props, 'confirm');
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  const loading = bool(props, 'loading');
  const canErase = bool(props, 'canErase', true);
  const required = bool(props, 'required');
  const blocked = disabled || readonly || loading;
  const baseTestId = text(props, 'dataTestId') || text(props, 'data-testid') || undefined;
  const timeZone =
    text(props, 'timeZone') ||
    (() => {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'local';
      } catch {
        return 'local';
      }
    })();
  let timePlaceholder = showSeconds ? 'gg:mm:ss' : 'gg:mm';
  if (format === '12h') timePlaceholder = showSeconds ? 'gg:mm:ss AM/PM' : 'gg:mm AM/PM';
  const placeholder =
    text(props, 'placeholder') ||
    `${dateFormat === 'iso' ? 'rrrr-mm-dd' : 'dd.mm.rrrr'} ${timePlaceholder}`;
  const formatContext = useMemo(
    () => ({ format, locale, showSeconds }),
    [format, locale, showSeconds],
  );
  const validationOptions = useMemo<DateTimeValidationOptions>(
    () => ({
      allowOffStep: bool(props, 'allowOffStep'),
      format,
      hourStep: normalizeStep(num(props, 'hourStep', 1), 24),
      isDateTimeDisabled: props.isDateTimeDisabled as
        | ((value: LocalDateTimeValue) => boolean)
        | undefined,
      locale,
      max: props.max as LocalDateTimeValue | undefined,
      min: props.min as LocalDateTimeValue | undefined,
      minuteStep: normalizeStep(num(props, 'minuteStep', 5), 60),
      secondStep: normalizeStep(num(props, 'secondStep', 5), 60),
      showSeconds,
    }),
    [
      format,
      locale,
      props.allowOffStep,
      props.hourStep,
      props.isDateTimeDisabled,
      props.max,
      props.min,
      props.minuteStep,
      props.secondStep,
      showSeconds,
    ],
  );
  const [modelValue, setModelValue] = useRuntimeModel<LocalDateTimeValue | undefined>(
    props,
    'value',
    undefined,
  );
  const [open, setOpen] = useRuntimeModel<boolean>(props, 'open', false);
  const [popoverPlacement, setPopoverPlacement] = useState(placement);
  const [availablePanelHeight, setAvailablePanelHeight] = useState(608);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const [draft, setDraft] = useState<Partial<LocalDateTimeValue>>(
    modelValue ? { ...modelValue } : {},
  );
  const displayFrom = (value: LocalDateTimeValue | undefined): string =>
    formatDateTimeDisplay(value, { dateFormat, ...formatContext });
  const [singleText, setSingleText] = useState(displayFrom(modelValue));
  const [dateText, setDateText] = useState(
    modelValue?.date ? formatDisplayDate(modelValue.date, locale, dateFormat) : '',
  );
  const initialTime = parseModelTime(modelValue?.time);
  const [timeText, setTimeText] = useState(
    initialTime ? formatDisplayTime(initialTime, formatContext) : '',
  );
  const initialDate = getDateParts(modelValue?.date);
  const [visible, setVisible] = useState({ year: initialDate.year, month: initialDate.month });
  const [activeDate, setActiveDate] = useState(modelValue?.date ?? getTodayModelDate());
  const [reason, setReason] = useState<FormDateTimePickerInvalidDetail['reason']>();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useNativePopover(open);
  const dayRefs = useRef(new Map<string, HTMLButtonElement>());
  const root = 'peaui-form-date-time-picker';
  const panelId = `${id}-panel`;
  const description = (props.descriptionContent ?? props.description) as ReactNode;
  const externalError = (props.errorContent ?? props.error) as ReactNode;
  const hasError = hasContent(externalError) || Boolean(reason);
  const descriptionId = `${id}-help-description`;
  const errorId = `${id}-error`;
  const loadingId = `${id}-date-time-loading`;
  const describedBy =
    [
      text(props, 'aria-describedby') || undefined,
      hasContent(description) && !hasError ? descriptionId : undefined,
      hasError ? errorId : undefined,
      loading ? loadingId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;
  const currentTime = parseModelTime(draft.time) ?? DEFAULT_TIME_PARTS;
  const segments: TimePickerSegment[] = [
    'hour',
    'minute',
    ...(showSeconds ? (['second'] as const) : []),
    ...(format === '12h' ? (['period'] as const) : []),
  ];
  const labels = getCalendarLabels(locale, visible.year, visible.month);
  const calendarDays = buildCalendarDays(
    visible.year,
    visible.month,
    draft.date,
    draft.time,
    validationOptions,
  );
  const calendarRows = Array.from({ length: 6 }, (_, index) =>
    calendarDays.slice(index * 7, index * 7 + 7),
  );
  const draftReason = validateLocalDateTime(draft, validationOptions);

  const syncDraft = (value: LocalDateTimeValue | undefined = modelValue): void => {
    const next = value ? { ...value } : {};
    setDraft(next);
    setSingleText(displayFrom(value));
    setDateText(value?.date ? formatDisplayDate(value.date, locale, dateFormat) : '');
    const parts = parseModelTime(value?.time);
    setTimeText(parts ? formatDisplayTime(parts, formatContext) : '');
    const date = getDateParts(value?.date);
    setVisible({ year: date.year, month: date.month });
    setActiveDate(value?.date ?? getTodayModelDate());
  };

  useEffect(() => {
    if (!open || !confirm) syncDraft(modelValue);
  }, [modelValue?.date, modelValue?.time]);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const updateTriggerWidth = (): void => {
      setTriggerWidth(element.getBoundingClientRect().width);
    };
    updateTriggerWidth();
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(updateTriggerWidth);
    observer?.observe(element);
    window.addEventListener('resize', updateTriggerWidth);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateTriggerWidth);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => dayRefs.current.get(activeDate)?.focus());
    return () => cancelAnimationFrame(frame);
  }, [activeDate, open]);

  const updateOpen = (next: boolean, restoreFocus = false): void => {
    if (next && blocked) return;
    if (next) {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        const availableAbove = rect.top;
        const availableBelow = window.innerHeight - rect.bottom;
        const preferredSpace = placement === 'bottom' ? availableBelow : availableAbove;
        const fallback = placement === 'bottom' ? 'top' : 'bottom';
        const fallbackSpace = fallback === 'bottom' ? availableBelow : availableAbove;
        const estimatedHeight = layout === 'stacked' ? 600 : 500;
        const nextPlacement =
          preferredSpace >= estimatedHeight || preferredSpace >= fallbackSpace
            ? placement
            : fallback;
        setPopoverPlacement(nextPlacement);
        const selectedSpace = nextPlacement === 'bottom' ? availableBelow : availableAbove;
        setAvailablePanelHeight(Math.max(240, selectedSpace - 10));
      }
      syncDraft(modelValue);
      setReason(undefined);
      call(props, 'onOpen');
    } else {
      if (confirm) syncDraft(modelValue);
      call(props, 'onClose');
    }
    setOpen(next);
    if (!next && restoreFocus)
      requestAnimationFrame(() =>
        triggerRef.current?.querySelector<HTMLElement>('input, button')?.focus(),
      );
  };

  const reportInvalid = (
    nextReason: FormDateTimePickerInvalidDetail['reason'],
    section: FormDateTimePickerInvalidDetail['section'],
    input: FormDateTimePickerInvalidDetail['input'],
  ): void => {
    setReason(nextReason);
    call(props, 'onInvalid', {
      input,
      reason: nextReason,
      section,
    } satisfies FormDateTimePickerInvalidDetail);
  };

  const commit = (next: LocalDateTimeValue | undefined): void => {
    setModelValue(next);
    call(props, 'onChange', next);
  };

  const updateDraftDate = (date: string | undefined): void => {
    const next = { ...draft, date };
    setDraft(next);
    setDateText(date ? formatDisplayDate(date, locale, dateFormat) : '');
    setSingleText(next.date && next.time ? displayFrom(next as LocalDateTimeValue) : '');
    call(props, 'onDateChange', date);
    const invalid = validateLocalDateTime(next, validationOptions);
    if (!confirm && !invalid && next.date && next.time) commit(next as LocalDateTimeValue);
  };

  const updateDraftTime = (time: string | undefined): void => {
    const next = { ...draft, time };
    setDraft(next);
    const parts = parseModelTime(time);
    setTimeText(parts ? formatDisplayTime(parts, formatContext) : '');
    setSingleText(next.date && next.time ? displayFrom(next as LocalDateTimeValue) : '');
    call(props, 'onTimeChange', time);
    const invalid = validateLocalDateTime(next, validationOptions);
    if (!confirm && !invalid && next.date && next.time) commit(next as LocalDateTimeValue);
  };

  const commitSingleInput = (): void => {
    const parsed = parseDateTimeDisplay(singleText, { dateFormat, ...formatContext });
    if (parsed === undefined) {
      reportInvalid('date', 'value', singleText);
      return;
    }
    setDraft(parsed);
    if (!parsed.date && !parsed.time) {
      if (required) reportInvalid('empty', 'value', singleText);
      else commit(undefined);
      return;
    }
    const invalid = validateLocalDateTime(parsed, validationOptions);
    if (invalid || !parsed.date || !parsed.time) {
      reportInvalid(invalid ?? 'partial', 'value', singleText);
      return;
    }
    setReason(undefined);
    setDateText(formatDisplayDate(parsed.date, locale, dateFormat));
    const parts = parseModelTime(parsed.time);
    setTimeText(parts ? formatDisplayTime(parts, formatContext) : '');
    call(props, 'onDateChange', parsed.date);
    call(props, 'onTimeChange', parsed.time);
    if (!confirm) commit(parsed as LocalDateTimeValue);
  };

  const commitDateInput = (): void => {
    if (!dateText.trim()) {
      updateDraftDate(undefined);
      if (draft.time) reportInvalid('partial', 'date', { ...draft, date: undefined });
      return;
    }
    const date = parseDisplayDate(dateText, locale, dateFormat);
    if (!date) reportInvalid('date', 'date', dateText);
    else updateDraftDate(date);
  };

  const commitTimeInput = (): void => {
    if (!timeText.trim()) {
      updateDraftTime(undefined);
      if (draft.date) reportInvalid('partial', 'time', { ...draft, time: undefined });
      return;
    }
    const parts = parseDisplayTime(timeText, format, showSeconds);
    if (!parts) reportInvalid('time', 'time', timeText);
    else updateDraftTime(formatModelTime(parts, showSeconds));
  };

  const focusDate = (date: string): void => {
    setActiveDate(date);
    const dateParts = getDateParts(date);
    if (dateParts.year !== visible.year || dateParts.month !== visible.month) {
      setVisible({ year: dateParts.year, month: dateParts.month });
    }
    requestAnimationFrame(() => dayRefs.current.get(date)?.focus());
  };

  const handleDayKeydown = (event: ReactKeyboardEvent<HTMLButtonElement>, date: string): void => {
    let next: string | undefined;
    if (event.key === 'ArrowLeft') next = addDays(date, -1);
    else if (event.key === 'ArrowRight') next = addDays(date, 1);
    else if (event.key === 'ArrowUp') next = addDays(date, -7);
    else if (event.key === 'ArrowDown') next = addDays(date, 7);
    else if (event.key === 'Home')
      next = addDays(date, -((new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7));
    else if (event.key === 'End')
      next = addDays(date, 6 - ((new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7));
    else if (event.key === 'PageUp' || event.key === 'PageDown') {
      const parts = getDateParts(date);
      const shifted = shiftMonth(parts.year, parts.month, event.key === 'PageDown' ? 1 : -1);
      const day = Math.min(
        parts.day,
        new Date(Date.UTC(shifted.year, shifted.month, 0)).getUTCDate(),
      );
      next = `${String(shifted.year).padStart(4, '0')}-${String(shifted.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    if (!next) return;
    event.preventDefault();
    focusDate(next);
  };

  const dayAriaLabel = (date: string): string => {
    const parts = getDateParts(date);
    try {
      return new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' }).format(
        new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12)),
      );
    } catch {
      return date;
    }
  };

  const timeValidationOptions = (): TimePickerValidationOptions => ({
    allowOffStep: validationOptions.allowOffStep,
    ...formatContext,
    hourStep: validationOptions.hourStep,
    max: draft.date ? getTimeBoundary(draft.date, validationOptions.max, 'max') : undefined,
    min: draft.date ? getTimeBoundary(draft.date, validationOptions.min, 'min') : undefined,
    minuteStep: validationOptions.minuteStep,
    secondStep: validationOptions.secondStep,
  });

  const adjustTime = (segment: TimePickerSegment, direction: 1 | -1): void => {
    if (blocked) return;
    let next: TimePickerParts | undefined;
    if (segment === 'period') {
      next = setTimeSegment(currentTime, 'period', currentTime.hour >= 12 ? 'am' : 'pm');
    } else {
      next = getAdjacentSegmentValue(segment, currentTime, direction, timeValidationOptions());
    }
    if (next) updateDraftTime(formatModelTime(next, showSeconds));
  };

  const handleTimeKeydown = (
    event: ReactKeyboardEvent<HTMLElement>,
    segment: TimePickerSegment,
    index: number,
  ): void => {
    if (blocked) return;
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      adjustTime(segment, event.key === 'ArrowUp' ? 1 : -1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const elements = Array.from(
        event.currentTarget
          .closest('[role="group"]')
          ?.querySelectorAll<HTMLElement>('[role="spinbutton"]') ?? [],
      );
      elements[
        (index + (event.key === 'ArrowRight' ? 1 : -1) + elements.length) % elements.length
      ]?.focus();
    }
  };

  const applySelection = (): void => {
    const invalid = validateLocalDateTime(draft, validationOptions);
    if (!draft.date && !draft.time) {
      reportInvalid('empty', 'value', { ...draft });
      return;
    }
    if (invalid || !draft.date || !draft.time) {
      reportInvalid(invalid ?? 'partial', 'value', { ...draft });
      return;
    }
    const next = draft as LocalDateTimeValue;
    commit(next);
    call(props, 'onApply', next);
    updateOpen(false, true);
  };

  const cancelSelection = (): void => {
    syncDraft(modelValue);
    call(props, 'onCancel');
    updateOpen(false, true);
  };

  const fieldClass = cx(
    'peaui-form-field__element',
    singleText ? 'peaui-form-field__element--medium' : 'peaui-form-field__element--normal',
    disabled && 'peaui-form-field__element--disabled',
    readonly && 'peaui-form-field__element--readonly',
    !readonly && 'peaui-form-field__element--basic',
    hasError && 'peaui-form-field__element--error',
  );
  const inputAria = {
    'aria-busy': loading || undefined,
    'aria-controls': panelId,
    'aria-describedby': describedBy,
    'aria-expanded': open,
    'aria-haspopup': 'dialog' as const,
    'aria-invalid': hasError || undefined,
    'aria-readonly': readonly || undefined,
  };
  const customTrigger = props.renderTrigger as
    | ((state: { displayValue: string; open: boolean; toggle: () => void }) => ReactNode)
    | undefined;
  const renderDate = props.renderDate as
    | ((state: { date: string | undefined }) => ReactNode)
    | undefined;
  const renderTime = props.renderTime as
    | ((state: { time: string | undefined }) => ReactNode)
    | undefined;
  const renderTimeZone = props.renderTimeZone as
    | ((state: { timeZone: string }) => ReactNode)
    | undefined;
  const anchorName = `--anchor-${id.replaceAll(':', '')}`;

  const defaultTrigger = (
    <div className="peaui-form-field" data-testid={baseTestId}>
      {label ? (
        <label className="peaui-form-label" htmlFor={id} id={`label-${id}`}>
          <span className="peaui-form-label__content">
            <span className="peaui-form-label__text">{label}</span>
            {!required ? (
              <span className="peaui-form-label__optional">(pole niewymagane)</span>
            ) : null}
          </span>
          {hasContent(props.hint) ? (
            <span className="peaui-info-tooltip">{props.hint as ReactNode}</span>
          ) : null}
        </label>
      ) : null}
      <div className="peaui-form-field__content">
        {variant === 'single-input' ? (
          <input
            {...inputAria}
            aria-autocomplete="none"
            aria-label={text(props, 'ariaLabel') || (!label ? name : undefined)}
            aria-labelledby={label ? `label-${id}` : undefined}
            autoComplete="off"
            className={cx(fieldClass, `${root}__input`)}
            data-testid={baseTestId ? `${baseTestId}-input` : undefined}
            disabled={disabled || loading}
            id={id}
            name={name}
            placeholder={placeholder}
            readOnly={readonly}
            ref={(element) => assignRef(forwardedRef, element)}
            required={required}
            role="combobox"
            style={{ '--pl': '12px', '--pr': canErase ? '80px' : '44px' } as CSSProperties}
            type="text"
            value={singleText}
            onBlur={commitSingleInput}
            onChange={(event) => setSingleText(event.target.value)}
            onClick={() => updateOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                updateOpen(true);
                requestAnimationFrame(() => dayRefs.current.get(activeDate)?.focus());
              } else if (event.key === 'Escape') updateOpen(false, true);
            }}
          />
        ) : (
          <div
            aria-busy={loading || undefined}
            aria-describedby={describedBy}
            aria-invalid={hasError || undefined}
            aria-label={text(props, 'ariaLabel') || (!label ? name : undefined)}
            aria-labelledby={label ? `label-${id}` : undefined}
            className={cx(fieldClass, `${root}__split-fields`)}
            role="group"
            ref={(element) => assignRef(forwardedRef, element)}
            style={{ '--pr': canErase ? '80px' : '44px' } as CSSProperties}
          >
            <input
              {...inputAria}
              role="combobox"
              aria-label={label ? 'Data' : `${name}: data`}
              className={`${root}__split-input`}
              data-testid={baseTestId ? `${baseTestId}-date-input` : undefined}
              disabled={disabled || loading}
              id={id}
              name={`${name}-date`}
              placeholder={dateFormat === 'iso' ? 'rrrr-mm-dd' : 'dd.mm.rrrr'}
              readOnly={readonly}
              type="text"
              value={dateText}
              onBlur={commitDateInput}
              onChange={(event) => setDateText(event.target.value)}
              onClick={() => updateOpen(true)}
            />
            <span aria-hidden="true" className={`${root}__split-divider`} />
            <input
              {...inputAria}
              role="combobox"
              aria-label={label ? 'Czas' : `${name}: czas`}
              className={`${root}__split-input`}
              data-testid={baseTestId ? `${baseTestId}-time-input` : undefined}
              disabled={disabled || loading}
              id={`${id}-time`}
              name={`${name}-time`}
              placeholder={showSeconds ? 'gg:mm:ss' : 'gg:mm'}
              readOnly={readonly}
              type="text"
              value={timeText}
              onBlur={commitTimeInput}
              onChange={(event) => setTimeText(event.target.value)}
              onClick={() => updateOpen(true)}
            />
          </div>
        )}
        <Icon className="peaui-form-field__icon peaui-form-field__icon--after" name="calendar" />
        {canErase && modelValue && !blocked ? (
          <button
            aria-label="Usuń wartość pola"
            className="peaui-form-field__erase-button"
            style={{ '--right': '44px' } as CSSProperties}
            type="button"
            onClick={() => {
              syncDraft(undefined);
              commit(undefined);
              call(props, 'onDateChange', undefined);
              call(props, 'onTimeChange', undefined);
              updateOpen(false, true);
            }}
          >
            <Icon className="peaui-form-field__erase-icon" name="cross" />
          </button>
        ) : null}
      </div>
      {hasContent(description) && !hasError ? (
        <div
          className="peaui-form-field__message peaui-message-text peaui-message-text--variant-default peaui-message-text--size-xs"
          id={descriptionId}
        >
          <p className="peaui-message-text__content">{description}</p>
        </div>
      ) : null}
      {hasError ? (
        <div
          className="peaui-form-field__message peaui-message-text peaui-message-text--variant-error peaui-message-text--size-xs"
          id={errorId}
        >
          <p className="peaui-message-text__content">{externalError ?? invalidMessage(reason)}</p>
        </div>
      ) : null}
    </div>
  );

  const defaultDate = (
    <>
      <div className={`${root}__calendar-header`}>
        <p aria-live="polite" className={`${root}__month-label`}>
          {labels.month}
        </p>
        <div className="peaui-form-date-picker-navigation">
          {([-1, 1] as const).map((offset) => (
            <button
              aria-label={offset === -1 ? 'Poprzedni miesiąc' : 'Następny miesiąc'}
              className="peaui-form-date-picker-navigation__button"
              key={offset}
              title={offset === -1 ? 'Poprzedni miesiąc' : 'Następny miesiąc'}
              type="button"
              onClick={() => setVisible(shiftMonth(visible.year, visible.month, offset))}
            >
              <Icon
                className={cx(
                  'peaui-form-date-picker-navigation__icon',
                  offset === -1
                    ? 'peaui-form-date-picker-navigation__icon--previous'
                    : 'peaui-form-date-picker-navigation__icon--next',
                )}
                name="arrow"
              />
            </button>
          ))}
        </div>
      </div>
      <div aria-label={labels.month} className={`${root}__calendar`} role="grid">
        <div className={`${root}__calendar-row`} role="row">
          {labels.weekdays.map((weekday) => (
            <span
              aria-label={weekday.long}
              className={`${root}__weekday`}
              key={weekday.long}
              role="columnheader"
            >
              {weekday.short}
            </span>
          ))}
        </div>
        {calendarRows.map((row, rowIndex) => (
          <div className={`${root}__calendar-row`} key={rowIndex} role="row">
            {row.map((day) => (
              <button
                aria-current={day.today ? 'date' : undefined}
                aria-label={dayAriaLabel(day.date)}
                aria-selected={day.selected}
                className={cx(
                  `${root}__day`,
                  day.outsideMonth && `${root}__day--outside`,
                  day.selected && `${root}__day--selected`,
                  day.today && `${root}__day--today`,
                )}
                data-date={day.date}
                disabled={day.disabled}
                key={day.date}
                ref={(element) => {
                  if (element) dayRefs.current.set(day.date, element);
                  else dayRefs.current.delete(day.date);
                }}
                role="gridcell"
                tabIndex={day.date === activeDate ? 0 : -1}
                type="button"
                onClick={() => {
                  if (day.disabled) return;
                  setActiveDate(day.date);
                  const parts = getDateParts(day.date);
                  setVisible({ year: parts.year, month: parts.month });
                  updateDraftDate(day.date);
                }}
                onKeyDown={(event) => handleDayKeydown(event, day.date)}
              >
                {day.day}
              </button>
            ))}
          </div>
        ))}
      </div>
    </>
  );

  const defaultTime = (
    <div aria-label="Ustaw czas" className={`${root}__time-controls`} role="group">
      {segments.map((segment, index) => {
        const segmentLabel = {
          hour: 'Godzina',
          minute: 'Minuta',
          second: 'Sekunda',
          period: 'Okres dnia',
        }[segment];
        return (
          <div className={`${root}__time-column`} key={segment}>
            <span className={`${root}__time-label`}>{segmentLabel}</span>
            <button
              aria-label={`Zwiększ: ${segmentLabel}`}
              className={`${root}__time-action`}
              disabled={blocked}
              type="button"
              onClick={() => adjustTime(segment, 1)}
            >
              +
            </button>
            <div
              aria-label={segmentLabel}
              aria-disabled={blocked || undefined}
              aria-valuemax={getSegmentRange(segment, format).max}
              aria-valuemin={getSegmentRange(segment, format).min}
              aria-valuenow={getSegmentValue(currentTime, segment, format)}
              aria-valuetext={getSegmentText(currentTime, segment, formatContext)}
              className={`${root}__time-value`}
              role="spinbutton"
              tabIndex={blocked ? -1 : 0}
              onClick={() => {
                if (!blocked && !draft.time)
                  updateDraftTime(formatModelTime(currentTime, showSeconds));
              }}
              onKeyDown={(event) => handleTimeKeydown(event, segment, index)}
            >
              {getSegmentText(currentTime, segment, formatContext)}
            </div>
            <button
              aria-label={`Zmniejsz: ${segmentLabel}`}
              className={`${root}__time-action`}
              disabled={blocked}
              type="button"
              onClick={() => adjustTime(segment, -1)}
            >
              −
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <div
        aria-disabled={disabled || undefined}
        className={cx(
          root,
          'peaui-popover-overlayer',
          `${root}--variant-${variant}`,
          `${root}--layout-${layout}`,
          open && `${root}--open`,
          disabled && `${root}--disabled`,
          readonly && `${root}--readonly`,
          loading && `${root}--loading`,
          hasError && `${root}--error`,
          props.className,
        )}
        ref={rootRef}
        style={{ ...props.style, '--unique-anchor': anchorName } as CSSProperties}
      >
        <div className={`${root}__trigger-host`} ref={triggerRef}>
          {customTrigger
            ? customTrigger({
                displayValue: displayFrom(modelValue),
                open,
                toggle: () => updateOpen(!open, open),
              })
            : defaultTrigger}
          {loading ? (
            <span className={`${root}__loading-status`} id={loadingId} role="status">
              <span aria-hidden="true" className={`${root}__spinner`} />
              {text(props, 'loadingLabel', 'Ładowanie wyboru daty i czasu')}
            </span>
          ) : null}
        </div>
      </div>
      <div
        className={cx(
          'peaui-popover-overlayer__content',
          `peaui-popover-overlayer__content--placement-${popoverPlacement}`,
          `${root}__popover-content`,
        )}
        data-testid={baseTestId ? `${baseTestId}-popover-content` : undefined}
        hidden={!open}
        popover={
          typeof HTMLElement !== 'undefined' &&
          typeof HTMLElement.prototype.showPopover === 'function'
            ? 'auto'
            : undefined
        }
        ref={popoverRef}
        style={
          {
            '--peaui-popover-overlayer-trigger-width': `${triggerWidth}px`,
            '--unique-anchor': anchorName,
          } as CSSProperties
        }
        onToggle={(event) => {
          if (event.nativeEvent.newState === 'closed' && open) updateOpen(false);
        }}
      >
        <section
          aria-label={text(props, 'panelAriaLabel', 'Wybierz datę i czas')}
          className={cx(`${root}__panel`, `${root}__panel--${layout}`)}
          id={panelId}
          role="dialog"
          style={
            {
              '--peaui-form-date-time-picker-available-height': `${availablePanelHeight}px`,
            } as CSSProperties
          }
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              if (confirm) cancelSelection();
              else updateOpen(false, true);
            }
          }}
        >
          <div className={`${root}__sections`}>
            <section
              aria-labelledby={`${id}-date-section-heading`}
              className={`${root}__date-section`}
            >
              <h3 className={`${root}__section-heading`} id={`${id}-date-section-heading`}>
                Data
              </h3>
              {renderDate?.({ date: draft.date }) ?? defaultDate}
            </section>
            <section
              aria-labelledby={`${id}-time-section-heading`}
              className={`${root}__time-section`}
            >
              <h3 className={`${root}__section-heading`} id={`${id}-time-section-heading`}>
                Czas
              </h3>
              {renderTime?.({ time: draft.time }) ?? defaultTime}
              {showTimeZone ? (
                <p className={`${root}__time-zone`} id={`${id}-time-zone`}>
                  <Icon name="clock" />
                  {renderTimeZone?.({ timeZone }) ?? `Strefa: ${timeZone}`}
                </p>
              ) : null}
            </section>
          </div>
          {confirm || hasContent(props.footerContent) ? (
            <footer className={`${root}__footer`}>
              {hasContent(props.footerContent) ? (
                (props.footerContent as ReactNode)
              ) : (
                <>
                  <button
                    className={`${root}__button ${root}__button--secondary`}
                    type="button"
                    onClick={cancelSelection}
                  >
                    Anuluj
                  </button>
                  <button
                    className={`${root}__button ${root}__button--primary`}
                    disabled={Boolean(draftReason || !draft.date || !draft.time)}
                    type="button"
                    onClick={applySelection}
                  >
                    Zastosuj
                  </button>
                </>
              )}
            </footer>
          ) : null}
        </section>
      </div>
    </>
  );
}

export default FormDateTimePickerRenderer;
