import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import PopoverButtonVueComponent from './index.ce.vue';

export const PopoverButtonElement = createVueCustomElement(
  PopoverButtonVueComponent,
  `${UIKIT_NAME}-popover-button`,
);

export function definePopoverButton(): void {
  definePeauiCustomElement(PopoverButtonElement);
}

definePopoverButton();

export default PopoverButtonElement;
