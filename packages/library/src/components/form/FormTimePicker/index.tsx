import type { ReactElement, ReactNode, RefAttributes } from 'react';

import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { FormTimePickerRenderer } from '@/react/form-time-picker.renderer';
import type { PeauiReactProps } from '@/react/generated-react-props';
import type {
  TimePickerFormatter,
  TimePickerInvalidDetail,
  TimePickerOption,
  TimePickerParser,
  TimePickerParts,
} from './time-picker.shared';

type GeneratedFormTimePickerProps = PeauiReactProps<'FormTimePicker'>;

export type FormTimePickerProps = Omit<
  GeneratedFormTimePickerProps,
  'description' | 'error' | 'formatValue' | 'onChange' | 'onInvalid' | 'parse'
> & {
  description?: ReactNode;
  error?: ReactNode;
  parse?: TimePickerParser;
  formatValue?: TimePickerFormatter;
  onChange?: (value: string | undefined, parts: TimePickerParts | undefined) => void;
  onInvalid?: (detail: TimePickerInvalidDetail) => void;
  renderTrigger?: (state: { displayValue: string; open: boolean; toggle: () => void }) => ReactNode;
  renderHourOption?: (option: TimePickerOption, selected: boolean) => ReactNode;
  renderMinuteOption?: (option: TimePickerOption, selected: boolean) => ReactNode;
  renderSecondOption?: (option: TimePickerOption, selected: boolean) => ReactNode;
  renderPeriodOption?: (option: TimePickerOption, selected: boolean) => ReactNode;
  footerContent?: ReactNode;
  errorContent?: ReactNode;
  descriptionContent?: ReactNode;
};

export type {
  FormTimePickerFormat,
  FormTimePickerPanelMode,
  FormTimePickerPlacement,
  FormTimePickerVariant,
  TimePickerFormatContext,
  TimePickerFormatter,
  TimePickerInvalidDetail,
  TimePickerInvalidReason,
  TimePickerOption,
  TimePickerParser,
  TimePickerParts,
  TimePickerPeriod,
  TimePickerSegment,
} from './time-picker.shared';

const FormTimePickerBase = createDirectReactComponent('FormTimePicker', FormTimePickerRenderer);
const FormTimePicker = FormTimePickerBase as unknown as (
  props: FormTimePickerProps & RefAttributes<HTMLElement>,
) => ReactElement | null;

export default FormTimePicker;
