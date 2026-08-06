import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type ProgressIndicatorProps = PeauiReactProps<'ProgressIndicator'>;

const ProgressIndicator = createPeauiReactComponent('ProgressIndicator');

export default ProgressIndicator;
