import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormFieldProps = PeauiReactProps<'FormField'>;

const FormField = createPeauiReactComponent('FormField');

export default FormField;
