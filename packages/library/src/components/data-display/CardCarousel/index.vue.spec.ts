import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import Component from './index.vue';

vi.mock('@/constants', () => ({ UIKIT_NAME: 'uikit' }));
vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));
vi.mock('@/components/basic/SvgIcon/index.vue', () => ({
  default: {
    name: 'SvgIcon',
    props: ['name'],
    template: '<svg :data-icon="name" aria-hidden="true" />',
  },
}));

function factory(props?: Partial<InstanceType<typeof Component>['$props']>) {
  return mount(Component, {
    props: {
      ariaLabel: 'Karuzela testowa',
      dataTestId: 'card-carousel',
      defaultVisibleSlides: 4,
      ...props,
    },
    slots: {
      default: `
        <article data-testid="card-a">A</article>
        <article data-testid="card-b">B</article>
        <article data-testid="card-c">C</article>
        <article data-testid="card-d">D</article>
        <article data-testid="card-e">E</article>
        <article data-testid="card-f">F</article>
      `,
    },
  });
}

async function syncCarouselState() {
  await nextTick();
  await nextTick();
}

describe('CardCarousel (index.vue)', () => {
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
  const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
  let getComputedStyleSpy: ReturnType<typeof vi.spyOn>;
  let scrollToSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return this.classList?.contains('uikit-card-carousel__slide') ? 242 : 0;
      },
    });

    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() {
        return this.classList?.contains('uikit-card-carousel__viewport') ? 1032 : 0;
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
    vi.useRealTimers();

    if (originalOffsetWidth) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
    }

    if (originalClientWidth) {
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
    }
  });

  it('renders a carousel region with BEM classes, slides and aria metadata', async () => {
    const wrapper = factory();
    await syncCarouselState();

    const root = wrapper.get('[data-testid="card-carousel"]');

    expect(root.attributes('role')).toBe('region');
    expect(root.attributes('aria-roledescription')).toBe('carousel');
    expect(root.attributes('aria-label')).toBe('Karuzela testowa');
    expect(root.classes()).toContain('uikit-card-carousel');

    const slides = wrapper.findAll('.uikit-card-carousel__slide');
    expect(slides).toHaveLength(6);
    expect(slides[0]!.attributes('aria-roledescription')).toBe('slide');
    expect(slides[0]!.attributes('aria-label')).toBe('Slajd 1 z 6');
    expect(slides[0]!.attributes('data-testid')).toBe('card-carousel-slide-1');
  });

  it('renders navigation and pagination with the expected accessible labels', async () => {
    const wrapper = factory();
    await syncCarouselState();

    const controls = wrapper.get('[data-testid="card-carousel-controls"]');
    expect(wrapper.get('[data-testid="card-carousel-previous"]').attributes('aria-label')).toBe(
      'Pokaz poprzednie karty',
    );
    expect(wrapper.get('[data-testid="card-carousel-next"]').attributes('aria-label')).toBe(
      'Pokaz nastepne karty',
    );

    expect(
      Array.from(controls.element.children).map((element) => element.getAttribute('data-testid')),
    ).toEqual(['card-carousel-previous', 'card-carousel-pagination', 'card-carousel-next']);

    const dots = wrapper.findAll('.uikit-card-carousel__dot');
    expect(wrapper.get('[data-testid="card-carousel-pagination"]').attributes('role')).toBe(
      'group',
    );
    expect(dots).toHaveLength(3);
    expect(dots[0]!.attributes('aria-current')).toBe('true');
    expect(dots[1]!.attributes('aria-label')).toBe('Przejdz do widoku 2 z 3');
  });

  it('moves between views using buttons and updates disabled states', async () => {
    const wrapper = factory();
    await syncCarouselState();

    const previousButton = wrapper.get('[data-testid="card-carousel-previous"]');
    const nextButton = wrapper.get('[data-testid="card-carousel-next"]');

    expect(previousButton.attributes('disabled')).toBeDefined();
    expect(nextButton.attributes('disabled')).toBeUndefined();

    await nextButton.trigger('click');
    await nextButton.trigger('click');

    const dots = wrapper.findAll('.uikit-card-carousel__dot');
    expect(dots[2]!.attributes('aria-current')).toBe('true');
    expect(nextButton.attributes('disabled')).toBeDefined();
    expect(previousButton.attributes('disabled')).toBeUndefined();
    expect(scrollToSpy).toHaveBeenLastCalledWith({ behavior: 'smooth', left: 516 });
  });

  it('supports keyboard navigation for Arrow keys, Home and End', async () => {
    const wrapper = factory();
    await syncCarouselState();
    const root = wrapper.get('[data-testid="card-carousel"]');

    await root.trigger('keydown', { key: 'End' });
    expect(wrapper.findAll('.uikit-card-carousel__dot')[2]!.attributes('aria-current')).toBe(
      'true',
    );

    await root.trigger('keydown', { key: 'Home' });
    expect(wrapper.findAll('.uikit-card-carousel__dot')[0]!.attributes('aria-current')).toBe(
      'true',
    );

    await root.trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.findAll('.uikit-card-carousel__dot')[1]!.attributes('aria-current')).toBe(
      'true',
    );

    await root.trigger('keydown', { key: 'ArrowLeft' });
    expect(wrapper.findAll('.uikit-card-carousel__dot')[0]!.attributes('aria-current')).toBe(
      'true',
    );
  });

  it('hides controls when there is no overflow or when controls are disabled by props', async () => {
    const wrapper = mount(Component, {
      props: {
        ariaLabel: 'Karuzela bez overflow',
        defaultVisibleSlides: 4,
        isNavigationDotsVisible: false,
        isNavigationVisible: false,
      },
      slots: {
        default: `
          <article>A</article>
          <article>B</article>
          <article>C</article>
        `,
      },
    });
    await syncCarouselState();

    expect(wrapper.find('.uikit-card-carousel__navigation').exists()).toBe(false);
    expect(wrapper.find('.uikit-card-carousel__pagination').exists()).toBe(false);
    expect(wrapper.find('.uikit-card-carousel__controls').exists()).toBe(false);
  });

  it('hides pagination when isNavigationDotsVisible is set to false', async () => {
    const wrapper = factory({
      isNavigationDotsVisible: false,
    });
    await syncCarouselState();

    expect(wrapper.find('.uikit-card-carousel__navigation').exists()).toBe(true);
    expect(wrapper.find('.uikit-card-carousel__pagination').exists()).toBe(false);
  });

  it('adds a single-slide modifier when only one slide is rendered', async () => {
    const wrapper = mount(Component, {
      props: {
        ariaLabel: 'Karuzela z jednym slajdem',
      },
      slots: {
        default: `
          <article>Jedna karta</article>
        `,
      },
    });
    await syncCarouselState();

    expect(wrapper.classes()).toContain('uikit-card-carousel--single-slide');
  });

  it('keeps backward compatibility for the defualtVisibleSlides prop alias', async () => {
    const wrapper = mount(Component, {
      props: {
        ariaLabel: 'Karuzela z aliasem',
        defualtVisibleSlides: 3,
      },
      slots: {
        default: `
          <article>A</article>
          <article>B</article>
          <article>C</article>
          <article>D</article>
        `,
      },
    });
    await syncCarouselState();

    expect(wrapper.attributes('style')).toContain('--peaui-card-carousel-visible-slides: 3;');
  });

  it('auto-advances slides every 2 seconds when withAnimation is enabled', async () => {
    vi.useFakeTimers();

    const wrapper = factory({
      withAnimation: true,
    });
    await syncCarouselState();

    expect(wrapper.findAll('.uikit-card-carousel__dot')[0]!.attributes('aria-current')).toBe(
      'true',
    );

    await vi.advanceTimersByTimeAsync(1999);
    await syncCarouselState();

    expect(wrapper.findAll('.uikit-card-carousel__dot')[0]!.attributes('aria-current')).toBe(
      'true',
    );

    await vi.advanceTimersByTimeAsync(1);
    await syncCarouselState();

    expect(wrapper.findAll('.uikit-card-carousel__dot')[1]!.attributes('aria-current')).toBe(
      'true',
    );

    await vi.advanceTimersByTimeAsync(2000);
    await syncCarouselState();

    expect(wrapper.findAll('.uikit-card-carousel__dot')[2]!.attributes('aria-current')).toBe(
      'true',
    );

    await vi.advanceTimersByTimeAsync(2000);
    await syncCarouselState();

    expect(wrapper.findAll('.uikit-card-carousel__dot')[0]!.attributes('aria-current')).toBe(
      'true',
    );
  });

  it('respects a custom animationDelay value when withAnimation is enabled', async () => {
    vi.useFakeTimers();

    const wrapper = factory({
      animationDelay: 1000,
      withAnimation: true,
    });
    await syncCarouselState();

    await vi.advanceTimersByTimeAsync(999);
    await syncCarouselState();

    expect(wrapper.findAll('.uikit-card-carousel__dot')[0]!.attributes('aria-current')).toBe(
      'true',
    );

    await vi.advanceTimersByTimeAsync(1);
    await syncCarouselState();

    expect(wrapper.findAll('.uikit-card-carousel__dot')[1]!.attributes('aria-current')).toBe(
      'true',
    );
  });
});
