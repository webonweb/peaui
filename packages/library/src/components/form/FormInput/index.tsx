import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { TextFieldLeafRenderer } from '@/react/renderer-entries/text-input.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormInputProps = PeauiReactProps<'FormInput'>;

const FormInput = createDirectReactComponent('FormInput', TextFieldLeafRenderer);

export default FormInput;
