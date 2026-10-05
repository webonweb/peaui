import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { TreeListLeafRenderer } from '@/react/renderer-entries/display.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type TreeListProps = PeauiReactProps<'TreeList'>;

const TreeList = createDirectReactComponent('TreeList', TreeListLeafRenderer);

export default TreeList;
