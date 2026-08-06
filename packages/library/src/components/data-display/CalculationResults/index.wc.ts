import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import CalculationResultsVueComponent from './index.ce.vue';

export const CalculationResultsElement = createVueCustomElement(
  CalculationResultsVueComponent,
  `${UIKIT_NAME}-calculation-results`,
);

export function defineCalculationResults(): void {
  definePeauiCustomElement(CalculationResultsElement);
}

defineCalculationResults();

export default CalculationResultsElement;
