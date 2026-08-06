import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import DrawerPanelVueComponent from './index.ce.vue';

export const DrawerPanelElement = createVueCustomElement(
  DrawerPanelVueComponent,
  `${UIKIT_NAME}-drawer-panel`,
);

export function defineDrawerPanel(): void {
  definePeauiCustomElement(DrawerPanelElement);
}

defineDrawerPanel();

export default DrawerPanelElement;
