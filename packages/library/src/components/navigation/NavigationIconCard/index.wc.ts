import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import NavigationIconCardVueComponent from './index.ce.vue';

export const NavigationIconCardElement = createVueCustomElement(
  NavigationIconCardVueComponent,
  `${UIKIT_NAME}-navigation-icon-card`,
  { hostRole: 'group' },
);

export function defineNavigationIconCard(): void {
  definePeauiCustomElement(NavigationIconCardElement);
}

defineNavigationIconCard();

export default NavigationIconCardElement;
