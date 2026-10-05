import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormDateTimePickerVueComponent from './index.ce.vue';
import type { LocalDateTimeValue } from './date-time-picker.shared';

const FormDateTimePickerVueElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(FormDateTimePickerVueComponent, `${UIKIT_NAME}-form-date-time-picker`);

/** Light-DOM custom element preserving the Vue FormDateTimePicker contract. */
export class FormDateTimePickerElement extends FormDateTimePickerVueElement {
  static readonly tagName = FormDateTimePickerVueElement.tagName;

  constructor() {
    super();
    this.addEventListener('update:value', this.syncValueProperty);
    this.addEventListener('update:open', this.syncOpenProperty);
  }

  override connectedCallback(): void {
    for (const name of ['hint', 'description', 'error', 'footer'] as const) {
      if (this.querySelector(`:scope > [slot="${name}"]`)) {
        this.setAttribute(`data-peaui-native-slot-${name}`, '');
      }
    }
    super.connectedCallback();
  }

  private readonly syncValueProperty = (event: Event): void => {
    const nextValue = (event as CustomEvent<LocalDateTimeValue | undefined>).detail;
    const element = this as unknown as Record<string, unknown>;
    if (!Object.is(element.value, nextValue)) element.value = nextValue;
  };

  private readonly syncOpenProperty = (event: Event): void => {
    const nextOpen = (event as CustomEvent<boolean>).detail;
    const element = this as unknown as Record<string, unknown>;
    if (!Object.is(element.open, nextOpen)) element.open = nextOpen;
  };
}

export function defineFormDateTimePicker(): typeof FormDateTimePickerElement {
  definePeauiCustomElement(FormDateTimePickerElement);
  return FormDateTimePickerElement;
}

defineFormDateTimePicker();

export default FormDateTimePickerElement;
