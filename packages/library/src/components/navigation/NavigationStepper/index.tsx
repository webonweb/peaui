import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type NavigationStepperProps = PeauiReactProps<'NavigationStepper'>;

const NavigationStepper = createPeauiReactComponent('NavigationStepper');

export default NavigationStepper;
