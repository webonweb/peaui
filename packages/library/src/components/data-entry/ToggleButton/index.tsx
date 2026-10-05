import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';

import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { ToggleButtonRenderer } from '@/react/renderer-entries/toggle-button.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type ToggleButtonProps = PeauiReactProps<'ToggleButton'>;

const ToggleButton = createDirectReactComponent(
  'ToggleButton',
  ToggleButtonRenderer,
) as unknown as ForwardRefExoticComponent<
  PropsWithoutRef<ToggleButtonProps> & RefAttributes<HTMLButtonElement>
>;

export default ToggleButton;
