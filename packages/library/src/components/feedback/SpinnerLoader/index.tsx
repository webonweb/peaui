import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type SpinnerLoaderProps = PeauiReactProps<'SpinnerLoader'>;

const SpinnerLoader = createPeauiReactComponent('SpinnerLoader');

export default SpinnerLoader;
