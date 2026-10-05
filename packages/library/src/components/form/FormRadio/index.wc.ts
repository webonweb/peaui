import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormRadioVueComponent from './index.ce.vue';

export const FormRadioElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(FormRadioVueComponent, `${UIKIT_NAME}-form-radio`);

export function defineFormRadio(): void {
  definePeauiCustomElement(FormRadioElement);
}

defineFormRadio();

export default FormRadioElement;
