import type { ChangeEvent, FocusEvent, ReactElement, RefAttributes } from 'react';

import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
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

const FormSwitchToggleBase = createPeauiReactComponent('FormSwitchToggle');

const FormSwitchToggle = FormSwitchToggleBase as unknown as <Value = boolean>(
  props: FormSwitchToggleProps<Value> & RefAttributes<HTMLInputElement>,
) => ReactElement | null;

export default FormSwitchToggle;
