import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { NavigationIconCardLeafRenderer } from '@/react/renderer-entries/navigation.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type NavigationIconCardProps = PeauiReactProps<'NavigationIconCard'>;

const NavigationIconCard = createDirectReactComponent(
  'NavigationIconCard',
  NavigationIconCardLeafRenderer,
);

export default NavigationIconCard;
