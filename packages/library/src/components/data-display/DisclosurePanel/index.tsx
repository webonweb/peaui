import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type DisclosurePanelProps = PeauiReactProps<'DisclosurePanel'>;

const DisclosurePanel = createPeauiReactComponent('DisclosurePanel');

export default DisclosurePanel;
