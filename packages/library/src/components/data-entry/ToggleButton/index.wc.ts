import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import ToggleButtonVueComponent from './index.vue';

const ToggleButtonVueElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(ToggleButtonVueComponent, `${UIKIT_NAME}-toggle-button`);

/**
 * The light-DOM adapter mirrors the boolean model property and exposes one
 * component-level `click` CustomEvent instead of both that event and the
 * internal button's bubbled native click.
 */
export class ToggleButtonElement extends ToggleButtonVueElement {
  static readonly tagName = ToggleButtonVueElement.tagName;

  constructor() {
    super();
    this.addEventListener('click', this.suppressInternalNativeClick);
    this.addEventListener('update:value', this.syncValueProperty);
  }

  private readonly suppressInternalNativeClick = (event: Event): void => {
    if (!(event instanceof MouseEvent)) return;

    const target = event.target;
    if (target instanceof Element && target.closest('.peaui-toggle-button')) {
      event.stopImmediatePropagation();
    }
  };

  private readonly syncValueProperty = (event: Event): void => {
    const nextValue = (event as CustomEvent<boolean>).detail;
    const element = this as unknown as Record<string, unknown>;

    if (!Object.is(element.value, nextValue)) element.value = nextValue;
  };
}

export function defineToggleButton(): typeof ToggleButtonElement {
  definePeauiCustomElement(ToggleButtonElement);
  return ToggleButtonElement;
}

defineToggleButton();

export default ToggleButtonElement;
