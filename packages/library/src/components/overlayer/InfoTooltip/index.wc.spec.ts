import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InfoTooltipElement, defineInfoTooltip } from './index.wc';

defineInfoTooltip();

const NESTED_INFO_TOOLTIP_MUTATION_TAG_NAME = 'test-info-tooltip-child-mutation';

class NestedInfoTooltipChildMutationElement extends HTMLElement {
  internalContainer = document.createElement('span');

  connectedCallback(): void {
    if (this.internalContainer.parentNode !== this) {
      this.appendChild(this.internalContainer);
    }
  }

  appendInternalNode(): void {
    const node = document.createElement('span');

    node.textContent = 'Nested content update';
    this.internalContainer.appendChild(node);
  }
}

if (!window.customElements.get(NESTED_INFO_TOOLTIP_MUTATION_TAG_NAME)) {
  window.customElements.define(
    NESTED_INFO_TOOLTIP_MUTATION_TAG_NAME,
    NestedInfoTooltipChildMutationElement,
  );
}

type MountOptions = {
  dataTestId?: string;
  description?: string;
  disabled?: boolean;
  forwardedTriggerTestId?: string;
  placement?:
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
  title?: string;
  trigger?: Node | string;
  variant?: 'default' | 'disabled';
};

function createTooltipElement(options: MountOptions = {}): InfoTooltipElement {
  const element = document.createElement(InfoTooltipElement.tagName) as InfoTooltipElement;

  if (options.placement !== undefined) {
    element.placement = options.placement;
  }

  if (options.variant !== undefined) {
    element.variant = options.variant;
  }

  if (options.disabled !== undefined) {
    element.disabled = options.disabled;
  }

  if (options.dataTestId !== undefined) {
    element.dataTestId = options.dataTestId;
  }

  if (options.forwardedTriggerTestId !== undefined) {
    element.setAttribute('data-testid', options.forwardedTriggerTestId);
  }

  const trigger = options.trigger ?? 'Trigger';

  if (typeof trigger === 'string') {
    element.append(trigger);
  } else {
    element.appendChild(trigger);
  }

  if (options.title !== undefined) {
    const title = document.createElement('span');

    title.setAttribute('slot', 'title');
    title.textContent = options.title;
    element.appendChild(title);
  }

  if (options.description !== undefined) {
    const description = document.createElement('span');

    description.setAttribute('slot', 'description');
    description.textContent = options.description;
    element.appendChild(description);
  }

  return element;
}

function getTooltip(element: InfoTooltipElement): HTMLElement {
  const tooltip = element.nextElementSibling;

  if (!(tooltip instanceof HTMLElement)) {
    throw new Error('Tooltip sibling was not rendered.');
  }

  return tooltip;
}

async function syncInfoTooltipState() {
  await Promise.resolve();
  await Promise.resolve();
}

