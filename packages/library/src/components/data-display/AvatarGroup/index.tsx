import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { AvatarGroupRenderer } from '@/react/renderer-entries/avatar-group.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type AvatarGroupProps = PeauiReactProps<'AvatarGroup'>;

const AvatarGroup = createDirectReactComponent('AvatarGroup', AvatarGroupRenderer);

export default AvatarGroup;
