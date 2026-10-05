import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { NavigationDisclosureCardRenderer } from '@/react/renderer-entries/navigation-disclosure-card.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type NavigationDisclosureCardProps = PeauiReactProps<'NavigationDisclosureCard'>;

const NavigationDisclosureCard = createDirectReactComponent(
  'NavigationDisclosureCard',
  NavigationDisclosureCardRenderer,
);

export default NavigationDisclosureCard;
