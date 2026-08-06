import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type TagChipProps = PeauiReactProps<'TagChip'>;

const TagChip = createPeauiReactComponent('TagChip');

export default TagChip;
