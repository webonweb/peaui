import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormYearPickerVueComponent from './index.ce.vue';

export const FormYearPickerElement = createVueCustomElement(
  FormYearPickerVueComponent,
  `${UIKIT_NAME}-form-year-picker`,
);

export function defineFormYearPicker(): void {
  definePeauiCustomElement(FormYearPickerElement);
}

defineFormYearPicker();

export default FormYearPickerElement;
