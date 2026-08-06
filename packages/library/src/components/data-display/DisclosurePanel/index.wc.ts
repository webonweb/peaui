import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import DisclosurePanelVueComponent from './index.ce.vue';

export const DisclosurePanelElement = createVueCustomElement(
  DisclosurePanelVueComponent,
  `${UIKIT_NAME}-disclosure-panel`,
);

export function defineDisclosurePanel(): void {
  definePeauiCustomElement(DisclosurePanelElement);
}

defineDisclosurePanel();

export default DisclosurePanelElement;
