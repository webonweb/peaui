import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormButtonCheckboxVueComponent from './index.ce.vue';

export const FormButtonCheckboxElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(FormButtonCheckboxVueComponent, `${UIKIT_NAME}-form-button-checkbox`);

export function defineFormButtonCheckbox(): void {
  definePeauiCustomElement(FormButtonCheckboxElement);
}

defineFormButtonCheckbox();

export default FormButtonCheckboxElement;
