import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { ToastAlertLeafRenderer } from '@/react/renderer-entries/feedback.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type ToastAlertProps = PeauiReactProps<'ToastAlert'>;

const ToastAlert = createDirectReactComponent('ToastAlert', ToastAlertLeafRenderer);

export default ToastAlert;
