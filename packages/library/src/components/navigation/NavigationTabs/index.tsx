import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type NavigationTabsProps = PeauiReactProps<'NavigationTabs'>;

const NavigationTabs = createPeauiReactComponent('NavigationTabs');

export default NavigationTabs;
