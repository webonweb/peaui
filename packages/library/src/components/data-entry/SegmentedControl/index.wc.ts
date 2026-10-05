import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import SegmentedControlVueComponent, { type SegmentedControlModelValue } from './index.vue';

const SegmentedControlVueElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(SegmentedControlVueComponent, `${UIKIT_NAME}-segmented-control`);

/** Light-DOM custom element exposing the same controlled value as Vue and React. */
export class SegmentedControlElement extends SegmentedControlVueElement {
  static readonly tagName = SegmentedControlVueElement.tagName;

  constructor() {
    super();
    this.addEventListener('update:value', this.syncValueProperty);
  }

  private readonly syncValueProperty = (event: Event): void => {
    const nextValue = (event as CustomEvent<SegmentedControlModelValue>).detail;
    const element = this as unknown as Record<string, unknown>;
    if (!Object.is(element.value, nextValue)) element.value = nextValue;
  };
}

export function defineSegmentedControl(): typeof SegmentedControlElement {
  definePeauiCustomElement(SegmentedControlElement);
  return SegmentedControlElement;
}

defineSegmentedControl();

export default SegmentedControlElement;
