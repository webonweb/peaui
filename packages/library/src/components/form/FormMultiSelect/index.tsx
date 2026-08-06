import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormMultiSelectProps = PeauiReactProps<'FormMultiSelect'>;

const FormMultiSelect = createPeauiReactComponent('FormMultiSelect');

export default FormMultiSelect;
