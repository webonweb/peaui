import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { SpinnerLoaderLeafRenderer } from '@/react/renderer-entries/feedback.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type SpinnerLoaderProps = PeauiReactProps<'SpinnerLoader'>;

const SpinnerLoader = createDirectReactComponent('SpinnerLoader', SpinnerLoaderLeafRenderer);

export default SpinnerLoader;
