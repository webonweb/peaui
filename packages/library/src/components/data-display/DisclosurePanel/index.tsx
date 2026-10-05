import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { DisclosurePanelLeafRenderer } from '@/react/renderer-entries/display.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type DisclosurePanelProps = PeauiReactProps<'DisclosurePanel'>;

const DisclosurePanel = createDirectReactComponent('DisclosurePanel', DisclosurePanelLeafRenderer);

export default DisclosurePanel;
