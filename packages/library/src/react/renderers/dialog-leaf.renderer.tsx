/** @jsxImportSource react */
import { type RuntimeProps, text } from './runtime.shared';
import { type ForwardedRef, type ReactElement } from 'react';
import { Dialog } from './dialog';
export function DialogLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  return <Dialog props={props} kind={text(props, '__name')} forwardedRef={forwardedRef} />;
}
