import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type PopoverOverlayerProps = PeauiReactProps<'PopoverOverlayer'>;

const PopoverOverlayer = createPeauiReactComponent('PopoverOverlayer');

export default PopoverOverlayer;
