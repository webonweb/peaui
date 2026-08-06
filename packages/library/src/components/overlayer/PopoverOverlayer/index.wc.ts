import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import PopoverOverlayerVueComponent from './index.ce.vue';

export const PopoverOverlayerElement = createVueCustomElement(
  PopoverOverlayerVueComponent,
  `${UIKIT_NAME}-popover-overlayer`,
);

export function definePopoverOverlayer(): void {
  definePeauiCustomElement(PopoverOverlayerElement);
}

definePopoverOverlayer();

export default PopoverOverlayerElement;
