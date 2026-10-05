import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { NavigationTabsLeafRenderer } from '@/react/renderer-entries/navigation.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type NavigationTabsProps = PeauiReactProps<'NavigationTabs'>;

const NavigationTabs = createDirectReactComponent('NavigationTabs', NavigationTabsLeafRenderer);

export default NavigationTabs;
