import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import CounterBadgeVueComponent from './index.ce.vue';

export const CounterBadgeElement = createVueCustomElement(
  CounterBadgeVueComponent,
  `${UIKIT_NAME}-counter-badge`,
);

export function defineCounterBadge(): void {
  definePeauiCustomElement(CounterBadgeElement);
}

defineCounterBadge();

export default CounterBadgeElement;
