import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { GridSectionLeafRenderer } from '@/react/renderer-entries/layout.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type GridSectionProps = PeauiReactProps<'GridSection'>;

const GridSection = createDirectReactComponent('GridSection', GridSectionLeafRenderer);

export default GridSection;
