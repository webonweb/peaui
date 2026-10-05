import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormButtonGroupVueComponent from './index.ce.vue';

export const FormButtonGroupElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(FormButtonGroupVueComponent, `${UIKIT_NAME}-form-button-group`);

export function defineFormButtonGroup(): void {
  definePeauiCustomElement(FormButtonGroupElement);
}

defineFormButtonGroup();

export default FormButtonGroupElement;
