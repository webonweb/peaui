import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import NavigationTabsVueComponent from './index.ce.vue';

export const NavigationTabsElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(NavigationTabsVueComponent, `${UIKIT_NAME}-navigation-tabs`);

export function defineNavigationTabs(): void {
  definePeauiCustomElement(NavigationTabsElement);
}

defineNavigationTabs();

export default NavigationTabsElement;
