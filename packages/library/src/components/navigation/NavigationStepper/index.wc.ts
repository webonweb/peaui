import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import NavigationStepperVueComponent from './index.ce.vue';

export const NavigationStepperElement = createVueCustomElement(
  NavigationStepperVueComponent,
  `${UIKIT_NAME}-navigation-stepper`,
);

export function defineNavigationStepper(): void {
  definePeauiCustomElement(NavigationStepperElement);
}

defineNavigationStepper();

export default NavigationStepperElement;
