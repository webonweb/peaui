import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormTextareaProps = PeauiReactProps<'FormTextarea'>;

const FormTextarea = createPeauiReactComponent('FormTextarea');

export default FormTextarea;
