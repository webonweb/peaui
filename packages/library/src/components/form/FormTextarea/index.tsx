import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { FormTextareaRenderer } from '@/react/renderer-entries/form-textarea.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormTextareaProps = PeauiReactProps<'FormTextarea'>;

const FormTextarea = createDirectReactComponent('FormTextarea', FormTextareaRenderer);

export default FormTextarea;
