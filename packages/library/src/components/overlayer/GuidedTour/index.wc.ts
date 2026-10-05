import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import GuidedTourVueComponent from './index.ce.vue';

export const GuidedTourElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(GuidedTourVueComponent, `${UIKIT_NAME}-guided-tour`, { hostRole: 'group' });

export function defineGuidedTour(): void {
  definePeauiCustomElement(GuidedTourElement);
}

defineGuidedTour();

export default GuidedTourElement;
