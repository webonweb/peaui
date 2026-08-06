import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type SearchInputProps = PeauiReactProps<'SearchInput'>;

const SearchInput = createPeauiReactComponent('SearchInput');

export default SearchInput;
