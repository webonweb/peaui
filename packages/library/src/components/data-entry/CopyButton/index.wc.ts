import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import CopyButtonVueComponent from './index.ce.vue';
import type {
  CopyButtonContent,
  CopyButtonSize,
  CopyButtonTextResolver,
  CopyButtonVariant,
} from './copy-button.shared';

const CopyButtonVueElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(CopyButtonVueComponent, `${UIKIT_NAME}-copy-button`);

/** Light-DOM adapter exposing asynchronous text resolution as a property. */
export class CopyButtonElement extends CopyButtonVueElement {
  static readonly tagName = CopyButtonVueElement.tagName;

  declare text: string;
  declare getText: CopyButtonTextResolver;
  declare resetDelay: number;
  declare content: CopyButtonContent;
  declare variant: CopyButtonVariant;
  declare size: CopyButtonSize;
  declare loading: boolean;
  declare disabled: boolean;
  declare showStatus: boolean;
}

export function defineCopyButton(): typeof CopyButtonElement {
  definePeauiCustomElement(CopyButtonElement);
  return CopyButtonElement;
}

defineCopyButton();

export default CopyButtonElement;
