import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type MenuBarProps = PeauiReactProps<'MenuBar'>;

const MenuBar = createPeauiReactComponent('MenuBar');

export default MenuBar;
