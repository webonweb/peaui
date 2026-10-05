import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { BreadcrumbsLeafRenderer } from '@/react/renderer-entries/navigation.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type BreadcrumbsProps = PeauiReactProps<'Breadcrumbs'>;

const Breadcrumbs = createDirectReactComponent('Breadcrumbs', BreadcrumbsLeafRenderer);

export default Breadcrumbs;
