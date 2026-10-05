import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { GridItemLeafRenderer } from '@/react/renderer-entries/layout.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type GridItemProps = PeauiReactProps<'GridItem'>;

const GridItem = createDirectReactComponent('GridItem', GridItemLeafRenderer);

export default GridItem;
