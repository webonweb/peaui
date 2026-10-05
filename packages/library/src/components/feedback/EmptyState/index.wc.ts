import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import EmptyStateVueComponent from './index.ce.vue';

export const EmptyStateElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(EmptyStateVueComponent, `${UIKIT_NAME}-empty-state`);

export function defineEmptyState(): void {
  definePeauiCustomElement(EmptyStateElement);
}

defineEmptyState();

export default EmptyStateElement;
