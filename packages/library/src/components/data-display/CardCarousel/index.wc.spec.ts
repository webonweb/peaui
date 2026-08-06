import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/basic/SvgIcon/index.wc', () => {
  class MockSvgIconElement extends HTMLElement {
    static readonly tagName = 'peaui-svg-icon';

    get name(): string {
      return this.getAttribute('name') ?? '';
    }

    set name(value: string) {
      this.setAttribute('name', value);
    }

    connectedCallback(): void {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('data-icon', this.name);
      this.replaceChildren(svg);
    }
  }

  function defineSvgIcon(): typeof MockSvgIconElement {
    if (!window.customElements.get(MockSvgIconElement.tagName)) {
      window.customElements.define(MockSvgIconElement.tagName, MockSvgIconElement);
    }

    return MockSvgIconElement;
  }

  defineSvgIcon();

  return {
    SvgIconElement: MockSvgIconElement,
    defineSvgIcon,
    default: MockSvgIconElement,
  };
});

import { CardCarouselElement, defineCardCarousel } from './index.wc';

defineCardCarousel();

type MountOptions = {
  animationDelay?: number;
  ariaLabel?: string;
  dataTestId?: string;
  defaultVisibleSlides?: number;
  defualtVisibleSlides?: number;
  isNavigationDotsVisible?: boolean;
  isNavigationVisible?: boolean;
  slides?: string[];
  withAnimation?: boolean;
};

function createSlide(label: string): HTMLElement {
  const element = document.createElement('article');

  element.textContent = label;
  element.setAttribute('data-testid', `card-${label.toLowerCase()}`);

  return element;
}

function mountCardCarousel(options: MountOptions = {}): CardCarouselElement {
  const element = document.createElement(CardCarouselElement.tagName) as CardCarouselElement;

  if (options.ariaLabel !== undefined) {
    element.ariaLabel = options.ariaLabel;
  }

  if (options.dataTestId !== undefined) {
    element.dataTestId = options.dataTestId;
  }

  if (options.defaultVisibleSlides !== undefined) {
    element.defaultVisibleSlides = options.defaultVisibleSlides;
  }

  if (options.defualtVisibleSlides !== undefined) {
    element.defualtVisibleSlides = options.defualtVisibleSlides;
  }

  if (options.animationDelay !== undefined) {
    element.animationDelay = options.animationDelay;
  }

  if (options.isNavigationDotsVisible !== undefined) {
    element.isNavigationDotsVisible = options.isNavigationDotsVisible;
  }

  if (options.isNavigationVisible !== undefined) {
    element.isNavigationVisible = options.isNavigationVisible;
  }

  if (options.withAnimation !== undefined) {
    element.withAnimation = options.withAnimation;
  }

  const slides = options.slides ?? ['A', 'B', 'C', 'D', 'E', 'F'];

  slides.forEach((slide) => {
    element.appendChild(createSlide(slide));
  });

  document.body.appendChild(element);

  return element;
}

async function syncCarouselState() {
  await Promise.resolve();
  await Promise.resolve();
}

