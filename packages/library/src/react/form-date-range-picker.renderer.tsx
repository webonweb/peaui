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
  addDays,
  buildRangeCalendarDays,
  cloneDateRange,
  formatDateRange,
  formatRangeEndpoint,
  getCalendarLabels,
  getDateAriaLabel,
  getDateParts,
  getRangeStatus,
  getTodayModelDate,
  isCompleteDateRange,
  isDateUnavailable,
  normalizeManualRange,
  parseDateRange,
  parseRangeEndpoint,
  selectRangeDate,
  shiftMonth,
  validateDateRange,
  type DateRangeFormatter,
  type DateRangeParser,
  type DateRangePreset,
  type DateRangeValue,
  type DateRangeValidationOptions,
  type FormDateRangePickerCalendars,
  type FormDateRangePickerDateFormat,
  type FormDateRangePickerInvalidDetail,
  type FormDateRangePickerPlacement,
  type FormDateRangePickerSelectionOrder,
  type FormDateRangePickerVariant,
} from '../components/form/FormDateRangePicker/date-range-picker.shared';
import { getNativePopoverValue, useNativePopover } from './popover-overlayer.shared';
import { reactIconData } from './generated-icon-data';

type RuntimeProps = Record<string, unknown> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
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

function assignRef<T>(ref: ForwardedRef<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as MutableRefObject<T | null>).current = value;
}

