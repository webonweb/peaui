import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormInputProps = PeauiReactProps<'FormInput'>;

const FormInput = createPeauiReactComponent('FormInput');

export default FormInput;
