import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { ListLimitControlRenderer } from '@/react/renderer-entries/list-limit-control.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type ListLimitControlProps = PeauiReactProps<'ListLimitControl'>;

const ListLimitControl = createDirectReactComponent('ListLimitControl', ListLimitControlRenderer);

export default ListLimitControl;
