import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormCheckboxProps = PeauiReactProps<'FormCheckbox'>;

const FormCheckbox = createPeauiReactComponent('FormCheckbox');

export default FormCheckbox;