describe('InfoTooltip (index.wc.ts)', () => {
  const observe = vi.fn();
  const disconnect = vi.fn();
  const cancelAnimationFrame = vi.fn();
  let animationFrameId = 0;
  let resizeObserverCallback: ResizeObserverCallback | null = null;
  let animationFrameCallbacks: Array<{ id: number; callback: FrameRequestCallback }> = [];

  const flushAnimationFrames = () => {
    const callbacks = [...animationFrameCallbacks];

    animationFrameCallbacks = [];

    callbacks.forEach(({ callback }) => {
      callback(performance.now());
    });
  };

  beforeEach(() => {
    observe.mockReset();
    disconnect.mockReset();
    cancelAnimationFrame.mockReset();
    animationFrameId = 0;
    resizeObserverCallback = null;
    animationFrameCallbacks = [];

    class ResizeObserverMock {
      observe = observe;
      disconnect = disconnect;

      constructor(callback: ResizeObserverCallback) {
        resizeObserverCallback = callback;
      }
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      animationFrameId += 1;
      animationFrameCallbacks.push({ id: animationFrameId, callback });
      return animationFrameId;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      cancelAnimationFrame(id);
      animationFrameCallbacks = animationFrameCallbacks.filter((entry) => entry.id !== id);
    });
    vi.stubGlobal('visualViewport', {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('renders with default placement=top and required structure', async () => {
    const element = createTooltipElement();

    document.body.appendChild(element);
    await syncInfoTooltipState();

    const tooltip = getTooltip(element);

    expect(tooltip.getAttribute('role')).toBe('tooltip');
    expect(tooltip.getAttribute('id')).toMatch(/^info-tooltip-/);
    expect(element.classList.contains('peaui-info-tooltip')).toBe(true);
    expect(tooltip.classList.contains('peaui-info-tooltip__content')).toBe(true);
    expect(tooltip.classList.contains('peaui-info-tooltip__content--placement-top')).toBe(true);
    expect(tooltip.classList.contains('peaui-info-tooltip__content--variant-default')).toBe(true);
  });

  it('applies placement and variant classes from attrs', async () => {
    const element = createTooltipElement({
      placement: 'bottom-right',
      variant: 'disabled',
      title: 'Title',
      description: 'Description',
    });

    document.body.appendChild(element);
    await syncInfoTooltipState();

    const tooltip = getTooltip(element);

    expect(tooltip.classList.contains('peaui-info-tooltip__content--placement-bottom-right')).toBe(
      true,
    );
    expect(tooltip.classList.contains('peaui-info-tooltip__content--variant-disabled')).toBe(true);
    expect(tooltip.querySelector('strong')?.textContent).toBe('Title');
    expect(tooltip.querySelector('p')?.textContent).toBe('Description');
  });

  it('does not re-render from managed host and tooltip content mutations', async () => {
    const renderSpy = vi.spyOn(InfoTooltipElement.prototype, 'render');
    const element = createTooltipElement({
      title: 'Title',
      description: 'Description',
    });

    document.body.appendChild(element);
    await syncInfoTooltipState();
    await syncInfoTooltipState();

    expect(renderSpy).toHaveBeenCalledTimes(1);

    renderSpy.mockRestore();
  });

  it('does not open tooltip and removes generated accessibility bindings when disabled is true', async () => {
    const element = createTooltipElement({
      disabled: true,
      description: 'Tooltip content',
    });

    document.body.appendChild(element);
    await syncInfoTooltipState();

    const tooltip = getTooltip(element);

    expect(element.classList.contains('peaui-info-tooltip--disabled')).toBe(true);
    expect(element.getAttribute('tabindex')).toBeNull();
    expect(element.getAttribute('role')).toBeNull();
    expect(element.getAttribute('aria-describedby')).toBeNull();
    expect(tooltip.getAttribute('aria-hidden')).toBe('true');

    element.dispatchEvent(new Event('mouseenter'));
    expect(element.getAttribute('data-open')).toBeNull();

    element.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(element.getAttribute('data-open')).toBeNull();
  });

  it('adds data-testid suffixes when dataTestId is provided', async () => {
    const element = createTooltipElement({
      dataTestId: 'info-tooltip',
      title: 'Title',
      description: 'Description',
    });

    document.body.appendChild(element);
    await syncInfoTooltipState();

    const tooltip = getTooltip(element);

    expect(element.getAttribute('data-testid')).toBe('info-tooltip-content');
    expect(tooltip.getAttribute('data-testid')).toBe('info-tooltip-tooltip');
    expect(tooltip.querySelector('[data-testid="info-tooltip-title"]')?.textContent).toBe('Title');
    expect(tooltip.querySelector('[data-testid="info-tooltip-description"]')?.textContent).toBe(
      'Description',
    );
  });

  it('uses forwarded data-testid on trigger when base dataTestId is not provided', async () => {
    const element = createTooltipElement({
      forwardedTriggerTestId: 'custom-trigger',
      description: 'Description',
    });

    document.body.appendChild(element);
    await syncInfoTooltipState();

    const tooltip = getTooltip(element);

    expect(element.getAttribute('data-testid')).toBe('custom-trigger');
    expect(tooltip.getAttribute('data-testid')).toBeNull();
  });

  it('does not render title or description blocks if slot content is not provided', async () => {
    const element = createTooltipElement({
      dataTestId: 'info-tooltip',
    });

    document.body.appendChild(element);
    await syncInfoTooltipState();

    const tooltip = getTooltip(element);

    expect(tooltip.querySelector('strong')).toBeNull();
    expect(tooltip.querySelector('p')).toBeNull();
  });

  it('keeps wrapper focusable and described by tooltip when slot has no focusable trigger', async () => {
    const element = createTooltipElement({
      description: 'Tooltip content',
    });

    document.body.appendChild(element);
    await syncInfoTooltipState();

    const tooltip = getTooltip(element);

    expect(element.getAttribute('tabindex')).toBe('0');
    expect(element.getAttribute('role')).toBe('button');
    expect(element.getAttribute('aria-label')).toBeNull();
    expect(element.getAttribute('aria-describedby')).toBe(tooltip.getAttribute('id'));
  });

  it('does not add extra wrapper tab stop when slot already contains focusable trigger', async () => {
    const button = document.createElement('button');

    button.type = 'button';
    button.setAttribute('aria-describedby', 'external-description');
    button.textContent = 'Trigger';

    const element = createTooltipElement({
      trigger: button,
      description: 'Tooltip content',
    });

    document.body.appendChild(element);
    await syncInfoTooltipState();

    const tooltip = getTooltip(element);
    const describedBy = button.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(element.getAttribute('tabindex')).toBeNull();
    expect(element.getAttribute('role')).toBeNull();
    expect(element.getAttribute('aria-describedby')).toBeNull();
    expect(describedBy).toContain('external-description');
    expect(describedBy).toContain(tooltip.getAttribute('id') ?? '');
  });

  it('reuses interactive ancestor as described trigger instead of adding nested tab stop', async () => {
    const parentButton = document.createElement('button');

    parentButton.type = 'button';
    parentButton.setAttribute('aria-describedby', 'external-parent-description');

    const element = createTooltipElement({
      trigger: 'Trigger',
      description: 'Tooltip content',
    });

    parentButton.appendChild(element);
    document.body.appendChild(parentButton);
    await syncInfoTooltipState();

    const tooltip = getTooltip(element);
    const describedBy = parentButton.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(element.getAttribute('tabindex')).toBeNull();
    expect(element.getAttribute('role')).toBeNull();
    expect(element.getAttribute('aria-describedby')).toBeNull();
    expect(describedBy).toContain('external-parent-description');
    expect(describedBy).toContain(tooltip.getAttribute('id') ?? '');
  });

  it('adds fallback accessible name when wrapper manages an icon-only trigger', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('viewBox', '0 0 14 14');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    circle.setAttribute('cx', '7');
    circle.setAttribute('cy', '7');
    circle.setAttribute('r', '7');
    svg.appendChild(circle);

    const element = createTooltipElement({
      trigger: svg,
      description: 'Tooltip content',
    });

    document.body.appendChild(element);
    await syncInfoTooltipState();

    expect(element.getAttribute('role')).toBe('button');
    expect(element.getAttribute('aria-label')).toBe('Pokaz dodatkowe informacje');
  });

  it('applies explicit aria-labelledby to the host trigger when it manages its own focus', async () => {
    const label = document.createElement('span');

    label.id = 'tooltip-trigger-label';
    label.textContent = 'Pomoc';
    document.body.appendChild(label);

    const element = createTooltipElement({
      trigger: '',
      description: 'Tooltip content',
    });

    element.setAttribute('aria-labelledby', 'tooltip-trigger-label');
    document.body.appendChild(element);
    await syncInfoTooltipState();

    expect(element.getAttribute('aria-labelledby')).toBe('tooltip-trigger-label');
    expect(element.getAttribute('aria-label')).toBeNull();
  });

  it('opens on trigger hover but not on managed ancestor hover', async () => {
    const parentButton = document.createElement('button');

    parentButton.type = 'button';

    const element = createTooltipElement({
      trigger: 'Trigger',
      description: 'Tooltip content',
    });

    parentButton.appendChild(element);
    document.body.appendChild(parentButton);
    await syncInfoTooltipState();

    parentButton.dispatchEvent(new Event('mouseenter'));
    expect(element.getAttribute('data-open')).toBeNull();

    element.dispatchEvent(new Event('mouseenter'));
    expect(element.getAttribute('data-open')).toBe('true');

    element.dispatchEvent(new Event('mouseleave'));
    expect(element.getAttribute('data-open')).toBeNull();

    parentButton.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(element.getAttribute('data-open')).toBe('true');
  });

  it('keeps the tooltip open while pointer moves from trigger to tooltip content', async () => {
    const element = createTooltipElement({
      description: 'Tooltip content',
    });

    document.body.appendChild(element);
    await syncInfoTooltipState();

    const tooltip = getTooltip(element);

    element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(element.getAttribute('data-open')).toBe('true');

    element.dispatchEvent(
      new MouseEvent('mouseleave', {
        bubbles: true,
        relatedTarget: tooltip,
      }),
    );
    expect(element.getAttribute('data-open')).toBe('true');

    tooltip.dispatchEvent(
      new MouseEvent('mouseleave', {
        bubbles: true,
        relatedTarget: document.body,
      }),
    );
    expect(element.getAttribute('data-open')).toBeNull();
  });

  it('supports dismissing an own managed trigger with Escape while focused', async () => {
    const element = createTooltipElement({
      description: 'Tooltip content',
    });

    document.body.appendChild(element);
    await syncInfoTooltipState();

    element.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(element.getAttribute('data-open')).toBe('true');

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(element.getAttribute('data-open')).toBeNull();
  });

  it('refreshes anchor layout token on initial frame and resize', async () => {
    const element = createTooltipElement();

    document.body.appendChild(element);
    await syncInfoTooltipState();

    const tooltip = getTooltip(element);

    expect(element.getAttribute('style')).toContain('--peaui-info-tooltip-layout-version: 0;');
    expect(tooltip.getAttribute('style')).toContain('--peaui-info-tooltip-layout-version: 0;');

    flushAnimationFrames();
    await syncInfoTooltipState();

    expect(element.getAttribute('style')).toContain('--peaui-info-tooltip-layout-version: 1;');
    expect(tooltip.getAttribute('style')).toContain('--peaui-info-tooltip-layout-version: 1;');

    window.dispatchEvent(new Event('resize'));
    await syncInfoTooltipState();

    expect(element.getAttribute('style')).toContain('--peaui-info-tooltip-layout-version: 2;');
    expect(tooltip.getAttribute('style')).toContain('--peaui-info-tooltip-layout-version: 2;');
  });

  it('refreshes anchor layout token when trigger or tooltip content resizes', async () => {
    const element = createTooltipElement({
      description: 'Tooltip content',
    });

    document.body.appendChild(element);
    await syncInfoTooltipState();

    const tooltip = getTooltip(element);

    expect(observe).toHaveBeenCalledWith(element);
    expect(observe).toHaveBeenCalledWith(tooltip);
    expect(resizeObserverCallback).toBeTypeOf('function');

    flushAnimationFrames();
    await syncInfoTooltipState();

    resizeObserverCallback?.([], {} as ResizeObserver);
    await syncInfoTooltipState();

    expect(element.getAttribute('style')).toContain('--peaui-info-tooltip-layout-version: 2;');
    expect(tooltip.getAttribute('style')).toContain('--peaui-info-tooltip-layout-version: 2;');
  });

  it('does not re-render when nested custom element content mutates inside tooltip slots', async () => {
    const renderSpy = vi.spyOn(InfoTooltipElement.prototype, 'render');
    const nestedElement = document.createElement(
      NESTED_INFO_TOOLTIP_MUTATION_TAG_NAME,
    ) as NestedInfoTooltipChildMutationElement;
    const element = createTooltipElement();

    nestedElement.setAttribute('slot', 'description');
    element.appendChild(nestedElement);
    document.body.appendChild(element);
    await syncInfoTooltipState();
    await syncInfoTooltipState();
    renderSpy.mockClear();

    nestedElement.appendInternalNode();
    await syncInfoTooltipState();

    expect(renderSpy).not.toHaveBeenCalled();
  });
});
