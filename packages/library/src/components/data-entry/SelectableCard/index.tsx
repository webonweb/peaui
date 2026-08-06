import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type SelectableCardProps = PeauiReactProps<'SelectableCard'>;

const SelectableCard = createPeauiReactComponent('SelectableCard');

export default SelectableCard;
