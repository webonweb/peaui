import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { ImageViewRenderer } from '@/react/renderer-entries/image-view.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type ImageViewProps = PeauiReactProps<'ImageView'>;

const ImageView = createDirectReactComponent('ImageView', ImageViewRenderer);

export default ImageView;
