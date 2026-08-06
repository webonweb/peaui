import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormContainerVueComponent from './index.ce.vue';

export const FormContainerElement = createVueCustomElement(
  FormContainerVueComponent,
  `${UIKIT_NAME}-form-container`,
);

export function defineFormContainer(): void {
  definePeauiCustomElement(FormContainerElement);
}

defineFormContainer();

export default FormContainerElement;
