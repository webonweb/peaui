import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { ButtonExportLeafRenderer } from '@/react/renderer-entries/button.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type ButtonExportProps = PeauiReactProps<'ButtonExport'>;

const ButtonExport = createDirectReactComponent('ButtonExport', ButtonExportLeafRenderer);

export default ButtonExport;
