import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { DialogLeafRenderer } from '@/react/renderer-entries/dialog-leaf.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type DrawerPanelProps = PeauiReactProps<'DrawerPanel'>;

const DrawerPanel = createDirectReactComponent('DrawerPanel', DialogLeafRenderer);

export default DrawerPanel;
