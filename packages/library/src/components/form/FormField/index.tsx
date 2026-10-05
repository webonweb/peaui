import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { FormFieldLeafRenderer } from '@/react/renderer-entries/form.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormFieldProps = PeauiReactProps<'FormField'>;

const FormField = createDirectReactComponent('FormField', FormFieldLeafRenderer);

export default FormField;
