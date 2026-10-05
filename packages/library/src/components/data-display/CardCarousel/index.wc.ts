import { upgradeCustomElementProperties, syncNodeChildren } from '@/helpers/dom.helper';
import { SvgIconElement, defineSvgIcon } from '@/components/basic/SvgIcon/index.wc';
import { prefersReducedMotion } from '@/helpers/browser.helper';
import {
  getCarouselMetrics,
  createCarouselRotationToggle,
  CAROUSEL_PAUSE_LABEL,
  CAROUSEL_RESUME_LABEL,
} from './carousel.shared';
import { UIKIT_NAME } from '@/constants';

const CARD_CAROUSEL_TAG_NAME = `${UIKIT_NAME}-card-carousel`;
const CARD_CAROUSEL_CLASS_NAME = `${UIKIT_NAME}-card-carousel`;
const DEFAULT_ACCESSIBLE_NAME = 'Karuzela kart';
const INTERACTIVE_TARGET_SELECTOR =
  'a, button, input, textarea, select, summary, [role="button"], [role="link"], [contenteditable="true"]';
const FALSEY_ATTRIBUTE_VALUES = new Set(['false', '0', 'no', 'off']);

let nextCarouselId = 0;

type SlideVisibleCount = number;

function getNormalizedAttributeValue(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const normalizedValue = value.trim();

    return normalizedValue.length > 0 ? normalizedValue : undefined;
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    const normalizedValue = String(value).trim();

    return normalizedValue.length > 0 ? normalizedValue : undefined;
  }

  return undefined;
}

function getBooleanAttributeValue(element: HTMLElement, name: string, fallback: boolean): boolean {
  if (!element.hasAttribute(name)) {
    return fallback;
  }

  const normalizedValue = `${element.getAttribute(name) ?? ''}`.trim().toLowerCase();

  if (!normalizedValue) {
    return true;
  }

  return !FALSEY_ATTRIBUTE_VALUES.has(normalizedValue);
}

function getNumberAttributeValue(element: HTMLElement, name: string): number | undefined {
  const value = getNormalizedAttributeValue(element.getAttribute(name));

  if (!value) {
    return undefined;
  }

  const normalizedNumber = Number(value);

  return Number.isFinite(normalizedNumber) ? normalizedNumber : undefined;
}

function setStringAttribute(element: HTMLElement, name: string, value: string | null | undefined) {
  const normalizedValue = getNormalizedAttributeValue(value);

  if (normalizedValue === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, normalizedValue);
}

function setNumberAttribute(element: HTMLElement, name: string, value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, String(value));
}

function setBooleanAttribute(element: HTMLElement, name: string, value: boolean) {
  if (value) {
    element.setAttribute(name, 'true');
    return;
  }

  element.setAttribute(name, 'false');
}

function normalizeSlideNodes(nodes: Node[]): Node[] {
  return nodes.filter((node) => {
    if (node.nodeType === Node.COMMENT_NODE) {
      return false;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return Boolean(node.textContent?.trim());
    }

    return true;
  });
}

function getViewportGap(element: HTMLElement): number {
  const styles = getComputedStyle(element);
  const normalizedGap = parseFloat(styles.columnGap || styles.gap || '0');

  return Number.isFinite(normalizedGap) ? normalizedGap : 0;
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest(INTERACTIVE_TARGET_SELECTOR));
}

function shouldHandleKeyboardNavigation(
  target: EventTarget | null,
  currentTarget: EventTarget | null,
): boolean {
  if (!(target instanceof HTMLElement)) {
    return true;
  }

  if (target === currentTarget) {
    return true;
  }

  if (target.closest(`.${CARD_CAROUSEL_CLASS_NAME}__navigation`)) {
    return true;
  }

  if (target.closest(`.${CARD_CAROUSEL_CLASS_NAME}__dot`)) {
    return true;
  }

  return !target.closest(`.${CARD_CAROUSEL_CLASS_NAME}__slide`);
}

function getNextCarouselId(): string {
  nextCarouselId += 1;

  return `${CARD_CAROUSEL_CLASS_NAME}-${nextCarouselId}`;
}

