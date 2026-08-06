import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type SvgIconProps = PeauiReactProps<'SvgIcon'>;

const SvgIcon = createPeauiReactComponent('SvgIcon');

export default SvgIcon;
