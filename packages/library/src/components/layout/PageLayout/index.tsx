import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { PageLayoutLeafRenderer } from '@/react/renderer-entries/layout.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type PageLayoutProps = PeauiReactProps<'PageLayout'>;

const PageLayout = createDirectReactComponent('PageLayout', PageLayoutLeafRenderer);

export default PageLayout;
