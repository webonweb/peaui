import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import SkeletonLoadingVueComponent from './index.ce.vue';

export const SkeletonLoadingElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(SkeletonLoadingVueComponent, `${UIKIT_NAME}-skeleton-loading`);

export function defineSkeletonLoading(): void {
  definePeauiCustomElement(SkeletonLoadingElement);
}

defineSkeletonLoading();

export default SkeletonLoadingElement;
