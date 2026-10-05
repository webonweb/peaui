/** @jsxImportSource react */
import { forwardRef, type CSSProperties, type ReactElement, type ReactNode } from 'react';

import { VirtualListRenderer } from '@/react/virtual-list.renderer';

import type {
  VirtualListHandle,
  VirtualListItem,
  VirtualListItemFocusDetail,
  VirtualListItemKeyResolver,
  VirtualListItemLabelResolver,
  VirtualListItemSlotState,
  VirtualListMeasureErrorDetail,
  VirtualListRange,
  VirtualListReachEndDetail,
  VirtualListRole,
  VirtualListScrollDetail,
} from './virtual-list.shared';

export type VirtualListProps = {
  items?: readonly VirtualListItem[];
  itemSize?: number;
  overscan?: number;
  height?: number | string;
  itemKey?: VirtualListItemKeyResolver;
  itemLabel?: VirtualListItemLabelResolver;
  semanticRole?: VirtualListRole;
  ariaLabel?: string;
  loading?: boolean;
  hasMore?: boolean;
  error?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  endLabel?: string;
  dataTestId?: string;
  activeIndex?: number | null;
  defaultActiveIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  renderItem?: (state: VirtualListItemSlotState) => ReactNode;
  empty?: ReactNode;
  loadingContent?: ReactNode;
  before?: ReactNode;
  after?: ReactNode;
  footer?: ReactNode;
  onVisibleRangeChange?: (detail: VirtualListRange) => void;
  onReachEnd?: (detail: VirtualListReachEndDetail) => void;
  onScroll?: (detail: VirtualListScrollDetail) => void;
  onItemFocus?: (detail: VirtualListItemFocusDetail) => void;
  onMeasureError?: (detail: VirtualListMeasureErrorDetail) => void;
  className?: string;
  style?: CSSProperties;
  'data-testid'?: string;
};

export type {
  ResolvedVirtualListItem,
  VirtualListAlign,
  VirtualListHandle,
  VirtualListItem,
  VirtualListItemFocusDetail,
  VirtualListItemKeyResolver,
  VirtualListItemLabelResolver,
  VirtualListItemSlotState,
  VirtualListKey,
  VirtualListMeasureErrorDetail,
  VirtualListRange,
  VirtualListReachEndDetail,
  VirtualListRole,
  VirtualListScrollDetail,
} from './virtual-list.shared';

const VirtualList = forwardRef<VirtualListHandle, VirtualListProps>((props, ref): ReactElement => (
  <VirtualListRenderer {...props} forwardedRef={ref} />
));

VirtualList.displayName = 'VirtualList';

export default VirtualList;
