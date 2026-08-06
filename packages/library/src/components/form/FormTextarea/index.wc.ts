import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormTextareaVueComponent from './index.ce.vue';

export const FormTextareaElement = createVueCustomElement(
  FormTextareaVueComponent,
  `${UIKIT_NAME}-form-textarea`,
);

export function defineFormTextarea(): void {
  definePeauiCustomElement(FormTextareaElement);
}

defineFormTextarea();

export default FormTextareaElement;
