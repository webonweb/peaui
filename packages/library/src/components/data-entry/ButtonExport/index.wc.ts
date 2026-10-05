import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import ButtonExportVueComponent from './index.ce.vue';

export const ButtonExportElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(ButtonExportVueComponent, `${UIKIT_NAME}-button-export`);

export function defineButtonExport(): void {
  definePeauiCustomElement(ButtonExportElement);
}

defineButtonExport();

export default ButtonExportElement;