defineSvgIcon();

export class CardCarouselElement extends HTMLElement {
  static readonly tagName = CARD_CAROUSEL_TAG_NAME;

  static get observedAttributes(): string[] {
    return [
      'aria-label',
      'aria-labelledby',
      'animation-delay',
      'data-testid',
      'default-visible-slides',
      'defualt-visible-slides',
      'is-navigation-dots-visible',
      'is-navigation-visible',
      'with-animation',
      'pause-label',
      'resume-label',
      'id',
      'tabindex',
    ];
  }

  #defaultId = getNextCarouselId();
  #isMounted = false;
  #isSyncingDom = false;
  #managedClasses = new Set<string>();
  #managedChildren = new Set<Node>();
  #viewportElement = document.createElement('div');
  #controlsElement = document.createElement('div');
  #rotationElement = document.createElement('button');
  #rotationPaused = false;
  #rotationToggle = createCarouselRotationToggle();
  #motionQuery: MediaQueryList | undefined;
  #previousButtonElement = document.createElement('button');
  #nextButtonElement = document.createElement('button');
  #paginationElement = document.createElement('div');
  #previousIconElement = document.createElement(SvgIconElement.tagName);
  #nextIconElement = document.createElement(SvgIconElement.tagName);
  #slideNodes: Node[] = [];
  #slideWrappers = new Map<Node, HTMLDivElement>();
  #resizeObserver: ResizeObserver | null = null;
  #mutationObserver: MutationObserver | null = null;
  #currentIndex = 0;
  #visibleSlidesCount = 1;
  #slideStep = 0;
  #isPointerDragging = false;
  #isPointerHovering = false;
  #totalSlides = 0;
  #pointerStartX = 0;
  #pointerStartScrollLeft = 0;
  #animationInterval: number | undefined;
  #syncIndexTimeout: number | undefined;

  constructor() {
    super();

    this.#setupStaticStructure();
  }

  connectedCallback(): void {
    upgradeCustomElementProperties(this);
    if (this.#isMounted) {
      this.render();
      return;
    }

    this.#isMounted = true;
    this.#collectExternalSlides();
    this.#motionQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : undefined;
    this.#updateMotionPreference();
    this.#motionQuery?.addEventListener('change', this.#updateMotionPreference);
    this.#setupObservers();
    this.render();
  }

