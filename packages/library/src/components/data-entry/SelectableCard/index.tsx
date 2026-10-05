import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { SelectableCardLeafRenderer } from '@/react/renderer-entries/button.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type SelectableCardProps = PeauiReactProps<'SelectableCard'>;

const SelectableCard = createDirectReactComponent('SelectableCard', SelectableCardLeafRenderer);

export default SelectableCard;
