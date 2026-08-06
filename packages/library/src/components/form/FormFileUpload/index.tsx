import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type FormFileUploadProps = PeauiReactProps<'FormFileUpload'>;

const FormFileUpload = createPeauiReactComponent('FormFileUpload');

export default FormFileUpload;
