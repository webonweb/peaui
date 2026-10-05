import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { NavigationStepperLeafRenderer } from '@/react/renderer-entries/navigation.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type NavigationStepperProps = PeauiReactProps<'NavigationStepper'>;

const NavigationStepper = createDirectReactComponent(
  'NavigationStepper',
  NavigationStepperLeafRenderer,
);

export default NavigationStepper;
