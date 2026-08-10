/** @jsxImportSource react */
import {
  Fragment,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ClipboardEvent as ReactClipboardEvent,
  type FocusEvent as ReactFocusEvent,
  type ForwardedRef,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import {
  applyPinInput,
  getPinCellLabel,
  normalizePinLength,
  normalizePinValue,
  removePinCharacter,
  type FormPinInputInvalidDetail,
  type FormPinInputOptions,
  type FormPinInputSize,
  type FormPinInputTransform,
  type FormPinInputType,
} from '../components/form/FormPinInput/pin-input.shared';

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

const num = (props: RuntimeProps, name: string, fallback: number): number => {
  const value = props[name];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
};

const call = (props: RuntimeProps, name: string, ...args: unknown[]): void => {
  const handler = props[name];
  if (typeof handler === 'function') (handler as (...values: unknown[]) => void)(...args);
};

function hasContent(value: unknown): boolean {
  return value !== undefined && value !== null && value !== false && value !== '';
}

function assignRef<T>(ref: ForwardedRef<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

export function FormPinInputRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedId = useId().replaceAll(':', '');
  const id = text(props, 'id', `peaui-form-pin-input-${generatedId}`);
  const name = text(props, 'name');
  const form = text(props, 'form') || undefined;
  const length = normalizePinLength(num(props, 'length', 6));
  const type = text(props, 'type', 'numeric') as FormPinInputType;
  const size = text(props, 'size', 'm') as FormPinInputSize;
  const pattern = text(props, 'pattern') || undefined;
  const transform = (props.transform ?? 'none') as FormPinInputTransform;
  const separatorEvery = Math.max(0, Math.trunc(num(props, 'separatorEvery', 0)));
  const autocomplete = text(props, 'autocomplete', 'one-time-code');
  const inputMode = text(props, 'inputmode') || (type === 'numeric' ? 'numeric' : 'text');
  const label = text(props, 'label');
  const description = (props.descriptionContent ?? props.description) as ReactNode;
  const error = (props.errorContent ?? props.error) as ReactNode;
  const hint = props.hintContent as ReactNode;
  const labelContent = (props.labelContent ?? label) as ReactNode;
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  const loading = bool(props, 'loading');
  const required = bool(props, 'required');
  const mask = bool(props, 'mask');
  const autoFocus = bool(props, 'autoFocus');
  const loadingLabel = text(props, 'loadingLabel', 'Trwa przygotowywanie pola kodu');
  const blocked = disabled || loading;
  const baseTestId = text(props, 'dataTestId') || text(props, 'data-testid') || undefined;
  const options: FormPinInputOptions = { length, pattern, transform, type };
  const isControlled = Object.prototype.hasOwnProperty.call(props, 'value');
  const externalValue = text(props, 'value');
  const defaultValue = text(props, 'defaultValue');
  const [internalValue, setInternalValue] = useState(() =>
    normalizePinValue(defaultValue, options),
  );
  const modelValue = normalizePinValue(isControlled ? externalValue : internalValue, options);
  const complete = modelValue.length === length;
  const cells = Array.from({ length }, (_, index) => modelValue[index] ?? '');
  const [activeIndex, setActiveIndex] = useState(() => Math.min(modelValue.length, length - 1));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const lastCompletedValue = useRef(complete ? modelValue : '');
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const loadingId = `${id}-loading`;
  const hasLabel = hasContent(labelContent);
  const hasDescription = hasContent(description);
  const hasError = hasContent(error);

  const describedIds = new Set(
    text(props, 'aria-describedby')
      .split(/\s+/)
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
  if (hasDescription) describedIds.add(descriptionId);
  if (hasError) describedIds.add(errorId);
  if (loading) describedIds.add(loadingId);
  const describedBy = describedIds.size ? [...describedIds].join(' ') : undefined;
  const explicitAriaLabel = text(props, 'aria-label');
  const explicitAriaLabelledBy = text(props, 'aria-labelledby');
  const groupLabel = explicitAriaLabel || text(props, 'ariaLabel') || name || 'Kod PIN';
  const groupLabelledBy = explicitAriaLabel
    ? undefined
    : explicitAriaLabelledBy || (hasLabel ? labelId : undefined);

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, length - 1));
    inputRefs.current.length = length;
  }, [length]);

  useEffect(() => {
    lastCompletedValue.current = complete ? modelValue : '';
  }, [complete, modelValue]);

  const focusCell = (index: number, select = true): void => {
    const nextIndex = Math.min(length - 1, Math.max(0, index));
    setActiveIndex(nextIndex);
    const input = inputRefs.current[nextIndex];
    input?.focus();
    if (select) input?.select();
    if (typeof input?.scrollIntoView === 'function') {
      input.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
    }
  };

  const updateValue = (nextValue: string, event: Event): void => {
    if (nextValue === modelValue) return;
    if (!isControlled) setInternalValue(nextValue);
    call(props, 'onValueChange', nextValue);
    call(props, 'onChange', nextValue, event);

    if (nextValue.length === length) {
      if (nextValue !== lastCompletedValue.current) {
        lastCompletedValue.current = nextValue;
        call(props, 'onComplete', nextValue, event);
      }
    } else {
      lastCompletedValue.current = '';
    }
  };

  const reportInvalid = (detail: FormPinInputInvalidDetail | undefined, event: Event): void => {
    if (detail) call(props, 'onInvalidInput', detail, event);
  };

  const insert = (index: number, input: string, event: Event): void => {
    if (blocked || readonly) return;
    const result = applyPinInput(modelValue, index, input, options);
    reportInvalid(result.invalid, event);
    if (result.accepted) {
      updateValue(result.value, event);
      focusCell(result.nextIndex);
    } else {
      focusCell(index);
    }
  };

  const handleKeyDown = (index: number, event: ReactKeyboardEvent<HTMLInputElement>): void => {
    if (event.altKey || event.metaKey || event.ctrlKey || event.nativeEvent.isComposing) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusCell(index - 1);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusCell(index + 1);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      focusCell(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusCell(length - 1);
      return;
    }
    if (event.key === 'Backspace') {
      if (readonly || blocked) return;
      event.preventDefault();
      const targetIndex = cells[index] ? index : Math.max(0, index - 1);
      updateValue(removePinCharacter(modelValue, targetIndex), event.nativeEvent);
      focusCell(targetIndex);
      return;
    }
    if (event.key === 'Delete') {
      if (readonly || blocked) return;
      event.preventDefault();
      updateValue(removePinCharacter(modelValue, index), event.nativeEvent);
      focusCell(index);
      return;
    }
    if (event.key.length === 1) {
      event.preventDefault();
      insert(index, event.key, event.nativeEvent);
    }
  };

  const handlePaste = (index: number, event: ReactClipboardEvent<HTMLInputElement>): void => {
    if (blocked || readonly) return;
    event.preventDefault();
    insert(index, event.clipboardData.getData('text'), event.nativeEvent);
  };

  const handleBlur = (event: ReactFocusEvent<HTMLDivElement>): void => {
    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    call(props, 'onBlur', event);
  };

  const renderSeparator = props.renderSeparator;

  return (
    <div
      className={cx(
        'peaui-form-pin-input',
        `peaui-form-pin-input--size-${size}`,
        complete && 'peaui-form-pin-input--complete',
        disabled && 'peaui-form-pin-input--disabled',
        readonly && 'peaui-form-pin-input--readonly',
        loading && 'peaui-form-pin-input--loading',
        hasError && 'peaui-form-pin-input--invalid',
        props.className,
      )}
      data-complete={complete || undefined}
      data-disabled={disabled || undefined}
      data-invalid={hasError || undefined}
      data-loading={loading || undefined}
      data-readonly={readonly || undefined}
      data-testid={baseTestId}
      style={props.style}
    >
      {hasLabel ? (
        <div className="peaui-form-pin-input__heading">
          <label className="peaui-form-pin-input__label" htmlFor={`${id}-cell-0`} id={labelId}>
            {labelContent}
            {required ? (
              <span aria-hidden="true" className="peaui-form-pin-input__required">
                *
              </span>
            ) : null}
          </label>
          {hint}
        </div>
      ) : null}

      <div
        aria-busy={loading || undefined}
        aria-describedby={describedBy}
        aria-disabled={blocked || undefined}
        aria-invalid={hasError || undefined}
        aria-label={groupLabelledBy ? undefined : groupLabel}
        aria-labelledby={groupLabelledBy}
        className="peaui-form-pin-input__group"
        data-testid={baseTestId ? `${baseTestId}-group` : undefined}
        onBlur={handleBlur}
        role="group"
      >
        {cells.map((cell, index) => {
          const showSeparator =
            separatorEvery > 0 && (index + 1) % separatorEvery === 0 && index < length - 1;
          return (
            <Fragment key={index}>
              <input
                aria-describedby={describedBy}
                aria-disabled={blocked || undefined}
                aria-invalid={hasError || undefined}
                aria-label={getPinCellLabel(type, index, length)}
                aria-readonly={readonly || undefined}
                aria-required={required || undefined}
                autoCapitalize="off"
                autoComplete={index === 0 ? autocomplete : 'off'}
                autoFocus={autoFocus && index === Math.min(modelValue.length, length - 1)}
                className="peaui-form-pin-input__cell"
                data-index={index}
                data-testid={baseTestId ? `${baseTestId}-cell-${index}` : undefined}
                disabled={blocked}
                id={`${id}-cell-${index}`}
                inputMode={inputMode as HTMLAttributes<HTMLInputElement>['inputMode']}
                maxLength={index === 0 ? length : 1}
                onChange={(event) => {
                  if (!(event.nativeEvent as InputEvent).isComposing && event.currentTarget.value) {
                    insert(index, event.currentTarget.value, event.nativeEvent);
                  }
                }}
                onFocus={(event) => {
                  setActiveIndex(index);
                  event.currentTarget.select();
                  call(props, 'onFocus', event, index);
                }}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={(event) => handlePaste(index, event)}
                readOnly={readonly}
                ref={(element) => {
                  inputRefs.current[index] = element;
                  if (index === 0) assignRef(forwardedRef, element);
                }}
                required={required}
                spellCheck={false}
                tabIndex={index === activeIndex ? 0 : -1}
                type={mask ? 'password' : 'text'}
                value={cell}
              />
              {showSeparator ? (
                <span aria-hidden="true" className="peaui-form-pin-input__separator">
                  {typeof renderSeparator === 'function'
                    ? (renderSeparator as (state: { index: number }) => ReactNode)({ index })
                    : '–'}
                </span>
              ) : null}
            </Fragment>
          );
        })}
      </div>

      {name ? (
        <input disabled={disabled} form={form} name={name} type="hidden" value={modelValue} />
      ) : null}
      {hasDescription ? (
        <p className="peaui-form-pin-input__description" id={descriptionId}>
          {description}
        </p>
      ) : null}
      {hasError ? (
        <p aria-live="polite" className="peaui-form-pin-input__error" id={errorId}>
          {error}
        </p>
      ) : null}
      {loading ? (
        <span className="peaui-form-pin-input__loading-status" id={loadingId} role="status">
          {loadingLabel}
        </span>
      ) : null}
    </div>
  );
}
