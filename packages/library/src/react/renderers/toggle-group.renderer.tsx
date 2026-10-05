/** @jsxImportSource react */
import {
  getRequiredValueAttributes,
  focusInvalidValue,
} from '../../helpers/form-validation.helper';
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  type ToggleGroupValue,
  normalizeToggleGroupSelection,
  isToggleGroupItemAvailable,
  findToggleGroupEdgeIndex,
  findToggleGroupReplacementIndex,
  findNextToggleGroupIndex,
} from '../../components/data-entry/ToggleGroup/toggle-group.shared';
import {
  type RuntimeProps,
  text,
  bool,
  useFormControlModel,
  callback,
  node,
  cx,
  dataTest,
} from './runtime.shared';
import {
  type ForwardedRef,
  type ReactElement,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  useEffect,
} from 'react';
import { ToggleButtonRenderer } from './toggle-button.renderer';

export type ReactToggleGroupItem = {
  value: ToggleGroupValue;
  label: string;
  ariaLabel?: string;
  pressedLabel?: string;
  icon?: string;
  pressedIcon?: string;
  content?: string;
  disabled?: boolean;
  readonly?: boolean;
  loading?: boolean;
  metadata?: unknown;
};

export function asToggleGroupItems(value: unknown): ReactToggleGroupItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): ReactToggleGroupItem[] => {
    if (!entry || typeof entry !== 'object') return [];
    const item = entry as Record<string, unknown>;
    if (typeof item.value !== 'string' && typeof item.value !== 'number') return [];
    if (typeof item.label !== 'string') return [];
    return [
      {
        value: item.value,
        label: item.label,
        ariaLabel: typeof item.ariaLabel === 'string' ? item.ariaLabel : undefined,
        pressedLabel: typeof item.pressedLabel === 'string' ? item.pressedLabel : undefined,
        icon: typeof item.icon === 'string' ? item.icon : undefined,
        pressedIcon: typeof item.pressedIcon === 'string' ? item.pressedIcon : undefined,
        content: typeof item.content === 'string' ? item.content : undefined,
        disabled: item.disabled === true,
        readonly: item.readonly === true,
        loading: item.loading === true,
        metadata: item.metadata,
      },
    ];
  });
}

