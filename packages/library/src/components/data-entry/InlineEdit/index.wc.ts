import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import InlineEditVueComponent from './index.ce.vue';
import type {
  InlineEditActions,
  InlineEditActivation,
  InlineEditDisplay,
  InlineEditEditor,
  InlineEditSaveMode,
  InlineEditTabBehavior,
  InlineEditValidate,
  InlineEditValue,
} from './inline-edit.shared';

const InlineEditVueElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(InlineEditVueComponent, `${UIKIT_NAME}-inline-edit`);

/** Light-DOM adapter with controlled value and editing properties. */
export class InlineEditElement extends InlineEditVueElement {
  static readonly tagName = InlineEditVueElement.tagName;

  declare value: InlineEditValue;
  declare editing: boolean;
  declare editor: InlineEditEditor;
  declare editorProps: Record<string, unknown>;
  declare activation: InlineEditActivation;
  declare actions: InlineEditActions;
  declare display: InlineEditDisplay;
  declare tabBehavior: InlineEditTabBehavior;
  declare saveMode: InlineEditSaveMode;
  declare validate: InlineEditValidate;
  declare loading: boolean;
  declare error: string;
  declare disabled: boolean;
  declare readonly: boolean;

  constructor() {
    super();
    this.addEventListener('update:value', this.syncValueProperty);
    this.addEventListener('update:editing', this.syncEditingProperty);
  }

  private readonly syncValueProperty = (event: Event): void => {
    const next = (event as CustomEvent<InlineEditValue>).detail;
    if (!Object.is(this.value, next)) this.value = next;
  };

  private readonly syncEditingProperty = (event: Event): void => {
    const next = (event as CustomEvent<boolean>).detail;
    if (!Object.is(this.editing, next)) this.editing = next;
  };
}

export function defineInlineEdit(): typeof InlineEditElement {
  definePeauiCustomElement(InlineEditElement);
  return InlineEditElement;
}

defineInlineEdit();

export default InlineEditElement;
