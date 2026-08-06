import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FullscreenContainerVueComponent from './index.ce.vue';

export const FullscreenContainerElement = createVueCustomElement(
  FullscreenContainerVueComponent,
  `${UIKIT_NAME}-fullscreen-container`,
);

export function defineFullscreenContainer(): void {
  definePeauiCustomElement(FullscreenContainerElement);
}

defineFullscreenContainer();

export default FullscreenContainerElement;
