import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import SectionDividerVueComponent from './index.ce.vue';

export const SectionDividerElement = createVueCustomElement(
  SectionDividerVueComponent,
  `${UIKIT_NAME}-section-divider`,
);

export function defineSectionDivider(): void {
  definePeauiCustomElement(SectionDividerElement);
}

defineSectionDivider();

export default SectionDividerElement;
