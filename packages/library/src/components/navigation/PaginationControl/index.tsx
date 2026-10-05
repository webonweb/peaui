import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { PaginationControlLeafRenderer } from '@/react/renderer-entries/navigation.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type PaginationControlProps = PeauiReactProps<'PaginationControl'>;

const PaginationControl = createDirectReactComponent(
  'PaginationControl',
  PaginationControlLeafRenderer,
);

export default PaginationControl;
