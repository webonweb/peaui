import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { BasicRenderer } from '@/react/renderer-entries/basic.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type SvgIconProps = PeauiReactProps<'SvgIcon'>;

const SvgIcon = createDirectReactComponent('SvgIcon', BasicRenderer);

export default SvgIcon;
