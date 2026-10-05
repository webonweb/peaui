/** @jsxImportSource react */
import type { ForwardedRef, ReactElement } from 'react';
import { type RuntimeProps, bool, callback, common, cx, text } from './runtime.shared';

export function ButtonActionRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const root = 'peaui-button-action';
  const disabled = bool(props, 'disabled');
  return (
    <button
      {...common(props)}
      className={cx(
        root,
        `${root}--size-${text(props, 'size', 'm')}`,
        `${root}--variant-${text(props, 'variant', 'primary')}`,
        disabled && `${root}--is-disabled`,
        props.className,
      )}
      disabled={disabled}
      ref={forwardedRef as ForwardedRef<HTMLButtonElement>}
      type={text(props, 'type', 'button') as 'button' | 'submit' | 'reset'}
      onClick={(event) => callback(props, 'onClick')?.(event)}
    >
      {props.children ?? 'Akcja'}
    </button>
  );
}
