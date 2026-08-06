import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import TableListVueComponent from './index.ce.vue';

export const TableListElement = createVueCustomElement(
  TableListVueComponent,
  `${UIKIT_NAME}-table-list`,
);

export function defineTableList(): void {
  definePeauiCustomElement(TableListElement);
}

defineTableList();

export default TableListElement;
