import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import SplitButtonVueComponent from './index.vue';

const SplitButtonVueElement = createVueCustomElement(
  SplitButtonVueComponent,
  `${UIKIT_NAME}-split-button`,
);

/** Light-DOM custom element preserving the Vue SplitButton contract. */
export class SplitButtonElement extends SplitButtonVueElement {
  static readonly tagName = SplitButtonVueElement.tagName;

  constructor() {
    super();
    this.addEventListener('update:open', this.syncOpenProperty);
  }

  private readonly syncOpenProperty = (event: Event): void => {
    const nextOpen = (event as CustomEvent<boolean>).detail;
    const element = this as unknown as Record<string, unknown>;
    if (!Object.is(element.open, nextOpen)) element.open = nextOpen;
  };
}

export function defineSplitButton(): typeof SplitButtonElement {
  definePeauiCustomElement(SplitButtonElement);
  return SplitButtonElement;
}

defineSplitButton();

export default SplitButtonElement;