describe('CardCarousel (index.wc.ts)', () => {
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
  const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
  const originalMutationObserver = globalThis.MutationObserver;
  const originalResizeObserver = globalThis.ResizeObserver;
  const mutationObserverInstances: MutationObserverStub[] = [];
  let getComputedStyleSpy: ReturnType<typeof vi.spyOn>;
  let scrollToSpy: ReturnType<typeof vi.fn>;

  class MutationObserverStub {
    readonly callback: MutationCallback;

    constructor(callback: MutationCallback) {
      this.callback = callback;
      mutationObserverInstances.push(this);
    }

    observe() {}
    disconnect() {}

    trigger(records: MutationRecord[]): void {
      this.callback(records, this as unknown as MutationObserver);
    }
  }

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    mutationObserverInstances.length = 0;

    class ResizeObserverStub {
      observe() {}
      disconnect() {}
    }

    globalThis.MutationObserver = MutationObserverStub as unknown as typeof MutationObserver;
    globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return this.classList?.contains('peaui-card-carousel__slide') ? 242 : 0;
      },
    });

    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() {
        return this.classList?.contains('peaui-card-carousel__viewport') ? 1032 : 0;
      },
    });

    getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle').mockImplementation(
      () =>
        ({
          columnGap: '16px',
          gap: '16px',
        }) as CSSStyleDeclaration,
    );

    scrollToSpy = vi.fn(function scrollTo(this: HTMLElement, options?: ScrollToOptions) {
      this.scrollLeft = Number(options?.left ?? 0);
    });

    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: scrollToSpy,
      writable: true,
    });
  });

  afterEach(() => {
    getComputedStyleSpy.mockRestore();
    document.body.innerHTML = '';
    vi.clearAllTimers();
    vi.useRealTimers();

    if (originalResizeObserver) {
      globalThis.ResizeObserver = originalResizeObserver;
    } else {
      delete (globalThis as Record<string, unknown>).ResizeObserver;
    }

    if (originalMutationObserver) {
      globalThis.MutationObserver = originalMutationObserver;
    } else {
      delete (globalThis as Record<string, unknown>).MutationObserver;
    }

    if (originalOffsetWidth) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
    }

    if (originalClientWidth) {
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
    }
  });

  it('renders a carousel region with BEM classes, slides and aria metadata', async () => {
    const element = mountCardCarousel({
      ariaLabel: 'Karuzela testowa',
      dataTestId: 'card-carousel',
      defaultVisibleSlides: 4,
    });
    await syncCarouselState();

    expect(element.getAttribute('role')).toBe('region');
    expect(element.getAttribute('aria-roledescription')).toBe('carousel');
    expect(element.getAttribute('aria-label')).toBe('Karuzela testowa');
    expect(element.classList.contains('peaui-card-carousel')).toBe(true);

    const slides = element.querySelectorAll('.peaui-card-carousel__slide');
    expect(slides.length).toBe(6);
    expect(slides[0]?.getAttribute('aria-roledescription')).toBe('slide');
    expect(slides[0]?.getAttribute('aria-label')).toBe('Slajd 1 z 6');
    expect(slides[0]?.getAttribute('data-testid')).toBe('card-carousel-slide-1');
  });

  it('renders navigation and pagination with the expected accessible labels', async () => {
    const element = mountCardCarousel({
      ariaLabel: 'Karuzela testowa',
      dataTestId: 'card-carousel',
      defaultVisibleSlides: 4,
    });
    await syncCarouselState();

    const controls = element.querySelector<HTMLElement>('[data-testid="card-carousel-controls"]');
    const previousButton = element.querySelector<HTMLElement>(
      '[data-testid="card-carousel-previous"]',
    );
    const nextButton = element.querySelector<HTMLElement>('[data-testid="card-carousel-next"]');
    const pagination = element.querySelector<HTMLElement>(
      '[data-testid="card-carousel-pagination"]',
    );
    const dots = element.querySelectorAll('.peaui-card-carousel__dot');

    expect(previousButton?.getAttribute('aria-label')).toBe('Pokaz poprzednie karty');
    expect(nextButton?.getAttribute('aria-label')).toBe('Pokaz nastepne karty');
    expect(
      Array.from(controls?.children ?? []).map((node) => (node as HTMLElement).dataset.testid),
    ).toEqual(['card-carousel-previous', 'card-carousel-pagination', 'card-carousel-next']);
    expect(pagination?.getAttribute('role')).toBe('group');
    expect(dots.length).toBe(3);
    expect(dots[0]?.getAttribute('aria-current')).toBe('true');
    expect(dots[1]?.getAttribute('aria-label')).toBe('Przejdz do widoku 2 z 3');
    expect(previousButton?.querySelector('peaui-svg-icon')?.style.display).toBe('inline-flex');
    expect(previousButton?.querySelector('peaui-svg-icon')?.style.transform).toBe('rotate(45deg)');
    expect(nextButton?.querySelector('peaui-svg-icon')?.style.display).toBe('inline-flex');
    expect(nextButton?.querySelector('peaui-svg-icon')?.style.transform).toBe('rotate(-45deg)');
  });

  it('moves between views using buttons and updates disabled states', async () => {
    const element = mountCardCarousel({
      ariaLabel: 'Karuzela testowa',
      dataTestId: 'card-carousel',
      defaultVisibleSlides: 4,
    });
    await syncCarouselState();

    const previousButton = element.querySelector<HTMLButtonElement>(
      '[data-testid="card-carousel-previous"]',
    );
    const nextButton = element.querySelector<HTMLButtonElement>(
      '[data-testid="card-carousel-next"]',
    );

    expect(previousButton?.disabled).toBe(true);
    expect(nextButton?.disabled).toBe(false);

    nextButton?.click();
    nextButton?.click();

    const dots = element.querySelectorAll('.peaui-card-carousel__dot');

    expect(dots[2]?.getAttribute('aria-current')).toBe('true');
    expect(nextButton?.disabled).toBe(true);
    expect(previousButton?.disabled).toBe(false);
    expect(scrollToSpy).toHaveBeenLastCalledWith({ behavior: 'smooth', left: 516 });
  });

  it('supports keyboard navigation for Arrow keys, Home and End', async () => {
    const element = mountCardCarousel({
      ariaLabel: 'Karuzela testowa',
      dataTestId: 'card-carousel',
      defaultVisibleSlides: 4,
    });
    await syncCarouselState();

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(
      element.querySelectorAll('.peaui-card-carousel__dot')[2]?.getAttribute('aria-current'),
    ).toBe('true');

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(
      element.querySelectorAll('.peaui-card-carousel__dot')[0]?.getAttribute('aria-current'),
    ).toBe('true');

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(
      element.querySelectorAll('.peaui-card-carousel__dot')[1]?.getAttribute('aria-current'),
    ).toBe('true');

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(
      element.querySelectorAll('.peaui-card-carousel__dot')[0]?.getAttribute('aria-current'),
    ).toBe('true');
  });

  it('hides controls when there is no overflow or when controls are disabled by props', async () => {
    const element = mountCardCarousel({
      ariaLabel: 'Karuzela bez overflow',
      defaultVisibleSlides: 4,
      isNavigationDotsVisible: false,
      isNavigationVisible: false,
      slides: ['A', 'B', 'C'],
    });
    await syncCarouselState();

    expect(Boolean(element.querySelector('.peaui-card-carousel__navigation'))).toBe(false);
    expect(Boolean(element.querySelector('.peaui-card-carousel__pagination'))).toBe(false);
    expect(Boolean(element.querySelector('.peaui-card-carousel__controls'))).toBe(false);
  });

  it('hides pagination when isNavigationDotsVisible is set to false', async () => {
    const element = mountCardCarousel({
      ariaLabel: 'Karuzela testowa',
      dataTestId: 'card-carousel',
      defaultVisibleSlides: 4,
      isNavigationDotsVisible: false,
    });
    await syncCarouselState();

    expect(Boolean(element.querySelector('.peaui-card-carousel__navigation'))).toBe(true);
    expect(Boolean(element.querySelector('.peaui-card-carousel__pagination'))).toBe(false);
  });

  it('adds a single-slide modifier when only one slide is rendered', async () => {
    const element = mountCardCarousel({
      ariaLabel: 'Karuzela z jednym slajdem',
      slides: ['Jedna karta'],
    });
    await syncCarouselState();

    expect(element.classList.contains('peaui-card-carousel--single-slide')).toBe(true);
  });

  it('keeps backward compatibility for the defualtVisibleSlides prop alias', async () => {
    const element = mountCardCarousel({
      ariaLabel: 'Karuzela z aliasem',
      defualtVisibleSlides: 3,
      slides: ['A', 'B', 'C', 'D'],
    });
    await syncCarouselState();

    expect(element.getAttribute('style')).toContain('--peaui-card-carousel-visible-slides: 3;');
  });

  it('ignores managed host mutations to avoid an internal render loop', async () => {
    const renderSpy = vi.spyOn(CardCarouselElement.prototype, 'render');
    const element = mountCardCarousel({
      ariaLabel: 'Karuzela testowa',
      dataTestId: 'card-carousel',
      defaultVisibleSlides: 4,
    });
    await syncCarouselState();

    const mutationObserver = mutationObserverInstances[0];
    const managedNodes = Array.from(element.childNodes).filter(
      (node) =>
        node === element.querySelector('.peaui-card-carousel__viewport') ||
        node === element.querySelector('.peaui-card-carousel__controls'),
    );

    renderSpy.mockClear();
    mutationObserver?.trigger([
      {
        addedNodes: managedNodes as unknown as NodeList,
        attributeName: null,
        attributeNamespace: null,
        nextSibling: null,
        oldValue: null,
        previousSibling: null,
        removedNodes: [] as unknown as NodeList,
        target: element,
        type: 'childList',
      },
    ] as MutationRecord[]);

    expect(renderSpy).not.toHaveBeenCalled();
  });

  it('auto-advances slides every 2 seconds when withAnimation is enabled', async () => {
    let intervalCallback: (() => void) | undefined;

    const setIntervalSpy = vi.spyOn(window, 'setInterval').mockImplementation(((
      callback: TimerHandler,
    ) => {
      intervalCallback = callback as () => void;
      return 1 as unknown as number;
    }) as typeof window.setInterval);
    vi.spyOn(window, 'clearInterval').mockImplementation(() => undefined);

    const element = mountCardCarousel({
      ariaLabel: 'Karuzela testowa',
      dataTestId: 'card-carousel',
      defaultVisibleSlides: 4,
      withAnimation: true,
    });
    await syncCarouselState();

    expect(
      element.querySelectorAll('.peaui-card-carousel__dot')[0]?.getAttribute('aria-current'),
    ).toBe('true');
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 2000);
    expect(intervalCallback).toBeTypeOf('function');

    await syncCarouselState();

    expect(
      element.querySelectorAll('.peaui-card-carousel__dot')[0]?.getAttribute('aria-current'),
    ).toBe('true');

    intervalCallback?.();
    await syncCarouselState();

    expect(
      element.querySelectorAll('.peaui-card-carousel__dot')[1]?.getAttribute('aria-current'),
    ).toBe('true');

    intervalCallback?.();
    await syncCarouselState();

    expect(
      element.querySelectorAll('.peaui-card-carousel__dot')[2]?.getAttribute('aria-current'),
    ).toBe('true');

    intervalCallback?.();
    await syncCarouselState();

    expect(
      element.querySelectorAll('.peaui-card-carousel__dot')[0]?.getAttribute('aria-current'),
    ).toBe('true');
  });

  it('does not render an autoplay toggle and still pauses autoplay on hover and focus', async () => {
    const setIntervalSpy = vi.spyOn(window, 'setInterval').mockImplementation(((callback) => {
      return window.setTimeout(callback as TimerHandler, 0) as unknown as number;
    }) as typeof window.setInterval);
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval').mockImplementation(() => undefined);

    const element = mountCardCarousel({
      dataTestId: 'card-carousel',
      withAnimation: true,
    });
    await syncCarouselState();

    const autoplayToggle = element.querySelector<HTMLButtonElement>(
      '[data-testid="card-carousel-autoplay-toggle"]',
    );
    const controls = element.querySelector<HTMLElement>('[data-testid="card-carousel-controls"]');

    expect(autoplayToggle).toBeNull();
    expect(
      Array.from(controls?.children ?? []).map((node) => (node as HTMLElement).dataset.testid),
    ).toEqual(['card-carousel-previous', 'card-carousel-pagination', 'card-carousel-next']);
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);

    element.dispatchEvent(new Event('mouseenter'));
    expect(clearIntervalSpy).toHaveBeenCalled();

    element.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);

    element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
    element.dispatchEvent(new Event('mouseleave'));
    expect(setIntervalSpy).toHaveBeenCalledTimes(2);
  });

  it('respects a custom animationDelay value when withAnimation is enabled', async () => {
    let intervalCallback: (() => void) | undefined;

    const setIntervalSpy = vi.spyOn(window, 'setInterval').mockImplementation(((
      callback: TimerHandler,
    ) => {
      intervalCallback = callback as () => void;
      return 1 as unknown as number;
    }) as typeof window.setInterval);
    vi.spyOn(window, 'clearInterval').mockImplementation(() => undefined);

    const element = mountCardCarousel({
      ariaLabel: 'Karuzela testowa',
      dataTestId: 'card-carousel',
      defaultVisibleSlides: 4,
      animationDelay: 1000,
      withAnimation: true,
    });
    await syncCarouselState();

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    expect(intervalCallback).toBeTypeOf('function');

    intervalCallback?.();
    await syncCarouselState();

    expect(
      element.querySelectorAll('.peaui-card-carousel__dot')[1]?.getAttribute('aria-current'),
    ).toBe('true');
  });
});
