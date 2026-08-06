import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type SectionDividerProps = PeauiReactProps<'SectionDivider'>;

const SectionDivider = createPeauiReactComponent('SectionDivider');

export default SectionDivider;
