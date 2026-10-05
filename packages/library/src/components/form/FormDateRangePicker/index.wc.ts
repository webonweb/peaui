import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormDateRangePickerVueComponent from './index.ce.vue';
import type { DateRangeValue } from './date-range-picker.shared';

const FormDateRangePickerVueElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(FormDateRangePickerVueComponent, `${UIKIT_NAME}-form-date-range-picker`);

/** Light-DOM custom element preserving the Vue FormDateRangePicker contract. */
export class FormDateRangePickerElement extends FormDateRangePickerVueElement {
  static readonly tagName = FormDateRangePickerVueElement.tagName;

  constructor() {
    super();
    this.addEventListener('update:value', this.syncValueProperty);
    this.addEventListener('update:open', this.syncOpenProperty);
  }

  override connectedCallback(): void {
    for (const name of [
      'day',
      'description',
      'end-label',
      'error',
      'footer',
      'hint',
      'preset',
      'start-label',
      'trigger',
    ] as const) {
      if (this.querySelector(`:scope > [slot="${name}"]`)) {
        this.setAttribute(`data-peaui-native-slot-${name}`, '');
      }
    }
    super.connectedCallback();
  }

  private readonly syncValueProperty = (event: Event): void => {
    const nextValue = (event as CustomEvent<DateRangeValue | undefined>).detail;
    const element = this as unknown as Record<string, unknown>;
    if (!Object.is(element.value, nextValue)) element.value = nextValue;
  };

  private readonly syncOpenProperty = (event: Event): void => {
    const nextOpen = (event as CustomEvent<boolean>).detail;
    const element = this as unknown as Record<string, unknown>;
    if (!Object.is(element.open, nextOpen)) element.open = nextOpen;
  };
}

export function defineFormDateRangePicker(): typeof FormDateRangePickerElement {
  definePeauiCustomElement(FormDateRangePickerElement);
  return FormDateRangePickerElement;
}

defineFormDateRangePicker();

export default FormDateRangePickerElement;
