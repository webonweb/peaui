import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type ButtonActionProps = PeauiReactProps<'ButtonAction'>;

const ButtonAction = createPeauiReactComponent('ButtonAction');

export default ButtonAction;
