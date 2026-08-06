import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type ButtonExportProps = PeauiReactProps<'ButtonExport'>;

const ButtonExport = createPeauiReactComponent('ButtonExport');

export default ButtonExport;
