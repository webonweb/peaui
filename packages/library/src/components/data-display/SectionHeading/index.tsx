import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { SectionHeadingLeafRenderer } from '@/react/renderer-entries/display.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type SectionHeadingProps = PeauiReactProps<'SectionHeading'>;

const SectionHeading = createDirectReactComponent('SectionHeading', SectionHeadingLeafRenderer);

export default SectionHeading;
