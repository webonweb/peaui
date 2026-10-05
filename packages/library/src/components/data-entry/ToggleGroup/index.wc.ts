import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import ToggleGroupVueComponent, { type ToggleGroupModelValue } from './index.vue';

const ToggleGroupVueElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(ToggleGroupVueComponent, `${UIKIT_NAME}-toggle-group`);

/** Light-DOM custom element with a reflected controlled value property. */
export class ToggleGroupElement extends ToggleGroupVueElement {
  static readonly tagName = ToggleGroupVueElement.tagName;

  constructor() {
    super();
    this.addEventListener('update:value', this.syncValueProperty);
  }

  private readonly syncValueProperty = (event: Event): void => {
    const nextValue = (event as CustomEvent<ToggleGroupModelValue>).detail;
    const element = this as unknown as Record<string, unknown>;
    if (!Object.is(element.value, nextValue)) element.value = nextValue;
  };
}

export function defineToggleGroup(): typeof ToggleGroupElement {
  definePeauiCustomElement(ToggleGroupElement);
  return ToggleGroupElement;
}

defineToggleGroup();

export default ToggleGroupElement;
