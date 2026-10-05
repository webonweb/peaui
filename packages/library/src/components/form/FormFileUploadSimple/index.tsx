import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { FileRenderer } from '@/react/renderer-entries/file.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormFileUploadSimpleProps = PeauiReactProps<'FormFileUploadSimple'>;

const FormFileUploadSimple = createDirectReactComponent('FormFileUploadSimple', FileRenderer);

export default FormFileUploadSimple;
