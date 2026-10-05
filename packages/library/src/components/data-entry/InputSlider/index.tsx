import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { InputSliderLeafRenderer } from '@/react/renderer-entries/text-input.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type InputSliderProps = PeauiReactProps<'InputSlider'>;

const InputSlider = createDirectReactComponent('InputSlider', InputSliderLeafRenderer);

export default InputSlider;
