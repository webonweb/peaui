import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormCheckboxVueComponent from './index.ce.vue';

export const FormCheckboxElement = createVueCustomElement(
  FormCheckboxVueComponent,
  `${UIKIT_NAME}-form-checkbox`,
);

export function defineFormCheckbox(): void {
  definePeauiCustomElement(FormCheckboxElement);
}

defineFormCheckbox();

export default FormCheckboxElement;
