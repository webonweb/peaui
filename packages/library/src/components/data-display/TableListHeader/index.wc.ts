import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import TableListHeaderVueComponent from './index.ce.vue';

export const TableListHeaderElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(TableListHeaderVueComponent, `${UIKIT_NAME}-table-list-header`);

export function defineTableListHeader(): void {
  definePeauiCustomElement(TableListHeaderElement);
}

defineTableListHeader();

export default TableListHeaderElement;
