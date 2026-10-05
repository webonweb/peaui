import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { TableListFooterLeafRenderer } from '@/react/renderer-entries/table.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type TableListFooterProps = PeauiReactProps<'TableListFooter'>;

const TableListFooter = createDirectReactComponent('TableListFooter', TableListFooterLeafRenderer);

export default TableListFooter;
