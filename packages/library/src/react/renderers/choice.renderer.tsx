/** @jsxImportSource react */
import { type RuntimeProps, text } from './runtime.shared';
import { type ForwardedRef, type ReactElement } from 'react';
import { ButtonGroupRenderer } from './button-group.renderer';
import { ChoiceControlsRenderer } from './choice-controls.renderer';
export function ChoiceRenderer(
  props: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> },
): ReactElement {
  return text(props, '__name') === 'FormButtonGroup' ? (
    <ButtonGroupRenderer {...props} />
  ) : (
    <ChoiceControlsRenderer {...props} />
  );
}
