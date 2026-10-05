import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import SearchInputVueComponent from './index.ce.vue';

export const SearchInputElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(SearchInputVueComponent, `${UIKIT_NAME}-search-input`);

export function defineSearchInput(): void {
  definePeauiCustomElement(SearchInputElement);
}

defineSearchInput();

export default SearchInputElement;
