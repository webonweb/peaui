/** @jsxImportSource react */
/* eslint-disable no-nested-ternary */
import {
  type RuntimeProps,
  text,
  useModel,
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
  type KeyboardEventHandler,
  type FocusEventHandler,
  type PointerEventHandler,
} from 'react';
import { Svg } from './svg.renderer';

export function ToggleButtonRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedId = useId();
  const id = text(props, 'id') || `peaui-toggle-button-${generatedId}`;
  const [pressed, setPressed] = useModel<boolean>(props, 'value', false);
  const disabled = bool(props, 'disabled');
  const loading = bool(props, 'loading');
  const readonly = bool(props, 'readonly');
  const nativelyDisabled = disabled || loading;
  const blocked = nativelyDisabled || readonly;
  const content = text(props, 'content', 'icon-text');
  const label = text(props, 'label', 'Przełącz');
  const pressedLabel = text(props, 'pressedLabel');
  const visibleLabel = pressed && pressedLabel ? pressedLabel : label;
  const icon = text(props, 'icon');
  const pressedIcon = text(props, 'pressedIcon');
  const resolvedIcon = pressed && pressedIcon ? pressedIcon : icon;
  const iconContent = pressed
    ? (node(props, 'pressedIconContent') ?? node(props, 'iconContent'))
    : node(props, 'iconContent');
  const showsText = content !== 'icon';
  const showsIcon = content !== 'text';
  const externalAriaLabel = text(props, 'aria-label');
  const externalAriaLabelledBy = text(props, 'aria-labelledby');
  const canUseVisibleChildrenName =
    content !== 'icon' && !pressedLabel && !label && hasVisibleReactText(props.children);
  const loadingId = `${id}-loading`;
  const describedBy = new Set(
    text(props, 'aria-describedby')
      .split(/\s+/)
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
  if (loading) describedBy.add(loadingId);
  const dataTestId = dataTest(props);

  return (
    <button
      aria-busy={loading || undefined}
      aria-describedby={describedBy.size > 0 ? [...describedBy].join(' ') : undefined}
      aria-disabled={blocked || undefined}
      aria-label={
        externalAriaLabelledBy
          ? undefined
          : externalAriaLabel ||
            text(props, 'ariaLabel') ||
            label ||
            (canUseVisibleChildrenName ? undefined : 'Przełącznik')
      }
      aria-labelledby={externalAriaLabelledBy || undefined}
      aria-pressed={pressed}
      className={cx(
        'peaui-toggle-button',
        `peaui-toggle-button--content-${content}`,
        `peaui-toggle-button--size-${text(props, 'size', 'm')}`,
        `peaui-toggle-button--variant-${text(props, 'variant', 'default')}`,
        pressed && 'peaui-toggle-button--pressed',
        bool(props, 'allowWrap') && 'peaui-toggle-button--wrap',
        disabled && 'peaui-toggle-button--disabled',
        readonly && 'peaui-toggle-button--readonly',
        loading && 'peaui-toggle-button--loading',
        props.className,
      )}
      data-disabled={disabled || undefined}
      data-loading={loading || undefined}
      data-pressed={pressed}
      data-readonly={readonly || undefined}
      data-testid={dataTestId}
      disabled={nativelyDisabled}
      id={id}
      ref={forwardedRef as ForwardedRef<HTMLButtonElement>}
      style={props.style}
      tabIndex={typeof props.tabIndex === 'number' ? props.tabIndex : undefined}
      type={text(props, 'type', 'button') as 'button' | 'submit' | 'reset'}
      onClick={(event) => {
        if (blocked) {
          event.preventDefault();
          return;
        }

        const nextValue = !pressed;
        setPressed(nextValue);
        callback(props, 'onChange')?.(nextValue, event);
        callback(props, 'onClick')?.(event);
      }}
      onKeyDown={
        typeof props.onKeyDown === 'function'
          ? (props.onKeyDown as KeyboardEventHandler<HTMLButtonElement>)
          : undefined
      }
      onFocus={
        typeof props.onFocus === 'function'
          ? (props.onFocus as FocusEventHandler<HTMLButtonElement>)
          : undefined
      }
      onBlur={
        typeof props.onBlur === 'function'
          ? (props.onBlur as FocusEventHandler<HTMLButtonElement>)
          : undefined
      }
      onPointerDown={
        typeof props.onPointerDown === 'function'
          ? (props.onPointerDown as PointerEventHandler<HTMLButtonElement>)
          : undefined
      }
    >
      {loading ? (
        <span aria-hidden="true" className="peaui-toggle-button__spinner" />
      ) : showsIcon ? (
        <span aria-hidden="true" className="peaui-toggle-button__icon">
          {iconContent ?? (resolvedIcon ? <Svg name={resolvedIcon} /> : null)}
        </span>
      ) : null}
      {showsText ? (
        <span className="peaui-toggle-button__label">{props.children ?? visibleLabel}</span>
      ) : null}
      {loading ? (
        <span
          aria-atomic="true"
          aria-live="polite"
          className="peaui-toggle-button__loading-status"
          id={loadingId}
          role="status"
        >
          {text(props, 'loadingLabel', 'Trwa aktualizowanie ustawienia')}
        </span>
      ) : null}
    </button>
  );
}
