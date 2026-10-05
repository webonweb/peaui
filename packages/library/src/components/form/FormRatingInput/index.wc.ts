import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormRatingInputVueComponent from './index.vue';
import type { RatingValue } from './rating-input.shared';

const FormRatingInputVueElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(FormRatingInputVueComponent, `${UIKIT_NAME}-form-rating-input`);

/** Light-DOM custom element preserving the Vue FormRatingInput contract. */
export class FormRatingInputElement extends FormRatingInputVueElement {
  static readonly tagName = FormRatingInputVueElement.tagName;

  constructor() {
    super();
    this.addEventListener('update:value', this.syncValueProperty);
  }

  override connectedCallback(): void {
    for (const name of ['description', 'error', 'icon', 'label', 'value-label'] as const) {
      if (this.querySelector(`:scope > [slot="${name}"]`)) {
        this.setAttribute(`data-peaui-native-slot-${name}`, '');
      }
    }
    super.connectedCallback();
  }

  private readonly syncValueProperty = (event: Event): void => {
    const nextValue = (event as CustomEvent<RatingValue>).detail;
    const element = this as unknown as Record<string, unknown>;
    if (!Object.is(element.value, nextValue)) element.value = nextValue;
  };
}

export function defineFormRatingInput(): typeof FormRatingInputElement {
  definePeauiCustomElement(FormRatingInputElement);
  return FormRatingInputElement;
}

defineFormRatingInput();

export default FormRatingInputElement;
