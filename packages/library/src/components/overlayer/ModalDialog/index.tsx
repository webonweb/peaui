import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { DialogLeafRenderer } from '@/react/renderer-entries/dialog-leaf.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type ModalDialogProps = PeauiReactProps<'ModalDialog'>;

const ModalDialog = createDirectReactComponent('ModalDialog', DialogLeafRenderer);

export default ModalDialog;
