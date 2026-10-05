import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { TagChipLeafRenderer } from '@/react/renderer-entries/display.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type TagChipProps = PeauiReactProps<'TagChip'>;

const TagChip = createDirectReactComponent('TagChip', TagChipLeafRenderer);

export default TagChip;
