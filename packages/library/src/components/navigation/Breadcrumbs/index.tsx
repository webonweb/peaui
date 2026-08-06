import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type BreadcrumbsProps = PeauiReactProps<'Breadcrumbs'>;

const Breadcrumbs = createPeauiReactComponent('Breadcrumbs');

export default Breadcrumbs;
