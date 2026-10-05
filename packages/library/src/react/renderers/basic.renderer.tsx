/** @jsxImportSource react */

import { type RuntimeProps, text, dataTest, common, cx } from './runtime.shared';
import { type ForwardedRef, type ReactElement } from 'react';
import { Svg } from './svg.renderer';

export function BasicRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  if (kind === 'SvgIcon')
    return (
      <Svg
        ariaHidden={
          typeof props['aria-hidden'] === 'boolean' ||
          props['aria-hidden'] === 'false' ||
          props['aria-hidden'] === 'true'
            ? props['aria-hidden']
            : undefined
        }
        className={props.className}
        dataTestId={dataTest(props)}
        describedBy={text(props, 'aria-describedby') || undefined}
        label={text(props, 'ariaLabel') || text(props, 'aria-label') || undefined}
        labelledBy={text(props, 'aria-labelledby') || undefined}
        name={text(props, 'name', 'info')}
        role={text(props, 'role') || undefined}
        style={props.style}
        tabIndex={typeof props.tabIndex === 'number' ? props.tabIndex : undefined}
      />
    );
  const size = text(props, 'size', 'auto');
  return (
    <span
      {...common(props)}
      className={cx('peaui-image-view', `peaui-image-view--size-${size}`, props.className)}
      ref={forwardedRef}
    >
      <img
        alt={text(props, 'alt')}
        className="peaui-image-view__image"
        src={text(props, 'src')}
        style={{ maxWidth: text(props, 'max') || undefined }}
      />
    </span>
  );
}
