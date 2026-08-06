import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type PhotoEditorProps = PeauiReactProps<'PhotoEditor'>;

const PhotoEditor = createPeauiReactComponent('PhotoEditor');

export default PhotoEditor;
