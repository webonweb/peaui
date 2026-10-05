import type { MouseEvent, ReactElement, RefAttributes } from 'react';

import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { SplitButtonRenderer } from '@/react/renderer-entries/split-button.renderer-entry';
import type { PeauiDropdownMenuItem, PeauiReactProps } from '@/react/generated-react-props';

type GeneratedSplitButtonProps = PeauiReactProps<'SplitButton'>;

export type SplitButtonProps = Omit<GeneratedSplitButtonProps, 'onPrimaryClick' | 'onSelect'> & {
  onPrimaryClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onSelect?: (item: PeauiDropdownMenuItem, path: number[]) => void;
};
export type SplitButtonItem = PeauiDropdownMenuItem;

const SplitButtonBase = createDirectReactComponent('SplitButton', SplitButtonRenderer);
const SplitButton = SplitButtonBase as unknown as (
  props: SplitButtonProps & RefAttributes<HTMLDivElement>,
) => ReactElement | null;

export default SplitButton;