function hasContent(value: unknown): boolean {
  return value !== undefined && value !== null && value !== false && value !== '';
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

function invalidMessage(
  externalError: ReactNode,
  reason: FormDateRangePickerInvalidDetail['reason'] | undefined,
): ReactNode {
  if (hasContent(externalError)) return externalError;
  if (reason === 'empty') return 'Wybierz datę początkową i końcową.';
  if (reason === 'partial') return 'Uzupełnij obie daty zakresu.';
  if (reason === 'format') return 'Wpisz poprawną datę.';
  if (reason === 'order') return 'Data końcowa nie może być wcześniejsza niż początkowa.';
  if (reason === 'range') return 'Zakres wykracza poza dozwolone daty.';
  if (reason === 'disabled') return 'Jedna z wybranych dat jest niedostępna.';
  return null;
}

export function FormDateRangePickerRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedId = useId().replaceAll(':', '');
  const id = text(props, 'id', `peaui-date-range-${generatedId}`);
  const name = text(props, 'name', id);
  const label = text(props, 'label');
  const locale = text(props, 'locale', 'pl-PL');
  const dateFormat = text(props, 'dateFormat', 'locale') as FormDateRangePickerDateFormat;
  const calendars = (props.calendars === 1 ? 1 : 2) as FormDateRangePickerCalendars;
  const variant = text(props, 'variant', 'two-inputs') as FormDateRangePickerVariant;
  const selectionOrder = text(props, 'selectionOrder', 'swap') as FormDateRangePickerSelectionOrder;
  const placement = text(props, 'placement', 'bottom') as FormDateRangePickerPlacement;
  const confirm = bool(props, 'confirm');
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  const loading = bool(props, 'loading');
  const required = bool(props, 'required');
  const canErase = bool(props, 'canErase', true);
  const showPresets = bool(props, 'showPresets', true);
  const blocked = disabled || readonly || loading;
  const format = props.format as DateRangeFormatter | undefined;
  const parse = props.parse as DateRangeParser | undefined;
  const presets = Array.isArray(props.presets) ? (props.presets as DateRangePreset[]) : [];
  const baseTestId = text(props, 'dataTestId') || text(props, 'data-testid') || undefined;
  const datePlaceholder = dateFormat === 'iso' ? 'rrrr-mm-dd' : 'dd.mm.rrrr';
  const placeholder = text(props, 'placeholder', `${datePlaceholder} – ${datePlaceholder}`);
  const startLabel = text(props, 'startLabel', 'Data początkowa');
  const endLabel = text(props, 'endLabel', 'Data końcowa');
  const panelLabel = text(props, 'panelAriaLabel', 'Wybierz zakres dat');
  const validationOptions = useMemo<DateRangeValidationOptions>(
    () => ({
      isDateDisabled: props.isDateDisabled as ((date: string) => boolean) | undefined,
      maxDate: text(props, 'maxDate') || undefined,
      minDate: text(props, 'minDate') || undefined,
    }),
    [props.isDateDisabled, props.maxDate, props.minDate],
  );
  const formatOptions = useMemo(
    () => ({ dateFormat, format, locale }),
    [dateFormat, format, locale],
  );
  const parseOptions = useMemo(() => ({ dateFormat, locale, parse }), [dateFormat, locale, parse]);
  const [modelValue, setModelValue] = useRuntimeModel<DateRangeValue | undefined>(
    props,
    'value',
    undefined,
  );
  const [open, setOpen] = useRuntimeModel<boolean>(props, 'open', false);
  const [draft, setDraft] = useState<DateRangeValue>(cloneDateRange(modelValue));
  const [singleText, setSingleText] = useState(formatDateRange(modelValue, formatOptions));
  const [startText, setStartText] = useState(
    formatRangeEndpoint(modelValue?.[0], 'start', formatOptions),
  );
  const [endText, setEndText] = useState(
    formatRangeEndpoint(modelValue?.[1], 'end', formatOptions),
  );
  const initialDate = getDateParts(modelValue?.[0]);
  const [visible, setVisible] = useState({ month: initialDate.month, year: initialDate.year });
  const [activeDate, setActiveDate] = useState(modelValue?.[0] ?? getTodayModelDate());
  const [hoverDate, setHoverDate] = useState<string>();
  const [reason, setReason] = useState<FormDateRangePickerInvalidDetail['reason']>();
  const [popoverPlacement, setPopoverPlacement] = useState(placement);
  const [availablePanelHeight, setAvailablePanelHeight] = useState(640);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useNativePopover(open);
  const root = 'peaui-form-date-range-picker';
  const panelId = `${id}-panel`;
  const statusId = `${id}-range-status`;
  const descriptionId = `${id}-help-description`;
  const errorId = `${id}-error`;
  const loadingId = `${id}-range-loading`;
  const description = (props.descriptionContent ?? props.description) as ReactNode;
  const externalError = (props.errorContent ?? props.error) as ReactNode;
  const hasError = hasContent(externalError) || Boolean(reason);
  const describedBy =
    [
      text(props, 'aria-describedby') || undefined,
      hasContent(description) && !hasError ? descriptionId : undefined,
      hasError ? errorId : undefined,
      loading ? loadingId : undefined,
      statusId,
    ]
      .filter(Boolean)
      .join(' ') || undefined;
  const displayValue = formatDateRange(modelValue, formatOptions);
  const draftReason = validateDateRange(draft, validationOptions, required);
  const anchorName = `--anchor-${id.replaceAll(':', '')}`;

  const syncDraft = (value: DateRangeValue | undefined = modelValue): void => {
    const next = cloneDateRange(value);
    setDraft(next);
    setSingleText(formatDateRange(value, formatOptions));
    setStartText(formatRangeEndpoint(value?.[0], 'start', formatOptions));
    setEndText(formatRangeEndpoint(value?.[1], 'end', formatOptions));
    const parts = getDateParts(value?.[0] ?? value?.[1]);
    setVisible({ month: parts.month, year: parts.year });
    setActiveDate(value?.[0] ?? getTodayModelDate());
    setHoverDate(undefined);
  };

  useEffect(() => {
    if (!open || !confirm) syncDraft(modelValue);
  }, [modelValue?.[0], modelValue?.[1], dateFormat, locale, format]);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const updateWidth = (): void => setTriggerWidth(element.getBoundingClientRect().width);
    updateWidth();
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(updateWidth);
    observer?.observe(element);
    window.addEventListener('resize', updateWidth);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const focusDate = (date: string): void => {
    setActiveDate(date);
    const parts = getDateParts(date);
    const last = shiftMonth(visible.year, visible.month, calendars - 1);
    const firstKey = `${visible.year}-${String(visible.month).padStart(2, '0')}`;
    const lastKey = `${last.year}-${String(last.month).padStart(2, '0')}`;
    const dateKey = date.slice(0, 7);
    if (dateKey < firstKey || dateKey > lastKey)
      setVisible({ month: parts.month, year: parts.year });
    requestAnimationFrame(() =>
      popoverRef.current
        ?.querySelector<HTMLButtonElement>(`[data-date="${date}"]:not([data-outside-month="true"])`)
        ?.focus(),
    );
  };

  const updateOpen = (next: boolean, restoreFocus = false): void => {
    if (next && blocked) return;
    if (next) {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        const above = rect.top;
        const below = window.innerHeight - rect.bottom;
        const preferred = placement === 'bottom' ? below : above;
        const fallback = placement === 'bottom' ? 'top' : 'bottom';
        const fallbackSpace = fallback === 'bottom' ? below : above;
        const nextPlacement = preferred >= 590 || preferred >= fallbackSpace ? placement : fallback;
        setPopoverPlacement(nextPlacement);
        setAvailablePanelHeight(Math.max(260, (nextPlacement === 'bottom' ? below : above) - 10));
      }
      syncDraft(modelValue);
      setReason(undefined);
      call(props, 'onOpen');
    } else {
      if (confirm) syncDraft(modelValue);
      call(props, 'onClose');
    }
    setOpen(next);
    if (!next && restoreFocus) {
      requestAnimationFrame(() =>
        triggerRef.current?.querySelector<HTMLElement>('input, button')?.focus(),
      );
    }
  };

  const reportInvalid = (
    nextReason: FormDateRangePickerInvalidDetail['reason'],
    section: FormDateRangePickerInvalidDetail['section'],
    input: FormDateRangePickerInvalidDetail['input'],
  ): void => {
    setReason(nextReason);
    call(props, 'onInvalid', {
      input,
      reason: nextReason,
      section,
    } satisfies FormDateRangePickerInvalidDetail);
  };

  const commit = (next: DateRangeValue | undefined): void => {
    const normalized = next && (next[0] || next[1]) ? cloneDateRange(next) : undefined;
    setModelValue(normalized);
    call(props, 'onChange', normalized);
  };

  const updateDraft = (next: DateRangeValue, closeWhenComplete = false): void => {
    const previous = draft;
    setDraft(cloneDateRange(next));
    setSingleText(formatDateRange(next, formatOptions));
    setStartText(formatRangeEndpoint(next[0], 'start', formatOptions));
    setEndText(formatRangeEndpoint(next[1], 'end', formatOptions));
    setReason(undefined);
    if (previous[0] !== next[0]) call(props, 'onStartChange', next[0]);
    if (previous[1] !== next[1]) call(props, 'onEndChange', next[1]);
    if (!confirm) {
      commit(next);
      if (closeWhenComplete && isCompleteDateRange(next)) updateOpen(false, true);
    }
  };

  const commitSingleInput = (): void => {
    const parsed = parseDateRange(singleText, parseOptions);
    if (!parsed) return reportInvalid('format', 'value', singleText);
    const normalized = normalizeManualRange(parsed, selectionOrder);
    if (normalized.invalid) return reportInvalid(normalized.invalid, 'value', singleText);
    const invalid = validateDateRange(normalized.value, validationOptions, false);
    if (invalid && invalid !== 'partial') return reportInvalid(invalid, 'value', singleText);
    updateDraft(normalized.value);
  };

  const commitEndpoint = (endpoint: 'start' | 'end'): void => {
    const input = endpoint === 'start' ? startText : endText;
    const parsed = parseRangeEndpoint(input, endpoint, parseOptions);
    if (input.trim() && !parsed) return reportInvalid('format', endpoint, input);
    const next: DateRangeValue = endpoint === 'start' ? [parsed, draft[1]] : [draft[0], parsed];
    const normalized = normalizeManualRange(next, selectionOrder);
    if (normalized.invalid) return reportInvalid(normalized.invalid, endpoint, input);
    const invalid = validateDateRange(normalized.value, validationOptions, false);
    if (invalid && invalid !== 'partial') return reportInvalid(invalid, endpoint, input);
    updateDraft(normalized.value);
  };

  const selectDate = (date: string): void => {
    if (blocked || isDateUnavailable(date, validationOptions)) return;
    setActiveDate(date);
    const result = selectRangeDate(draft, date, selectionOrder);
    if (result.invalid) return reportInvalid(result.invalid, 'end', cloneDateRange(draft));
    updateDraft(result.value, true);
    setHoverDate(undefined);
  };

  const selectPreset = (preset: DateRangePreset): void => {
    if (preset.disabled === true || blocked) return;
    const result = normalizeManualRange(cloneDateRange(preset.value), selectionOrder);
    const invalid = result.invalid ?? validateDateRange(result.value, validationOptions, true);
    if (invalid) return reportInvalid(invalid, 'value', cloneDateRange(preset.value));
    updateDraft(result.value, true);
  };

  const navigateMonth = (offset: number): void => {
    const next = shiftMonth(visible.year, visible.month, offset);
    setVisible(next);
    const nextActive = `${String(next.year).padStart(4, '0')}-${String(next.month).padStart(2, '0')}-01`;
    setActiveDate(nextActive);
    call(props, 'onMonthChange', next);
  };

  const nextEnabledDate = (date: string, offset: number): string => {
    let next = addDays(date, offset);
    for (let index = 0; index < 370 && isDateUnavailable(next, validationOptions); index += 1) {
      next = addDays(next, offset > 0 ? 1 : -1);
    }
    return next;
  };

  const handleDayKeydown = (event: ReactKeyboardEvent<HTMLButtonElement>, date: string): void => {
    let offset: number | undefined;
    if (event.key === 'ArrowLeft') offset = -1;
    else if (event.key === 'ArrowRight') offset = 1;
    else if (event.key === 'ArrowUp') offset = -7;
    else if (event.key === 'ArrowDown') offset = 7;
    else if (event.key === 'Home') offset = -((new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7);
    else if (event.key === 'End')
      offset = 6 - ((new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7);
    if (offset !== undefined) {
      event.preventDefault();
      focusDate(nextEnabledDate(date, offset));
      return;
    }
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      const parts = getDateParts(date);
      const shifted = shiftMonth(parts.year, parts.month, event.key === 'PageDown' ? 1 : -1);
      const day = Math.min(
        parts.day,
        new Date(Date.UTC(shifted.year, shifted.month, 0)).getUTCDate(),
      );
      const next = `${String(shifted.year).padStart(4, '0')}-${String(shifted.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      focusDate(nextEnabledDate(next, event.key === 'PageDown' ? 1 : -1));
    }
  };

  const applySelection = (): void => {
    const invalid = validateDateRange(draft, validationOptions, required);
    if (invalid || !isCompleteDateRange(draft)) {
      reportInvalid(invalid ?? 'partial', 'value', cloneDateRange(draft));
      return;
    }
    const next: [string, string] = [draft[0], draft[1]];
    commit(next);
    call(props, 'onApply', next);
    updateOpen(false, true);
  };

  const cancelSelection = (): void => {
    syncDraft(modelValue);
    call(props, 'onCancel');
    updateOpen(false, true);
  };

  const erase = (): void => {
    const previous = cloneDateRange(draft);
    syncDraft(undefined);
    commit(undefined);
    if (previous[0]) call(props, 'onStartChange', undefined);
    if (previous[1]) call(props, 'onEndChange', undefined);
    updateOpen(false, true);
  };

  const fieldClass = cx(
    'peaui-form-field__element',
    displayValue ? 'peaui-form-field__element--medium' : 'peaui-form-field__element--normal',
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
  const renderDay = props.renderDay as
    | ((state: {
        day: ReturnType<typeof buildRangeCalendarDays>[number];
        select: () => void;
      }) => ReactNode)
    | undefined;
  const renderPreset = props.renderPreset as
    | ((state: { preset: DateRangePreset; select: () => void }) => ReactNode)
    | undefined;

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
                requestAnimationFrame(() => focusDate(activeDate));
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
            className={cx(fieldClass, `${root}__range-fields`)}
            ref={(element) => assignRef(forwardedRef, element)}
            role="group"
            style={{ '--pr': canErase ? '80px' : '44px' } as CSSProperties}
          >
            <label className={`${root}__range-field`}>
              <span className={`${root}__input-label`}>
                {(props.startLabelContent as ReactNode) ?? startLabel}
              </span>
              <input
                {...inputAria}
                aria-autocomplete="none"
                aria-label={startLabel}
                autoComplete="off"
                className={`${root}__range-input`}
                data-testid={baseTestId ? `${baseTestId}-start-input` : undefined}
                disabled={disabled || loading}
                id={id}
                placeholder={text(props, 'startPlaceholder', datePlaceholder)}
                readOnly={readonly}
                required={required}
                role="combobox"
                type="text"
                value={startText}
                onBlur={() => commitEndpoint('start')}
                onChange={(event) => setStartText(event.target.value)}
                onClick={() => updateOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    updateOpen(true);
                    requestAnimationFrame(() => focusDate(activeDate));
                  }
                }}
              />
            </label>
            <span aria-hidden="true" className={`${root}__range-separator`}>
              –
            </span>
            <label className={`${root}__range-field`}>
              <span className={`${root}__input-label`}>
                {(props.endLabelContent as ReactNode) ?? endLabel}
              </span>
              <input
                {...inputAria}
                aria-autocomplete="none"
                aria-label={endLabel}
                autoComplete="off"
                className={`${root}__range-input`}
                data-testid={baseTestId ? `${baseTestId}-end-input` : undefined}
                disabled={disabled || loading}
                id={`${id}-end`}
                placeholder={text(props, 'endPlaceholder', datePlaceholder)}
                readOnly={readonly}
                required={required}
                role="combobox"
                type="text"
                value={endText}
                onBlur={() => commitEndpoint('end')}
                onChange={(event) => setEndText(event.target.value)}
                onClick={() => updateOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    updateOpen(true);
                    requestAnimationFrame(() => focusDate(activeDate));
                  }
                }}
              />
            </label>
          </div>
        )}
        <Icon className="peaui-form-field__icon peaui-form-field__icon--after" name="calendar" />
        {canErase && modelValue && !blocked ? (
          <button
            aria-label="Usuń wartość pola"
            className="peaui-form-field__erase-button"
            style={{ '--right': '44px' } as CSSProperties}
            type="button"
            onClick={erase}
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
          <p className="peaui-message-text__content">{invalidMessage(externalError, reason)}</p>
        </div>
      ) : null}
    </div>
  );

  const monthViews = Array.from({ length: calendars }, (_, index) => {
    const month = shiftMonth(visible.year, visible.month, index);
    const labels = getCalendarLabels(locale, month.year, month.month);
    const days = buildRangeCalendarDays(
      month.year,
      month.month,
      draft,
      hoverDate,
      validationOptions,
    );
    const rows = Array.from({ length: 6 }, (__, row) => days.slice(row * 7, row * 7 + 7));
    return { ...month, days, index, labels, rows };
  });

  return (
    <>
      <div
        aria-disabled={disabled || undefined}
        className={cx(
          root,
          'peaui-popover-overlayer',
          `${root}--variant-${variant}`,
          `${root}--calendars-${calendars}`,
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
            ? customTrigger({ displayValue, open, toggle: () => updateOpen(!open, true) })
            : defaultTrigger}
          {loading ? (
            <span className={`${root}__loading-status`} id={loadingId} role="status">
              <span aria-hidden="true" className={`${root}__spinner`} />
              {text(props, 'loadingLabel', 'Ładowanie wyboru zakresu dat')}
            </span>
          ) : null}
          <input name={`${name}.start`} type="hidden" value={modelValue?.[0] ?? ''} />
          <input name={`${name}.end`} type="hidden" value={modelValue?.[1] ?? ''} />
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
        popover={getNativePopoverValue()}
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
          aria-label={panelLabel}
          className={`${root}__panel`}
          id={panelId}
          role="dialog"
          style={
            {
              '--peaui-form-date-range-picker-available-height': `${availablePanelHeight}px`,
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
          <h2 className={`${root}__sr-only`}>{panelLabel}</h2>
          <p aria-live="polite" className={`${root}__sr-only`} id={statusId}>
            {getRangeStatus(draft, locale)}
          </p>
          {showPresets && presets.length ? (
            <aside aria-label="Gotowe zakresy dat" className={`${root}__presets`}>
              {presets.map((preset) => (
                <button
                  className={cx(
                    `${root}__preset`,
                    'peaui-button-action',
                    'peaui-button-action--size-xxs',
                    'peaui-button-action--variant-ghost',
                    (preset.disabled === true || blocked) && 'peaui-button-action--is-disabled',
                  )}
                  disabled={preset.disabled === true || blocked}
                  key={preset.id}
                  type="button"
                  onClick={() => selectPreset(preset)}
                >
                  {renderPreset?.({ preset, select: () => selectPreset(preset) }) ?? preset.label}
                </button>
              ))}
            </aside>
          ) : null}
          <div className={`${root}__calendar-area`}>
            <div className={`${root}__calendar-navigation`}>
              <p className={`${root}__selection-summary`}>{getRangeStatus(draft, locale)}</p>
              <div className="peaui-form-date-picker-navigation">
                {([-1, 1] as const).map((offset) => (
                  <button
                    aria-label={offset === -1 ? 'Poprzedni miesiąc' : 'Następny miesiąc'}
                    className="peaui-form-date-picker-navigation__button"
                    key={offset}
                    title={offset === -1 ? 'Poprzedni miesiąc' : 'Następny miesiąc'}
                    type="button"
                    onClick={() => navigateMonth(offset)}
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
            <div className={`${root}__calendars`}>
              {monthViews.map((month) => (
                <section
                  aria-labelledby={`${id}-month-${month.index}`}
                  className={`${root}__calendar-section`}
                  key={`${month.year}-${month.month}`}
                >
                  <h3 className={`${root}__month-label`} id={`${id}-month-${month.index}`}>
                    {month.labels.month}
                  </h3>
                  <div aria-label={month.labels.month} className={`${root}__calendar`} role="grid">
                    <div className={`${root}__calendar-row`} role="row">
                      {month.labels.weekdays.map((weekday) => (
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
                    {month.rows.map((row, rowIndex) => (
                      <div className={`${root}__calendar-row`} key={rowIndex} role="row">
                        {row.map((day) => (
                          <button
                            aria-current={day.today ? 'date' : undefined}
                            aria-label={getDateAriaLabel(day.date, locale, day)}
                            aria-selected={day.start || day.end || day.inRange}
                            className={cx(
                              `${root}__day`,
                              day.outsideMonth && `${root}__day--outside`,
                              day.inRange && `${root}__day--in-range`,
                              day.inPreview && `${root}__day--preview`,
                              day.start && `${root}__day--start`,
                              day.end && `${root}__day--end`,
                              day.today && `${root}__day--today`,
                            )}
                            data-date={day.date}
                            data-month-index={month.index}
                            data-outside-month={day.outsideMonth}
                            disabled={day.disabled}
                            key={day.date}
                            role="gridcell"
                            tabIndex={day.date === activeDate && !day.outsideMonth ? 0 : -1}
                            type="button"
                            onBlur={() => setHoverDate(undefined)}
                            onClick={() => selectDate(day.date)}
                            onFocus={() => setHoverDate(day.date)}
                            onKeyDown={(event) => handleDayKeydown(event, day.date)}
                            onMouseEnter={() => setHoverDate(day.date)}
                            onMouseLeave={() => setHoverDate(undefined)}
                          >
                            {renderDay?.({ day, select: () => selectDate(day.date) }) ?? day.day}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
          {confirm || hasContent(props.footerContent) ? (
            <footer className={`${root}__footer`}>
              {hasContent(props.footerContent) ? (
                (props.footerContent as ReactNode)
              ) : (
                <>
                  <button
                    className={cx(
                      `${root}__button`,
                      `${root}__button--secondary`,
                      'peaui-button-action',
                      'peaui-button-action--size-xs',
                      'peaui-button-action--variant-secondary',
                    )}
                    type="button"
                    onClick={cancelSelection}
                  >
                    Anuluj
                  </button>
                  <button
                    className={cx(
                      `${root}__button`,
                      `${root}__button--primary`,
                      'peaui-button-action',
                      'peaui-button-action--size-xs',
                      'peaui-button-action--variant-primary',
                      (draftReason || !isCompleteDateRange(draft)) &&
                        'peaui-button-action--is-disabled',
                    )}
                    disabled={Boolean(draftReason || !isCompleteDateRange(draft))}
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

export default FormDateRangePickerRenderer;
