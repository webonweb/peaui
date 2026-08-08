import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import TransferListVueComponent from './index.vue';
import type {
  TransferListItem,
  TransferListKey,
  TransferListKeyResolver,
  TransferListLabelResolver,
  TransferListLabels,
  TransferListLoadingState,
  TransferListSort,
} from './transfer-list.shared';

const TransferListVueElement = createVueCustomElement(
  TransferListVueComponent,
  `${UIKIT_NAME}-transfer-list`,
);

/** Light-DOM adapter preserving all three controlled collections and native named slots. */
export class TransferListElement extends TransferListVueElement {
  static readonly tagName = TransferListVueElement.tagName;

  declare items: readonly TransferListItem[];
  declare value: TransferListKey[];
  declare sourceSelected: TransferListKey[];
  declare targetSelected: TransferListKey[];
  declare itemKey: TransferListKeyResolver;
  declare itemLabel: TransferListLabelResolver;
  declare disabledKeys: readonly TransferListKey[];
  declare sort: TransferListSort;
  declare loading: boolean | TransferListLoadingState;
  declare labels: Partial<TransferListLabels>;

  constructor() {
    super();
    this.addEventListener('update:value', this.syncValueProperty);
    this.addEventListener('update:sourceSelected', this.syncSourceSelectionProperty);
    this.addEventListener('update:targetSelected', this.syncTargetSelectionProperty);
  }

  private readonly syncValueProperty = (event: Event): void => {
    const next = (event as CustomEvent<TransferListKey[]>).detail;
    if (!Object.is(this.value, next)) this.value = next;
  };

  private readonly syncSourceSelectionProperty = (event: Event): void => {
    const next = (event as CustomEvent<TransferListKey[]>).detail;
    if (!Object.is(this.sourceSelected, next)) this.sourceSelected = next;
  };

  private readonly syncTargetSelectionProperty = (event: Event): void => {
    const next = (event as CustomEvent<TransferListKey[]>).detail;
    if (!Object.is(this.targetSelected, next)) this.targetSelected = next;
  };
}

export function defineTransferList(): typeof TransferListElement {
  definePeauiCustomElement(TransferListElement);
  return TransferListElement;
}

defineTransferList();

export default TransferListElement;
