import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormFileUploadSimpleVueComponent from './index.ce.vue';

export const FormFileUploadSimpleElement = createVueCustomElement(
  FormFileUploadSimpleVueComponent,
  `${UIKIT_NAME}-form-file-upload-simple`,
);

export function defineFormFileUploadSimple(): void {
  definePeauiCustomElement(FormFileUploadSimpleElement);
}

defineFormFileUploadSimple();

export default FormFileUploadSimpleElement;
