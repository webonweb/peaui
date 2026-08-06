import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type ModalDialogProps = PeauiReactProps<'ModalDialog'>;

const ModalDialog = createPeauiReactComponent('ModalDialog');

export default ModalDialog;
