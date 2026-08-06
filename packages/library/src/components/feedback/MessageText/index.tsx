import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type MessageTextProps = PeauiReactProps<'MessageText'>;

const MessageText = createPeauiReactComponent('MessageText');

export default MessageText;
