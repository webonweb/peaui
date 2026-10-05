import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import PopoverButtonVueComponent from './index.ce.vue';

export const PopoverButtonElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(PopoverButtonVueComponent, `${UIKIT_NAME}-popover-button`);

export function definePopoverButton(): void {
  definePeauiCustomElement(PopoverButtonElement);
}

definePopoverButton();

export default PopoverButtonElement;
