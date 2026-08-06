import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type TableListProps = PeauiReactProps<'TableList'>;

const TableList = createPeauiReactComponent('TableList');

export default TableList;
