/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-base-to-string, no-nested-ternary */
import { type RuntimeProps, text, useFormControlModel, bool, cx, common } from './runtime.shared';
import { type ForwardedRef, type ReactElement, useId, useRef } from 'react';

export function ChoiceControlsRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useFormControlModel<unknown>(
    props,
    'value',
    kind === 'FormButtonCheckbox' || kind === 'FormCheckbox' ? false : undefined,
    inputRef,
  );
  const generatedId = useId();
  const id = text(props, 'id') || generatedId;
  const rootAttributes = common({
    ...props,
    id: undefined,
    'aria-label': undefined,
    'aria-labelledby': undefined,
    ariaLabel: undefined,
  });
  const choiceAria = {
    'aria-label':
      text(props, 'aria-label') ||
      text(props, 'ariaLabel') ||
      (!props.children && !text(props, 'aria-labelledby') ? text(props, 'name') : undefined),
    'aria-labelledby': text(props, 'aria-labelledby') || undefined,
    'aria-describedby': text(props, 'aria-describedby') || undefined,
    'aria-invalid': props.isValid === false || text(props, 'aria-invalid') === 'true',
    'aria-required': bool(props, 'required') || undefined,
  };
  const radio = kind === 'FormRadio';
  const optionValue = props.optionValue;
  const checked = radio ? Object.is(value, optionValue) : value === true;
  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key !== 'Enter' || bool(props, 'disabled')) return;
    event.preventDefault();
    event.stopPropagation();
    setValue(radio ? optionValue : !checked);
  };
  const root =
    kind === 'FormButtonCheckbox'
      ? 'peaui-form-button-checkbox'
      : radio
        ? 'peaui-form-field-radio'
        : 'peaui-form-field-checkbox';
  const invalid = props.isValid === false;
  if (kind === 'FormButtonCheckbox') {
    const size = text(props, 'size', 'm');
    return (
      <div
        {...rootAttributes}
        className={cx(
          root,
          `${root}--size-${size}`,
          checked && `${root}--checked`,
          bool(props, 'disabled') && `${root}--disabled`,
          invalid && `${root}--invalid`,
          props.className,
        )}
        ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      >
        <input
          ref={inputRef}
          form={text(props, 'form') || undefined}
          {...choiceAria}
          required={bool(props, 'required')}
          checked={checked}
          className={`${root}__element`}
          disabled={bool(props, 'disabled')}
          id={id}
          name={text(props, 'name')}
          type="checkbox"
          onKeyDown={handleEnter}
          onChange={(event) => setValue(event.target.checked)}
        />
        <label
          className={cx(
            `${root}__label`,
            checked && `${root}__label--checked`,
            bool(props, 'disabled') && `${root}__label--disabled`,
            invalid && `${root}__label--invalid`,
          )}
          htmlFor={id}
        >
          <span
            aria-hidden="true"
            className={cx(
              `${root}__marker`,
              checked && `${root}__marker--checked`,
              bool(props, 'disabled') && `${root}__marker--disabled`,
              invalid && `${root}__marker--invalid`,
            )}
          />
          {props.children ? (
            <span className={cx(`${root}__text`, checked && `${root}__text--checked`)}>
              {props.children}
            </span>
          ) : null}
        </label>
      </div>
    );
  }
  return (
    <div
      {...rootAttributes}
      className={cx(
        root,
        props.children ? `${root}--with-slot` : `${root}--without-slot`,
        props.className,
      )}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
    >
      <input
        ref={inputRef}
        form={text(props, 'form') || undefined}
        {...choiceAria}
        className={cx(
          `${root}__element`,
          checked && `${root}__element--checked`,
          bool(props, 'disabled') && `${root}__element--disabled`,
          invalid && `${root}__element--${radio ? 'invalid' : 'in-valid'}`,
        )}
        checked={checked}
        disabled={bool(props, 'disabled')}
        id={id}
        name={text(props, 'name')}
        required={bool(props, 'required')}
        type={radio ? 'radio' : 'checkbox'}
        value={radio ? String(optionValue ?? '') : undefined}
        onKeyDown={handleEnter}
        onChange={(event) => setValue(radio ? optionValue : event.target.checked)}
      />
      {props.children ? (
        <label
          className={cx(
            `${root}__label`,
            checked && `${root}__label--checked`,
            !checked && `${root}__label--normal`,
            !radio && checked && `${root}__label--medium`,
            bool(props, 'disabled') && `${root}__label--disabled`,
            invalid && `${root}__label--${radio ? 'invalid' : 'in-valid'}`,
          )}
          htmlFor={id}
        >
          {props.children}
        </label>
      ) : null}
    </div>
  );
}
