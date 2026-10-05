/** @jsxImportSource react */

import { type RuntimeProps } from './runtime.shared';
import { type ForwardedRef, type ReactElement } from 'react';
import { CopyButtonRenderer } from '.././copy-button.renderer';
import { ButtonActionRenderer } from './button-action.renderer';
import { BasicRenderer } from './basic.renderer';

export function CopyButtonRuntimeRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  return (
    <CopyButtonRenderer
      {...props}
      __renderButton={(buttonProps, children) => (
        <ButtonActionRenderer {...buttonProps}>{children}</ButtonActionRenderer>
      )}
      __renderIcon={(iconProps) => <BasicRenderer {...iconProps} __name="SvgIcon" />}
      forwardedRef={forwardedRef}
    />
  );
}
