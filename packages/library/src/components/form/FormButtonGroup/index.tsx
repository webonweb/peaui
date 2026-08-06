import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormButtonGroupProps = PeauiReactProps<'FormButtonGroup'>;

const FormButtonGroup = createPeauiReactComponent('FormButtonGroup');

export default FormButtonGroup;