export function ToggleGroupRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedId = useId();
  const id = text(props, 'id') || `peaui-toggle-group-${generatedId}`;
  const items = useMemo(() => asToggleGroupItems(props.items), [props.items]);
  const type = text(props, 'type', 'single') as 'single' | 'multiple';
  const orientation = text(props, 'orientation', 'horizontal') as 'horizontal' | 'vertical';
  const appearance = text(props, 'appearance', 'separate');
  const size = text(props, 'size', 'm');
  const variant = text(props, 'variant', 'outline');
  const overflow = text(props, 'overflow', 'wrap');
  const semanticRole = text(props, 'semanticRole', 'toolbar') as 'toolbar' | 'group';
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  const required = bool(props, 'required');
  const allowEmpty = props.allowEmpty !== false;
  const loop = props.loop !== false;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const resetRef = useRef<HTMLInputElement>(null);
  const [modelValue, setModelValue] = useFormControlModel<unknown>(
    props,
    'value',
    type === 'multiple' ? [] : null,
    resetRef,
  );
  const selectedValues = normalizeToggleGroupSelection(type, modelValue);
  const buttonRefs = useRef<Array<HTMLElement | null>>([]);
  const lastActiveIndex = useRef(0);
  const focusWithin = useRef(false);
  const initialActiveValue = (): ToggleGroupValue | null => {
    const selectedIndex = items.findIndex(
      (item) =>
        selectedValues.some((value) => Object.is(value, item.value)) &&
        isToggleGroupItemAvailable(item),
    );
    const index = selectedIndex >= 0 ? selectedIndex : findToggleGroupEdgeIndex(items, 'first');
    return items[index]?.value ?? null;
  };
  const [activeValue, setActiveValue] = useState<ToggleGroupValue | null>(initialActiveValue);
  const activeIndex = items.findIndex(
    (item) => Object.is(item.value, activeValue) && isToggleGroupItemAvailable(item),
  );
  const validationMessage =
    text(props, 'error') ||
    (required && selectedValues.length === 0
      ? text(props, 'requiredMessage', 'Wybierz co najmniej jedną opcję.')
      : '');
  const label = text(props, 'label');
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  const describedBy = new Set(
    text(props, 'aria-describedby')
      .split(/\s+/)
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
  if (validationMessage) describedBy.add(errorId);
  const externalLabelledBy = text(props, 'aria-labelledby');
  const resolvedAriaLabel = text(props, 'aria-label') || text(props, 'ariaLabel');
  const resolvedLabelledBy = externalLabelledBy || (!resolvedAriaLabel && label ? labelId : '');
  const renderItem = props.renderItem as
    | ((
        item: ReactToggleGroupItem,
        state: { pressed: boolean; disabled: boolean; index: number },
      ) => ReactNode)
    | undefined;

  useEffect(() => {
    if (activeIndex >= 0 && !disabled) {
      lastActiveIndex.current = activeIndex;
      return;
    }
    const replacementIndex = disabled
      ? -1
      : findToggleGroupReplacementIndex(items, lastActiveIndex.current);
    setActiveValue(items[replacementIndex]?.value ?? null);
    lastActiveIndex.current = Math.max(replacementIndex, 0);
    if (focusWithin.current && replacementIndex >= 0) {
      buttonRefs.current[replacementIndex]?.focus();
    }
  }, [activeIndex, disabled, items]);

  const isPressed = (item: ReactToggleGroupItem): boolean =>
    selectedValues.some((value) => Object.is(value, item.value));
  const isAvailable = (index: number): boolean =>
    !disabled && isToggleGroupItemAvailable(items[index]);
  const focusItem = (index: number): void => {
    if (!isAvailable(index)) return;
    setActiveValue(items[index]?.value ?? null);
    lastActiveIndex.current = index;
    buttonRefs.current[index]?.focus();
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number): void => {
    let nextIndex = -1;
    if (event.key === 'Home') nextIndex = findToggleGroupEdgeIndex(items, 'first');
    else if (event.key === 'End') nextIndex = findToggleGroupEdgeIndex(items, 'last');
    else if (orientation === 'horizontal' && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const rtl = rootRef.current ? getComputedStyle(rootRef.current).direction === 'rtl' : false;
      const forward = event.key === 'ArrowRight' ? !rtl : rtl;
      nextIndex = findNextToggleGroupIndex(items, index, forward ? 1 : -1, loop);
    } else if (orientation === 'vertical' && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
      nextIndex = findNextToggleGroupIndex(items, index, event.key === 'ArrowDown' ? 1 : -1, loop);
    } else return;

    event.preventDefault();
    if (nextIndex >= 0) focusItem(nextIndex);
  };
  const handleChange = (
    item: ReactToggleGroupItem,
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    if (disabled || readonly || item.disabled || item.readonly || item.loading) return;
    const pressed = isPressed(item);
    let nextValue: ToggleGroupValue | ToggleGroupValue[] | null;
    if (type === 'single') {
      if (pressed && (!allowEmpty || required)) return;
      nextValue = pressed ? null : item.value;
    } else if (pressed) {
      if (selectedValues.length === 1 && (!allowEmpty || required)) return;
      nextValue = selectedValues.filter((value) => !Object.is(value, item.value));
    } else nextValue = [...selectedValues, item.value];

    setModelValue(nextValue);
    callback(props, 'onChange')?.(nextValue, item, event);
  };

  const setRootRef = (element: HTMLDivElement | null): void => {
    rootRef.current = element;
    if (typeof forwardedRef === 'function') forwardedRef(element);
    else if (forwardedRef) forwardedRef.current = element;
  };

  return (
    <div className="peaui-toggle-group__field">
      {label || node(props, 'labelContent') ? (
        <div className="peaui-toggle-group__label" id={labelId}>
          {node(props, 'labelContent') ?? label}
          {required ? (
            <span aria-hidden="true" className="peaui-toggle-group__required">
              *
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        aria-describedby={describedBy.size ? [...describedBy].join(' ') : undefined}
        aria-disabled={disabled || undefined}
        aria-invalid={validationMessage ? true : undefined}
        aria-label={
          resolvedLabelledBy
            ? undefined
            : resolvedAriaLabel || (!label ? 'Grupa przełączników' : undefined)
        }
        aria-labelledby={resolvedLabelledBy || undefined}
        aria-orientation={semanticRole === 'toolbar' ? orientation : undefined}
        className={cx(
          'peaui-toggle-group',
          `peaui-toggle-group--${orientation}`,
          `peaui-toggle-group--${appearance}`,
          `peaui-toggle-group--size-${size}`,
          `peaui-toggle-group--overflow-${overflow}`,
          disabled && 'peaui-toggle-group--disabled',
          readonly && 'peaui-toggle-group--readonly',
          validationMessage && 'peaui-toggle-group--invalid',
          props.className,
        )}
        data-disabled={disabled || undefined}
        data-readonly={readonly || undefined}
        data-required={required || undefined}
        data-testid={dataTest(props)}
        dir={text(props, 'dir') || undefined}
        id={id}
        ref={setRootRef}
        role={semanticRole}
        style={props.style}
        onBlurCapture={() => {
          queueMicrotask(() => {
            focusWithin.current = Boolean(rootRef.current?.contains(document.activeElement));
          });
        }}
        onFocusCapture={() => {
          focusWithin.current = true;
        }}
      >
        {items.map((item, index) => {
          const pressed = isPressed(item);
          const itemDisabled = disabled || item.disabled === true;
          return (
            <ToggleButtonRenderer
              ariaLabel={item.ariaLabel || item.label}
              className="peaui-toggle-group__item"
              content={
                item.content ??
                (item.icon?.trim() || item.pressedIcon?.trim() ? 'icon-text' : 'text')
              }
              dataTestId={dataTest(props) ? `${dataTest(props)}-item-${index}` : undefined}
              disabled={itemDisabled}
              forwardedRef={(element) => {
                buttonRefs.current[index] = element;
              }}
              icon={item.icon}
              label={item.label}
              key={`${typeof item.value}:${String(item.value)}:${index}`}
              loading={item.loading}
              pressedIcon={item.pressedIcon}
              pressedLabel={item.pressedLabel}
              readonly={readonly || item.readonly}
              size={size}
              tabIndex={isAvailable(index) && activeIndex === index ? 0 : -1}
              value={pressed}
              variant={variant}
              onChange={(_next: boolean, event: React.MouseEvent<HTMLButtonElement>) =>
                handleChange(item, event)
              }
              onFocus={() => {
                setActiveValue(item.value);
                lastActiveIndex.current = index;
                callback(props, 'onFocusChange')?.(item, index);
              }}
              onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) =>
                handleKeyDown(event, index)
              }
            >
              {renderItem?.(item, { pressed, disabled: itemDisabled, index })}
            </ToggleButtonRenderer>
          );
        })}
      </div>
      <input
        ref={resetRef}
        {...getRequiredValueAttributes(
          selectedValues.length > 0,
          required,
          disabled,
          readonly,
          text(props, 'form') || undefined,
        )}
        onChange={() => undefined}
        onInvalid={(event) =>
          focusInvalidValue(
            event.nativeEvent,
            rootRef.current?.querySelector('button:not(:disabled)'),
          )
        }
      />
      {text(props, 'name')
        ? selectedValues.map((value) => (
            <input
              disabled={disabled}
              key={`${typeof value}:${String(value)}`}
              name={text(props, 'name')}
              form={text(props, 'form') || undefined}
              type="hidden"
              value={value}
            />
          ))
        : null}
      {validationMessage ? (
        <div className="peaui-toggle-group__error" id={errorId} role="alert">
          {node(props, 'errorContent') ?? validationMessage}
        </div>
      ) : null}
    </div>
  );
}
