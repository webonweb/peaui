import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';

import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type ToggleButtonProps = PeauiReactProps<'ToggleButton'>;

const ToggleButton = createPeauiReactComponent(
  'ToggleButton',
) as unknown as ForwardRefExoticComponent<
  PropsWithoutRef<ToggleButtonProps> & RefAttributes<HTMLButtonElement>
>;

export default ToggleButton;
