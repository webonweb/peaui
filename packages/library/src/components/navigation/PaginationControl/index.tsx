import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type PaginationControlProps = PeauiReactProps<'PaginationControl'>;

const PaginationControl = createPeauiReactComponent('PaginationControl');

export default PaginationControl;
