import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormSelectProps = PeauiReactProps<'FormSelect'>;

const FormSelect = createPeauiReactComponent('FormSelect');

export default FormSelect;
