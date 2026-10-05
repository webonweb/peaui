import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormNumberVueComponent from './index.ce.vue';

export const FormNumberElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(FormNumberVueComponent, `${UIKIT_NAME}-form-number`);

export function defineFormNumber(): void {
  definePeauiCustomElement(FormNumberElement);
}

defineFormNumber();

export default FormNumberElement;
