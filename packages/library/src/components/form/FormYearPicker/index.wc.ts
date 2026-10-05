import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormYearPickerVueComponent from './index.ce.vue';

export const FormYearPickerElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(FormYearPickerVueComponent, `${UIKIT_NAME}-form-year-picker`);

export function defineFormYearPicker(): void {
  definePeauiCustomElement(FormYearPickerElement);
}

defineFormYearPicker();

export default FormYearPickerElement;
