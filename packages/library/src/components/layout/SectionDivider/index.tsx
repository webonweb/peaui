import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { SectionDividerLeafRenderer } from '@/react/renderer-entries/layout.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type SectionDividerProps = PeauiReactProps<'SectionDivider'>;

const SectionDivider = createDirectReactComponent('SectionDivider', SectionDividerLeafRenderer);

export default SectionDivider;
