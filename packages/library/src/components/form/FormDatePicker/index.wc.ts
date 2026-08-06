import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormDatePickerVueComponent from './index.ce.vue';

export const FormDatePickerElement = createVueCustomElement(
  FormDatePickerVueComponent,
  `${UIKIT_NAME}-form-date-picker`,
);

export function defineFormDatePicker(): void {
  definePeauiCustomElement(FormDatePickerElement);
}

defineFormDatePicker();

export default FormDatePickerElement;
