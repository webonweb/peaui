import type { MouseEvent, ReactElement, RefAttributes } from 'react';

import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiDropdownMenuItem, PeauiReactProps } from '@/react/generated-react-props';

type GeneratedSplitButtonProps = PeauiReactProps<'SplitButton'>;

export type SplitButtonProps = Omit<GeneratedSplitButtonProps, 'onPrimaryClick' | 'onSelect'> & {
  onPrimaryClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onSelect?: (item: PeauiDropdownMenuItem, path: number[]) => void;
};
export type SplitButtonItem = PeauiDropdownMenuItem;

const SplitButtonBase = createPeauiReactComponent('SplitButton');
const SplitButton = SplitButtonBase as unknown as (
  props: SplitButtonProps & RefAttributes<HTMLDivElement>,
) => ReactElement | null;

export default SplitButton;
