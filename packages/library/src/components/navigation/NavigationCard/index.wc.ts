import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import NavigationCardVueComponent from './index.ce.vue';

export const NavigationCardElement = createVueCustomElement(
  NavigationCardVueComponent,
  `${UIKIT_NAME}-navigation-card`,
);

export function defineNavigationCard(): void {
  definePeauiCustomElement(NavigationCardElement);
}

defineNavigationCard();

export default NavigationCardElement;
