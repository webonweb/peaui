import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import ProgressIndicatorVueComponent from './index.ce.vue';

export const ProgressIndicatorElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(ProgressIndicatorVueComponent, `${UIKIT_NAME}-progress-indicator`);

export function defineProgressIndicator(): void {
  definePeauiCustomElement(ProgressIndicatorElement);
}

defineProgressIndicator();

export default ProgressIndicatorElement;
