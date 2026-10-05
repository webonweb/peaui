import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { FileRenderer } from '@/react/renderer-entries/file.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormFileUploadProps = PeauiReactProps<'FormFileUpload'>;

const FormFileUpload = createDirectReactComponent('FormFileUpload', FileRenderer);

export default FormFileUpload;

export type { FormFileUploadValue, FileUploadValueMode } from './file-upload.shared';
