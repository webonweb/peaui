import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type ImageViewProps = PeauiReactProps<'ImageView'>;

const ImageView = createPeauiReactComponent('ImageView');

export default ImageView;
