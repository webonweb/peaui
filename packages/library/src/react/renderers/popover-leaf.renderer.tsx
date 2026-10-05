/** @jsxImportSource react */
import { type RuntimeProps, text } from './runtime.shared';
import { type ForwardedRef, type ReactElement } from 'react';
import { Popover } from './popover';
export function PopoverLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  return <Popover props={props} kind={text(props, '__name')} forwardedRef={forwardedRef} />;
}
