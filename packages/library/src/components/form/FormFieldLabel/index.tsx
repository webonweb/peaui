import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { FormFieldLabelLeafRenderer } from '@/react/renderer-entries/form.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormFieldLabelProps = PeauiReactProps<'FormFieldLabel'>;

const FormFieldLabel = createDirectReactComponent('FormFieldLabel', FormFieldLabelLeafRenderer);

export default FormFieldLabel;
