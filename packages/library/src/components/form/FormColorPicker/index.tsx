import type { ReactElement, ReactNode, RefAttributes } from 'react';

import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { FormColorPickerRenderer } from '@/react/form-color-picker.renderer';
import type { PeauiReactProps } from '@/react/generated-react-props';
import type {
  FormColorPickerEyedropperErrorDetail,
  FormColorPickerInvalidDetail,
  FormColorPickerSwatch,
} from './color-picker.shared';

type GeneratedFormColorPickerProps = PeauiReactProps<'FormColorPicker'>;

export type FormColorPickerProps = Omit<
  GeneratedFormColorPickerProps,
  | 'defaultValue'
  | 'description'
  | 'error'
  | 'onChange'
  | 'onClose'
  | 'onCommit'
  | 'onEyedropperError'
  | 'onEyedropperStart'
  | 'onInvalid'
  | 'onOpen'
  | 'onOpenChange'
  | 'onValueChange'
  | 'value'
> & {
  value?: string;
  defaultValue?: string;
  description?: ReactNode;
  error?: ReactNode;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  onChange?: (value: string) => void;
  onCommit?: (value: string) => void;
  onInvalid?: (detail: FormColorPickerInvalidDetail) => void;
  onEyedropperError?: (detail: FormColorPickerEyedropperErrorDetail) => void;
  onEyedropperStart?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  renderTrigger?: (state: { color: string; open: boolean; toggle: () => void }) => ReactNode;
  renderSwatch?: (state: { color: string }) => ReactNode;
  renderSavedColor?: (state: { color: FormColorPickerSwatch; index: number }) => ReactNode;
  renderRecentColor?: (state: { color: FormColorPickerSwatch; index: number }) => ReactNode;
  renderFooter?: (state: { color: string }) => ReactNode;
  footerContent?: ReactNode;
  hintContent?: ReactNode;
  descriptionContent?: ReactNode;
  errorContent?: ReactNode;
};

export type {
  FormColorPickerDensity,
  FormColorPickerEyedropperErrorDetail,
  FormColorPickerFormat,
  FormColorPickerInvalidDetail,
  FormColorPickerInvalidReason,
  FormColorPickerPlacement,
  FormColorPickerSwatch,
  FormColorPickerVariant,
  HslaColor,
  HsvaColor,
  RgbaColor,
} from './color-picker.shared';

const FormColorPickerBase = createDirectReactComponent('FormColorPicker', FormColorPickerRenderer);
const FormColorPicker = FormColorPickerBase as unknown as (
  props: FormColorPickerProps & RefAttributes<HTMLInputElement>,
) => ReactElement | null;

export default FormColorPicker;
