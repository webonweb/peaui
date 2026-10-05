import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import NavigationDisclosureCardVueComponent from './index.ce.vue';

export const NavigationDisclosureCardElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(NavigationDisclosureCardVueComponent, `${UIKIT_NAME}-navigation-disclosure-card`);

export function defineNavigationDisclosureCard(): void {
  definePeauiCustomElement(NavigationDisclosureCardElement);
}

defineNavigationDisclosureCard();

export default NavigationDisclosureCardElement;
