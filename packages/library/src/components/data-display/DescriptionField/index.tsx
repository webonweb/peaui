import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { DescriptionFieldLeafRenderer } from '@/react/renderer-entries/display.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type DescriptionFieldProps = PeauiReactProps<'DescriptionField'>;

const DescriptionField = createDirectReactComponent(
  'DescriptionField',
  DescriptionFieldLeafRenderer,
);

export default DescriptionField;
