import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { SelectRenderer } from '@/react/renderer-entries/select.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormMultiSelectProps = PeauiReactProps<'FormMultiSelect'>;

const FormMultiSelect = createDirectReactComponent('FormMultiSelect', SelectRenderer);

export default FormMultiSelect;
