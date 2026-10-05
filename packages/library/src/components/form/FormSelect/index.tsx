import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { SelectRenderer } from '@/react/renderer-entries/select.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormSelectProps = PeauiReactProps<'FormSelect'>;

const FormSelect = createDirectReactComponent('FormSelect', SelectRenderer);

export default FormSelect;
