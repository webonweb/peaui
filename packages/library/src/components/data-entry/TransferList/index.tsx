import type { ReactElement, ReactNode, RefAttributes } from 'react';

import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { TransferListRenderer } from '@/react/transfer-list.renderer';
import type { PeauiReactProps } from '@/react/generated-react-props';
import type {
  TransferListItem,
  TransferListKey,
  TransferListKeyResolver,
  TransferListLabelResolver,
  TransferListLabels,
  TransferListLoadingState,
  TransferListMoveDetail,
  TransferListOrientation,
  TransferListPanel,
  TransferListSearchDetail,
  TransferListSelectionDetail,
  TransferListSize,
  TransferListSort,
} from './transfer-list.shared';

type GeneratedTransferListProps = PeauiReactProps<'TransferList'>;
export type TransferListProps = Omit<
  GeneratedTransferListProps,
  | 'controls'
  | 'defaultSourceSelected'
  | 'defaultTargetSelected'
  | 'defaultValue'
  | 'disabledKeys'
  | 'item'
  | 'itemKey'
  | 'itemLabel'
  | 'items'
  | 'labels'
  | 'loading'
  | 'onMove'
  | 'onSearch'
  | 'onSelectionChange'
  | 'onSourceSelectedChange'
  | 'onTargetSelectedChange'
  | 'onValueChange'
  | 'orientation'
  | 'size'
  | 'sort'
  | 'sourceEmpty'
  | 'sourceHeader'
  | 'sourceSelected'
  | 'targetEmpty'
  | 'targetHeader'
  | 'targetSelected'
  | 'value'
> & {
  items?: readonly TransferListItem[];
  itemKey?: TransferListKeyResolver;
  itemLabel?: TransferListLabelResolver;
  sort?: TransferListSort;
  preserveOrder?: boolean;
  disabledKeys?: readonly TransferListKey[];
  loading?: boolean | TransferListLoadingState;
  labels?: Partial<TransferListLabels>;
  orientation?: TransferListOrientation;
  size?: TransferListSize;
  value?: TransferListKey[];
  defaultValue?: TransferListKey[];
  onValueChange?: (value: TransferListKey[]) => void;
  sourceSelected?: TransferListKey[];
  defaultSourceSelected?: TransferListKey[];
  onSourceSelectedChange?: (value: TransferListKey[]) => void;
  targetSelected?: TransferListKey[];
  defaultTargetSelected?: TransferListKey[];
  onTargetSelectedChange?: (value: TransferListKey[]) => void;
  onMove?: (detail: TransferListMoveDetail) => void;
  onSearch?: (detail: TransferListSearchDetail) => void;
  onSelectionChange?: (detail: TransferListSelectionDetail) => void;
  renderSourceHeader?: (state: { count: number; selectedCount: number }) => ReactNode;
  renderTargetHeader?: (state: { count: number; selectedCount: number }) => ReactNode;
  renderItem?: (state: {
    item: TransferListItem;
    itemKey: TransferListKey;
    label: string;
    description?: string;
    panel: TransferListPanel;
    selected: boolean;
    disabled: boolean;
  }) => ReactNode;
  renderSourceEmpty?: (state: { query: string }) => ReactNode;
  renderTargetEmpty?: (state: { query: string }) => ReactNode;
  renderLoading?: (state: { panel: TransferListPanel }) => ReactNode;
  renderControls?: (actions: {
    moveSelectedToTarget: () => void;
    moveSelectedToSource: () => void;
    moveAllToTarget: () => void;
    moveAllToSource: () => void;
  }) => ReactNode;
};

export type {
  TransferListDirection,
  TransferListItem,
  TransferListKey,
  TransferListKeyResolver,
  TransferListLabelResolver,
  TransferListLabels,
  TransferListLoadingState,
  TransferListMoveDetail,
  TransferListOrientation,
  TransferListPanel,
  TransferListSearchDetail,
  TransferListSelectionDetail,
  TransferListSize,
  TransferListSort,
} from './transfer-list.shared';

const TransferListBase = createDirectReactComponent('TransferList', TransferListRenderer);
const TransferList = TransferListBase as unknown as (
  props: TransferListProps & RefAttributes<HTMLDivElement>,
) => ReactElement | null;

export default TransferList;
