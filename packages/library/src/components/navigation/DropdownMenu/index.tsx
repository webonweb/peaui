import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type DropdownMenuProps = PeauiReactProps<'DropdownMenu'>;

const DropdownMenu = createPeauiReactComponent('DropdownMenu');

export default DropdownMenu;
