import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormDatePickerVueComponent from './index.ce.vue';

export const FormDatePickerElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(FormDatePickerVueComponent, `${UIKIT_NAME}-form-date-picker`);

export function defineFormDatePicker(): void {
  definePeauiCustomElement(FormDatePickerElement);
}

defineFormDatePicker();

export default FormDatePickerElement;
