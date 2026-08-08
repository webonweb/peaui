import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormTimePickerVueComponent from './index.ce.vue';

const FormTimePickerVueElement = createVueCustomElement(
  FormTimePickerVueComponent,
  `${UIKIT_NAME}-form-time-picker`,
);

/** Light-DOM custom element preserving the Vue FormTimePicker contract. */
export class FormTimePickerElement extends FormTimePickerVueElement {
  static readonly tagName = FormTimePickerVueElement.tagName;

  constructor() {
    super();
    this.addEventListener('update:value', this.syncValueProperty);
    this.addEventListener('update:open', this.syncOpenProperty);
  }

  override connectedCallback(): void {
    for (const name of ['hint', 'description', 'footer'] as const) {
      if (this.querySelector(`:scope > [slot="${name}"]`)) {
        this.setAttribute(`data-peaui-native-slot-${name}`, '');
      }
    }
    super.connectedCallback();
  }

  private readonly syncValueProperty = (event: Event): void => {
    const nextValue = (event as CustomEvent<string | undefined>).detail;
    const element = this as unknown as Record<string, unknown>;
    if (!Object.is(element.value, nextValue)) element.value = nextValue;
  };

  private readonly syncOpenProperty = (event: Event): void => {
    const nextOpen = (event as CustomEvent<boolean>).detail;
    const element = this as unknown as Record<string, unknown>;
    if (!Object.is(element.open, nextOpen)) element.open = nextOpen;
  };
}

export function defineFormTimePicker(): typeof FormTimePickerElement {
  definePeauiCustomElement(FormTimePickerElement);
  return FormTimePickerElement;
}

defineFormTimePicker();

export default FormTimePickerElement;
