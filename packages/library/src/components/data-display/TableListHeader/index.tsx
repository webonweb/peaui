import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type TableListHeaderProps = PeauiReactProps<'TableListHeader'>;

const TableListHeader = createPeauiReactComponent('TableListHeader');

export default TableListHeader;
