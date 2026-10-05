import type PublicVueComponent from './index.vue';
import { UIKIT_NAME } from '@/constants';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

import ScrollAreaVueComponent from './index.ce.vue';
import { getScrollAreaRtlMode, normalizeScrollAreaBehavior } from './scroll-area.controller';
import {
  applyScrollAreaOrientation,
  getRawScrollLeft,
  getScrollAreaPosition,
  type ScrollAreaHandle,
  type ScrollAreaOrientation,
  type ScrollAreaPosition,
  type ScrollAreaScrollbarVisibility,
  type ScrollAreaType,
} from './scroll-area.shared';

const ScrollAreaVueElement = createVueCustomElement<
  Omit<
    InstanceType<typeof PublicVueComponent>['$props'],
    keyof HTMLElement | 'ref' | 'key' | 'class' | 'style'
  >
>(ScrollAreaVueComponent, `${UIKIT_NAME}-scroll-area`);

/** Light-DOM adapter exposing the same programmatic viewport API as Vue and React. */
export class ScrollAreaElement extends ScrollAreaVueElement implements ScrollAreaHandle {
  static readonly tagName = ScrollAreaVueElement.tagName;

  declare type: ScrollAreaType;
  declare orientation: ScrollAreaOrientation;
  declare scrollbarVisibility: ScrollAreaScrollbarVisibility;
  declare scrollbarSize: number;
  declare autoHideDelay: number;
  declare tabindex: number | undefined;
  declare ariaLabel: string | null;
  declare disabled: boolean;
  declare restorePosition: boolean;
  declare dataTestId: string | undefined;

  get viewport(): HTMLElement | null {
    return this.querySelector<HTMLElement>('.peaui-scroll-area__viewport');
  }

  override scrollTo(options?: ScrollToOptions): void;
  override scrollTo(x: number, y: number): void;
  override scrollTo(optionsOrX: number | ScrollToOptions = {}, y?: number): void {
    const viewport = this.viewport;
    if (!viewport || this.disabled) return;
    if (typeof optionsOrX === 'number') {
      viewport.scrollTo(optionsOrX, y ?? 0);
      return;
    }
    const current = this.getPosition();
    const direction = getComputedStyle(viewport).direction === 'rtl' ? 'rtl' : 'ltr';
    viewport.scrollTo({
      ...optionsOrX,
      behavior: normalizeScrollAreaBehavior(optionsOrX.behavior),
      left:
        optionsOrX.left === undefined
          ? undefined
          : getRawScrollLeft(optionsOrX.left, current.maxX, direction, getScrollAreaRtlMode()),
    });
  }

  override scrollBy(options?: ScrollToOptions): void;
  override scrollBy(x: number, y: number): void;
  override scrollBy(optionsOrX: number | ScrollToOptions = {}, y?: number): void {
    const viewport = this.viewport;
    if (!viewport || this.disabled) return;
    if (typeof optionsOrX === 'number') {
      viewport.scrollBy(optionsOrX, y ?? 0);
      return;
    }
    const current = this.getPosition();
    this.scrollTo({
      left: optionsOrX.left === undefined ? undefined : current.x + optionsOrX.left,
      top: optionsOrX.top === undefined ? undefined : current.y + optionsOrX.top,
      behavior: optionsOrX.behavior,
    });
  }

  scrollIntoView(target?: Element | string, options?: ScrollIntoViewOptions): boolean;
  override scrollIntoView(options?: boolean | ScrollIntoViewOptions): void;
  override scrollIntoView(
    targetOrOptions?: Element | string | boolean | ScrollIntoViewOptions,
    options?: ScrollIntoViewOptions,
  ): boolean | void {
    if (
      targetOrOptions === undefined ||
      typeof targetOrOptions === 'boolean' ||
      (typeof targetOrOptions === 'object' && !(targetOrOptions instanceof Element))
    ) {
      super.scrollIntoView(targetOrOptions);
      return;
    }
    if (this.disabled) return false;
    const content = this.querySelector<HTMLElement>('.peaui-scroll-area__content');
    const target =
      typeof targetOrOptions === 'string'
        ? content?.querySelector<Element>(targetOrOptions)
        : targetOrOptions;
    if (!content || !target || !content.contains(target)) return false;
    const resolvedOptions = options ?? { block: 'nearest', inline: 'nearest' };
    target.scrollIntoView({
      ...resolvedOptions,
      behavior: normalizeScrollAreaBehavior(resolvedOptions.behavior),
    });
    return true;
  }

  getPosition(): ScrollAreaPosition {
    const viewport = this.viewport;
    if (!viewport) {
      return {
        x: 0,
        y: 0,
        maxX: 0,
        maxY: 0,
        overflowX: false,
        overflowY: false,
        atStartX: true,
        atEndX: true,
        atStartY: true,
        atEndY: true,
      };
    }
    return applyScrollAreaOrientation(
      getScrollAreaPosition(
        viewport,
        getComputedStyle(viewport).direction === 'rtl' ? 'rtl' : 'ltr',
        getScrollAreaRtlMode(),
      ),
      this.orientation,
    );
  }
}

export function defineScrollArea(): typeof ScrollAreaElement {
  definePeauiCustomElement(ScrollAreaElement);
  return ScrollAreaElement;
}

defineScrollArea();

export default ScrollAreaElement;
