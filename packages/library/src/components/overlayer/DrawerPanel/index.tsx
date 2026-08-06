import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type DrawerPanelProps = PeauiReactProps<'DrawerPanel'>;

const DrawerPanel = createPeauiReactComponent('DrawerPanel');

export default DrawerPanel;
