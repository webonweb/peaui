/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/no-base-to-string */
import {
  type RuntimeProps,
  text,
  useFormControlModel,
  bool,
  node,
  hasVisibleReactText,
  dataTest,
  cx,
  callback,
} from './runtime.shared';
import {
  type ForwardedRef,
  type ReactElement,
  useId,
  useRef,
  type ReactNode,
  type MouseEventHandler,
  type KeyboardEventHandler,
  type PointerEventHandler,
} from 'react';

export function serializeSwitchFormValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (['number', 'boolean', 'bigint'].includes(typeof value)) return String(value);

  try {
    const serialized: unknown = JSON.stringify(value);
    return typeof serialized === 'string' ? serialized : String(value);
  } catch {
    return String(value);
  }
}

export function FormSwitchToggleRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedId = useId();
  const id = text(props, 'id') || `peaui-form-switch-toggle-${generatedId}`;
  const trueValue = props.trueValue === undefined ? true : props.trueValue;
  const falseValue = props.falseValue === undefined ? false : props.falseValue;
  const resetRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useFormControlModel<unknown>(props, 'value', falseValue, resetRef);
  const checked = Object.is(value, trueValue);
  const disabled = bool(props, 'disabled');
  const loading = bool(props, 'loading');
  const readonly = bool(props, 'readonly');
  const blocked = disabled || loading;
  const required = bool(props, 'required');
  const descriptionContent = node(props, 'descriptionContent') ?? text(props, 'description');
  const errorContent = node(props, 'errorContent') ?? text(props, 'error');
  const labelContent = node(props, 'labelContent') ?? text(props, 'label');
  const hasLabel = hasVisibleReactText(labelContent);
  const hasDescription = hasVisibleReactText(descriptionContent);
  const hasError = hasVisibleReactText(errorContent);
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const loadingId = `${id}-loading`;
  const describedBy = new Set(
    text(props, 'aria-describedby')
      .split(/\s+/)
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
  if (hasDescription) describedBy.add(descriptionId);
  if (hasError) describedBy.add(errorId);
  if (loading) describedBy.add(loadingId);
  const dataTestId = dataTest(props);
  const size = text(props, 'size', 'm');
  const labelPosition = text(props, 'labelPosition', 'end');
  const showStateLabel = bool(props, 'showStateLabel');
  const externalLabelledBy = text(props, 'aria-labelledby');
  const explicitAriaLabel = text(props, 'aria-label');
  const labelledBy = externalLabelledBy || (hasLabel && !explicitAriaLabel ? labelId : undefined);
  const renderThumb =
    typeof props.renderThumb === 'function'
      ? (props.renderThumb as (state: { checked: boolean; loading: boolean }) => ReactNode)
      : undefined;
  const labelNode = hasLabel ? (
    <span className="peaui-form-switch-toggle__label" id={labelId}>
      {labelContent}
      {required ? (
        <span aria-hidden="true" className="peaui-form-switch-toggle__required">
          *
        </span>
      ) : null}
    </span>
  ) : null;
  const stateContent = checked
    ? (node(props, 'onLabelContent') ?? text(props, 'onLabel', 'Włączone'))
    : (node(props, 'offLabelContent') ?? text(props, 'offLabel', 'Wyłączone'));

  return (
    <div
      className={cx(
        'peaui-form-switch-toggle',
        `peaui-form-switch-toggle--size-${size}`,
        `peaui-form-switch-toggle--label-${labelPosition}`,
        checked && 'peaui-form-switch-toggle--checked',
        disabled && 'peaui-form-switch-toggle--disabled',
        readonly && 'peaui-form-switch-toggle--readonly',
        loading && 'peaui-form-switch-toggle--loading',
        hasError && 'peaui-form-switch-toggle--invalid',
        props.className,
      )}
      data-checked={checked}
      data-disabled={disabled || undefined}
      data-invalid={hasError || undefined}
      data-loading={loading || undefined}
      data-readonly={readonly || undefined}
      data-testid={dataTestId}
      style={props.style}
    >
      <label
        className="peaui-form-switch-toggle__interaction"
        data-testid={dataTestId ? `${dataTestId}-label` : undefined}
        htmlFor={id}
      >
        {labelPosition === 'start' ? labelNode : null}
        <span className="peaui-form-switch-toggle__control">
          <input
            aria-busy={loading || undefined}
            aria-checked={checked}
            aria-describedby={describedBy.size > 0 ? [...describedBy].join(' ') : undefined}
            aria-disabled={blocked || undefined}
            aria-invalid={hasError || undefined}
            aria-label={
              labelledBy
                ? undefined
                : explicitAriaLabel ||
                  (hasLabel
                    ? undefined
                    : text(props, 'ariaLabel') || text(props, 'name') || 'Przełącznik')
            }
            aria-labelledby={labelledBy}
            aria-readonly={readonly || undefined}
            aria-required={required || undefined}
            checked={checked}
            className="peaui-form-switch-toggle__input"
            data-testid={dataTestId ? `${dataTestId}-element` : undefined}
            disabled={blocked}
            form={text(props, 'form') || undefined}
            id={id}
            name={text(props, 'name') || undefined}
            ref={(element) => {
              resetRef.current = element;
              if (typeof forwardedRef === 'function') forwardedRef(element);
              else if (forwardedRef) forwardedRef.current = element;
            }}
            required={required}
            role="switch"
            type="checkbox"
            value={serializeSwitchFormValue(trueValue)}
            onBlur={(event) => callback(props, 'onBlur')?.(event)}
            onChange={(event) => {
              if (readonly || blocked) {
                event.preventDefault();
                event.currentTarget.checked = checked;
                return;
              }
              const nextValue = event.currentTarget.checked ? trueValue : falseValue;
              setValue(nextValue);
              callback(props, 'onChange')?.(nextValue, event);
            }}
            onClick={(event) => {
              if (readonly) {
                event.preventDefault();
                const input = event.currentTarget;
                queueMicrotask(() => {
                  input.checked = checked;
                });
              }
              if (typeof props.onClick === 'function') {
                (props.onClick as MouseEventHandler<HTMLInputElement>)(event);
              }
            }}
            onFocus={(event) => callback(props, 'onFocus')?.(event)}
            onKeyDown={
              typeof props.onKeyDown === 'function'
                ? (props.onKeyDown as KeyboardEventHandler<HTMLInputElement>)
                : undefined
            }
            onPointerDown={
              typeof props.onPointerDown === 'function'
                ? (props.onPointerDown as PointerEventHandler<HTMLInputElement>)
                : undefined
            }
          />
          <span aria-hidden="true" className="peaui-form-switch-toggle__track">
            <span className="peaui-form-switch-toggle__thumb">
              {renderThumb?.({ checked, loading }) ??
                (loading ? <span className="peaui-form-switch-toggle__spinner" /> : null)}
            </span>
          </span>
        </span>
        {labelPosition === 'end' ? labelNode : null}
        {showStateLabel ? (
          <span aria-hidden="true" className="peaui-form-switch-toggle__state">
            {stateContent}
          </span>
        ) : null}
      </label>
      {hasDescription ? (
        <p className="peaui-form-switch-toggle__description" id={descriptionId}>
          {descriptionContent}
        </p>
      ) : null}
      {hasError ? (
        <p aria-live="polite" className="peaui-form-switch-toggle__error" id={errorId}>
          {errorContent}
        </p>
      ) : null}
      {loading ? (
        <span
          aria-atomic="true"
          aria-live="polite"
          className="peaui-form-switch-toggle__loading-status"
          id={loadingId}
          role="status"
        >
          {text(props, 'loadingLabel', 'Trwa aktualizowanie ustawienia')}
        </span>
      ) : null}
    </div>
  );
}
