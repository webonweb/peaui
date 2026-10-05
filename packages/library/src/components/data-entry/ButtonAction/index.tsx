import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { ButtonActionRenderer } from '@/react/renderer-entries/button-action.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type ButtonActionProps = PeauiReactProps<'ButtonAction'>;

const ButtonAction = createDirectReactComponent('ButtonAction', ButtonActionRenderer);

export default ButtonAction;
