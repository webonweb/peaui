import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { PopoverLeafRenderer } from '@/react/renderer-entries/popover-leaf.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type PopoverButtonProps = PeauiReactProps<'PopoverButton'>;

const PopoverButton = createDirectReactComponent('PopoverButton', PopoverLeafRenderer);

export default PopoverButton;
