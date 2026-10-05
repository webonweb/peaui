import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import NavigationIconCardVueComponent from './index.ce.vue';

export const NavigationIconCardElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(NavigationIconCardVueComponent, `${UIKIT_NAME}-navigation-icon-card`);

export function defineNavigationIconCard(): void {
  definePeauiCustomElement(NavigationIconCardElement);
}

defineNavigationIconCard();

export default NavigationIconCardElement;
