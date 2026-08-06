import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormNumberVueComponent from './index.ce.vue';

export const FormNumberElement = createVueCustomElement(
  FormNumberVueComponent,
  `${UIKIT_NAME}-form-number`,
);

export function defineFormNumber(): void {
  definePeauiCustomElement(FormNumberElement);
}

defineFormNumber();

export default FormNumberElement;
