import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type CardPanelProps = PeauiReactProps<'CardPanel'>;

const CardPanel = createPeauiReactComponent('CardPanel');

export default CardPanel;
