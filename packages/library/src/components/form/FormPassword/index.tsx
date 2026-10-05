import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { FormPasswordLeafRenderer } from '@/react/renderer-entries/text-input.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormPasswordProps = PeauiReactProps<'FormPassword'>;

const FormPassword = createDirectReactComponent('FormPassword', FormPasswordLeafRenderer);

export default FormPassword;
