import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import KeyboardKeyVueComponent from './index.ce.vue';
import type {
  KeyboardKeyFormat,
  KeyboardKeyPlatform,
  KeyboardKeySize,
} from './keyboard-key.shared';

const KeyboardKeyVueElement = createVueCustomElement(
  KeyboardKeyVueComponent,
  `${UIKIT_NAME}-keyboard-key`,
);

/** Light-DOM representation of a key or shortcut with Vue-equivalent semantics. */
export class KeyboardKeyElement extends KeyboardKeyVueElement {
  static readonly tagName = KeyboardKeyVueElement.tagName;

  declare keys: string | readonly string[];
  declare platform: KeyboardKeyPlatform;
  declare format: KeyboardKeyFormat;
  declare size: KeyboardKeySize;
  declare inline: boolean;
  declare separator: string;
  declare ariaLabel: string;
  declare muted: boolean;
}

export function defineKeyboardKey(): typeof KeyboardKeyElement {
  definePeauiCustomElement(KeyboardKeyElement);
  return KeyboardKeyElement;
}

defineKeyboardKey();

export default KeyboardKeyElement;
