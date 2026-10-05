import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { DateRenderer } from '@/react/renderer-entries/date.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormYearPickerProps = PeauiReactProps<'FormYearPicker'>;

const FormYearPicker = createDirectReactComponent('FormYearPicker', DateRenderer);

export default FormYearPicker;
