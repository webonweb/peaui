import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { CardCarouselLeafRenderer } from '@/react/renderer-entries/display.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type CardCarouselProps = PeauiReactProps<'CardCarousel'>;

const CardCarousel = createDirectReactComponent('CardCarousel', CardCarouselLeafRenderer);

export default CardCarousel;
