import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormYearPickerProps = PeauiReactProps<'FormYearPicker'>;

const FormYearPicker = createPeauiReactComponent('FormYearPicker');

export default FormYearPicker;
