import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { TableRenderer } from '@/react/renderer-entries/table.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type TableListProps = PeauiReactProps<'TableList'>;

const TableList = createDirectReactComponent('TableList', TableRenderer);

export default TableList;

export type * from './table.types';
