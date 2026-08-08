import type { ReactElement, ReactNode, RefAttributes } from 'react';

import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { FormDateTimePickerRenderer } from '@/react/form-date-time-picker.renderer';
import type { PeauiReactProps } from '@/react/generated-react-props';
import type {
  FormDateTimePickerInvalidDetail,
  LocalDateTimeValue,
} from './date-time-picker.shared';

type GeneratedFormDateTimePickerProps = PeauiReactProps<'FormDateTimePicker'>;

export type FormDateTimePickerProps = Omit<
  GeneratedFormDateTimePickerProps,
  | 'defaultValue'
  | 'description'
  | 'error'
  | 'isDateTimeDisabled'
  | 'max'
  | 'min'
  | 'onApply'
  | 'onChange'
  | 'onInvalid'
  | 'onValueChange'
  | 'value'
> & {
  value?: LocalDateTimeValue;
  defaultValue?: LocalDateTimeValue;
  min?: LocalDateTimeValue;
  max?: LocalDateTimeValue;
  description?: ReactNode;
  error?: ReactNode;
  isDateTimeDisabled?: (value: LocalDateTimeValue) => boolean;
  onValueChange?: (value: LocalDateTimeValue | undefined) => void;
  onChange?: (value: LocalDateTimeValue | undefined) => void;
  onApply?: (value: LocalDateTimeValue) => void;
  onInvalid?: (detail: FormDateTimePickerInvalidDetail) => void;
  renderTrigger?: (state: { displayValue: string; open: boolean; toggle: () => void }) => ReactNode;
  renderDate?: (state: { date: string | undefined }) => ReactNode;
  renderTime?: (state: { time: string | undefined }) => ReactNode;
  renderTimeZone?: (state: { timeZone: string }) => ReactNode;
  footerContent?: ReactNode;
  descriptionContent?: ReactNode;
  errorContent?: ReactNode;
};

export type {
  FormDateTimePickerDateFormat,
  FormDateTimePickerInvalidDetail,
  FormDateTimePickerInvalidReason,
  FormDateTimePickerLayout,
  FormDateTimePickerPlacement,
  FormDateTimePickerSection,
  FormDateTimePickerVariant,
  LocalDateTimeValue,
} from './date-time-picker.shared';

const FormDateTimePickerBase = createDirectReactComponent(
  'FormDateTimePicker',
  FormDateTimePickerRenderer,
);
const FormDateTimePicker = FormDateTimePickerBase as unknown as (
  props: FormDateTimePickerProps & RefAttributes<HTMLElement>,
) => ReactElement | null;

export default FormDateTimePicker;
