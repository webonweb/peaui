import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import InputSliderVueComponent from './index.ce.vue';

export const InputSliderElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(InputSliderVueComponent, `${UIKIT_NAME}-input-slider`);

export function defineInputSlider(): void {
  definePeauiCustomElement(InputSliderElement);
}

defineInputSlider();

export default InputSliderElement;
