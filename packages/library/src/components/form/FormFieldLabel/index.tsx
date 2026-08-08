import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormFieldLabelProps = PeauiReactProps<'FormFieldLabel'>;

const FormFieldLabel = createPeauiReactComponent('FormFieldLabel');

export default FormFieldLabel;