  disconnectedCallback(): void {
    this.#motionQuery?.removeEventListener('change', this.#updateMotionPreference);
    this.#isMounted = false;
    this.#mutationObserver?.disconnect();
    this.#mutationObserver = null;
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
    this.#clearAnimationInterval();

    if (this.#syncIndexTimeout) {
      window.clearTimeout(this.#syncIndexTimeout);
      this.#syncIndexTimeout = undefined;
    }
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (!this.#isMounted || this.#isSyncingDom) {
      return;
    }

    this.render();
  }

  get ariaLabel(): string | null {
    return getNormalizedAttributeValue(this.getAttribute('aria-label')) ?? null;
  }

  set ariaLabel(value: string | null) {
    setStringAttribute(this, 'aria-label', value);
  }

  get animationDelay(): number {
    return this.#resolvedAnimationDelay;
  }

  set animationDelay(value: number | null | undefined) {
    setNumberAttribute(this, 'animation-delay', value);
  }

  get dataTestId(): string | undefined {
    return getNormalizedAttributeValue(this.getAttribute('data-testid'));
  }

  set dataTestId(value: string | null | undefined) {
    setStringAttribute(this, 'data-testid', value);
  }

  get defaultVisibleSlides(): number | undefined {
    return getNumberAttributeValue(this, 'default-visible-slides');
  }

  set defaultVisibleSlides(value: number | null | undefined) {
    setNumberAttribute(this, 'default-visible-slides', value);
  }

  get defualtVisibleSlides(): number | undefined {
    return getNumberAttributeValue(this, 'defualt-visible-slides');
  }

  set defualtVisibleSlides(value: number | null | undefined) {
    setNumberAttribute(this, 'defualt-visible-slides', value);
  }

  get isNavigationDotsVisible(): boolean {
    return getBooleanAttributeValue(this, 'is-navigation-dots-visible', true);
  }

  set isNavigationDotsVisible(value: boolean) {
    setBooleanAttribute(this, 'is-navigation-dots-visible', value);
  }

  get isNavigationVisible(): boolean {
    return getBooleanAttributeValue(this, 'is-navigation-visible', true);
  }

  set isNavigationVisible(value: boolean) {
    setBooleanAttribute(this, 'is-navigation-visible', value);
  }

  get withAnimation(): boolean {
    return getBooleanAttributeValue(this, 'with-animation', false);
  }

  set withAnimation(value: boolean) {
    setBooleanAttribute(this, 'with-animation', value);
  }

  render(): void {
    this.#withDomSync(() => {
      this.#collectExternalSlides();
      this.#syncRootAttributes();
      this.#syncSlideMarkup();
      this.#updateMetrics();
      this.#syncIndexFromScroll();
      this.#syncControls();
      this.#syncAnimationInterval();
    });
  }

  #withDomSync<T>(callback: () => T): T {
    const wasSyncingDom = this.#isSyncingDom;
    if (!wasSyncingDom) this.#mutationObserver?.disconnect();
    this.#isSyncingDom = true;

    try {
      return callback();
    } finally {
      this.#isSyncingDom = wasSyncingDom;
      if (!wasSyncingDom && this.#isMounted) this.#observeSlides();
    }
  }

  #setupStaticStructure(): void {
    this.#viewportElement.addEventListener('pointercancel', this.#handlePointerEnd);
    this.#viewportElement.addEventListener('pointerdown', this.#handlePointerDown);
    this.#viewportElement.addEventListener('pointerleave', this.#handlePointerEnd);
    this.#viewportElement.addEventListener('pointermove', this.#handlePointerMove);
    this.#viewportElement.addEventListener('pointerup', this.#handlePointerEnd);
    this.#viewportElement.addEventListener('scroll', this.#handleScroll, { passive: true });

    this.addEventListener('keydown', this.#handleKeydown);
    this.addEventListener('mouseenter', this.#handleMouseEnter);
    this.addEventListener('mouseleave', this.#handleMouseLeave);
    this.addEventListener('focusin', this.#handleFocusIn);
    this.#rotationElement.type = 'button';
    this.#rotationElement.addEventListener('pointerdown', () => {
      this.#rotationToggle.capturePointerState(this.#rotationPaused);
    });
    this.#rotationElement.addEventListener('click', (event) => {
      this.#rotationPaused = this.#rotationToggle.toggle(this.#rotationPaused, event);
      this.#syncRotation();
      this.#syncAnimationInterval();
    });
    this.#managedChildren.add(this.#rotationElement);

    this.#previousButtonElement.type = 'button';
    this.#previousButtonElement.addEventListener('click', () => {
      this.#handleGoToPreviousSlide();
    });

    this.#nextButtonElement.type = 'button';
    this.#nextButtonElement.addEventListener('click', () => {
      this.#handleGoToNextSlide();
    });

    this.#previousIconElement.name = 'arrow';
    this.#nextIconElement.name = 'arrow';
    this.#previousIconElement.style.display = 'inline-flex';
    this.#nextIconElement.style.display = 'inline-flex';
    this.#previousIconElement.style.alignItems = 'center';
    this.#nextIconElement.style.alignItems = 'center';
    this.#previousIconElement.style.justifyContent = 'center';
    this.#nextIconElement.style.justifyContent = 'center';
    this.#previousIconElement.style.lineHeight = '0';
    this.#nextIconElement.style.lineHeight = '0';
    this.#previousIconElement.style.transform = 'rotate(45deg)';
    this.#nextIconElement.style.transform = 'rotate(-45deg)';

    this.#previousButtonElement.appendChild(this.#previousIconElement);
    this.#nextButtonElement.appendChild(this.#nextIconElement);

    this.#managedChildren.add(this.#viewportElement);
    this.#managedChildren.add(this.#controlsElement);
  }

  #setupObservers(): void {
    if (!this.#mutationObserver) {
      this.#mutationObserver = new MutationObserver((records) => {
        if (this.#isSyncingDom || records.length === 0 || this.#onlyAddsManagedChildren(records)) {
          return;
        }

        this.#collectExternalSlides();
        this.render();
      });

      this.#observeSlides();
    }

    if (typeof ResizeObserver !== 'undefined' && !this.#resizeObserver) {
      this.#resizeObserver = new ResizeObserver(() => {
        this.#updateMetrics();
        this.#syncControls();
        this.#syncAnimationInterval();
      });

      this.#resizeObserver.observe(this.#viewportElement);
    }
  }

  #collectExternalSlides(): void {
    const nextSlides = normalizeSlideNodes(
      Array.from(this.childNodes).filter((node) => !this.#managedChildren.has(node)),
    );

    const external = new Set(nextSlides);
    this.#slideNodes = [
      ...this.#slideNodes.filter((node) => this.contains(node) && !external.has(node)),
      ...nextSlides,
    ];
  }

  #onlyAddsManagedChildren(records: MutationRecord[]): boolean {
    // Own container insertion never changes slides. Removals must still be observed:
    // removing the viewport externally also removes its current slide content.
    return records.every(
      (record) =>
        record.type === 'childList' &&
        record.target === this &&
        record.removedNodes.length === 0 &&
        record.addedNodes.length > 0 &&
        Array.from(record.addedNodes).every((node) => this.#managedChildren.has(node)),
    );
  }

  #observeSlides(): void {
    this.#mutationObserver?.observe(this, { childList: true });
    this.#mutationObserver?.observe(this.#viewportElement, { childList: true, subtree: true });
  }

  #syncRootAttributes(): void {
    this.#withDomSync(() => {
      const normalizedAriaLabelledBy = getNormalizedAttributeValue(
        this.getAttribute('aria-labelledby'),
      );

      if (!this.id) {
        this.id = this.#defaultId;
      }

      const classNames = new Set(
        [
          CARD_CAROUSEL_CLASS_NAME,
          this.#isPointerDragging && `${CARD_CAROUSEL_CLASS_NAME}--dragging`,
          this.#slideNodes.length === 1 && `${CARD_CAROUSEL_CLASS_NAME}--single-slide`,
        ].filter(Boolean) as string[],
      );

      for (const className of this.#managedClasses) {
        if (!classNames.has(className)) {
          this.classList.remove(className);
        }
      }

      for (const className of classNames) {
        this.classList.add(className);
      }

      this.#managedClasses = classNames;

      this.setAttribute('role', 'region');
      this.setAttribute('aria-roledescription', 'carousel');

      if (normalizedAriaLabelledBy) {
        this.setAttribute('aria-labelledby', normalizedAriaLabelledBy);
        this.removeAttribute('aria-label');
      } else {
        this.setAttribute('aria-label', this.#resolvedAriaLabel);
        this.removeAttribute('aria-labelledby');
      }

      if (this.dataTestId) {
        this.setAttribute('data-testid', this.dataTestId);
      } else {
        this.removeAttribute('data-testid');
      }

      this.style.setProperty(
        '--peaui-card-carousel-visible-slides',
        String(this.#requestedVisibleSlides),
      );
    });
  }

  #syncSlideMarkup(): void {
    this.#withDomSync(() => {
      this.#viewportElement.className = `${CARD_CAROUSEL_CLASS_NAME}__viewport`;
      this.#viewportElement.id = this.#viewportId;
      this.#viewportElement.tabIndex = 0;

      const normalizedAriaLabelledBy = getNormalizedAttributeValue(
        this.getAttribute('aria-labelledby'),
      );

      if (normalizedAriaLabelledBy) {
        this.#viewportElement.setAttribute('aria-labelledby', normalizedAriaLabelledBy);
        this.#viewportElement.removeAttribute('aria-label');
      } else {
        this.#viewportElement.removeAttribute('aria-labelledby');
        this.#viewportElement.setAttribute(
          'aria-label',
          `${this.#resolvedAriaLabel} - obszar przewijania`,
        );
      }

      const viewportTestId = this.#viewportTestId;

      if (viewportTestId) {
        this.#viewportElement.setAttribute('data-testid', viewportTestId);
      } else {
        this.#viewportElement.removeAttribute('data-testid');
      }

      const slides = normalizeSlideNodes(this.#slideNodes);
      const current = new Set(slides);
      for (const [node, wrapper] of this.#slideWrappers) {
        if (!current.has(node)) {
          wrapper.remove();
          this.#slideWrappers.delete(node);
        }
      }

      slides.forEach((slide, index) => {
        const wrapper = this.#slideWrappers.get(slide) ?? document.createElement('div');
        this.#slideWrappers.set(slide, wrapper);

        wrapper.className = `${CARD_CAROUSEL_CLASS_NAME}__slide`;
        wrapper.setAttribute('role', 'group');
        wrapper.setAttribute('aria-roledescription', 'slide');
        wrapper.setAttribute('aria-label', this.#getSlideAriaLabel(index, slides.length));

        const slideTestId = this.#getSlideTestId(index);

        if (slideTestId) {
          wrapper.setAttribute('data-testid', slideTestId);
        } else wrapper.removeAttribute('data-testid');

        if (slide.parentNode !== wrapper) wrapper.appendChild(slide);
        const position = this.#viewportElement.children.item(index);
        if (position !== wrapper) this.#viewportElement.insertBefore(wrapper, position);
      });

      this.#slideNodes = slides;

      if (this.firstChild !== this.#viewportElement) {
        this.prepend(this.#viewportElement);
      }
    });
  }

  #updateMetrics(): void {
    this.#totalSlides = this.#viewportElement.querySelectorAll(
      `.${CARD_CAROUSEL_CLASS_NAME}__slide`,
    ).length;

    const metrics = getCarouselMetrics(
      this.#viewportElement,
      this.#totalSlides,
      this.#requestedVisibleSlides,
    );
    this.#slideStep = metrics.step;
    this.#visibleSlidesCount = metrics.visible;

    const nextIndex = this.#clampIndex(this.#currentIndex);

    if (nextIndex !== this.#currentIndex && this.#slideStep > 0) {
      this.#viewportElement.scrollLeft = nextIndex * this.#slideStep;
    }

    this.#currentIndex = nextIndex;
  }

  #syncControls(): void {
    this.#syncRotation();
    this.#withDomSync(() => {
      if (!this.#hasControls) {
        this.#controlsElement.remove();
        return;
      }

      this.#controlsElement.className = [
        `${CARD_CAROUSEL_CLASS_NAME}__controls`,
        !this.#shouldRenderDots && `${CARD_CAROUSEL_CLASS_NAME}__controls--navigation-only`,
      ]
        .filter(Boolean)
        .join(' ');

      const controlsTestId = this.#controlsTestId;

      if (controlsTestId) {
        this.#controlsElement.setAttribute('data-testid', controlsTestId);
      } else {
        this.#controlsElement.removeAttribute('data-testid');
      }

      this.#syncNavigationButtons();
      this.#syncPagination();

      const controlsChildren: Node[] = [];

      if (this.isNavigationVisible) {
        controlsChildren.push(this.#previousButtonElement);
      }

      if (this.#shouldRenderDots) {
        controlsChildren.push(this.#paginationElement);
      }

      if (this.isNavigationVisible) {
        controlsChildren.push(this.#nextButtonElement);
      }

      syncNodeChildren(this.#controlsElement, controlsChildren);

      if (this.#controlsElement.parentNode !== this) {
        this.appendChild(this.#controlsElement);
      }
    });
  }

  #syncNavigationButtons(): void {
    this.#previousButtonElement.className = [
      `${CARD_CAROUSEL_CLASS_NAME}__navigation`,
      `${CARD_CAROUSEL_CLASS_NAME}__navigation--previous`,
    ].join(' ');
    this.#previousButtonElement.setAttribute('aria-controls', this.#viewportId);
    this.#previousButtonElement.setAttribute('aria-label', 'Pokaz poprzednie karty');
    this.#previousButtonElement.toggleAttribute('disabled', !this.#canGoPrevious);

    const previousButtonTestId = this.#previousButtonTestId;

    if (previousButtonTestId) {
      this.#previousButtonElement.setAttribute('data-testid', previousButtonTestId);
    } else {
      this.#previousButtonElement.removeAttribute('data-testid');
    }

    this.#nextButtonElement.className = [
      `${CARD_CAROUSEL_CLASS_NAME}__navigation`,
      `${CARD_CAROUSEL_CLASS_NAME}__navigation--next`,
    ].join(' ');
    this.#nextButtonElement.setAttribute('aria-controls', this.#viewportId);
    this.#nextButtonElement.setAttribute('aria-label', 'Pokaz nastepne karty');
    this.#nextButtonElement.toggleAttribute('disabled', !this.#canGoNext);

    const nextButtonTestId = this.#nextButtonTestId;

    if (nextButtonTestId) {
      this.#nextButtonElement.setAttribute('data-testid', nextButtonTestId);
    } else {
      this.#nextButtonElement.removeAttribute('data-testid');
    }

    this.#previousIconElement.className = `${CARD_CAROUSEL_CLASS_NAME}__navigation-icon`;
    this.#nextIconElement.className = `${CARD_CAROUSEL_CLASS_NAME}__navigation-icon`;
  }

  #syncPagination(): void {
    this.#paginationElement.className = `${CARD_CAROUSEL_CLASS_NAME}__pagination`;
    this.#paginationElement.setAttribute('role', 'group');
    this.#paginationElement.setAttribute('aria-label', 'Pozycje karuzeli');

    const paginationTestId = this.#paginationTestId;

    if (paginationTestId) {
      this.#paginationElement.setAttribute('data-testid', paginationTestId);
    } else {
      this.#paginationElement.removeAttribute('data-testid');
    }

    const buttons: HTMLButtonElement[] = [];

    for (let index = 0; index < this.#dotCount; index += 1) {
      const button =
        (this.#paginationElement.children[index] as HTMLButtonElement | undefined) ??
        document.createElement('button');

      button.type = 'button';
      button.className = [
        `${CARD_CAROUSEL_CLASS_NAME}__dot`,
        index === this.#currentIndex && `${CARD_CAROUSEL_CLASS_NAME}__dot--active`,
      ]
        .filter(Boolean)
        .join(' ');

      if (index === this.#currentIndex) {
        button.setAttribute('aria-current', 'true');
        button.setAttribute('aria-disabled', 'true');
      } else {
        button.removeAttribute('aria-current');
        button.removeAttribute('aria-disabled');
      }
      button.setAttribute('aria-controls', this.#viewportId);

      button.setAttribute('aria-label', this.#getDotAriaLabel(index));

      const dotTestId = this.#getDotTestId(index);

      if (dotTestId) {
        button.setAttribute('data-testid', dotTestId);
      }

      button.onclick = () => this.#scrollToIndex(index);
      buttons.push(button);
    }

    syncNodeChildren(this.#paginationElement, buttons);
  }

  #syncIndexFromScroll(): void {
    if (this.#slideStep <= 0) {
      this.#currentIndex = this.#clampIndex(this.#currentIndex);
      return;
    }

    this.#currentIndex = this.#clampIndex(
      Math.round(this.#viewportElement.scrollLeft / this.#slideStep),
    );
  }

  #scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth'): void {
    const clampedIndex = this.#clampIndex(index);
    const fallbackGap = getViewportGap(this.#viewportElement);
    const slideElement = this.#viewportElement.querySelector<HTMLElement>(
      `.${CARD_CAROUSEL_CLASS_NAME}__slide`,
    );
    const fallbackWidth = slideElement?.offsetWidth ?? 0;
    const calculatedStep =
      this.#slideStep ||
      (fallbackWidth > 0 ? fallbackWidth + fallbackGap : this.#viewportElement.clientWidth);

    this.#currentIndex = clampedIndex;

    if (typeof this.#viewportElement.scrollTo === 'function') {
      this.#viewportElement.scrollTo({
        left: clampedIndex * calculatedStep,
        behavior: prefersReducedMotion() ? 'auto' : behavior,
      });
    } else {
      this.#viewportElement.scrollLeft = clampedIndex * calculatedStep;
    }

    this.#syncControls();
  }

  #handleGoToPreviousSlide(): void {
    if (!this.#canGoPrevious) {
      return;
    }

    this.#scrollToIndex(this.#currentIndex - 1);
  }

  #handleGoToNextSlide(): void {
    if (!this.#canGoNext) {
      return;
    }

    this.#scrollToIndex(this.#currentIndex + 1);
  }

  #handleGoToAnimatedSlide(): void {
    const nextIndex = this.#currentIndex >= this.#maxStartIndex ? 0 : this.#currentIndex + 1;

    this.#scrollToIndex(nextIndex);
  }

  #handleKeydown = (event: KeyboardEvent): void => {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    if (!shouldHandleKeyboardNavigation(event.target, event.currentTarget)) {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.#handleGoToPreviousSlide();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.#handleGoToNextSlide();
        break;
      case 'Home':
        event.preventDefault();
        this.#scrollToIndex(0);
        break;
      case 'End':
        event.preventDefault();
        this.#scrollToIndex(this.#maxStartIndex);
        break;
      default:
        break;
    }
  };

  #handleScroll = (): void => {
    this.#syncIndexFromScroll();
    this.#syncControls();
  };

  #handlePointerDown = (event: PointerEvent): void => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    if (isInteractiveTarget(event.target)) {
      return;
    }

    if (this.#syncIndexTimeout) {
      window.clearTimeout(this.#syncIndexTimeout);
      this.#syncIndexTimeout = undefined;
    }

    this.#isPointerDragging = true;
    this.#pointerStartX = event.clientX;
    this.#pointerStartScrollLeft = this.#viewportElement.scrollLeft;

    if (typeof this.#viewportElement.setPointerCapture === 'function') {
      this.#viewportElement.setPointerCapture(event.pointerId);
    }

    this.#syncRootAttributes();
    this.#syncAnimationInterval();
  };

  #handlePointerMove = (event: PointerEvent): void => {
    if (!this.#isPointerDragging) {
      return;
    }

    this.#viewportElement.scrollLeft =
      this.#pointerStartScrollLeft - (event.clientX - this.#pointerStartX);
  };

  #handlePointerEnd = (event?: PointerEvent): void => {
    if (!this.#isPointerDragging) {
      return;
    }

    this.#isPointerDragging = false;

    if (
      event &&
      typeof this.#viewportElement.hasPointerCapture === 'function' &&
      this.#viewportElement.hasPointerCapture(event.pointerId)
    ) {
      this.#viewportElement.releasePointerCapture(event.pointerId);
    }

    this.#syncRootAttributes();
    this.#syncAnimationInterval();

    this.#syncIndexTimeout = window.setTimeout(() => {
      this.#syncIndexFromScroll();
      this.#syncControls();
    }, 80);
  };

  #handleMouseEnter = (): void => {
    this.#isPointerHovering = true;
    this.#syncAnimationInterval();
  };

  #handleMouseLeave = (): void => {
    this.#isPointerHovering = false;
    this.#syncAnimationInterval();
  };

  #handleFocusIn = (event: FocusEvent): void => {
    if (event.relatedTarget instanceof Node && this.contains(event.relatedTarget)) return;
    this.#rotationPaused = true;
    this.#syncRotation();
    this.#syncAnimationInterval();
  };

  #updateMotionPreference = (): void => {
    if (this.#motionQuery?.matches === true) this.#rotationPaused = true;
    this.#syncRotation();
    this.#syncAnimationInterval();
  };

  get pauseLabel(): string {
    return this.getAttribute('pause-label') ?? CAROUSEL_PAUSE_LABEL;
  }
  set pauseLabel(value: string) {
    this.setAttribute('pause-label', value);
  }
  get resumeLabel(): string {
    return this.getAttribute('resume-label') ?? CAROUSEL_RESUME_LABEL;
  }
  set resumeLabel(value: string) {
    this.setAttribute('resume-label', value);
  }

  #syncRotation(): void {
    if (!this.withAnimation || !this.#hasOverflow) {
      this.#rotationElement.remove();
      return;
    }
    this.#rotationElement.className = `${CARD_CAROUSEL_CLASS_NAME}__rotation`;
    this.#rotationElement.textContent = this.#rotationPaused ? this.resumeLabel : this.pauseLabel;
    this.#rotationElement.setAttribute('aria-controls', this.#viewportId);
    if (this.#rotationElement.parentNode !== this)
      this.insertBefore(this.#rotationElement, this.#viewportElement);
  }

  #clearAnimationInterval(): void {
    if (this.#animationInterval) {
      window.clearInterval(this.#animationInterval);
      this.#animationInterval = undefined;
    }
  }

  #syncAnimationInterval(): void {
    this.#clearAnimationInterval();

    if (
      !this.withAnimation ||
      !this.#hasOverflow ||
      this.#isPointerDragging ||
      this.#isPointerHovering ||
      this.#rotationPaused
    ) {
      return;
    }

    this.#animationInterval = window.setInterval(() => {
      this.#handleGoToAnimatedSlide();
    }, this.#resolvedAnimationDelay);
  }

  #clampIndex(index: number): number {
    return Math.min(Math.max(index, 0), this.#maxStartIndex);
  }

  #getSlideTestId(index: number): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-slide-${index + 1}` : undefined;
  }

  #getDotTestId(index: number): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-dot-${index + 1}` : undefined;
  }

  #getSlideAriaLabel(index: number, slideCount: number): string {
    return `Slajd ${index + 1} z ${slideCount}`;
  }

  #getDotAriaLabel(index: number): string {
    return `Przejdz do widoku ${index + 1} z ${this.#dotCount}`;
  }

  get #requestedVisibleSlides(): SlideVisibleCount {
    const value = this.defaultVisibleSlides ?? this.defualtVisibleSlides ?? 4;
    const normalizedValue = Number(value);

    if (!Number.isFinite(normalizedValue)) {
      return 4;
    }

    return Math.max(1, Math.floor(normalizedValue));
  }

  get #resolvedAnimationDelay(): number {
    const normalizedValue = Number(getNumberAttributeValue(this, 'animation-delay') ?? 2000);

    if (!Number.isFinite(normalizedValue) || normalizedValue <= 0) {
      return 2000;
    }

    return normalizedValue;
  }

  get #resolvedAriaLabel(): string {
    return this.ariaLabel || DEFAULT_ACCESSIBLE_NAME;
  }

  get #maxStartIndex(): number {
    return Math.max(this.#totalSlides - this.#visibleSlidesCount, 0);
  }

  get #dotCount(): number {
    return this.#totalSlides > 0 ? this.#maxStartIndex + 1 : 0;
  }

  get #hasOverflow(): boolean {
    return this.#totalSlides > this.#visibleSlidesCount;
  }

  get #canGoPrevious(): boolean {
    return this.#currentIndex > 0;
  }

  get #canGoNext(): boolean {
    return this.#currentIndex < this.#maxStartIndex;
  }

  get #shouldRenderDots(): boolean {
    return this.isNavigationDotsVisible && this.#dotCount > 1;
  }

  get #hasControls(): boolean {
    return this.#hasOverflow && (this.isNavigationVisible || this.#shouldRenderDots);
  }

  get #viewportId(): string {
    return `${this.id || this.#defaultId}-viewport`;
  }

  get #viewportTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-viewport` : undefined;
  }

  get #controlsTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-controls` : undefined;
  }

  get #paginationTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-pagination` : undefined;
  }

  get #previousButtonTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-previous` : undefined;
  }

  get #nextButtonTestId(): string | undefined {
    return this.dataTestId ? `${this.dataTestId}-next` : undefined;
  }
}

export function defineCardCarousel(): typeof CardCarouselElement {
  if (typeof window !== 'undefined' && !window.customElements.get(CARD_CAROUSEL_TAG_NAME)) {
    window.customElements.define(CARD_CAROUSEL_TAG_NAME, CardCarouselElement);
  }

  return CardCarouselElement;
}

defineCardCarousel();

export default CardCarouselElement;
