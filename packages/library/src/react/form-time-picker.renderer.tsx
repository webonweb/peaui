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
  buildSegmentOptions,
  formatDisplayTime,
  formatModelTime,
  getAdjacentSegmentValue,
  getFirstValidTime,
  getPeriodLabels,
  getSegmentRange,
  getSegmentText,
  getSegmentValue,
  isTimeParts,
  normalizeStep,
  parseDisplayTime,
  parseModelTime,
  setTimeSegment,
  validateTimeParts,
  type FormTimePickerFormat,
  type FormTimePickerPanelMode,
  type FormTimePickerPlacement,
  type FormTimePickerVariant,
  type TimePickerFormatContext,
  type TimePickerFormatter,
  type TimePickerInvalidDetail,
  type TimePickerInvalidReason,
  type TimePickerOption,
  type TimePickerParser,
  type TimePickerParts,
  type TimePickerPeriod,
  type TimePickerSegment,
  type TimePickerValidationOptions,
} from '../components/form/FormTimePicker/time-picker.shared';
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
  const isControlled = Object.prototype.hasOwnProperty.call(props, name);
  const controlled = props[name] as T | undefined;
  const defaultValue = props[`default${capitalized}`] as T | undefined;
  const [internal, setInternal] = useState<T>(defaultValue ?? fallback);
  const value = isControlled ? (controlled as T) : internal;
  const update = (next: T): void => {
    if (!isControlled) setInternal(next);
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
      const isOpen = element.matches(':popover-open');
      if (open && !isOpen) element.showPopover();
      if (!open && isOpen) element.hidePopover();
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

function invalidMessage(reason: TimePickerInvalidReason | undefined, placeholder: string): string {
  if (reason === 'empty') return 'Wybierz czas.';
  if (reason === 'format') return `Wpisz czas w formacie ${placeholder}.`;
  if (reason === 'range') return 'Wybrany czas jest poza dozwolonym zakresem.';
  if (reason === 'step') return 'Wybrany czas nie pasuje do dozwolonego interwału.';
  return '';
}

function defaultPlaceholder(format: FormTimePickerFormat, showSeconds: boolean): string {
  if (format === '12h') return showSeconds ? 'gg:mm:ss AM/PM' : 'gg:mm AM/PM';
  return showSeconds ? 'gg:mm:ss' : 'gg:mm';
}

function modelInvalidReason(
  value: string | undefined,
  parts: TimePickerParts | undefined,
  options: TimePickerValidationOptions,
): TimePickerInvalidReason | undefined {
  if (parts !== undefined) return validateTimeParts(parts, options);
  return value !== undefined && value.length > 0 ? 'format' : undefined;
}

function hasContent(value: unknown): boolean {
  return value !== undefined && value !== null && value !== false && value !== '';
}

export function FormTimePickerRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedId = useId().replaceAll(':', '');
  const id = text(props, 'id', `peaui-time-${generatedId}`);
  const name = text(props, 'name', id);
  const label = text(props, 'label');
  const description = (props.descriptionContent ?? props.description) as ReactNode;
  const externalError = (props.errorContent ?? props.error) as ReactNode;
  const format = text(props, 'format', '24h') as FormTimePickerFormat;
  const variant = text(props, 'variant', 'input') as FormTimePickerVariant;
  const panelMode = text(props, 'panelMode', 'dropdown') as FormTimePickerPanelMode;
  const preferredPlacement = text(props, 'placement', 'bottom') as FormTimePickerPlacement;
  const locale = text(props, 'locale', 'pl-PL');
  const showSeconds = bool(props, 'showSeconds');
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  const loading = bool(props, 'loading');
  const canErase = bool(props, 'canErase', true);
  const required = bool(props, 'required');
  const blocked = disabled || readonly || loading;
  const baseTestId = text(props, 'dataTestId') || text(props, 'data-testid') || undefined;
  const placeholder = text(props, 'placeholder') || defaultPlaceholder(format, showSeconds);
  const formatContext = useMemo<TimePickerFormatContext>(
    () => ({ format, locale, showSeconds }),
    [format, locale, showSeconds],
  );
  const validationOptions = useMemo<TimePickerValidationOptions>(
    () => ({
      ...formatContext,
      allowOffStep: bool(props, 'allowOffStep'),
      hourStep: normalizeStep(num(props, 'hourStep', 1), 24),
      minuteStep: normalizeStep(num(props, 'minuteStep', 5), 60),
      secondStep: normalizeStep(num(props, 'secondStep', 5), 60),
      min: text(props, 'min') || undefined,
      max: text(props, 'max') || undefined,
    }),
    [
      formatContext,
      props.allowOffStep,
      props.hourStep,
      props.max,
      props.min,
      props.minuteStep,
      props.secondStep,
    ],
  );
  const [modelValue, setModelValue] = useRuntimeModel<string | undefined>(
    props,
    'value',
    undefined,
  );
  const valueControlled = Object.prototype.hasOwnProperty.call(props, 'value');
  const [open, setOpen] = useRuntimeModel<boolean>(props, 'open', false);
  const initialParts = parseModelTime(modelValue);
  const initialReason = modelInvalidReason(modelValue, initialParts, validationOptions);
  const [activeParts, setActiveParts] = useState<TimePickerParts>(
    initialParts !== undefined && initialReason === undefined
      ? initialParts
      : (getFirstValidTime(validationOptions) ?? { ...DEFAULT_TIME_PARTS }),
  );
  const formatForDisplay = (parts: TimePickerParts): string => {
    const normalized = formatModelTime(parts, showSeconds);
    const customFormatter = props.formatValue as TimePickerFormatter | undefined;
    if (customFormatter) {
      try {
        return customFormatter(normalized, formatContext);
      } catch {
        return formatDisplayTime(parts, formatContext);
      }
    }
    return formatDisplayTime(parts, formatContext);
  };
  const [draft, setDraft] = useState(
    initialParts ? formatForDisplay(initialParts) : String(modelValue ?? ''),
  );
  const [reason, setReason] = useState<TimePickerInvalidReason | undefined>(initialReason);
  const [placement, setPlacement] = useState<FormTimePickerPlacement>(preferredPlacement);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const triggerHostRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const digitBufferRef = useRef<
    { segment: TimePickerSegment; text: string; timestamp: number } | undefined
  >(undefined);
  const pendingFocusRef = useRef<TimePickerSegment | null>(null);
  const popoverRef = useNativePopover(open);
  const segments = useMemo<TimePickerSegment[]>(
    () => [
      'hour',
      'minute',
      ...(showSeconds ? (['second'] as const) : []),
      ...(format === '12h' ? (['period'] as const) : []),
    ],
    [format, showSeconds],
  );
  const periodLabels = useMemo(() => getPeriodLabels(locale), [locale]);
  const hourOptions = useMemo(
    () => buildSegmentOptions('hour', activeParts, validationOptions),
    [activeParts, validationOptions],
  );
  const minuteOptions = useMemo(
    () => buildSegmentOptions('minute', activeParts, validationOptions),
    [activeParts, validationOptions],
  );
  const secondOptions = useMemo(
    () => buildSegmentOptions('second', activeParts, validationOptions),
    [activeParts, validationOptions],
  );
  const periodOptions = useMemo<TimePickerOption[]>(
    () =>
      (['am', 'pm'] as const).map((period) => ({
        disabled: Boolean(
          validateTimeParts(setTimeSegment(activeParts, 'period', period), validationOptions),
        ),
        label: periodLabels[period],
        value: period,
      })),
    [activeParts, periodLabels, validationOptions],
  );

  useEffect(() => {
    const parsed = parseModelTime(modelValue);
    const nextReason = modelInvalidReason(modelValue, parsed, validationOptions);
    if (parsed !== undefined && nextReason === undefined) setActiveParts(parsed);
    else setActiveParts(getFirstValidTime(validationOptions) ?? { ...DEFAULT_TIME_PARTS });
    setDraft(parsed !== undefined ? formatForDisplay(parsed) : String(modelValue ?? ''));
    setReason((current) =>
      (modelValue === undefined || modelValue.length === 0) && current === 'empty'
        ? 'empty'
        : nextReason,
    );
  }, [modelValue, format, locale, showSeconds, validationOptions]);

  useEffect(() => {
    if (!open || !pendingFocusRef.current) return;
    const segment = pendingFocusRef.current;
    pendingFocusRef.current = null;
    queueMicrotask(() => focusPanelSegment(segment));
  }, [open, panelMode]);

  useEffect(() => {
    if (blocked && open) updateOpen(false);
  }, [blocked, open]);

  const getOptions = (segment: Exclude<TimePickerSegment, 'period'>): TimePickerOption[] => {
    if (segment === 'hour') return hourOptions;
    if (segment === 'minute') return minuteOptions;
    return secondOptions;
  };
  const getSegmentLabel = (segment: TimePickerSegment): string =>
    ({ hour: 'Godzina', minute: 'Minuta', second: 'Sekunda', period: 'Okres dnia' })[segment];
  const selectedValue = (segment: TimePickerSegment): number | TimePickerPeriod => {
    if (segment !== 'period') return activeParts[segment];
    return activeParts.hour >= 12 ? 'pm' : 'am';
  };
  const isSelected = (segment: TimePickerSegment, option: TimePickerOption): boolean =>
    selectedValue(segment) === option.value;
  const parseDraftValue = (input: string): TimePickerParts | undefined => {
    const customParser = props.parse as TimePickerParser | undefined;
    if (customParser) {
      try {
        const parsed = customParser(input, formatContext);
        if (isTimeParts(parsed)) return parsed;
        return parseModelTime(parsed);
      } catch {
        return undefined;
      }
    }
    return parseDisplayTime(input, format, showSeconds);
  };
  const rejectValue = (input: string, nextReason: TimePickerInvalidReason): false => {
    const detail: TimePickerInvalidDetail = { input, reason: nextReason };
    setReason(nextReason);
    call(props, 'onInvalid', detail);
    return false;
  };
  const applyParts = (parts: TimePickerParts, closeAfter = false): void => {
    if (blocked) return;
    const nextReason = validateTimeParts(parts, validationOptions);
    if (nextReason) {
      rejectValue(formatModelTime(parts, showSeconds), nextReason);
      return;
    }
    const nextValue = formatModelTime(parts, showSeconds);
    const controlledParts = valueControlled ? parseModelTime(modelValue) : undefined;
    setActiveParts(controlledParts ?? parts);
    let nextDraft = formatForDisplay(parts);
    if (valueControlled) {
      nextDraft =
        controlledParts !== undefined
          ? formatForDisplay(controlledParts)
          : String(modelValue ?? '');
    }
    setDraft(nextDraft);
    setReason(undefined);
    setModelValue(nextValue);
    call(props, 'onChange', nextValue, parts);
    if (closeAfter) updateOpen(false, true);
  };
  const commitDraft = (closeAfter = false): boolean => {
    const input = draft.trim();
    if (!input) {
      if (required) return rejectValue(input, 'empty');
      setReason(undefined);
      setModelValue(undefined);
      if (valueControlled) {
        const controlledParts = parseModelTime(modelValue);
        setDraft(controlledParts ? formatForDisplay(controlledParts) : String(modelValue ?? ''));
      }
      call(props, 'onChange', undefined, undefined);
      if (closeAfter) updateOpen(false, true);
      return true;
    }
    const parsed = parseDraftValue(input);
    if (!parsed) return rejectValue(input, 'format');
    const nextReason = validateTimeParts(parsed, validationOptions);
    if (nextReason) return rejectValue(input, nextReason);
    applyParts(parsed, closeAfter);
    return true;
  };
  function syncPlacement(): void {
    const rect = triggerHostRef.current?.getBoundingClientRect();
    if (!rect || typeof window === 'undefined') return;
    const height = panelMode === 'dropdown' ? 310 : 230;
    const above = rect.top;
    const below = window.innerHeight - rect.bottom;
    const preferred = preferredPlacement === 'bottom' ? below : above;
    const fallback = preferredPlacement === 'bottom' ? 'top' : 'bottom';
    const fallbackSpace = fallback === 'bottom' ? below : above;
    setPlacement(preferred >= height || preferred >= fallbackSpace ? preferredPlacement : fallback);
  }
  function updateOpen(next: boolean, restoreFocus = false, focus?: TimePickerSegment): void {
    if (next && blocked) return;
    if (next) syncPlacement();
    if (focus) pendingFocusRef.current = focus;
    if (next !== open) {
      setOpen(next);
      call(props, next ? 'onOpen' : 'onClose');
    }
    if (!next && restoreFocus) {
      queueMicrotask(() => {
        if (variant === 'input') inputRef.current?.focus();
        else triggerHostRef.current?.querySelector<HTMLElement>('[data-time-segment]')?.focus();
      });
    }
  }
  function focusPanelSegment(segment: TimePickerSegment): void {
    if (panelMode === 'spinbutton') {
      panelRef.current?.querySelector<HTMLElement>(`[data-time-segment="${segment}"]`)?.focus();
      return;
    }
    panelRef.current
      ?.querySelector<HTMLElement>(
        `[data-time-option-segment="${segment}"][data-time-option-value="${selectedValue(segment)}"]`,
      )
      ?.focus();
  }
  const selectOption = (segment: TimePickerSegment, option: TimePickerOption): void => {
    if (!option.disabled) applyParts(setTimeSegment(activeParts, segment, option.value));
  };
  const adjustSegment = (segment: TimePickerSegment, direction: 1 | -1): void => {
    const next = getAdjacentSegmentValue(segment, activeParts, direction, validationOptions);
    if (next) applyParts(next);
  };
  const selectSegmentEdge = (segment: TimePickerSegment, edge: 'first' | 'last'): void => {
    const choices =
      segment === 'period'
        ? periodOptions.filter((option) => !option.disabled)
        : getOptions(segment).filter((option) => !option.disabled);
    const option = choices[edge === 'first' ? 0 : choices.length - 1];
    if (option) selectOption(segment, option);
  };
  const replaceSegmentWithDigit = (
    segment: Exclude<TimePickerSegment, 'period'>,
    digit: string,
  ): void => {
    const now = Date.now();
    const previous = digitBufferRef.current;
    const nextText =
      previous?.segment === segment && now - previous.timestamp < 800
        ? `${previous.text}${digit}`.slice(-2)
        : digit;
    digitBufferRef.current = { segment, text: nextText, timestamp: now };
    const numeric = Number(nextText);
    const range = getSegmentRange(segment, format);
    if (numeric < range.min || numeric > range.max) return;
    let internal = numeric;
    if (segment === 'hour' && format === '12h') {
      internal = (numeric % 12) + (activeParts.hour >= 12 ? 12 : 0);
    }
    const next = setTimeSegment(activeParts, segment, internal);
    if (!validateTimeParts(next, validationOptions)) applyParts(next);
  };
  const handleSegmentKeydown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    segment: TimePickerSegment,
    index: number,
  ): void => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      adjustSegment(segment, event.key === 'ArrowUp' ? 1 : -1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const buttons = Array.from(
        triggerHostRef.current?.querySelectorAll<HTMLElement>(
          '.peaui-form-time-picker__segments [data-time-segment]',
        ) ?? [],
      );
      buttons[
        (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length
      ]?.focus();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      selectSegmentEdge(segment, event.key === 'Home' ? 'first' : 'last');
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      updateOpen(true, false, segment);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      updateOpen(false, true);
    } else if (/^\d$/.test(event.key) && segment !== 'period') {
      event.preventDefault();
      replaceSegmentWithDigit(segment, event.key);
    }
  };
  const handleOptionKeydown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    segment: TimePickerSegment,
  ): void => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const index = segments.indexOf(segment);
      focusPanelSegment(
        segments[
          (index + (event.key === 'ArrowRight' ? 1 : -1) + segments.length) % segments.length
        ]!,
      );
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const list = event.currentTarget.closest('[role="listbox"]');
    const options = Array.from(
      list?.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])') ?? [],
    );
    const currentIndex = options.indexOf(event.currentTarget);
    let nextIndex =
      (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
    if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = options.length - 1;
    options[nextIndex]?.focus();
  };
  const errorText = externalError ?? invalidMessage(reason, placeholder);
  const hasError = Boolean(errorText);
  const hasDescription = hasContent(description);
  const descriptionId = `${id}-help-description`;
  const errorId = `${id}-error`;
  const loadingId = `${id}-time-loading`;
  const describedBy =
    [
      text(props, 'aria-describedby') || undefined,
      hasDescription && !hasError ? descriptionId : undefined,
      hasError ? errorId : undefined,
      loading ? loadingId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;
  const root = 'peaui-form-time-picker';
  const anchorName = `--anchor-${id.replaceAll(':', '')}`;
  const renderOption = (segment: TimePickerSegment, option: TimePickerOption): ReactNode => {
    const renderer = props[`render${segment.charAt(0).toUpperCase()}${segment.slice(1)}Option`] as
      | ((option: TimePickerOption, selected: boolean) => ReactNode)
      | undefined;
    return renderer?.(option, isSelected(segment, option)) ?? option.label;
  };
  const triggerAriaLabel =
    text(props, 'triggerAriaLabel') || `Wybierz czas${label ? `: ${label}` : ''}`;
  const panelAriaLabel = text(props, 'panelAriaLabel') || `Wybór czasu${label ? `: ${label}` : ''}`;
  const customTrigger = props.renderTrigger as
    | ((state: { displayValue: string; open: boolean; toggle: () => void }) => ReactNode)
    | undefined;
  const currentFieldClass = cx(
    'peaui-form-field__element',
    draft.length > 0 ? 'peaui-form-field__element--medium' : 'peaui-form-field__element--normal',
    disabled && 'peaui-form-field__element--disabled',
    readonly && 'peaui-form-field__element--readonly',
    !readonly && 'peaui-form-field__element--basic',
    hasError && 'peaui-form-field__element--error',
  );

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
        {variant === 'input' ? (
          <input
            aria-busy={loading || undefined}
            aria-controls={`${id}-time-panel`}
            aria-describedby={describedBy}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-invalid={hasError || undefined}
            aria-label={text(props, 'ariaLabel') || (!label ? name : undefined)}
            aria-labelledby={label ? `label-${id}` : undefined}
            aria-readonly={readonly || undefined}
            aria-autocomplete="none"
            autoCapitalize="off"
            autoComplete="off"
            className={cx(currentFieldClass, `${root}__input`)}
            data-testid={baseTestId ? `${baseTestId}-element` : undefined}
            data-type="time-picker"
            disabled={disabled || loading}
            id={id}
            inputMode={format === '12h' ? 'text' : 'numeric'}
            name={name}
            placeholder={placeholder}
            readOnly={readonly}
            ref={(element) => {
              inputRef.current = element;
              assignRef(forwardedRef, element);
            }}
            required={required}
            role="combobox"
            spellCheck={false}
            style={{ '--pl': '12px', '--pr': canErase ? '80px' : '44px' } as CSSProperties}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => commitDraft(false)}
            onClick={() => updateOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                updateOpen(true, false, 'hour');
              } else if (event.key === 'Enter') {
                event.preventDefault();
                commitDraft(true);
              } else if (event.key === 'Escape') {
                event.preventDefault();
                const parsed = parseModelTime(modelValue);
                setDraft(parsed ? formatForDisplay(parsed) : String(modelValue ?? ''));
                updateOpen(false, true);
              } else if (event.key === 'Tab') {
                commitDraft(false);
                updateOpen(false);
              }
            }}
          />
        ) : (
          <div
            aria-busy={loading || undefined}
            aria-describedby={describedBy}
            aria-invalid={hasError || undefined}
            aria-label={text(props, 'ariaLabel') || label || name}
            className={cx(currentFieldClass, `${root}__segments`)}
            data-testid={baseTestId ? `${baseTestId}-element` : undefined}
            id={id}
            ref={(element) => assignRef(forwardedRef, element)}
            role="group"
            style={{ '--pl': '4px', '--pr': canErase ? '48px' : '4px' } as CSSProperties}
          >
            {segments.map((segment, index) => (
              <span key={segment} style={{ display: 'contents' }}>
                {index > 0 && segment !== 'period' ? (
                  <span aria-hidden="true" className={`${root}__separator`}>
                    :
                  </span>
                ) : null}
                <button
                  aria-label={getSegmentLabel(segment)}
                  aria-valuemax={getSegmentRange(segment, format).max}
                  aria-valuemin={getSegmentRange(segment, format).min}
                  aria-valuenow={getSegmentValue(activeParts, segment, format)}
                  aria-valuetext={getSegmentText(activeParts, segment, formatContext)}
                  className={`${root}__segment`}
                  data-time-segment={segment}
                  disabled={disabled || loading}
                  role="spinbutton"
                  type="button"
                  onClick={() => {
                    if (segment === 'period')
                      selectSegmentEdge('period', activeParts.hour >= 12 ? 'first' : 'last');
                  }}
                  onKeyDown={(event) => handleSegmentKeydown(event, segment, index)}
                >
                  {getSegmentText(activeParts, segment, formatContext)}
                </button>
              </span>
            ))}
            <button
              aria-controls={`${id}-time-panel`}
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-label={triggerAriaLabel}
              className={`${root}__panel-trigger`}
              disabled={blocked}
              type="button"
              onClick={() => updateOpen(!open, !open ? false : true)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  updateOpen(true, false, 'hour');
                }
              }}
            >
              <Icon name="clock" />
            </button>
            <input name={name} type="hidden" value={modelValue ?? ''} />
          </div>
        )}
        {variant === 'input' ? (
          <Icon className="peaui-form-field__icon peaui-form-field__icon--after" name="clock" />
        ) : null}
        {canErase && modelValue && !blocked ? (
          <button
            aria-label="Usuń wartość pola"
            className="peaui-form-field__erase-button"
            style={{ '--right': variant === 'input' ? '44px' : '12px' } as CSSProperties}
            type="button"
            onClick={() => {
              setDraft('');
              setReason(required ? 'empty' : undefined);
              setModelValue(undefined);
              call(props, 'onChange', undefined, undefined);
              updateOpen(false, true);
            }}
          >
            <Icon className="peaui-form-field__erase-icon" name="cross" />
          </button>
        ) : null}
      </div>
      {hasDescription && !hasError ? (
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
          <p className="peaui-message-text__content">{errorText}</p>
        </div>
      ) : null}
    </div>
  );

  const renderOptionColumn = (segment: TimePickerSegment): ReactElement => {
    const options = segment === 'period' ? periodOptions : getOptions(segment);
    return (
      <div className={`${root}__option-column`} key={segment}>
        <span className={`${root}__column-label`} id={`${id}-${segment}-label`}>
          {getSegmentLabel(segment)}
        </span>
        <div
          aria-labelledby={`${id}-${segment}-label`}
          className={`${root}__listbox`}
          data-time-listbox={segment}
          role="listbox"
        >
          {options.map((option) => (
            <button
              aria-disabled={option.disabled || undefined}
              aria-selected={isSelected(segment, option)}
              className={cx(
                `${root}__option`,
                isSelected(segment, option) && `${root}__option--selected`,
              )}
              data-time-option-segment={segment}
              data-time-option-value={String(option.value)}
              disabled={option.disabled}
              id={`${id}-${segment}-option-${String(option.value)}`}
              key={String(option.value)}
              role="option"
              tabIndex={isSelected(segment, option) && !option.disabled ? 0 : -1}
              type="button"
              onClick={() => selectOption(segment, option)}
              onKeyDown={(event) => handleOptionKeydown(event, segment)}
            >
              {renderOption(segment, option)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        aria-disabled={disabled || undefined}
        className={cx(
          root,
          `${root}--variant-${variant}`,
          `${root}--panel-${panelMode}`,
          `${root}__overlayer`,
          'peaui-popover-overlayer',
          'peaui-popover-overlayer--match-trigger-width',
          open && `${root}--open`,
          disabled && `${root}--disabled`,
          readonly && `${root}--readonly`,
          loading && `${root}--loading`,
          hasError && `${root}--invalid`,
          props.className,
        )}
        ref={rootRef}
        style={{ ...props.style, '--unique-anchor': anchorName } as CSSProperties}
      >
        <div className={`${root}__trigger-host`} ref={triggerHostRef}>
          {customTrigger
            ? customTrigger({ displayValue: draft, open, toggle: () => updateOpen(!open, open) })
            : defaultTrigger}
          {loading ? (
            <span
              aria-live="polite"
              className={`${root}__loading-status`}
              id={loadingId}
              role="status"
            >
              <span aria-hidden="true" className={`${root}__spinner`} />
              {text(props, 'loadingLabel', 'Ładowanie wyboru czasu')}
            </span>
          ) : null}
        </div>
      </div>
      <div
        className={cx(
          'peaui-popover-overlayer__content',
          `peaui-popover-overlayer__content--placement-${placement}`,
          'peaui-popover-overlayer__content--match-trigger-width',
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
            '--unique-anchor': anchorName,
            '--peaui-popover-overlayer-trigger-width': `${rootRef.current?.getBoundingClientRect().width ?? 0}px`,
          } as CSSProperties
        }
        onToggle={(event) => {
          if (event.nativeEvent.newState === 'closed' && open) updateOpen(false);
        }}
      >
        <div
          aria-labelledby={`${id}-time-panel-label`}
          aria-modal="false"
          className={`${root}__panel`}
          data-testid={baseTestId ? `${baseTestId}-panel` : undefined}
          id={`${id}-time-panel`}
          ref={panelRef}
          role="dialog"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              const parsed = parseModelTime(modelValue);
              setDraft(parsed ? formatForDisplay(parsed) : String(modelValue ?? ''));
              updateOpen(false, true);
            }
          }}
        >
          <p className={`${root}__panel-heading`} id={`${id}-time-panel-label`}>
            {panelAriaLabel}
          </p>
          {panelMode === 'dropdown' ? (
            <div className={`${root}__option-columns`}>{segments.map(renderOptionColumn)}</div>
          ) : (
            <div aria-label={panelAriaLabel} className={`${root}__spin-columns`} role="group">
              {segments.map((segment, index) => (
                <div className={`${root}__spin-column`} key={segment}>
                  <span className={`${root}__column-label`}>{getSegmentLabel(segment)}</span>
                  <button
                    aria-label={`Zwiększ: ${getSegmentLabel(segment)}`}
                    className={`${root}__spin-action`}
                    type="button"
                    onClick={() => adjustSegment(segment, 1)}
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                  <button
                    aria-label={getSegmentLabel(segment)}
                    aria-valuemax={getSegmentRange(segment, format).max}
                    aria-valuemin={getSegmentRange(segment, format).min}
                    aria-valuenow={getSegmentValue(activeParts, segment, format)}
                    aria-valuetext={getSegmentText(activeParts, segment, formatContext)}
                    className={`${root}__spin-value`}
                    data-time-segment={segment}
                    role="spinbutton"
                    type="button"
                    onKeyDown={(event) => handleSegmentKeydown(event, segment, index)}
                  >
                    {getSegmentText(activeParts, segment, formatContext)}
                  </button>
                  <button
                    aria-label={`Zmniejsz: ${getSegmentLabel(segment)}`}
                    className={`${root}__spin-action`}
                    type="button"
                    onClick={() => adjustSegment(segment, -1)}
                  >
                    <span aria-hidden="true">−</span>
                  </button>
                </div>
              ))}
            </div>
          )}
          {hasContent(props.footerContent) ? (
            <div className={`${root}__footer`}>{props.footerContent as ReactNode}</div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default FormTimePickerRenderer;
