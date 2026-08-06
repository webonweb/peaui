import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormContainerProps = PeauiReactProps<'FormContainer'>;

const FormContainer = createPeauiReactComponent('FormContainer');

export default FormContainer;
