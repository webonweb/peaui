import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type PageLayoutProps = PeauiReactProps<'PageLayout'>;

const PageLayout = createPeauiReactComponent('PageLayout');

export default PageLayout;
