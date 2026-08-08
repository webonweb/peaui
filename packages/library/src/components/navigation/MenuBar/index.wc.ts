import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import MenuBarVueComponent from './index.vue';

export const MenuBarElement = createVueCustomElement(MenuBarVueComponent, `${UIKIT_NAME}-menu-bar`);

export function defineMenuBar(): typeof MenuBarElement {
  definePeauiCustomElement(MenuBarElement);

  return MenuBarElement;
}

defineMenuBar();

export default MenuBarElement;
