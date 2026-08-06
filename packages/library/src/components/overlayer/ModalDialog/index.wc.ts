import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import ModalDialogVueComponent from './index.ce.vue';

export const ModalDialogElement = createVueCustomElement(
  ModalDialogVueComponent,
  `${UIKIT_NAME}-modal-dialog`,
);

export function defineModalDialog(): void {
  definePeauiCustomElement(ModalDialogElement);
}

defineModalDialog();

export default ModalDialogElement;
