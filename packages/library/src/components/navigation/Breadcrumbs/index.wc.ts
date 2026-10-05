import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import BreadcrumbsVueComponent from './index.ce.vue';

export const BreadcrumbsElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(BreadcrumbsVueComponent, `${UIKIT_NAME}-breadcrumbs`);

export function defineBreadcrumbs(): void {
  definePeauiCustomElement(BreadcrumbsElement);
}

defineBreadcrumbs();

export default BreadcrumbsElement;
