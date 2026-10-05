import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import TableListFooterVueComponent from './index.ce.vue';

export const TableListFooterElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(TableListFooterVueComponent, `${UIKIT_NAME}-table-list-footer`);

export function defineTableListFooter(): void {
  definePeauiCustomElement(TableListFooterElement);
}

defineTableListFooter();

export default TableListFooterElement;
