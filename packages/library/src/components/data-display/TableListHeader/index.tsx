import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { TableListHeaderLeafRenderer } from '@/react/renderer-entries/table.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type TableListHeaderProps = PeauiReactProps<'TableListHeader'>;

const TableListHeader = createDirectReactComponent('TableListHeader', TableListHeaderLeafRenderer);

export default TableListHeader;
