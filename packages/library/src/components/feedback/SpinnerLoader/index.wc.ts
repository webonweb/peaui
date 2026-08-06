import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import SpinnerLoaderVueComponent from './index.ce.vue';

export const SpinnerLoaderElement = createVueCustomElement(
  SpinnerLoaderVueComponent,
  `${UIKIT_NAME}-spinner-loader`,
);

export function defineSpinnerLoader(): void {
  definePeauiCustomElement(SpinnerLoaderElement);
}

defineSpinnerLoader();

export default SpinnerLoaderElement;
