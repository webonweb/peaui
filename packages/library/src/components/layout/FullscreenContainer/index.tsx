import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FullscreenContainerProps = PeauiReactProps<'FullscreenContainer'>;

const FullscreenContainer = createPeauiReactComponent('FullscreenContainer');

export default FullscreenContainer;
