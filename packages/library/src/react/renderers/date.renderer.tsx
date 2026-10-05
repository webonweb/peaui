/** @jsxImportSource react */
import {
  getRequiredValueAttributes,
  focusInvalidValue,
} from '../../helpers/form-validation.helper';
/* eslint-disable @typescript-eslint/strict-boolean-expressions, no-nested-ternary */
import {
  type RuntimeProps,
  text,
  bool,
  useFormControlModel,
  cx,
  node,
  dataTest,
  callback,
} from './runtime.shared';
import { iconArrow, iconCross } from '../generated-static-icons';
import {
  type ForwardedRef,
  type ReactElement,
  useState,
  useRef,
  useId,
  useEffect,
  type CSSProperties,
} from 'react';
import { useNativePopover, getNativePopoverValue } from '.././popover-overlayer.shared';
import { FormShell } from './form-shell';
import { getFormFieldPaddingRight } from '../../components/form/FormField/form-field-layout.shared';
import { Svg } from './svg.renderer';
import { parseModelDate } from '../../components/form/FormDateTimePicker/date-time-picker.shared';

export function DateRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  const range = bool(props, 'range');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useFormControlModel<unknown>(props, 'value', undefined, inputRef);
  const root = kind === 'FormYearPicker' ? 'peaui-form-year-picker' : 'peaui-form-date-picker';
  const [open, setOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<'day' | 'month' | 'year'>('day');
  const [pendingRangeStart, setPendingRangeStart] = useState<string | number>();
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  const canErase = bool(props, 'canErase', true);
  const [viewDate, setViewDate] = useState(() => {
    if (kind === 'FormYearPicker' && typeof value === 'number') {
      return new Date(value, 0, 1);
    }
    const parsed = parseModelDate(Array.isArray(value) ? value[0] : value);
    if (parsed) return new Date(parsed.year, parsed.month - 1, parsed.day);
    return new Date();
  });
  const selectedRecord =
    !Array.isArray(value) && typeof value === 'object' && value !== null
      ? (value as RuntimeProps)
      : undefined;
  const selectedRange = Array.isArray(value)
    ? value.slice(0, 2).filter((item) => typeof item === 'string' || typeof item === 'number')
    : [
        selectedRecord?.from ?? selectedRecord?.start,
        selectedRecord?.to ?? selectedRecord?.end,
      ].filter((item) => typeof item === 'string' || typeof item === 'number');
  const normalized = range
    ? pendingRangeStart !== undefined && open
      ? `${pendingRangeStart} - `
      : selectedRange.join(' - ')
    : typeof value === 'string' || typeof value === 'number'
      ? String(value)
      : '';
  const selectValue = (next: string | number): void => {
    if (!range) {
      setValue(next);
      setOpen(false);
      return;
    }
    if (pendingRangeStart === undefined) {
      setPendingRangeStart(next);
      return;
    }
    const ordered = [pendingRangeStart, next].sort((left, right) =>
      String(left).localeCompare(String(right)),
    );
    setValue(ordered);
    setPendingRangeStart(undefined);
    setOpen(false);
  };
  const currentYear = viewDate.getFullYear();
  const decadeStart = Math.floor(currentYear / 10) * 10;
  const firstDayOffset = (new Date(currentYear, viewDate.getMonth(), 1).getDay() + 6) % 7;
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(currentYear, viewDate.getMonth(), index - firstDayOffset + 1);
    return {
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate(),
      ).padStart(2, '0')}`,
      day: date.getDate(),
      outsideMonth: date.getMonth() !== viewDate.getMonth(),
    };
  });
  const popoverRef = useNativePopover(open);
  const overlayerRef = useRef<HTMLDivElement | null>(null);
  const focusPanelOnOpen = useRef(false);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const generatedId = useId();
  const id = text(props, 'id') || generatedId;
  const anchorName = `--anchor-peaui-${id.replaceAll(':', '')}`;
  const minYear = Number.isFinite(Number(props.minYear)) ? Number(props.minYear) : undefined;
  const maxYear = Number.isFinite(Number(props.maxYear)) ? Number(props.maxYear) : undefined;
  const rawMinDate = text(props, 'minDate') || text(props, 'min');
  const rawMaxDate = text(props, 'maxDate') || text(props, 'max');
  const minDate = rawMinDate && /^\d{4}-\d{2}-\d{2}$/.test(rawMinDate) ? rawMinDate : undefined;
  const maxDate = rawMaxDate && /^\d{4}-\d{2}-\d{2}$/.test(rawMaxDate) ? rawMaxDate : undefined;
  const isOptionDisabled = (next: string | number): boolean => {
    if (kind === 'FormYearPicker') {
      const year = Number(next);
      return (minYear !== undefined && year < minYear) || (maxYear !== undefined && year > maxYear);
    }
    const date = String(next);
    return (minDate !== undefined && date < minDate) || (maxDate !== undefined && date > maxDate);
  };
  const isRangeEndpoint = (next: string | number): boolean =>
    pendingRangeStart === next || selectedRange.some((entry) => String(entry) === String(next));
  const isInSelectedRange = (next: string | number): boolean => {
    const bounds =
      pendingRangeStart !== undefined
        ? [pendingRangeStart, next]
        : selectedRange.length === 2
          ? selectedRange
          : [];
    if (bounds.length !== 2) return false;
    const ordered = bounds.map(String).sort((left, right) => left.localeCompare(right));
    const comparable = String(next);
    return comparable >= (ordered[0] ?? '') && comparable <= (ordered[1] ?? '');
  };
  const isToday = (date: string): boolean => {
    const now = new Date();
    return (
      date ===
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate(),
      ).padStart(2, '0')}`
    );
  };
  const setOpenWithLayout = (next: boolean, focusPanel = false): void => {
    if (next) setTriggerWidth(overlayerRef.current?.getBoundingClientRect().width ?? 0);
    focusPanelOnOpen.current = next && focusPanel;
    if (!next) setPendingRangeStart(undefined);
    setOpen(next);
  };
  const handleGridKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    columns: number,
  ): void => {
    const buttons = Array.from(
      popoverRef.current?.querySelectorAll<HTMLButtonElement>('[data-picker-option]') ?? [],
    );
    const currentIndex = buttons.indexOf(event.currentTarget);
    if (currentIndex < 0) return;
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex += 1;
    else if (event.key === 'ArrowLeft') nextIndex -= 1;
    else if (event.key === 'ArrowDown') nextIndex += columns;
    else if (event.key === 'ArrowUp') nextIndex -= columns;
    else if (event.key === 'Home') nextIndex -= currentIndex % columns;
    else if (event.key === 'End') nextIndex += columns - 1 - (currentIndex % columns);
    else if (event.key === 'Escape') {
      event.preventDefault();
      setOpenWithLayout(false);
      inputRef.current?.focus();
      return;
    } else return;
    event.preventDefault();
    const direction = nextIndex >= currentIndex ? 1 : -1;
    nextIndex = Math.max(0, Math.min(buttons.length - 1, nextIndex));
    while (buttons[nextIndex]?.disabled && nextIndex >= 0 && nextIndex < buttons.length) {
      nextIndex += direction;
    }
    buttons[Math.max(0, Math.min(buttons.length - 1, nextIndex))]?.focus();
  };
  useEffect(() => {
    if (!open || !focusPanelOnOpen.current) return;
    focusPanelOnOpen.current = false;
    const options = Array.from(
      popoverRef.current?.querySelectorAll<HTMLButtonElement>(
        '[data-picker-option]:not(:disabled)',
      ) ?? [],
    );
    const selected = options.find((option) => option.dataset.selected === 'true');
    (selected ?? options[0])?.focus();
  }, [calendarView, open, popoverRef]);
  const pickerButtonRoot = `${root}-button`;
  const navigationRoot = `${root}-navigation`;
  const monthLabels = [
    'styczeń',
    'luty',
    'marzec',
    'kwiecień',
    'maj',
    'czerwiec',
    'lipiec',
    'sierpień',
    'wrzesień',
    'październik',
    'listopad',
    'grudzień',
  ];
  const monthAriaLabels = [
    'stycznia',
    'lutego',
    'marca',
    'kwietnia',
    'maja',
    'czerwca',
    'lipca',
    'sierpnia',
    'września',
    'października',
    'listopada',
    'grudnia',
  ];
  const panelLabel =
    calendarView === 'month'
      ? `Wybierz miesiąc dla roku ${currentYear}`
      : calendarView === 'year'
        ? `Wybierz rok z zakresu ${decadeStart} - ${decadeStart + 9}`
        : `Wybierz datę w miesiącu ${monthAriaLabels[viewDate.getMonth()]} ${currentYear}`;
  const navigatePicker = (direction: -1 | 1): void => {
    setViewDate((current) => {
      if (calendarView === 'year') {
        return new Date(current.getFullYear() + direction * 10, current.getMonth(), 1);
      }
      if (calendarView === 'month') {
        return new Date(current.getFullYear() + direction, current.getMonth(), 1);
      }
      return new Date(current.getFullYear(), current.getMonth() + direction, 1);
    });
  };
  const showCalendarView = (view: 'day' | 'month' | 'year'): void => {
    focusPanelOnOpen.current = true;
    setCalendarView(view);
  };
  return (
    <>
      <div
        aria-disabled={disabled || undefined}
        className={cx(
          root,
          range && `${root}--range`,
          `${root}__overlayer`,
          'peaui-popover-overlayer',
          'peaui-popover-overlayer--match-trigger-width',
          open && `${root}--open`,
          disabled && `${root}--disabled`,
          readonly && `${root}--readonly`,
          props.className,
        )}
        ref={overlayerRef}
        style={
          {
            ...props.style,
            '--unique-anchor': anchorName,
            '--peaui-popover-overlayer-trigger-width': `${triggerWidth}px`,
          } as CSSProperties
        }
      >
        <FormShell
          props={{
            ...props,
            className: undefined,
            iconAfter: 'calendar',
            id,
            style: undefined,
            value,
          }}
        >
          <input
            aria-autocomplete="none"
            aria-controls={`${id}-dialog`}
            aria-describedby={
              node(props, 'error')
                ? `${id}-error`
                : node(props, 'success')
                  ? `${id}-success`
                  : node(props, 'description')
                    ? `${id}-description`
                    : text(props, 'aria-describedby') || undefined
            }
            aria-disabled={disabled}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-invalid={Boolean(node(props, 'error')) || undefined}
            aria-label={
              text(props, 'ariaLabel') ||
              text(props, 'aria-label') ||
              (!text(props, 'label') ? text(props, 'name') : undefined)
            }
            aria-labelledby={
              text(props, 'aria-labelledby') || (text(props, 'label') ? `label-${id}` : undefined)
            }
            aria-readonly="true"
            className={cx(
              'peaui-form-field__element',
              normalized
                ? 'peaui-form-field__element--medium'
                : 'peaui-form-field__element--normal',
              disabled && 'peaui-form-field__element--disabled',
              readonly && 'peaui-form-field__element--readonly',
              !readonly && 'peaui-form-field__element--basic',
              `${root}__input`,
              !disabled && !readonly && `${root}__input--interactive`,
            )}
            data-testid={dataTest(props) ? `${dataTest(props)}-element` : undefined}
            data-type={kind === 'FormYearPicker' ? 'year-picker' : 'date-picker'}
            disabled={disabled}
            id={id}
            inputMode="none"
            name={text(props, 'name')}
            form={text(props, 'form') || undefined}
            placeholder={text(
              props,
              'placeholder',
              kind === 'FormYearPicker' ? 'wybierz rok' : 'wybierz date',
            )}
            readOnly
            ref={(element) => {
              inputRef.current = element;
              if (typeof forwardedRef === 'function') forwardedRef(element);
              else if (forwardedRef) forwardedRef.current = element;
            }}
            role="combobox"
            style={
              {
                '--pl': '12px',
                '--pr': `${getFormFieldPaddingRight({ canErase, iconAfter: 'calendar' })}px`,
              } as CSSProperties
            }
            type="text"
            value={normalized}
            onClick={() => {
              if (readonly) return;
              setCalendarView('day');
              setOpenWithLayout(!open);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setOpenWithLayout(false);
                inputRef.current?.focus();
              }
              if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
                event.preventDefault();
                if (!readonly) {
                  setCalendarView('day');
                  setOpenWithLayout(true, true);
                }
              }
            }}
          />
          <input
            {...getRequiredValueAttributes(
              Boolean(normalized),
              bool(props, 'required'),
              disabled,
              readonly,
              text(props, 'form') || undefined,
            )}
            onChange={() => undefined}
            onInvalid={(event) => focusInvalidValue(event.nativeEvent, inputRef.current)}
          />
          {canErase && value && !disabled ? (
            <button
              aria-label="Usuń wartość pola"
              className="peaui-form-field__erase-button"
              style={{ '--right': '44px' } as CSSProperties}
              type="button"
              onClick={() => {
                setValue(undefined);
                callback(props, 'onRemove')?.();
              }}
            >
              <Svg data={iconCross} className="peaui-form-field__erase-icon" name="cross" />
            </button>
          ) : null}
        </FormShell>
      </div>
      <div
        className={cx(
          'peaui-popover-overlayer__content',
          `peaui-popover-overlayer__content--placement-${text(props, 'placement', 'bottom')}`,
          `${root}__popover-content`,
          'peaui-popover-overlayer__content--match-trigger-width',
        )}
        id={`popover-${id}`}
        popover={getNativePopoverValue()}
        ref={popoverRef}
        style={
          {
            '--unique-anchor': anchorName,
            '--peaui-popover-overlayer-trigger-width': `${triggerWidth}px`,
          } as CSSProperties
        }
        onToggle={(event) => {
          if (event.nativeEvent.newState === 'closed' && open) setOpen(false);
        }}
      >
        <div
          aria-labelledby={kind === 'FormYearPicker' ? `${id}-range-label` : `${id}-dialog-label`}
          aria-modal="false"
          className={`${root}__panel`}
          id={`${id}-dialog`}
          role="dialog"
        >
          {kind === 'FormYearPicker' ? (
            <>
              <div className={`${root}__header`}>
                <p aria-live="polite" className={`${root}__range`} id={`${id}-range-label`}>
                  {decadeStart} - {decadeStart + 9}
                </p>
                <div className={navigationRoot}>
                  <button
                    aria-label="Poprzednie 10 lat"
                    className={`${navigationRoot}__button`}
                    disabled={minYear !== undefined && decadeStart <= Math.floor(minYear / 10) * 10}
                    type="button"
                    onClick={() =>
                      setViewDate(
                        (current) => new Date(current.getFullYear() - 10, current.getMonth(), 1),
                      )
                    }
                  >
                    <Svg
                      data={iconArrow}
                      className={`${navigationRoot}__icon ${navigationRoot}__icon--previous`}
                      name="arrow"
                    />
                  </button>
                  <button
                    aria-label="Następne 10 lat"
                    className={`${navigationRoot}__button`}
                    disabled={maxYear !== undefined && decadeStart + 9 >= maxYear}
                    type="button"
                    onClick={() =>
                      setViewDate(
                        (current) => new Date(current.getFullYear() + 10, current.getMonth(), 1),
                      )
                    }
                  >
                    <Svg
                      data={iconArrow}
                      className={`${navigationRoot}__icon ${navigationRoot}__icon--next`}
                      name="arrow"
                    />
                  </button>
                </div>
              </div>
              <div
                aria-labelledby={`${id}-range-label`}
                className={`${root}__grid`}
                id={`${id}-grid`}
                role="grid"
              >
                {Array.from({ length: 4 }, (_, rowIndex) => (
                  <div className={`${root}__row`} key={rowIndex} role="row">
                    {Array.from({ length: 10 }, (_, index) => decadeStart + index)
                      .slice(rowIndex * 3, rowIndex * 3 + 3)
                      .map((year) => {
                        const optionDisabled = isOptionDisabled(year);
                        const endpoint = isRangeEndpoint(year);
                        const inRange = range && isInSelectedRange(year);
                        const selected = range ? endpoint || inRange : Number(value) === year;
                        const variant =
                          endpoint || (!range && selected)
                            ? 'primary'
                            : inRange || year === new Date().getFullYear()
                              ? 'outline'
                              : 'ghost';
                        return (
                          <div
                            aria-disabled={optionDisabled || undefined}
                            aria-selected={selected}
                            className={`${root}__cell`}
                            key={year}
                            role="gridcell"
                          >
                            <button
                              aria-current={year === new Date().getFullYear() ? 'date' : undefined}
                              aria-label={`Wybierz rok ${year}`}
                              className={cx(
                                pickerButtonRoot,
                                `${pickerButtonRoot}--variant-${variant}`,
                                optionDisabled && `${pickerButtonRoot}--disabled`,
                              )}
                              data-picker-option=""
                              data-selected={selected ? 'true' : undefined}
                              data-testid={
                                dataTest(props) ? `${dataTest(props)}-year-${year}` : undefined
                              }
                              disabled={optionDisabled}
                              id={`${id}-year-${year}`}
                              tabIndex={selected || (!value && year === currentYear) ? 0 : -1}
                              type="button"
                              onClick={() => selectValue(year)}
                              onKeyDown={(event) => handleGridKeyDown(event, 3)}
                            >
                              <span className={`${pickerButtonRoot}__label`}>{year}</span>
                            </button>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className={`${root}__sr-only`} id={`${id}-dialog-label`}>
                {panelLabel}
              </p>
              <div className={`${root}__header`}>
                <div className={`${root}__heading`}>
                  {calendarView === 'day' ? (
                    <>
                      <button
                        aria-label={`Wybierz miesiąc, obecnie ${monthLabels[viewDate.getMonth()]}`}
                        className={`${root}__heading-trigger`}
                        type="button"
                        onClick={() => showCalendarView('month')}
                      >
                        {monthLabels[viewDate.getMonth()]}
                      </button>
                      <button
                        aria-label={`Wybierz rok, obecnie ${currentYear}`}
                        className={`${root}__heading-trigger`}
                        type="button"
                        onClick={() => showCalendarView('year')}
                      >
                        {currentYear}
                      </button>
                    </>
                  ) : calendarView === 'month' ? (
                    <button
                      aria-label={`Wybierz rok, obecnie ${currentYear}`}
                      className={`${root}__heading-trigger`}
                      type="button"
                      onClick={() => showCalendarView('year')}
                    >
                      {currentYear}
                    </button>
                  ) : (
                    <p className={`${root}__heading-label`}>
                      {decadeStart} - {decadeStart + 9}
                    </p>
                  )}
                </div>
                <div className={navigationRoot}>
                  <button
                    aria-label={
                      calendarView === 'year'
                        ? 'Poprzednie 10 lat'
                        : calendarView === 'month'
                          ? 'Poprzedni rok'
                          : 'Poprzedni miesiąc'
                    }
                    className={`${navigationRoot}__button`}
                    type="button"
                    onClick={() => navigatePicker(-1)}
                  >
                    <Svg
                      data={iconArrow}
                      className={`${navigationRoot}__icon ${navigationRoot}__icon--previous`}
                      name="arrow"
                    />
                  </button>
                  <button
                    aria-label={
                      calendarView === 'year'
                        ? 'Następne 10 lat'
                        : calendarView === 'month'
                          ? 'Następny rok'
                          : 'Następny miesiąc'
                    }
                    className={`${navigationRoot}__button`}
                    type="button"
                    onClick={() => navigatePicker(1)}
                  >
                    <Svg
                      data={iconArrow}
                      className={`${navigationRoot}__icon ${navigationRoot}__icon--next`}
                      name="arrow"
                    />
                  </button>
                </div>
              </div>
              {calendarView === 'day' ? (
                <div
                  aria-labelledby={`${id}-dialog-label`}
                  className={`${root}__grid ${root}__grid--day`}
                  id={`${id}-grid`}
                  role="grid"
                >
                  <div className={`${root}__weekday-row`} role="row">
                    {[
                      ['Pon', 'Poniedziałek'],
                      ['Wt', 'Wtorek'],
                      ['Śr', 'Środa'],
                      ['Czw', 'Czwartek'],
                      ['Pt', 'Piątek'],
                      ['Sob', 'Sobota'],
                      ['Nd', 'Niedziela'],
                    ].map(([short, full]) => (
                      <div
                        aria-label={full}
                        className={`${root}__weekday`}
                        key={short}
                        role="columnheader"
                      >
                        {short}
                      </div>
                    ))}
                  </div>
                  {Array.from({ length: 6 }, (_, rowIndex) => (
                    <div
                      className={`${root}__row ${root}__row--day`}
                      key={`day-row-${rowIndex}`}
                      role="row"
                    >
                      {calendarDays.slice(rowIndex * 7, rowIndex * 7 + 7).map((calendarDay) => {
                        const optionDisabled = isOptionDisabled(calendarDay.date);
                        const endpoint = isRangeEndpoint(calendarDay.date);
                        const inRange = range && isInSelectedRange(calendarDay.date);
                        const selected = range
                          ? endpoint || inRange
                          : String(value) === calendarDay.date;
                        const current = isToday(calendarDay.date);
                        const variant =
                          endpoint || (!range && selected)
                            ? 'primary'
                            : inRange || current
                              ? 'outline'
                              : 'ghost';
                        return (
                          <div
                            aria-disabled={optionDisabled || undefined}
                            aria-selected={selected}
                            className={`${root}__cell`}
                            key={calendarDay.date}
                            role="gridcell"
                          >
                            <button
                              aria-current={current ? 'date' : undefined}
                              aria-label={`Wybierz date ${calendarDay.day} ${
                                monthAriaLabels[Number(calendarDay.date.slice(5, 7)) - 1]
                              } ${calendarDay.date.slice(0, 4)}`}
                              className={cx(
                                pickerButtonRoot,
                                `${pickerButtonRoot}--variant-${variant}`,
                                optionDisabled && `${pickerButtonRoot}--disabled`,
                                calendarDay.outsideMonth && `${root}__picker-button--outside-month`,
                              )}
                              data-picker-option=""
                              data-selected={endpoint || (!range && selected) ? 'true' : undefined}
                              data-testid={
                                dataTest(props)
                                  ? `${dataTest(props)}-day-${calendarDay.date}`
                                  : undefined
                              }
                              disabled={optionDisabled}
                              id={`${id}-day-${calendarDay.date}`}
                              tabIndex={
                                endpoint ||
                                (!range && selected) ||
                                (!value && !calendarDay.outsideMonth && calendarDay.day === 1)
                                  ? 0
                                  : -1
                              }
                              type="button"
                              onClick={() => selectValue(calendarDay.date)}
                              onKeyDown={(event) => handleGridKeyDown(event, 7)}
                            >
                              <span className={`${pickerButtonRoot}__label`}>
                                {calendarDay.day}
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : calendarView === 'month' ? (
                <div
                  aria-labelledby={`${id}-dialog-label`}
                  className={`${root}__grid ${root}__grid--period`}
                  id={`${id}-grid`}
                  role="grid"
                >
                  {Array.from({ length: 4 }, (_, rowIndex) => (
                    <div className={`${root}__row ${root}__row--period`} key={rowIndex} role="row">
                      {monthLabels.slice(rowIndex * 3, rowIndex * 3 + 3).map((month, index) => {
                        const monthIndex = rowIndex * 3 + index;
                        const active = monthIndex === viewDate.getMonth();
                        return (
                          <div
                            aria-selected={active}
                            className={`${root}__cell`}
                            key={month}
                            role="gridcell"
                          >
                            <button
                              aria-label={`Wybierz miesiąc ${month}`}
                              className={cx(
                                pickerButtonRoot,
                                `${pickerButtonRoot}--variant-${active ? 'primary' : 'ghost'}`,
                              )}
                              data-picker-option=""
                              data-selected={active ? 'true' : undefined}
                              tabIndex={active ? 0 : -1}
                              type="button"
                              onClick={() => {
                                setViewDate(new Date(currentYear, monthIndex, 1));
                                showCalendarView('day');
                              }}
                              onKeyDown={(event) => handleGridKeyDown(event, 3)}
                            >
                              <span className={`${pickerButtonRoot}__label`}>{month}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  aria-labelledby={`${id}-dialog-label`}
                  className={`${root}__grid ${root}__grid--period`}
                  id={`${id}-grid`}
                  role="grid"
                >
                  {Array.from({ length: 4 }, (_, rowIndex) => (
                    <div className={`${root}__row ${root}__row--period`} key={rowIndex} role="row">
                      {Array.from({ length: 10 }, (_, index) => decadeStart + index)
                        .slice(rowIndex * 3, rowIndex * 3 + 3)
                        .map((year) => {
                          const active = year === currentYear;
                          return (
                            <div
                              aria-selected={active}
                              className={`${root}__cell`}
                              key={year}
                              role="gridcell"
                            >
                              <button
                                aria-label={`Wybierz rok ${year}`}
                                className={cx(
                                  pickerButtonRoot,
                                  `${pickerButtonRoot}--variant-${active ? 'primary' : 'ghost'}`,
                                )}
                                data-picker-option=""
                                data-selected={active ? 'true' : undefined}
                                tabIndex={active ? 0 : -1}
                                type="button"
                                onClick={() => {
                                  setViewDate(new Date(year, viewDate.getMonth(), 1));
                                  showCalendarView('month');
                                }}
                                onKeyDown={(event) => handleGridKeyDown(event, 3)}
                              >
                                <span className={`${pickerButtonRoot}__label`}>{year}</span>
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
