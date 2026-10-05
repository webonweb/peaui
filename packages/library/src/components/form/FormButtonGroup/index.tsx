import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { ButtonGroupRenderer } from '@/react/renderer-entries/button-group.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormButtonGroupProps = PeauiReactProps<'FormButtonGroup'>;

const FormButtonGroup = createDirectReactComponent('FormButtonGroup', ButtonGroupRenderer);

export default FormButtonGroup;
