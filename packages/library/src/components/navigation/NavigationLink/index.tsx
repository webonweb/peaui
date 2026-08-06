import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type NavigationLinkProps = PeauiReactProps<'NavigationLink'>;

const NavigationLink = createPeauiReactComponent('NavigationLink');

export default NavigationLink;
