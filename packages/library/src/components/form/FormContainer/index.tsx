import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { FormContainerLeafRenderer } from '@/react/renderer-entries/form-container.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormContainerProps = PeauiReactProps<'FormContainer'>;

const FormContainer = createDirectReactComponent('FormContainer', FormContainerLeafRenderer);

export default FormContainer;
