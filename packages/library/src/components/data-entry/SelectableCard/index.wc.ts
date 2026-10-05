import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import SelectableCardVueComponent from './index.ce.vue';

export const SelectableCardElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(SelectableCardVueComponent, `${UIKIT_NAME}-selectable-card`);

export function defineSelectableCard(): void {
  definePeauiCustomElement(SelectableCardElement);
}

defineSelectableCard();

export default SelectableCardElement;
