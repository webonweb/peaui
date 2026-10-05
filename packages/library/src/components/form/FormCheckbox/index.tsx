import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { ChoiceControlsRenderer } from '@/react/renderer-entries/choice-controls.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormCheckboxProps = PeauiReactProps<'FormCheckbox'>;

const FormCheckbox = createDirectReactComponent('FormCheckbox', ChoiceControlsRenderer);

export default FormCheckbox;
