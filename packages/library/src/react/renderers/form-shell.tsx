/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type RuntimeProps, text, num, node, cx, bool, dataTest } from './runtime.shared';
import { iconCheckCircle, iconHint } from '../generated-static-icons';
import { type ReactNode, type ReactElement, type ForwardedRef, useId } from 'react';
import { Svg } from './svg.renderer';
import { InfoTooltipRenderer } from './info-tooltip.renderer';

/** Attributes must describe the same message that FormShell actually renders. */
export function getFormFieldAria(props: RuntimeProps, id: string) {
  const hasError = Boolean(node(props, 'error'));
  const hasSuccess = Boolean(node(props, 'success'));
  let messageId: string | undefined;
  if (hasError && !hasSuccess) messageId = `${id}-error`;
  else if (hasSuccess && !hasError) messageId = `${id}-success`;
  else if (!hasError && !hasSuccess) {
    if (num(props, 'maxLength')) messageId = `${id}-help-max-length-description`;
    else if (node(props, 'description')) messageId = `${id}-description`;
  }
  const labelledBy = text(props, 'aria-labelledby') || undefined;
  const describedBy =
    [
      ...new Set(
        `${text(props, 'aria-describedby')} ${messageId ?? ''}`.split(/\s+/).filter(Boolean),
      ),
    ].join(' ') || undefined;
  return {
    'aria-label':
      text(props, 'aria-label') ||
      text(props, 'ariaLabel') ||
      (!labelledBy ? text(props, 'label') || text(props, 'name') : undefined) ||
      undefined,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    'aria-invalid':
      hasError || props['aria-invalid'] === true || text(props, 'aria-invalid') === 'true',
    'aria-required': bool(props, 'required') || undefined,
  };
}

export function FormShell({
  props,
  children,
  shellClass,
  forwardedRef,
}: {
  props: RuntimeProps;
  children: ReactNode;
  shellClass?: string;
  forwardedRef?: ForwardedRef<HTMLElement>;
}): ReactElement {
  const generatedId = useId();
  const id = text(props, 'id') || generatedId;
  const label = text(props, 'label');
  const className = 'peaui-form-field';
  const maxLength = num(props, 'maxLength');
  const valueLength = typeof props.value === 'string' ? props.value.length : 0;
  const hasError = Boolean(node(props, 'error'));
  const hasSuccess = Boolean(node(props, 'success'));
  return (
    <div
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      className={cx(
        className,
        shellClass,
        bool(props, 'disabled') && `${className}--disabled`,
        props.className,
      )}
      data-testid={dataTest(props)}
      style={props.style}
    >
      {label ? (
        <label className="peaui-form-label" htmlFor={id} id={`label-${id}`}>
          <span className="peaui-form-label__content">
            <span className="peaui-form-label__text">{label}</span>
            {!bool(props, 'required') ? (
              <span className="peaui-form-label__optional">(pole niewymagane)</span>
            ) : null}
          </span>
          {node(props, 'hint') ? (
            <InfoTooltipRenderer description={node(props, 'hint')} placement="right">
              <Svg data={iconHint} className="peaui-form-label__hint-icon" name="hint" />
            </InfoTooltipRenderer>
          ) : null}
        </label>
      ) : null}
      <div className={`${className}__content`}>
        {text(props, 'iconBefore') ? (
          <Svg
            className={`${className}__icon ${className}__icon--before`}
            name={text(props, 'iconBefore')}
          />
        ) : null}
        {children}
        {text(props, 'iconAfter') ? (
          <Svg
            className={`${className}__icon ${className}__icon--after`}
            name={text(props, 'iconAfter')}
          />
        ) : null}
        {text(props, 'before') ? (
          <span
            className={`${className}__additional ${className}__additional--before`}
            data-before={text(props, 'before')}
          />
        ) : null}
        {text(props, 'after') ? (
          <span
            className={`${className}__additional ${className}__additional--after`}
            data-after={text(props, 'after')}
          />
        ) : null}
      </div>
      {node(props, 'description') && !hasError && !hasSuccess && !maxLength ? (
        <div
          className={`${className}__message peaui-message-text peaui-message-text--variant-default peaui-message-text--size-xs`}
          id={`${id}-description`}
        >
          <p className="peaui-message-text__content">{node(props, 'description')}</p>
        </div>
      ) : null}
      {!hasError && !hasSuccess && maxLength ? (
        <div
          className={cx(
            `${className}__message`,
            'peaui-message-text',
            `peaui-message-text--variant-${maxLength === valueLength ? 'info' : 'default'}`,
            'peaui-message-text--size-xs',
          )}
          id={`${id}-help-max-length-description`}
        >
          <p className="peaui-message-text__content">
            Długość tekstu: {valueLength} / {maxLength} znaków
          </p>
        </div>
      ) : null}
      {hasError && !hasSuccess ? (
        <div
          className={`${className}__message peaui-message-text peaui-message-text--variant-error peaui-message-text--size-xs`}
          id={`${id}-error`}
          role="alert"
        >
          <Svg data={iconHint} className="peaui-message-text__icon" name="hint" />
          <p className="peaui-message-text__content">{node(props, 'error')}</p>
        </div>
      ) : null}
      {hasSuccess && !hasError ? (
        <div
          className={`${className}__message peaui-message-text peaui-message-text--variant-success peaui-message-text--size-xs`}
          id={`${id}-success`}
        >
          <Svg data={iconCheckCircle} className="peaui-message-text__icon" name="checkCircle" />
          <p className="peaui-message-text__content">{node(props, 'success')}</p>
        </div>
      ) : null}
    </div>
  );
}
