import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import TableListHeaderVueComponent from './index.ce.vue';

export const TableListHeaderElement = createVueCustomElement(
  TableListHeaderVueComponent,
  `${UIKIT_NAME}-table-list-header`,
);

export function defineTableListHeader(): void {
  definePeauiCustomElement(TableListHeaderElement);
}

defineTableListHeader();

export default TableListHeaderElement;
