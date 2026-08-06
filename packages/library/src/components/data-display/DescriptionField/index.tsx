import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type DescriptionFieldProps = PeauiReactProps<'DescriptionField'>;

const DescriptionField = createPeauiReactComponent('DescriptionField');

export default DescriptionField;
