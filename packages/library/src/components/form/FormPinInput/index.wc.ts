import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormPinInputVueComponent from './index.ce.vue';

const FormPinInputVueElement = createVueCustomElement(
  FormPinInputVueComponent,
  `${UIKIT_NAME}-form-pin-input`,
);

/** Light-DOM custom element preserving the Vue FormPinInput contract. */
export class FormPinInputElement extends FormPinInputVueElement {
  static readonly tagName = FormPinInputVueElement.tagName;

  constructor() {
    super();
    this.addEventListener('update:value', this.syncValueProperty);
  }

  override connectedCallback(): void {
    for (const name of ['label', 'hint', 'separator', 'description', 'error'] as const) {
      if (this.querySelector(`:scope > [slot="${name}"]`)) {
        this.setAttribute(`data-peaui-native-slot-${name}`, '');
      }
    }
    super.connectedCallback();
  }

  private readonly syncValueProperty = (event: Event): void => {
    const nextValue = (event as CustomEvent<string>).detail;
    const element = this as unknown as Record<string, unknown>;
    if (!Object.is(element.value, nextValue)) element.value = nextValue;
  };
}

export function defineFormPinInput(): typeof FormPinInputElement {
  definePeauiCustomElement(FormPinInputElement);
  return FormPinInputElement;
}

defineFormPinInput();

export default FormPinInputElement;
