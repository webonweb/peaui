import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type AvatarProps = PeauiReactProps<'Avatar'>;

const Avatar = createPeauiReactComponent('Avatar');

export default Avatar;
