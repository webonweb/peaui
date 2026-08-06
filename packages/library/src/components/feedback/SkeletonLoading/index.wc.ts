import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import SkeletonLoadingVueComponent from './index.ce.vue';

export const SkeletonLoadingElement = createVueCustomElement(
  SkeletonLoadingVueComponent,
  `${UIKIT_NAME}-skeleton-loading`,
);

export function defineSkeletonLoading(): void {
  definePeauiCustomElement(SkeletonLoadingElement);
}

defineSkeletonLoading();

export default SkeletonLoadingElement;
