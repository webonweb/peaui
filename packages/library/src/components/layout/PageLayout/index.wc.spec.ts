import { afterEach, describe, expect, it, vi } from 'vitest';

import { GridSectionElement, defineGridSection } from '../GridSection/index.wc';
import { PageLayoutElement, definePageLayout } from './index.wc';

defineGridSection();
definePageLayout();

const NESTED_PAGE_LAYOUT_SLOT_MUTATION_TAG_NAME = 'test-page-layout-slot-mutation';

class NestedPageLayoutSlotMutationElement extends HTMLElement {
  internalNode = document.createElement('span');

  connectedCallback(): void {
    if (this.internalNode.parentNode !== this) {
      this.appendChild(this.internalNode);
    }
  }

  setInternalSlot(value: string): void {
    this.internalNode.setAttribute('slot', value);
  }
}

if (!window.customElements.get(NESTED_PAGE_LAYOUT_SLOT_MUTATION_TAG_NAME)) {
  window.customElements.define(
    NESTED_PAGE_LAYOUT_SLOT_MUTATION_TAG_NAME,
    NestedPageLayoutSlotMutationElement,
  );
}

type MountOptions = {
  additional?: Array<Node | string> | Node | string;
  ariaLabel?: string;
  attrs?: Record<string, string>;
  content?: Array<Node | string> | Node | string;
  dataTestId?: string;
  footer?: Array<Node | string> | Node | string;
  isHeaderSticky?: boolean;
  top?: Array<Node | string> | Node | string;
};

function appendNodes(
  element: PageLayoutElement,
  content: Array<Node | string> | Node | string,
  slotName?: string,
) {
  const items = Array.isArray(content) ? content : [content];

  for (const item of items) {
    if (typeof item === 'string') {
      if (!slotName) {
        element.append(item);
        continue;
      }

      const wrapper = document.createElement('div');

      wrapper.setAttribute('slot', slotName);
      wrapper.textContent = item;
      element.appendChild(wrapper);
      continue;
    }

    if (slotName && item instanceof Element) {
      item.setAttribute('slot', slotName);
    }

    element.appendChild(item);
  }
}

function mountPageLayout(options: MountOptions = {}): PageLayoutElement {
  const element = document.createElement(PageLayoutElement.tagName) as PageLayoutElement;

  if (options.ariaLabel !== undefined) {
    element.ariaLabel = options.ariaLabel;
  }

  if (options.dataTestId !== undefined) {
    element.dataTestId = options.dataTestId;
  }

  if (options.isHeaderSticky !== undefined) {
    element.isHeaderSticky = options.isHeaderSticky;
  }

  if (options.attrs) {
    for (const [name, value] of Object.entries(options.attrs)) {
      element.setAttribute(name, value);
    }
  }

  if (options.top !== undefined) {
    appendNodes(element, options.top, 'top');
  }

  if (options.additional !== undefined) {
    appendNodes(element, options.additional, 'additional');
  }

  appendNodes(
    element,
    options.content ??
      (() => {
        const wrapper = document.createElement('div');

        wrapper.textContent = 'Body';
        return wrapper;
      })(),
  );

  if (options.footer !== undefined) {
    appendNodes(element, options.footer, 'footer');
  }

  document.body.appendChild(element);

  return element;
}

