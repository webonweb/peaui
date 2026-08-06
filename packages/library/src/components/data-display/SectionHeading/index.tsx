import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type SectionHeadingProps = PeauiReactProps<'SectionHeading'>;

const SectionHeading = createPeauiReactComponent('SectionHeading');

export default SectionHeading;
