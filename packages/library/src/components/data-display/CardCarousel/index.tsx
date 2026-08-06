import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type CardCarouselProps = PeauiReactProps<'CardCarousel'>;

const CardCarousel = createPeauiReactComponent('CardCarousel');

export default CardCarousel;
