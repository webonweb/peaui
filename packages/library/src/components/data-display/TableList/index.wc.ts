import type PublicVueComponent from './index.vue';
export type * from './table.types';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import TableListVueComponent from './index.ce.vue';

export const TableListElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(TableListVueComponent, `${UIKIT_NAME}-table-list`, { hostRole: 'group' });

export function defineTableList(): void {
  definePeauiCustomElement(TableListElement);
}

defineTableList();

export default TableListElement;
