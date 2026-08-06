import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import NavigationTabsVueComponent from './index.ce.vue';

export const NavigationTabsElement = createVueCustomElement(
  NavigationTabsVueComponent,
  `${UIKIT_NAME}-navigation-tabs`,
);

export function defineNavigationTabs(): void {
  definePeauiCustomElement(NavigationTabsElement);
}

defineNavigationTabs();

export default NavigationTabsElement;
