import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import BreadcrumbsVueComponent from './index.ce.vue';

export const BreadcrumbsElement = createVueCustomElement(
  BreadcrumbsVueComponent,
  `${UIKIT_NAME}-breadcrumbs`,
  { hostRole: 'group' },
);

export function defineBreadcrumbs(): void {
  definePeauiCustomElement(BreadcrumbsElement);
}

defineBreadcrumbs();

export default BreadcrumbsElement;
