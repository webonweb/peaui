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

type VueCustomElementInternals = {
  _instance?: { exposed?: Partial<ExposedContextMenu> };
};

const ContextMenuVueElement = createVueCustomElement(
  ContextMenuVueComponent,
  `${UIKIT_NAME}-context-menu`,
);

/** Light-DOM Web Component exposing the same imperative positioning API as Vue and React refs. */
export class ContextMenuElement extends ContextMenuVueElement {
  static readonly tagName = `${UIKIT_NAME}-context-menu`;

  openAt(point: ContextMenuPoint): boolean {
    return this.exposed()?.openAt?.(point) ?? false;
  }

  close(): void {
    this.exposed()?.close?.();
  }

  private exposed(): Partial<ExposedContextMenu> | undefined {
    return (this as unknown as VueCustomElementInternals)._instance?.exposed;
  }
}

export function defineContextMenu(): typeof ContextMenuElement {
  definePeauiCustomElement(ContextMenuElement);
  return ContextMenuElement;
}

defineContextMenu();

export default ContextMenuElement;
