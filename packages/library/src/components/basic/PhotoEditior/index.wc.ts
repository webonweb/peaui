import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import PhotoEditorVueComponent from './index.ce.vue';

export const PhotoEditorElement = createVueCustomElement(
  PhotoEditorVueComponent,
  `${UIKIT_NAME}-photo-editor`,
);

export function definePhotoEditor(): void {
  definePeauiCustomElement(PhotoEditorElement);
}

definePhotoEditor();

export default PhotoEditorElement;
