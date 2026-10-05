import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import PaginationControlVueComponent from './index.ce.vue';

export const PaginationControlElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(PaginationControlVueComponent, `${UIKIT_NAME}-pagination-control`);

export function definePaginationControl(): void {
  definePeauiCustomElement(PaginationControlElement);
}

definePaginationControl();

export default PaginationControlElement;
