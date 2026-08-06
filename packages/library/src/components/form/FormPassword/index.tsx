import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormPasswordProps = PeauiReactProps<'FormPassword'>;

const FormPassword = createPeauiReactComponent('FormPassword');

export default FormPassword;
