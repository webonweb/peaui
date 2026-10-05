import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { EmptyStateLeafRenderer } from '@/react/renderer-entries/feedback.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type EmptyStateProps = PeauiReactProps<'EmptyState'>;

const EmptyState = createDirectReactComponent('EmptyState', EmptyStateLeafRenderer);

export default EmptyState;
