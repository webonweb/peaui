import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { MenuBarRenderer } from '@/react/renderer-entries/menu-bar.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type MenuBarProps = PeauiReactProps<'MenuBar'>;

const MenuBar = createDirectReactComponent('MenuBar', MenuBarRenderer);

export default MenuBar;
