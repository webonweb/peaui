import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormNumberProps = PeauiReactProps<'FormNumber'>;

const FormNumber = createPeauiReactComponent('FormNumber');

export default FormNumber;
