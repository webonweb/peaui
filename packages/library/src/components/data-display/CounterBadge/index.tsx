import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type CounterBadgeProps = PeauiReactProps<'CounterBadge'>;

const CounterBadge = createPeauiReactComponent('CounterBadge');

export default CounterBadge;
