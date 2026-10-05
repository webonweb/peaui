import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { SearchInputLeafRenderer } from '@/react/renderer-entries/text-input.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type SearchInputProps = PeauiReactProps<'SearchInput'>;

const SearchInput = createDirectReactComponent('SearchInput', SearchInputLeafRenderer);

export default SearchInput;
