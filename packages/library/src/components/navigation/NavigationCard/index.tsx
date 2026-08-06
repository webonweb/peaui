import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type NavigationCardProps = PeauiReactProps<'NavigationCard'>;

const NavigationCard = createPeauiReactComponent('NavigationCard');

export default NavigationCard;
