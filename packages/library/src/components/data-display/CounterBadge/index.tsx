import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { CounterBadgeLeafRenderer } from '@/react/renderer-entries/display.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type CounterBadgeProps = PeauiReactProps<'CounterBadge'>;

const CounterBadge = createDirectReactComponent('CounterBadge', CounterBadgeLeafRenderer);

export default CounterBadge;
