import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import FormSwitchToggleVueComponent from './index.vue';

const FormSwitchToggleVueElement = createVueCustomElement(
  FormSwitchToggleVueComponent,
  `${UIKIT_NAME}-form-switch-toggle`,
);

/**
 * A native custom element keeps its public `value` property in sync after a
 * user change. Consumers may still overwrite the property from an
 * `update:value` listener to use the component in a controlled mode.
 */
export class FormSwitchToggleElement extends FormSwitchToggleVueElement {
  static readonly tagName = FormSwitchToggleVueElement.tagName;

  constructor() {
    super();
    this.addEventListener('click', this.activateInputFromLabel);
    this.addEventListener('update:value', this.syncValueProperty);
  }

  private readonly activateInputFromLabel = (event: Event): void => {
    const target = event.target;

    if (!(target instanceof Element) || target.matches('.peaui-form-switch-toggle__input')) return;
    if (!target.closest('.peaui-form-switch-toggle__interaction')) return;

    event.preventDefault();
    this.querySelector<HTMLInputElement>('.peaui-form-switch-toggle__input')?.click();
  };

  private readonly syncValueProperty = (event: Event): void => {
    const nextValue = (event as CustomEvent<unknown>).detail;
    const element = this as unknown as Record<string, unknown>;

    if (!Object.is(element.value, nextValue)) {
      element.value = nextValue;
    }
  };
}

export function defineFormSwitchToggle(): typeof FormSwitchToggleElement {
  definePeauiCustomElement(FormSwitchToggleElement);

  return FormSwitchToggleElement;
}

defineFormSwitchToggle();

export default FormSwitchToggleElement;
