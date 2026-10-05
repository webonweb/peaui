import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { ProgressIndicatorLeafRenderer } from '@/react/renderer-entries/feedback.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type ProgressIndicatorProps = PeauiReactProps<'ProgressIndicator'>;

const ProgressIndicator = createDirectReactComponent(
  'ProgressIndicator',
  ProgressIndicatorLeafRenderer,
);

export default ProgressIndicator;
