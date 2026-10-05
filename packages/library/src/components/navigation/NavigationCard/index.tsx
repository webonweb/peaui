import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { NavigationCardLeafRenderer } from '@/react/renderer-entries/navigation.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type NavigationCardProps = PeauiReactProps<'NavigationCard'>;

const NavigationCard = createDirectReactComponent('NavigationCard', NavigationCardLeafRenderer);

export default NavigationCard;
