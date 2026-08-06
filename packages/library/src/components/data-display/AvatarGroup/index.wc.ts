import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import AvatarGroupVueComponent from './index.vue';

export const AvatarGroupElement = createVueCustomElement(
  AvatarGroupVueComponent,
  `${UIKIT_NAME}-avatar-group`,
);

export function defineAvatarGroup(): typeof AvatarGroupElement {
  definePeauiCustomElement(AvatarGroupElement);

  return AvatarGroupElement;
}

defineAvatarGroup();

export default AvatarGroupElement;
