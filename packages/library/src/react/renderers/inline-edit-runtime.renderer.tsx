/** @jsxImportSource react */

import { type RuntimeProps } from './runtime.shared';
import { type ForwardedRef, type ReactElement } from 'react';
import { InlineEditRenderer } from '.././inline-edit.renderer';
import { ButtonActionRenderer } from './button-action.renderer';
import { TextFieldLeafRenderer } from './text-input.renderer';
import { FormTextareaRenderer } from './form-textarea.renderer';
import { SelectRenderer } from './select.renderer';

export function InlineEditRuntimeRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  return (
    <InlineEditRenderer
      {...props}
      __renderButton={(buttonProps, children) => (
        <ButtonActionRenderer {...buttonProps}>{children}</ButtonActionRenderer>
      )}
      __renderField={(name, fieldProps) => {
        if (name === 'FormSelect') return <SelectRenderer {...fieldProps} __name={name} />;
        if (name === 'FormTextarea') return <FormTextareaRenderer {...fieldProps} />;
        return <TextFieldLeafRenderer {...fieldProps} __name={name} />;
      }}
      forwardedRef={forwardedRef}
    />
  );
}
