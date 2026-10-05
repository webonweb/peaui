import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { TextFieldLeafRenderer } from '@/react/renderer-entries/text-input.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormNumberProps = PeauiReactProps<'FormNumber'>;

const FormNumber = createDirectReactComponent('FormNumber', TextFieldLeafRenderer);

export default FormNumber;
