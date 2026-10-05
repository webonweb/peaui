import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { CalculationResultsLeafRenderer } from '@/react/renderer-entries/display.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type CalculationResultsProps = PeauiReactProps<'CalculationResults'>;

const CalculationResults = createDirectReactComponent(
  'CalculationResults',
  CalculationResultsLeafRenderer,
);

export default CalculationResults;
