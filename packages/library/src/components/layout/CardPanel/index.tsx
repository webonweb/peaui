import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { CardPanelLeafRenderer } from '@/react/renderer-entries/layout.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type CardPanelProps = PeauiReactProps<'CardPanel'>;

const CardPanel = createDirectReactComponent('CardPanel', CardPanelLeafRenderer);

export default CardPanel;
