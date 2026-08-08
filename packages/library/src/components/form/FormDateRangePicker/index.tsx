import type { ReactElement, ReactNode, RefAttributes } from 'react';

import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { FormDateRangePickerRenderer } from '@/react/form-date-range-picker.renderer';
import type { PeauiReactProps } from '@/react/generated-react-props';
import type {
  DateRangeFormatter,
  DateRangeParser,
  DateRangePreset,
  DateRangeCalendarDay,
  DateRangeValue,
  FormDateRangePickerInvalidDetail,
} from './date-range-picker.shared';

type GeneratedFormDateRangePickerProps = PeauiReactProps<'FormDateRangePicker'>;

export type FormDateRangePickerProps = Omit<
  GeneratedFormDateRangePickerProps,
  | 'defaultValue'
  | 'description'
  | 'error'
  | 'format'
  | 'isDateDisabled'
  | 'onApply'
  | 'onChange'
  | 'onInvalid'
  | 'onValueChange'
  | 'parse'
  | 'presets'
  | 'value'
> & {
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  presets?: DateRangePreset[];
  description?: ReactNode;
  error?: ReactNode;
  format?: DateRangeFormatter;
  parse?: DateRangeParser;
  isDateDisabled?: (date: string) => boolean;
  onValueChange?: (value: DateRangeValue | undefined) => void;
  onChange?: (value: DateRangeValue | undefined) => void;
  onApply?: (value: [string, string]) => void;
  onInvalid?: (detail: FormDateRangePickerInvalidDetail) => void;
  onStartChange?: (value: string | undefined) => void;
  onEndChange?: (value: string | undefined) => void;
  renderTrigger?: (state: { displayValue: string; open: boolean; toggle: () => void }) => ReactNode;
  renderDay?: (state: { day: DateRangeCalendarDay; select: () => void }) => ReactNode;
  renderPreset?: (state: { preset: DateRangePreset; select: () => void }) => ReactNode;
  footerContent?: ReactNode;
  startLabelContent?: ReactNode;
  endLabelContent?: ReactNode;
  descriptionContent?: ReactNode;
  errorContent?: ReactNode;
};

export type {
  DateRangeCalendarDay,
  DateRangeFormatContext,
  DateRangeFormatter,
  DateRangeParser,
  DateRangePreset,
  DateRangeValue,
  FormDateRangePickerCalendars,
  FormDateRangePickerDateFormat,
  FormDateRangePickerInvalidDetail,
  FormDateRangePickerInvalidReason,
  FormDateRangePickerPlacement,
  FormDateRangePickerSection,
  FormDateRangePickerSelectionOrder,
  FormDateRangePickerVariant,
} from './date-range-picker.shared';

const FormDateRangePickerBase = createDirectReactComponent(
  'FormDateRangePicker',
  FormDateRangePickerRenderer,
);
const FormDateRangePicker = FormDateRangePickerBase as unknown as (
  props: FormDateRangePickerProps & RefAttributes<HTMLElement>,
) => ReactElement | null;

export default FormDateRangePicker;
