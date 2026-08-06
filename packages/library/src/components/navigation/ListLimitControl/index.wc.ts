import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import ListLimitControlVueComponent from './index.ce.vue';

export const ListLimitControlElement = createVueCustomElement(
  ListLimitControlVueComponent,
  `${UIKIT_NAME}-list-limit-control`,
);

export function defineListLimitControl(): void {
  definePeauiCustomElement(ListLimitControlElement);
}

defineListLimitControl();

export default ListLimitControlElement;
