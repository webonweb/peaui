import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type GridItemProps = PeauiReactProps<'GridItem'>;

const GridItem = createPeauiReactComponent('GridItem');

export default GridItem;
