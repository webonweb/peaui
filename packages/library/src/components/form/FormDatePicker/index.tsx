import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormDatePickerProps = PeauiReactProps<'FormDatePicker'>;

const FormDatePicker = createPeauiReactComponent('FormDatePicker');

export default FormDatePicker;
