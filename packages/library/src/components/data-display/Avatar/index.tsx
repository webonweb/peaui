import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { AvatarRenderer } from '@/react/renderer-entries/avatar.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type AvatarProps = PeauiReactProps<'Avatar'>;

const Avatar = createDirectReactComponent('Avatar', AvatarRenderer);

export default Avatar;
