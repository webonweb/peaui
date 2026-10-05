import type { ChangeEvent, FocusEvent, ReactElement, RefAttributes } from 'react';

import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { FormSwitchToggleRenderer } from '@/react/renderer-entries/form-switch-toggle.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

type GeneratedFormSwitchToggleProps = PeauiReactProps<'FormSwitchToggle'>;

export type FormSwitchToggleProps<Value = boolean> = Omit<
  GeneratedFormSwitchToggleProps,
  | 'defaultValue'
  | 'falseValue'
  | 'onBlur'
  | 'onChange'
  | 'onFocus'
  | 'onValueChange'
  | 'trueValue'
  | 'value'
> & {
  value?: Value;
  defaultValue?: Value;
  trueValue?: Value;
  falseValue?: Value;
  onValueChange?: (value: Value) => void;
  onChange?: (value: Value, event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
};

const FormSwitchToggleBase = createDirectReactComponent(
  'FormSwitchToggle',
  FormSwitchToggleRenderer,
);

const FormSwitchToggle = FormSwitchToggleBase as unknown as <Value = boolean>(
  props: FormSwitchToggleProps<Value> & RefAttributes<HTMLInputElement>,
) => ReactElement | null;

export default FormSwitchToggle;
