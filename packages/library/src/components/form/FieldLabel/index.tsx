import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FieldLabelProps = PeauiReactProps<'FieldLabel'>;

const FieldLabel = createPeauiReactComponent('FieldLabel');

export default FieldLabel;
