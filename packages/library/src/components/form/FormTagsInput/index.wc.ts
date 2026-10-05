import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import type {
  FormTagsInputKeyGetter,
  FormTagsInputNormalizer,
  FormTagsInputSerializer,
  FormTagsInputSuggestionProvider,
  FormTagsInputTag,
  FormTagsInputValidator,
} from './tags-input.shared';
import FormTagsInputVueComponent from './index.ce.vue';

const FormTagsInputVueElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(FormTagsInputVueComponent, `${UIKIT_NAME}-form-tags-input`);

/** Light-DOM custom element preserving the Vue FormTagsInput contract. */
export class FormTagsInputElement extends FormTagsInputVueElement {
  static readonly tagName = FormTagsInputVueElement.tagName;

  declare value: FormTagsInputTag[];
  declare inputValue: string;
  declare suggestions: readonly FormTagsInputTag[];
  declare separators: readonly string[];
  declare disabledTags: readonly (string | number)[];
  declare normalizeTag?: FormTagsInputNormalizer;
  declare validateTag?: FormTagsInputValidator;
  declare getTagKey?: FormTagsInputKeyGetter;
  declare serializeTag?: FormTagsInputSerializer;
  declare suggestionProvider?: FormTagsInputSuggestionProvider;

  constructor() {
    super();
    this.addEventListener('update:value', this.syncValueProperty);
    this.addEventListener('update:inputValue', this.syncInputValueProperty);
  }

  override connectedCallback(): void {
    for (const name of [
      'label',
      'hint',
      'tag',
      'tag-content',
      'suggestion',
      'empty-suggestions',
      'loading',
      'prefix',
      'suffix',
      'description',
      'error',
    ] as const) {
      if (this.querySelector(`:scope > [slot="${name}"]`)) {
        this.setAttribute(`data-peaui-native-slot-${name}`, '');
      }
    }
    super.connectedCallback();
  }

  private readonly syncValueProperty = (event: Event): void => {
    const nextValue = (event as CustomEvent<FormTagsInputTag[]>).detail;
    if (!Object.is(this.value, nextValue)) this.value = nextValue;
  };

  private readonly syncInputValueProperty = (event: Event): void => {
    const nextValue = (event as CustomEvent<string>).detail;
    if (!Object.is(this.inputValue, nextValue)) this.inputValue = nextValue;
  };
}

export function defineFormTagsInput(): typeof FormTagsInputElement {
  definePeauiCustomElement(FormTagsInputElement);
  return FormTagsInputElement;
}

defineFormTagsInput();

export default FormTagsInputElement;
