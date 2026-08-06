import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type SkeletonLoadingProps = PeauiReactProps<'SkeletonLoading'>;

const SkeletonLoading = createPeauiReactComponent('SkeletonLoading');

export default SkeletonLoading;
