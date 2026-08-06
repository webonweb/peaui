import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormMultiSelectVueComponent from './index.ce.vue';

export const FormMultiSelectElement = createVueCustomElement(
  FormMultiSelectVueComponent,
  `${UIKIT_NAME}-form-multi-select`,
);

export function defineFormMultiSelect(): void {
  definePeauiCustomElement(FormMultiSelectElement);
}

defineFormMultiSelect();

export default FormMultiSelectElement;
