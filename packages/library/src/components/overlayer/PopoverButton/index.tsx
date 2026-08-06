import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type PopoverButtonProps = PeauiReactProps<'PopoverButton'>;

const PopoverButton = createPeauiReactComponent('PopoverButton');

export default PopoverButton;
