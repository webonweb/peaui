import type {
  FocusEvent,
  KeyboardEvent,
  PointerEvent,
  ReactElement,
  ReactNode,
  RefAttributes,
} from 'react';

import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { FormRatingInputRenderer } from '@/react/form-rating-input.renderer';
import type { PeauiReactProps } from '@/react/generated-react-props';
import type { RatingLabelGetter, RatingLabels, RatingValue } from './rating-input.shared';

type GeneratedFormRatingInputProps = PeauiReactProps<'FormRatingInput'>;

export type FormRatingInputProps = Omit<
  GeneratedFormRatingInputProps,
  | 'defaultValue'
  | 'description'
  | 'error'
  | 'getLabel'
  | 'labels'
  | 'onBlur'
  | 'onChange'
  | 'onClear'
  | 'onFocus'
  | 'onPreviewChange'
  | 'onValueChange'
  | 'value'
> & {
  value?: RatingValue;
  defaultValue?: RatingValue;
  labels?: RatingLabels;
  getLabel?: RatingLabelGetter;
  description?: ReactNode;
  error?: ReactNode;
  onValueChange?: (value: RatingValue) => void;
  onChange?: (
    value: RatingValue,
    event: PointerEvent<HTMLElement> | KeyboardEvent<HTMLInputElement> | Event,
  ) => void;
  onPreviewChange?: (value: RatingValue) => void;
  onClear?: (event: KeyboardEvent<HTMLInputElement> | PointerEvent<HTMLElement> | Event) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  renderIcon?: (state: { fill: 0 | 50 | 100; index: number; value: RatingValue }) => ReactNode;
  labelContent?: ReactNode;
  descriptionContent?: ReactNode;
  errorContent?: ReactNode;
  renderValueLabel?: (state: { text: string; value: RatingValue }) => ReactNode;
};

export type {
  FormRatingInputSize,
  FormRatingInputStep,
  RatingLabelGetter,
  RatingLabels,
  RatingValue,
} from './rating-input.shared';

const FormRatingInputBase = createDirectReactComponent('FormRatingInput', FormRatingInputRenderer);
const FormRatingInput = FormRatingInputBase as unknown as (
  props: FormRatingInputProps & RefAttributes<HTMLInputElement | HTMLMeterElement>,
) => ReactElement | null;

export default FormRatingInput;
