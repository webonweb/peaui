import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { DateRenderer } from '@/react/renderer-entries/date.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormDatePickerProps = PeauiReactProps<'FormDatePicker'>;

const FormDatePicker = createDirectReactComponent('FormDatePicker', DateRenderer);

export default FormDatePicker;
