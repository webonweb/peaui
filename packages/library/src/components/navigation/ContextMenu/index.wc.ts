import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import ContextMenuVueComponent from './index.vue';
import type { ContextMenuPoint } from './index.vue';

type ExposedContextMenu = {
  close(): void;
  openAt(point: ContextMenuPoint): boolean;
};

const ContextMenuVueElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(ContextMenuVueComponent, `${UIKIT_NAME}-context-menu`);

/** Light-DOM Web Component exposing the same imperative positioning API as Vue and React refs. */
export class ContextMenuElement extends ContextMenuVueElement {
  static readonly tagName = `${UIKIT_NAME}-context-menu`;

  // Vue 3.5 publishes defineExpose methods directly on a mounted custom element.
  declare openAt: ExposedContextMenu['openAt'];
  declare close: ExposedContextMenu['close'];
}

export function defineContextMenu(): typeof ContextMenuElement {
  definePeauiCustomElement(ContextMenuElement);
  return ContextMenuElement;
}

defineContextMenu();

export default ContextMenuElement;
