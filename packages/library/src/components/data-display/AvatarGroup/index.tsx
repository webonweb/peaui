import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type AvatarGroupProps = PeauiReactProps<'AvatarGroup'>;

const AvatarGroup = createPeauiReactComponent('AvatarGroup');

export default AvatarGroup;
