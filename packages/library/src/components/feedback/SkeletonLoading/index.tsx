import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { SkeletonLoadingLeafRenderer } from '@/react/renderer-entries/feedback.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type SkeletonLoadingProps = PeauiReactProps<'SkeletonLoading'>;

const SkeletonLoading = createDirectReactComponent('SkeletonLoading', SkeletonLoadingLeafRenderer);

export default SkeletonLoading;
