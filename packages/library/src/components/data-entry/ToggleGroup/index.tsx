import type { MouseEvent, ReactElement, RefAttributes } from 'react';

import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type {
  PeauiReactProps,
  PeauiToggleGroupItem,
  PeauiToggleGroupValue,
} from '@/react/generated-react-props';

type GeneratedToggleGroupProps = PeauiReactProps<'ToggleGroup'>;
type ToggleGroupCommonProps = Omit<
  GeneratedToggleGroupProps,
  'defaultValue' | 'onChange' | 'onValueChange' | 'type' | 'value'
> & {
  onChange?: (
    value: PeauiToggleGroupValue | PeauiToggleGroupValue[] | null,
    item: PeauiToggleGroupItem,
    event: MouseEvent<HTMLButtonElement>,
  ) => void;
};
type ToggleGroupSingleProps = {
  type?: 'single';
  value?: PeauiToggleGroupValue | null;
  defaultValue?: PeauiToggleGroupValue | null;
  onValueChange?: (value: PeauiToggleGroupValue | null) => void;
};
type ToggleGroupMultipleProps = {
  type: 'multiple';
  value?: PeauiToggleGroupValue[];
  defaultValue?: PeauiToggleGroupValue[];
  onValueChange?: (value: PeauiToggleGroupValue[]) => void;
};

export type ToggleGroupProps = ToggleGroupCommonProps &
  (ToggleGroupSingleProps | ToggleGroupMultipleProps);
export type ToggleGroupItem = PeauiToggleGroupItem;
export type ToggleGroupValue = PeauiToggleGroupValue;

const ToggleGroupBase = createPeauiReactComponent('ToggleGroup');
const ToggleGroup = ToggleGroupBase as unknown as (
  props: ToggleGroupProps & RefAttributes<HTMLDivElement>,
) => ReactElement | null;

export default ToggleGroup;
