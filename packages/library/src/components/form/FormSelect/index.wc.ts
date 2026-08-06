import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormSelectVueComponent from './index.ce.vue';

export const FormSelectElement = createVueCustomElement(
  FormSelectVueComponent,
  `${UIKIT_NAME}-form-select`,
);

export function defineFormSelect(): void {
  definePeauiCustomElement(FormSelectElement);
}

defineFormSelect();

export default FormSelectElement;
