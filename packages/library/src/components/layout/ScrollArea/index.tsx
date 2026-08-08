import type { ReactElement, ReactNode, RefAttributes } from 'react';

import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { ScrollAreaRenderer } from '@/react/scroll-area.renderer';
import type { PeauiReactProps } from '@/react/generated-react-props';

import type {
  ScrollAreaEdgeDetail,
  ScrollAreaHandle,
  ScrollAreaPosition,
  ScrollAreaResizeDetail,
  ScrollAreaScrollbarSlotState,
} from './scroll-area.shared';

type GeneratedScrollAreaProps = PeauiReactProps<'ScrollArea'>;

export type ScrollAreaProps = Omit<
  GeneratedScrollAreaProps,
  | 'endIndicator'
  | 'onReachEnd'
  | 'onReachStart'
  | 'onResize'
  | 'onScroll'
  | 'onScrollEnd'
  | 'onScrollStart'
  | 'scrollbar'
  | 'startIndicator'
  | 'tabindex'
> & {
  children?: ReactNode;
  tabIndex?: number;
  renderScrollbar?: (state: ScrollAreaScrollbarSlotState) => ReactNode;
  startIndicator?: ReactNode;
  endIndicator?: ReactNode;
  onScroll?: (detail: ScrollAreaPosition) => void;
  onScrollStart?: (detail: ScrollAreaPosition) => void;
  onScrollEnd?: (detail: ScrollAreaPosition) => void;
  onReachStart?: (detail: ScrollAreaEdgeDetail) => void;
  onReachEnd?: (detail: ScrollAreaEdgeDetail) => void;
  onResize?: (detail: ScrollAreaResizeDetail) => void;
};

export type {
  ScrollAreaAxis,
  ScrollAreaEdgeDetail,
  ScrollAreaHandle,
  ScrollAreaOrientation,
  ScrollAreaPosition,
  ScrollAreaResizeDetail,
  ScrollAreaScrollbarSlotState,
  ScrollAreaScrollbarVisibility,
  ScrollAreaType,
} from './scroll-area.shared';

const ScrollAreaBase = createDirectReactComponent('ScrollArea', ScrollAreaRenderer);
const ScrollArea = ScrollAreaBase as unknown as (
  props: ScrollAreaProps & RefAttributes<ScrollAreaHandle>,
) => ReactElement | null;

export default ScrollArea;
