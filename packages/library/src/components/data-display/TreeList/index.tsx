import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type TreeListProps = PeauiReactProps<'TreeList'>;

const TreeList = createPeauiReactComponent('TreeList');

export default TreeList;
