import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import PaginationControlVueComponent from './index.ce.vue';

export const PaginationControlElement = createVueCustomElement(
  PaginationControlVueComponent,
  `${UIKIT_NAME}-pagination-control`,
);

export function definePaginationControl(): void {
  definePeauiCustomElement(PaginationControlElement);
}

definePaginationControl();

export default PaginationControlElement;
