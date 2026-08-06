import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import NavigationDisclosureCardVueComponent from './index.ce.vue';

export const NavigationDisclosureCardElement = createVueCustomElement(
  NavigationDisclosureCardVueComponent,
  `${UIKIT_NAME}-navigation-disclosure-card`,
);

export function defineNavigationDisclosureCard(): void {
  definePeauiCustomElement(NavigationDisclosureCardElement);
}

defineNavigationDisclosureCard();

export default NavigationDisclosureCardElement;
