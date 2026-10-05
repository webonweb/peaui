import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { MessageTextLeafRenderer } from '@/react/renderer-entries/feedback.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type MessageTextProps = PeauiReactProps<'MessageText'>;

const MessageText = createDirectReactComponent('MessageText', MessageTextLeafRenderer);

export default MessageText;
