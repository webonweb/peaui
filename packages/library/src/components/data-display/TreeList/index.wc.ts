import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import TreeListVueComponent from './index.ce.vue';

export const TreeListElement = createVueCustomElement(
  TreeListVueComponent,
  `${UIKIT_NAME}-tree-list`,
);

export function defineTreeList(): void {
  definePeauiCustomElement(TreeListElement);
}

defineTreeList();

export default TreeListElement;
