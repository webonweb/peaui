import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import ProgressIndicatorVueComponent from './index.ce.vue';

export const ProgressIndicatorElement = createVueCustomElement(
  ProgressIndicatorVueComponent,
  `${UIKIT_NAME}-progress-indicator`,
);

export function defineProgressIndicator(): void {
  definePeauiCustomElement(ProgressIndicatorElement);
}

defineProgressIndicator();

export default ProgressIndicatorElement;
