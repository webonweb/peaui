import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormTextareaVueComponent from './index.ce.vue';

export const FormTextareaElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(FormTextareaVueComponent, `${UIKIT_NAME}-form-textarea`);

export function defineFormTextarea(): void {
  definePeauiCustomElement(FormTextareaElement);
}

defineFormTextarea();

export default FormTextareaElement;
