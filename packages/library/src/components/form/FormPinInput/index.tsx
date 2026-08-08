import type { FocusEvent, ReactElement, ReactNode, RefAttributes } from 'react';

import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { FormPinInputRenderer } from '@/react/form-pin-input.renderer';
import type { PeauiReactProps } from '@/react/generated-react-props';
import type { FormPinInputInvalidDetail, FormPinInputTransform } from './pin-input.shared';

type GeneratedFormPinInputProps = PeauiReactProps<'FormPinInput'>;

export type FormPinInputProps = Omit<
  GeneratedFormPinInputProps,
  | 'defaultValue'
  | 'description'
  | 'error'
  | 'onBlur'
  | 'onChange'
  | 'onComplete'
  | 'onFocus'
  | 'onInvalidInput'
  | 'onValueChange'
  | 'transform'
  | 'value'
> & {
  value?: string;
  defaultValue?: string;
  description?: ReactNode;
  error?: ReactNode;
  transform?: FormPinInputTransform;
  onValueChange?: (value: string) => void;
  onChange?: (value: string, event: Event) => void;
  onComplete?: (value: string, event: Event) => void;
  onInvalidInput?: (detail: FormPinInputInvalidDetail, event: Event) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>, index: number) => void;
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
  renderSeparator?: (state: { index: number }) => ReactNode;
  labelContent?: ReactNode;
  hintContent?: ReactNode;
  descriptionContent?: ReactNode;
  errorContent?: ReactNode;
};

export type {
  FormPinInputApplication,
  FormPinInputInputMode,
  FormPinInputInvalidDetail,
  FormPinInputInvalidReason,
  FormPinInputOptions,
  FormPinInputSize,
  FormPinInputTransform,
  FormPinInputTransformMode,
  FormPinInputType,
} from './pin-input.shared';

const FormPinInputBase = createDirectReactComponent('FormPinInput', FormPinInputRenderer);
const FormPinInput = FormPinInputBase as unknown as (
  props: FormPinInputProps & RefAttributes<HTMLInputElement>,
) => ReactElement | null;

export default FormPinInput;
