/** @jsxImportSource react */
import { getRequiredValueAttributes, focusInvalidValue } from '../helpers/form-validation.helper';
import { useFormReset } from './renderers/runtime.shared';
import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import {
  getRatingDescription,
  getRatingItemFill,
  getRatingKeyboardValue,
  getRatingPointerValue,
  normalizeRatingMax,
  normalizeRatingStep,
  normalizeRatingValue,
  type FormRatingInputSize,
  type RatingKeyboardAction,
  type RatingLabelGetter,
  type RatingLabels,
  type RatingValue,
} from '../components/form/FormRatingInput/rating-input.shared';
import { iconCoreStar } from './generated-static-icons';
import { useReactIcon } from './renderers/svg.renderer';

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

function call(props: RuntimeProps, name: string, ...args: unknown[]): void {
  const handler = props[name];
  if (typeof handler === 'function') (handler as (...values: unknown[]) => void)(...args);
}

function hasContent(value: unknown): boolean {
  return value !== undefined && value !== null && value !== false && value !== '';
}

function assignRef<T>(ref: ForwardedRef<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

function RatingIcon({ name }: { name: string }): ReactElement {
  const { icon: resolvedIcon } = useReactIcon(
    name,
    name === 'core/star' ? iconCoreStar : undefined,
  );
  const icon = resolvedIcon ?? iconCoreStar;
  return (
    <svg
      aria-hidden="true"
      className="peaui-svg-icon"
      dangerouslySetInnerHTML={{ __html: icon.body }}
      fill={icon.fill ?? 'none'}
      focusable="false"
      stroke={icon.stroke ?? 'currentColor'}
      strokeLinecap={icon.strokeLinecap}
      strokeLinejoin={icon.strokeLinejoin}
      strokeWidth={icon.strokeWidth}
      viewBox={icon.viewBox}
    />
  );
}

export function FormRatingInputRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedId = useId();
  const id = text(props, 'id') || `peaui-form-rating-input-${generatedId}`;
  const max = normalizeRatingMax(typeof props.max === 'number' ? props.max : undefined);
  const step = normalizeRatingStep(typeof props.step === 'number' ? props.step : undefined);
  const controlled = Object.prototype.hasOwnProperty.call(props, 'value');
  const initialValue = normalizeRatingValue(
    (props.defaultValue as number | null | undefined) ?? null,
    max,
    step,
  );
  const [internalValue, setInternalValue] = useState<RatingValue>(initialValue);
  const sourceValue = controlled ? (props.value as number | null | undefined) : internalValue;
  const committedValue = normalizeRatingValue(sourceValue, max, step);
  const [previewValue, setPreviewValue] = useState<RatingValue>(null);
  const displayedValue = previewValue ?? committedValue;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const initialResetValue = useRef(initialValue);
  useFormReset(inputRef, () => {
    if (!controlled) {
      setInternalValue(initialResetValue.current);
      setPreviewValue(null);
    }
  });
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  const required = bool(props, 'required');
  const allowClear = bool(props, 'allowClear');
  const showValueLabel = bool(props, 'showValueLabel', true);
  const size = text(props, 'size', 'm') as FormRatingInputSize;
  const icon = text(props, 'icon', 'core/star');
  const locale = text(props, 'locale', 'pl-PL');
  const emptyLabel = text(props, 'emptyLabel', 'Brak oceny');
  const labels = (props.labels ?? {}) as RatingLabels;
  const getLabel =
    typeof props.getLabel === 'function' ? (props.getLabel as RatingLabelGetter) : undefined;
  const labelContent = (props.labelContent as ReactNode | undefined) ?? text(props, 'label');
  const descriptionContent =
    (props.descriptionContent as ReactNode | undefined) ?? text(props, 'description');
  const errorContent = (props.errorContent as ReactNode | undefined) ?? text(props, 'error');
  const hasLabel = hasContent(labelContent);
  const hasDescription = hasContent(descriptionContent);
  const hasError = hasContent(errorContent);
  const formLabelId = `label-${id}`;
  const labelId = `${id}-label-text`;
  const descriptionId = `${id}-default`;
  const errorId = `${id}-error`;
  const valueLabelId = `${id}-value-label`;
  let dataTestId: string | undefined;
  if (typeof props['data-testid'] === 'string') dataTestId = props['data-testid'];
  else if (typeof props.dataTestId === 'string') dataTestId = props.dataTestId;
  const describedBy = new Set(
    text(props, 'aria-describedby')
      .split(/\s+/)
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
  if (hasDescription) describedBy.add(descriptionId);
  if (hasError) describedBy.add(errorId);
  const explicitLabel = text(props, 'aria-label') || text(props, 'ariaLabel');
  const externalLabelledBy = text(props, 'aria-labelledby');
  const labelledBy = externalLabelledBy || (hasLabel && !explicitLabel ? labelId : undefined);
  const accessibleValueText = getRatingDescription(committedValue, max, {
    emptyLabel: `${emptyLabel} z ${max}`,
    getLabel,
    labels,
    locale,
  });
  const displayedValueText = getRatingDescription(displayedValue, max, {
    emptyLabel,
    getLabel,
    labels,
    locale,
  });
  const renderIcon =
    typeof props.renderIcon === 'function'
      ? (props.renderIcon as (state: {
          fill: 0 | 50 | 100;
          index: number;
          value: RatingValue;
        }) => ReactNode)
      : undefined;
  const renderValueLabel =
    typeof props.renderValueLabel === 'function'
      ? (props.renderValueLabel as (state: { text: string; value: RatingValue }) => ReactNode)
      : undefined;

  const updateModel = (next: RatingValue): void => {
    if (!controlled) setInternalValue(next);
    call(props, 'onValueChange', next);
  };

  const updatePreview = (next: RatingValue): void => {
    if (previewValue === next) return;
    setPreviewValue(next);
    call(props, 'onPreviewChange', next);
  };

  const clearRating = (event: unknown): void => {
    if (!allowClear || disabled || readonly) return;
    updateModel(null);
    updatePreview(null);
    call(props, 'onClear', event);
    call(props, 'onChange', null, event);
  };

  const commitRating = (nextValue: number, event: unknown): void => {
    if (disabled || readonly) return;
    const normalized = normalizeRatingValue(nextValue, max, step);
    if (allowClear && normalized !== null && normalized === committedValue) {
      clearRating(event);
      return;
    }
    if (normalized === null || normalized === committedValue) return;
    updateModel(normalized);
    call(props, 'onChange', normalized, event);
  };

  const pointerValue = (index: number, event: ReactPointerEvent<HTMLElement>): number => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 1;
    return getRatingPointerValue(
      index,
      ratio,
      max,
      step,
      getComputedStyle(event.currentTarget).direction === 'rtl',
    );
  };

  const keyboardAction = (
    action: RatingKeyboardAction,
    event: ReactKeyboardEvent<HTMLInputElement>,
  ): void => {
    event.preventDefault();
    if (action === 'clear') {
      clearRating(event);
      return;
    }
    const next = getRatingKeyboardValue(committedValue, action, { allowClear, max, step });
    if (next !== null) commitRating(next, event);
  };

  const handleKeydown = (event: ReactKeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') keyboardAction('increment', event);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      keyboardAction('decrement', event);
    } else if (event.key === 'Home') keyboardAction('minimum', event);
    else if (event.key === 'End') keyboardAction('maximum', event);
    else if (event.key === 'Delete' || event.key === 'Backspace') keyboardAction('clear', event);
    call(props, 'onKeyDown', event);
  };

  const label = hasLabel ? (
    <label className="peaui-form-label" htmlFor={id} id={formLabelId}>
      <span className="peaui-form-label__content">
        <span
          className={cx('peaui-form-label__text', readonly && 'peaui-form-label__text--readonly')}
        >
          <span id={labelId}>{labelContent}</span>
        </span>
        {!readonly && !required ? (
          <span className="peaui-form-label__optional">(pole niewymagane)</span>
        ) : null}
      </span>
    </label>
  ) : null;

  return (
    <div
      className={cx(
        'peaui-form-rating-input',
        `peaui-form-rating-input--size-${size}`,
        committedValue === null && 'peaui-form-rating-input--empty',
        previewValue !== null && 'peaui-form-rating-input--preview',
        disabled && 'peaui-form-rating-input--disabled',
        readonly && 'peaui-form-rating-input--readonly',
        hasError && 'peaui-form-rating-input--invalid',
        props.className,
      )}
      data-disabled={disabled || undefined}
      data-invalid={hasError || undefined}
      data-preview-value={previewValue ?? undefined}
      data-readonly={readonly || undefined}
      data-testid={dataTestId}
      data-value={committedValue ?? undefined}
      style={props.style}
    >
      {label}
      <div className="peaui-form-rating-input__control-row">
        <div
          className="peaui-form-rating-input__control"
          onPointerLeave={() => updatePreview(null)}
        >
          {!readonly ? (
            <input
              aria-describedby={describedBy.size ? [...describedBy].join(' ') : undefined}
              aria-invalid={hasError || undefined}
              aria-label={labelledBy ? undefined : explicitLabel || text(props, 'name') || 'Ocena'}
              aria-labelledby={labelledBy}
              aria-required={required || undefined}
              aria-valuemax={max}
              aria-valuemin={0}
              aria-valuenow={committedValue ?? 0}
              aria-valuetext={accessibleValueText}
              className="peaui-form-rating-input__input"
              data-testid={dataTestId ? `${dataTestId}-element` : undefined}
              disabled={disabled}
              id={id}
              max={max}
              min={0}
              ref={(element) => {
                inputRef.current = element;
                assignRef(forwardedRef as ForwardedRef<HTMLInputElement>, element);
              }}
              step={step}
              form={text(props, 'form') || undefined}
              type="range"
              value={committedValue ?? 0}
              onBlur={(event) => call(props, 'onBlur', event)}
              onChange={(event) => commitRating(Number(event.currentTarget.value), event)}
              onFocus={(event) => call(props, 'onFocus', event)}
              onKeyDown={handleKeydown}
            />
          ) : (
            <meter
              aria-describedby={describedBy.size ? [...describedBy].join(' ') : undefined}
              aria-label={labelledBy ? undefined : explicitLabel || text(props, 'name') || 'Ocena'}
              aria-labelledby={labelledBy}
              aria-valuetext={accessibleValueText}
              className="peaui-form-rating-input__meter"
              data-testid={dataTestId ? `${dataTestId}-element` : undefined}
              id={id}
              max={max}
              min={0}
              ref={forwardedRef as ForwardedRef<HTMLMeterElement>}
              value={committedValue ?? 0}
            >
              {accessibleValueText}
            </meter>
          )}
          <span aria-hidden="true" className="peaui-form-rating-input__items">
            {Array.from({ length: max }, (_, index) => {
              const fill = getRatingItemFill(displayedValue, index);
              const iconNode = () =>
                renderIcon?.({ fill, index, value: displayedValue }) ?? <RatingIcon name={icon} />;
              return (
                <span
                  className="peaui-form-rating-input__item"
                  data-rating-value={index + 1}
                  key={index}
                  onPointerDown={(event) => {
                    if (disabled || readonly) return;
                    event.preventDefault();
                    inputRef.current?.focus();
                    commitRating(pointerValue(index, event), event);
                  }}
                  onPointerMove={(event) => {
                    if (disabled || readonly || event.pointerType === 'touch') return;
                    updatePreview(pointerValue(index, event));
                  }}
                >
                  <span className="peaui-form-rating-input__icon-frame">
                    <span className="peaui-form-rating-input__icon peaui-form-rating-input__icon--base">
                      {iconNode()}
                    </span>
                    <span
                      className="peaui-form-rating-input__icon peaui-form-rating-input__icon--fill"
                      style={{ '--peaui-rating-item-fill': `${fill}%` } as CSSProperties}
                    >
                      {iconNode()}
                    </span>
                  </span>
                </span>
              );
            })}
          </span>
        </div>
        {showValueLabel ? (
          <output
            aria-hidden="true"
            className="peaui-form-rating-input__value-label"
            htmlFor={id}
            id={valueLabelId}
            title={displayedValueText}
          >
            {renderValueLabel?.({ text: displayedValueText, value: displayedValue }) ??
              displayedValueText}
          </output>
        ) : null}
      </div>
      <input
        {...getRequiredValueAttributes(
          committedValue !== null,
          required,
          disabled,
          readonly,
          text(props, 'form') || undefined,
        )}
        onChange={() => undefined}
        onInvalid={(event) => focusInvalidValue(event.nativeEvent, inputRef.current)}
      />
      {text(props, 'name') && committedValue !== null && !disabled ? (
        <input
          form={text(props, 'form') || undefined}
          name={text(props, 'name')}
          type="hidden"
          value={committedValue}
        />
      ) : null}
      {hasDescription ? (
        <div
          className="peaui-message-text peaui-message-text--size-xs peaui-message-text--variant-default"
          id={descriptionId}
        >
          <p className="peaui-message-text__content">{descriptionContent}</p>
        </div>
      ) : null}
      {hasError ? (
        <div
          aria-live="polite"
          className="peaui-message-text peaui-message-text--size-xs peaui-message-text--variant-error"
          id={errorId}
        >
          <p className="peaui-message-text__content">{errorContent}</p>
        </div>
      ) : null}
    </div>
  );
}
