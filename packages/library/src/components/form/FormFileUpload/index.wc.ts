import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormFileUploadVueComponent from './index.ce.vue';

export const FormFileUploadElement = createVueCustomElement(
  FormFileUploadVueComponent,
  `${UIKIT_NAME}-form-file-upload`,
);

export function defineFormFileUpload(): void {
  definePeauiCustomElement(FormFileUploadElement);
}

defineFormFileUpload();

export default FormFileUploadElement;
