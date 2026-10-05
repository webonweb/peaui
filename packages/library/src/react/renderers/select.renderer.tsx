/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions, no-nested-ternary */
import {
  getSelectLabels,
  getSelectFormValues,
  focusInvalidSelect,
  resolveSelectPlacement,
  createSelectValueIndex,
  getSelectOptionValue,
  isSelectOptionSelected,
  toggleSelectValues,
  type SelectValueMode,
  type SelectLabels,
} from '../../components/form/FormSelect/select.shared';
import { useVirtualListWindow } from '../use-virtual-list-window';
import { iconCross } from '../generated-static-icons';
import {
  type RuntimeProps,
  text,
  useFormControlModel,
  asOptions,
  bool,
  type Option,
  cx,
  node,
  dataTest,
  callback,
} from './runtime.shared';
import {
  type ForwardedRef,
  type ReactElement,
  useState,
  useMemo,
  useId,
  useRef,
  useEffect,
  useCallback,
  type CSSProperties,
} from 'react';
import { useNativePopover, getNativePopoverValue } from '.././popover-overlayer.shared';
import {
  edgeEnabledMenuIndex,
  nextEnabledMenuIndex,
} from '../../components/navigation/DropdownMenu/menu.shared';
import { FormShell, getFormFieldAria } from './form-shell';
import { getFormFieldPaddingRight } from '../../components/form/FormField/form-field-layout.shared';
import { Svg } from './svg.renderer';

