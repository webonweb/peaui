import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { FullscreenContainerLeafRenderer } from '@/react/renderer-entries/layout.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FullscreenContainerProps = PeauiReactProps<'FullscreenContainer'>;

const FullscreenContainer = createDirectReactComponent(
  'FullscreenContainer',
  FullscreenContainerLeafRenderer,
);

export default FullscreenContainer;
