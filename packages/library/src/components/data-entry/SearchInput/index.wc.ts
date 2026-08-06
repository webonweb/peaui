import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import SearchInputVueComponent from './index.ce.vue';

export const SearchInputElement = createVueCustomElement(
  SearchInputVueComponent,
  `${UIKIT_NAME}-search-input`,
);

export function defineSearchInput(): void {
  definePeauiCustomElement(SearchInputElement);
}

defineSearchInput();

export default SearchInputElement;