export function SelectRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  const multi = kind === 'FormMultiSelect';
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, updateValue] = useFormControlModel<unknown>(
    props,
    'value',
    multi ? [] : '',
    inputRef,
  );
  const [nativeInvalid, setNativeInvalid] = useState(false);
  useEffect(() => setNativeInvalid(false), [value]);
  const setValue = (next: unknown): void => {
    setNativeInvalid(false);
    updateValue(next);
  };
  const formValues = getSelectFormValues(value, multi);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const options = useMemo(() => asOptions(props.options), [props.options]);
  const valueMode: SelectValueMode = props.valueMode === 'label' ? 'label' : 'value';
  const selected = useMemo(
    () => createSelectValueIndex(multi ? (Array.isArray(value) ? value : []) : [value], valueMode),
    [multi, value, valueMode],
  );
  const generatedId = useId();
  const id = text(props, 'id') || generatedId;
  const root = multi ? 'peaui-form-multiselect' : 'peaui-form-select';
  const searchable = bool(props, 'searchable', true);
  const canWrite = !multi && bool(props, 'canWrite');
  const labels = getSelectLabels(props.labels as Partial<SelectLabels> | undefined);
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  const canErase = bool(props, 'canErase');
  const selectedOptions = useMemo(
    () => options.filter((option) => isSelectOptionSelected(option, selected, valueMode)),
    [options, selected, valueMode],
  );
  const filteredOptions = useMemo(() => {
    const phrase = query.trim().toLowerCase();
    return phrase
      ? options.filter((option) => option.label.trim().toLowerCase().startsWith(phrase))
      : options;
  }, [options, query]);
  const enabledFilteredOptions = useMemo(
    () => filteredOptions.filter((option) => !option.disabled),
    [filteredOptions],
  );
  const allFilteredSelected =
    enabledFilteredOptions.length > 0 &&
    enabledFilteredOptions.every((option) => isSelectOptionSelected(option, selected, valueMode));
  const displayValue = multi
    ? selectedOptions.map((option) => option.label).join(', ')
    : (selectedOptions[0]?.label ?? (typeof value === 'string' ? value : ''));
  const popoverRef = useNativePopover(open);
  const overlayerRef = useRef<HTMLDivElement | null>(null);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const [popoverPlacement, setPopoverPlacement] = useState('bottom');
  const preferredPlacement = props.placement === 'top' ? 'top' : 'bottom';
  const selectAll = multi && bool(props, 'withSelectAll');
  const syncPopoverLayout = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;
    const rect = input.getBoundingClientRect();
    const estimatedHeight = Math.min(
      Math.max(filteredOptions.length, 1) * 48 + 8 + (selectAll ? 56 : 0),
      240,
    );
    const height = popoverRef.current?.scrollHeight || estimatedHeight;
    setTriggerWidth(rect.width);
    setPopoverPlacement(
      multi && props.placement
        ? preferredPlacement
        : resolveSelectPlacement(rect, height + 5, window.innerHeight, preferredPlacement),
    );
  }, [filteredOptions.length, selectAll, multi, props.placement, preferredPlacement, popoverRef]);
  useEffect(() => {
    if (!open) return;
    syncPopoverLayout();
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(syncPopoverLayout);
    if (inputRef.current) observer?.observe(inputRef.current);
    window.addEventListener('resize', syncPopoverLayout);
    window.addEventListener('scroll', syncPopoverLayout, true);
    window.visualViewport?.addEventListener('resize', syncPopoverLayout);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', syncPopoverLayout);
      window.removeEventListener('scroll', syncPopoverLayout, true);
      window.visualViewport?.removeEventListener('resize', syncPopoverLayout);
    };
  }, [open, syncPopoverLayout]);
  const anchorName = `--anchor-peaui-${id.replaceAll(':', '')}`;
  const activeOptionIndex =
    filteredOptions[activeIndex]?.disabled === false ||
    (filteredOptions[activeIndex] && !filteredOptions[activeIndex].disabled)
      ? activeIndex
      : edgeEnabledMenuIndex(filteredOptions, 'first');
  const virtual = bool(props, 'virtual');
  const { viewportRef, visibleOptions, beforeSize, afterSize, optionStyle, handleScroll } =
    useVirtualListWindow(
      filteredOptions,
      activeOptionIndex,
      open,
      virtual,
      typeof props.optionHeight === 'number' ? props.optionHeight : 48,
    );
  const activeOptionId =
    open &&
    activeOptionIndex >= 0 &&
    (!virtual || visibleOptions.some(({ index }) => index === activeOptionIndex))
      ? `${id}-option-${activeOptionIndex}`
      : undefined;
  useEffect(() => {
    if (activeOptionId) {
      const option = document.getElementById(activeOptionId);
      if (option && typeof option.scrollIntoView === 'function')
        option.scrollIntoView({ block: 'nearest' });
    }
  }, [activeOptionId]);
  const setOpenWithLayout = (next: boolean): void => {
    if (next && (disabled || readonly)) return;
    if (next) syncPopoverLayout();
    if (next && !open) {
      if (searchable && canWrite && selectedOptions.length === 0) setQuery(displayValue);
      const selectedIndex = filteredOptions.findIndex(
        (option) => !option.disabled && isSelectOptionSelected(option, selected, valueMode),
      );
      setActiveIndex(
        selectedIndex >= 0 ? selectedIndex : edgeEnabledMenuIndex(filteredOptions, 'first'),
      );
    }
    if (!next) setQuery('');
    setOpen(next);
  };
  const choose = (option: Option): void => {
    if (option.disabled || disabled || readonly) return;
    if (multi) {
      setValue(toggleSelectValues(Array.isArray(value) ? value : [], [option], valueMode));
      return;
    }
    setValue(getSelectOptionValue(option, valueMode));
    setOpenWithLayout(false);
    setQuery('');
  };
  const inputClasses = cx(
    'peaui-form-field__element',
    `${root}__input`,
    searchable ? `${root}__input--searchable` : `${root}__input--select-only`,
    displayValue ? 'peaui-form-field__element--medium' : 'peaui-form-field__element--normal',
    disabled
      ? 'peaui-form-field__element--disabled'
      : readonly
        ? 'peaui-form-field__element--readonly'
        : 'peaui-form-field__element--basic',
    Boolean(node(props, 'error')) && 'peaui-form-field__element--error',
    Boolean(node(props, 'success')) && 'peaui-form-field__element--success',
  );
  return (
    <>
      <div
        aria-disabled={disabled || undefined}
        className={cx(
          root,
          !multi && `${root}--size-${text(props, 'size', 'm')}`,
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
            id,
            className: undefined,
            iconAfter: 'arrow',
            style: undefined,
            value,
          }}
        >
          <input
            {...getFormFieldAria(
              { ...props, 'aria-invalid': nativeInvalid || props['aria-invalid'] },
              id,
            )}
            aria-activedescendant={activeOptionId}
            aria-autocomplete={searchable ? 'list' : 'none'}
            aria-controls={`${id}-listbox`}
            aria-disabled={disabled}
            aria-expanded={open}
            aria-haspopup="listbox"
            autoCapitalize="none"
            autoComplete="off"
            className={inputClasses}
            data-testid={dataTest(props) ? `${dataTest(props)}-element` : undefined}
            data-type={multi ? 'multiselect' : 'select'}
            disabled={disabled}
            id={id}
            form={text(props, 'form') || undefined}
            placeholder={
              open && searchable
                ? labels.searchPlaceholder
                : text(
                    props,
                    'placeholder',
                    searchable ? labels.placeholder : labels.selectPlaceholder,
                  )
            }
            readOnly={readonly || !searchable}
            onInvalid={(event) => {
              setNativeInvalid(true);
              focusInvalidSelect(event.nativeEvent, inputRef.current);
            }}
            ref={(element) => {
              inputRef.current = element;
              if (typeof forwardedRef === 'function') forwardedRef(element);
              else if (forwardedRef) forwardedRef.current = element;
            }}
            role="combobox"
            spellCheck={false}
            style={
              {
                '--pl': '12px',
                '--pr': `${getFormFieldPaddingRight({ canErase, iconAfter: 'arrow' })}px`,
                [`--${root}-input-padding-right`]: `${getFormFieldPaddingRight({
                  canErase,
                  iconAfter: 'arrow',
                })}px`,
              } as CSSProperties
            }
            value={open && searchable ? query : displayValue}
            onChange={(event) => {
              if (!searchable || disabled || readonly) return;
              setOpenWithLayout(true);
              setQuery(event.target.value);
              if (canWrite) setValue(event.target.value);
              setActiveIndex(-1);
            }}
            onClick={() => !readonly && setOpenWithLayout(searchable ? true : !open)}
            onKeyDown={(event) => {
              if (disabled || readonly) return;
              if (event.key === 'Escape' || event.key === 'Tab') {
                if (event.key === 'Escape' && open) event.preventDefault();
                setOpenWithLayout(false);
              } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                if (!open) setOpenWithLayout(true);
                else
                  setActiveIndex(
                    nextEnabledMenuIndex(
                      filteredOptions,
                      activeOptionIndex,
                      event.key === 'ArrowDown' ? 1 : -1,
                      false,
                    ),
                  );
              } else if (open && (event.key === 'Home' || event.key === 'End')) {
                event.preventDefault();
                setActiveIndex(
                  edgeEnabledMenuIndex(filteredOptions, event.key === 'Home' ? 'first' : 'last'),
                );
              } else if (event.key === 'Enter' || (event.key === ' ' && !searchable)) {
                event.preventDefault();
                if (!open) setOpenWithLayout(true);
                else if (filteredOptions[activeOptionIndex])
                  choose(filteredOptions[activeOptionIndex]);
              }
            }}
          />
          <select
            aria-hidden="true"
            tabIndex={-1}
            className="peaui-form-field__native-select"
            name={text(props, 'name') || undefined}
            form={text(props, 'form') || undefined}
            disabled={disabled}
            required={bool(props, 'required') && !readonly}
            multiple={multi}
            value={multi ? formValues : (formValues[0] ?? '')}
            onChange={() => undefined}
            onInvalid={(event) => {
              setNativeInvalid(true);
              focusInvalidSelect(event.nativeEvent, inputRef.current);
            }}
          >
            {!multi && <option value="">{labels.selectPlaceholder}</option>}
            {formValues.map((entry, index) => (
              <option key={`${index}:${entry}`} value={entry}>
                {entry}
              </option>
            ))}
          </select>
          {canErase && selected.size > 0 && !disabled && !readonly ? (
            <button
              aria-label={labels.clear}
              className="peaui-form-field__erase-button"
              style={{ '--right': '44px' } as CSSProperties}
              type="button"
              onClick={() => {
                setValue(multi ? [] : undefined);
                setQuery('');
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
          `peaui-popover-overlayer__content--placement-${popoverPlacement}`,
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
        {open ? (
          <div className={`${root}__panel`}>
            {multi && bool(props, 'withSelectAll') && filteredOptions.length > 0 ? (
              <button
                aria-pressed={allFilteredSelected}
                disabled={disabled || readonly || enabledFilteredOptions.length === 0}
                className={`${root}__action`}
                type="button"
                onClick={() =>
                  setValue(
                    toggleSelectValues(
                      Array.isArray(value) ? value : [],
                      enabledFilteredOptions,
                      valueMode,
                    ),
                  )
                }
              >
                {allFilteredSelected ? labels.deselectAll : labels.selectAll}
              </button>
            ) : null}
            <ul
              ref={viewportRef}
              onScroll={handleScroll}
              aria-label={
                !text(props, 'label') ? text(props, 'ariaLabel') || text(props, 'name') : undefined
              }
              aria-labelledby={text(props, 'label') ? `label-${id}` : undefined}
              aria-multiselectable={multi || undefined}
              className={`${root}__listbox`}
              id={`${id}-listbox`}
              role="listbox"
              tabIndex={-1}
            >
              {beforeSize > 0 ? (
                <li role="presentation" aria-hidden="true" style={{ height: beforeSize }} />
              ) : null}
              {visibleOptions.map(({ item: option, index }) => {
                const isSelected = isSelectOptionSelected(option, selected, valueMode);
                return (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- The combobox input owns keyboard selection with aria-activedescendant.
                  <li
                    key={option.id ?? `${String(option.value)}-${index}`}
                    style={optionStyle}
                    aria-setsize={virtual ? filteredOptions.length : undefined}
                    aria-posinset={virtual ? index + 1 : undefined}
                    aria-disabled={option.disabled || undefined}
                    aria-selected={isSelected}
                    id={`${id}-option-${index}`}
                    className={cx(
                      `${root}__option`,
                      option.icon && `${root}__option--with-icon`,
                      option.hint && `${root}__option--with-hint`,
                      option.disabled && `${root}__option--disabled`,
                      isSelected && `${root}__option--selected`,
                      activeOptionIndex === index && `${root}__option--active`,
                    )}
                    role="option"
                    onClick={() => choose(option)}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                  >
                    {multi ? (
                      <span aria-hidden="true" className={`${root}__option-marker`} />
                    ) : null}
                    {option.icon ? (
                      <Svg className={`${root}__option-icon`} name={option.icon} />
                    ) : null}
                    <span className={`${root}__option-label`}>{option.label}</span>
                    {option.hint ? (
                      <span className={`${root}__option-hint`} title={option.hint}>
                        <i aria-hidden="true" className={`${root}__option-hint-trigger`}>
                          i
                        </i>
                      </span>
                    ) : null}
                  </li>
                );
              })}
              {afterSize > 0 ? (
                <li role="presentation" aria-hidden="true" style={{ height: afterSize }} />
              ) : null}
            </ul>
            {filteredOptions.length === 0 ? (
              <p className={`${root}__empty`} role="status">
                {bool(props, 'canWrite') ? labels.emptyWritable : labels.empty}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}
