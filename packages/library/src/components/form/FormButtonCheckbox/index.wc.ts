import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormButtonCheckboxVueComponent from './index.ce.vue';

export const FormButtonCheckboxElement = createVueCustomElement(
  FormButtonCheckboxVueComponent,
  `${UIKIT_NAME}-form-button-checkbox`,
);

export function defineFormButtonCheckbox(): void {
  definePeauiCustomElement(FormButtonCheckboxElement);
}

defineFormButtonCheckbox();

export default FormButtonCheckboxElement;
