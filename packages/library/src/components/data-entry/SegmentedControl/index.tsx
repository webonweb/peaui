import type { KeyboardEvent, MouseEvent, ReactElement, RefAttributes } from 'react';

import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { SegmentedControlRenderer } from '@/react/renderer-entries/segmented-control.renderer-entry';
import type {
  PeauiReactProps,
  PeauiSegmentedControlItem,
  PeauiSegmentedControlValue,
} from '@/react/generated-react-props';

type GeneratedSegmentedControlProps = PeauiReactProps<'SegmentedControl'>;
export type SegmentedControlProps = Omit<
  GeneratedSegmentedControlProps,
  'defaultValue' | 'onChange' | 'onValueChange' | 'value'
> & {
  value?: PeauiSegmentedControlValue | null;
  defaultValue?: PeauiSegmentedControlValue | null;
  onValueChange?: (value: PeauiSegmentedControlValue) => void;
  onChange?: (
    value: PeauiSegmentedControlValue,
    item: PeauiSegmentedControlItem,
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
  ) => void;
};
export type SegmentedControlItem = PeauiSegmentedControlItem;
export type SegmentedControlValue = PeauiSegmentedControlValue;

const SegmentedControlBase = createDirectReactComponent(
  'SegmentedControl',
  SegmentedControlRenderer,
);
const SegmentedControl = SegmentedControlBase as unknown as (
  props: SegmentedControlProps & RefAttributes<HTMLDivElement>,
) => ReactElement | null;

export default SegmentedControl;
