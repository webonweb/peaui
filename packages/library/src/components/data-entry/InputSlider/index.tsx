import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type InputSliderProps = PeauiReactProps<'InputSlider'>;

const InputSlider = createPeauiReactComponent('InputSlider');

export default InputSlider;
