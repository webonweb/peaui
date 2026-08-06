import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type CalculationResultsProps = PeauiReactProps<'CalculationResults'>;

const CalculationResults = createPeauiReactComponent('CalculationResults');

export default CalculationResults;