async function syncPageLayoutState() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('PageLayout (index.wc.ts)', () => {
  it('renders root with base class and passes attrs', async () => {
    const element = mountPageLayout({
      attrs: {
        id: 'page-root',
        'data-foo': 'bar',
      },
    });

    await syncPageLayoutState();

    expect(element.classList.contains('peaui-page-layout')).toBe(true);
    expect(element.getAttribute('id')).toBe('page-root');
    expect(element.getAttribute('data-foo')).toBe('bar');
  });

  it('does not render header when top slot is missing', async () => {
    const element = mountPageLayout();

    await syncPageLayoutState();

    expect(Boolean(element.querySelector('header'))).toBe(false);
  });

  it('renders header with top slot and aria-label', async () => {
    const top = document.createElement('div');

    top.setAttribute('data-testid', 'top-slot');
    top.textContent = 'Top';

    const element = mountPageLayout({
      ariaLabel: 'Header label',
      top,
    });

    await syncPageLayoutState();

    const header = element.querySelector('header');

    expect(header?.classList.contains('peaui-page-layout__top')).toBe(true);
    expect(header?.getAttribute('aria-label')).toBe('Header label');
    expect(header?.querySelector('[data-testid="top-slot"]')?.textContent).toBe('Top');
  });

  it('adds sticky class when isHeaderSticky=true', async () => {
    const element = mountPageLayout({
      isHeaderSticky: true,
      top: 'Top',
    });

    await syncPageLayoutState();

    expect(
      element.querySelector('header')?.classList.contains('peaui-page-layout__top--sticky'),
    ).toBe(true);
  });

  it('renders main with content class and generated data-testid', async () => {
    const element = mountPageLayout({
      dataTestId: 'page',
      top: 'Top',
    });

    await syncPageLayoutState();

    const main = element.querySelector('main');
    const header = element.querySelector('header');

    expect(main?.classList.contains('peaui-page-layout__content')).toBe(true);
    expect(main?.getAttribute('data-testid')).toBe('page-content');
    expect(header?.getAttribute('data-testid')).toBe('page-top');
  });

  it('renders additional slot only when provided', async () => {
    const extra = document.createElement('span');

    extra.setAttribute('data-testid', 'extra');
    extra.textContent = 'Extra';

    const element = mountPageLayout({
      additional: extra,
    });

    await syncPageLayoutState();

    expect(
      element.querySelector('.peaui-page-layout__additional [data-testid="extra"]')?.textContent,
    ).toBe('Extra');
  });

  it('does not render additional container when slot is missing', async () => {
    const element = mountPageLayout();

    await syncPageLayoutState();

    expect(Boolean(element.querySelector('.peaui-page-layout__additional'))).toBe(false);
  });

  it('wraps default slot in body element', async () => {
    const body = document.createElement('div');

    body.textContent = 'Body';

    const element = mountPageLayout({
      content: body,
    });

    await syncPageLayoutState();

    expect(element.querySelector('.peaui-page-layout__body')?.textContent).toContain('Body');
  });

  it('renders footer only when footer slot is provided', async () => {
    const footer = document.createElement('div');

    footer.setAttribute('data-testid', 'footer-slot');
    footer.textContent = 'Footer';

    const element = mountPageLayout({
      footer,
    });

    await syncPageLayoutState();

    expect(element.querySelector('footer.peaui-page-layout__footer')).not.toBeNull();
    expect(
      element.querySelector('.peaui-page-layout__footer [data-testid="footer-slot"]')?.textContent,
    ).toBe('Footer');
  });

  it('ignores managed mutations to avoid an internal render loop', async () => {
    const renderSpy = vi.spyOn(PageLayoutElement.prototype, 'render');

    mountPageLayout({
      top: 'Top',
      additional: 'Additional',
      content: 'Body',
      footer: 'Footer',
    });

    await syncPageLayoutState();

    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('does not re-render when a nested custom element mutates its internal slot attributes', async () => {
    const renderSpy = vi.spyOn(PageLayoutElement.prototype, 'render');
    const nestedElement = document.createElement(
      NESTED_PAGE_LAYOUT_SLOT_MUTATION_TAG_NAME,
    ) as NestedPageLayoutSlotMutationElement;

    mountPageLayout({
      content: nestedElement,
    });

    await syncPageLayoutState();
    renderSpy.mockClear();

    nestedElement.setInternalSlot('internal');
    await syncPageLayoutState();

    expect(renderSpy).not.toHaveBeenCalled();
  });

  it('does not enter a render loop when top slot contains a nested GridSection', async () => {
    const pageLayoutRenderSpy = vi.spyOn(PageLayoutElement.prototype, 'render');
    const gridSectionRenderSpy = vi.spyOn(GridSectionElement.prototype, 'render');
    const top = document.createElement('div');
    const gridSection = document.createElement(GridSectionElement.tagName) as GridSectionElement;
    const firstItem = document.createElement('div');
    const secondItem = document.createElement('div');

    firstItem.textContent = 'd';
    secondItem.textContent = 'd';
    gridSection.columns = 2;
    gridSection.gap = 6;
    gridSection.append(firstItem, secondItem);
    top.appendChild(gridSection);

    mountPageLayout({
      top,
    });

    await syncPageLayoutState();

    expect(pageLayoutRenderSpy.mock.calls.length).toBeLessThanOrEqual(2);
    expect(gridSectionRenderSpy.mock.calls.length).toBeLessThanOrEqual(2);
  });
});
