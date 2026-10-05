import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import VirtualListVueComponent from './index.ce.vue';
import {
  calculateVirtualListRange,
  getVirtualListScrollOffset,
  normalizeVirtualListItemSize,
  normalizeVirtualListOverscan,
  type VirtualListAlign,
  type VirtualListHandle,
  type VirtualListItem,
  type VirtualListItemKeyResolver,
  type VirtualListItemLabelResolver,
  type VirtualListRange,
  type VirtualListRole,
} from './virtual-list.shared';

const VirtualListVueElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(VirtualListVueComponent, `${UIKIT_NAME}-virtual-list`);

/** Light-DOM adapter exposing property-based data and the same imperative scroll API. */
export class VirtualListElement extends VirtualListVueElement implements VirtualListHandle {
  static readonly tagName = VirtualListVueElement.tagName;

  declare items: readonly VirtualListItem[];
  declare itemSize: number;
  declare overscan: number;
  declare height: number | string;
  declare itemKey: VirtualListItemKeyResolver;
  declare itemLabel: VirtualListItemLabelResolver;
  declare semanticRole: VirtualListRole;
  declare ariaLabel: string;
  declare loading: boolean;
  declare hasMore: boolean;
  declare error: string;
  declare activeIndex: number | null;

  constructor() {
    super();
    this.addEventListener('update:activeIndex', this.syncActiveIndexProperty);
  }

  private readonly syncActiveIndexProperty = (event: Event): void => {
    const next = (event as CustomEvent<number | null>).detail;
    if (!Object.is(this.activeIndex, next)) this.activeIndex = next;
  };

  get viewport(): HTMLElement | null {
    return this.querySelector<HTMLElement>('.peaui-scroll-area__viewport');
  }

  scrollToIndex(
    index: number,
    align: VirtualListAlign = 'auto',
    behavior: ScrollBehavior = 'auto',
  ): void {
    const viewport = this.viewport;
    if (!viewport) return;
    const itemCount = Array.isArray(this.items) ? this.items.length : 0;
    const itemSize = normalizeVirtualListItemSize(this.itemSize);
    const offset = getVirtualListScrollOffset({
      align,
      currentOffset: viewport.scrollTop,
      index,
      itemCount,
      itemSize,
      viewportSize: viewport.clientHeight,
    });
    this.scrollToOffset(offset, behavior);
  }

  scrollToOffset(offset: number, behavior: ScrollBehavior = 'auto'): void {
    const viewport = this.viewport;
    if (!viewport) return;
    const itemCount = Array.isArray(this.items) ? this.items.length : 0;
    const maximum = Math.max(
      0,
      itemCount * normalizeVirtualListItemSize(this.itemSize) - viewport.clientHeight,
    );
    viewport.scrollTo({
      behavior,
      top: Math.min(Math.max(Number.isFinite(offset) ? offset : 0, 0), maximum),
    });
  }

  getVisibleRange(): VirtualListRange {
    const list = this.querySelector<HTMLElement>('.peaui-virtual-list__items');
    if (list) {
      return {
        startIndex: Number(list.dataset.startIndex ?? 0),
        endIndex: Number(list.dataset.endIndex ?? -1),
        visibleStartIndex: Number(list.dataset.visibleStartIndex ?? 0),
        visibleEndIndex: Number(list.dataset.visibleEndIndex ?? -1),
        total: Number(list.dataset.total ?? 0),
      };
    }
    const viewport = this.viewport;
    return calculateVirtualListRange({
      itemCount: Array.isArray(this.items) ? this.items.length : 0,
      itemSize: normalizeVirtualListItemSize(this.itemSize),
      overscan: normalizeVirtualListOverscan(this.overscan),
      scrollOffset: viewport?.scrollTop ?? 0,
      viewportSize: viewport?.clientHeight ?? 0,
    });
  }
}

export function defineVirtualList(): typeof VirtualListElement {
  definePeauiCustomElement(VirtualListElement);
  return VirtualListElement;
}

defineVirtualList();

export default VirtualListElement;
