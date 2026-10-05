import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormSelectVueComponent from './index.ce.vue';

export const FormSelectElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(FormSelectVueComponent, `${UIKIT_NAME}-form-select`);

export function defineFormSelect(): void {
  definePeauiCustomElement(FormSelectElement);
}

defineFormSelect();

export default FormSelectElement;
