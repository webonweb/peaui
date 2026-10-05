/** @jsxImportSource react */

import { type RuntimeProps, text } from './runtime.shared';
import { type ForwardedRef, type ReactElement } from 'react';
import { Dialog } from './dialog';
import { InfoTooltipRenderer } from './info-tooltip.renderer';
import { Popover } from './popover';

export function OverlayRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');
  if (kind === 'ModalDialog' || kind === 'DrawerPanel')
    return <Dialog props={props} kind={kind} forwardedRef={forwardedRef} />;
  if (kind === 'InfoTooltip') return <InfoTooltipRenderer {...props} forwardedRef={forwardedRef} />;
  return <Popover props={props} kind={kind} forwardedRef={forwardedRef} />;
}
