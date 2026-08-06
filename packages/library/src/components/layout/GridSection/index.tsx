import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type GridSectionProps = PeauiReactProps<'GridSection'>;

const GridSection = createPeauiReactComponent('GridSection');

export default GridSection;
