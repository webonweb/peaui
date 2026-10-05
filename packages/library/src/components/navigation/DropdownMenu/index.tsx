import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { DropdownMenuRenderer } from '@/react/renderer-entries/dropdown-menu.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type DropdownMenuProps = PeauiReactProps<'DropdownMenu'>;

const DropdownMenu = createDirectReactComponent('DropdownMenu', DropdownMenuRenderer);

export default DropdownMenu;
