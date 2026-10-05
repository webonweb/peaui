import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { NavigationLinkLeafRenderer } from '@/react/renderer-entries/navigation.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type NavigationLinkProps = PeauiReactProps<'NavigationLink'>;

const NavigationLink = createDirectReactComponent('NavigationLink', NavigationLinkLeafRenderer);

export default NavigationLink;
