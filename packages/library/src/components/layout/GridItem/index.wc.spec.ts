import { afterEach, describe, expect, it } from 'vitest';

import { GridItemElement, defineGridItem } from './index.wc';

defineGridItem();

type MountOptions = {
  attrs?: Record<string, string>;
  colspan?: number;
  columns?: number;
  content?: Array<Node | string> | Node | string;
  gap?: number;
  grid?: boolean;
};

function mountGridItem(options: MountOptions = {}): GridItemElement {
  const element = document.createElement(GridItemElement.tagName) as GridItemElement;

  if (options.colspan !== undefined) {
    element.colspan = options.colspan;
  }

  if (options.columns !== undefined) {
    element.columns = options.columns;
  }

  if (options.gap !== undefined) {
    element.gap = options.gap;
  }

  if (options.grid !== undefined) {
    element.grid = options.grid;
  }

  if (options.attrs) {
    for (const [name, value] of Object.entries(options.attrs)) {
      element.setAttribute(name, value);
    }
  }

  const content =
    options.content ??
    (() => {
      const wrapper = document.createElement('div');

      wrapper.textContent = 'Content';
      return wrapper;
    })();

  const contents = Array.isArray(content) ? content : [content];

  for (const item of contents) {
    if (typeof item === 'string') {
      element.append(item);
      continue;
    }

    element.appendChild(item);
  }

  document.body.appendChild(element);

  return element;
}

async function syncGridItemState() {
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('GridItem (index.wc.ts)', () => {
  it('renders root element with base BEM class', async () => {
    const element = mountGridItem();

    await syncGridItemState();

    expect(element.classList.contains('peaui-grid-item')).toBe(true);
  });

  it('adds --grid modifier class when grid=true (default)', async () => {
    const element = mountGridItem();

    await syncGridItemState();

    expect(element.classList.contains('peaui-grid-item--grid')).toBe(true);
  });

  it('does not add --grid modifier class when grid=false', async () => {
    const element = mountGridItem({
      grid: false,
    });

    await syncGridItemState();

    expect(element.classList.contains('peaui-grid-item--grid')).toBe(false);
  });

  it('clamps colspan to minimum 1', async () => {
    const element = mountGridItem({
      colspan: 0,
    });

    await syncGridItemState();

    expect(element.getAttribute('style') ?? '').toContain('--peaui-grid-item-colspan: 1');
  });

  it('sets --peaui-grid-item-columns from columns prop when provided', async () => {
    const first = document.createElement('div');
    const second = document.createElement('div');

    const element = mountGridItem({
      columns: 3,
      content: [first, second],
    });

    await syncGridItemState();

    expect(element.getAttribute('style') ?? '').toContain('--peaui-grid-item-columns: 3');
  });

  it('sets --peaui-grid-item-columns from child count when columns prop is missing or invalid', async () => {
    const element = document.createElement(GridItemElement.tagName) as GridItemElement;
    const one = document.createElement('div');
    const two = document.createElement('div');

    one.textContent = 'One';
    two.textContent = 'Two';
    element.columns = 0;
    element.append(one, two);
    document.body.appendChild(element);

    await syncGridItemState();

    expect(element.getAttribute('style') ?? '').toContain('--peaui-grid-item-columns: 2');
  });

  it('sets --peaui-grid-item-gap from gap prop', async () => {
    const element = mountGridItem({
      gap: 8,
    });

    await syncGridItemState();

    expect(element.getAttribute('style') ?? '').toContain('--peaui-grid-item-gap: 8');
  });

  it('passes through attrs to root element', async () => {
    const element = mountGridItem({
      attrs: {
        id: 'my-grid-item',
        'data-foo': 'bar',
        tabindex: '0',
      },
    });

    await syncGridItemState();

    expect(element.getAttribute('id')).toBe('my-grid-item');
    expect(element.getAttribute('data-foo')).toBe('bar');
    expect(element.getAttribute('tabindex')).toBe('0');
  });

  it('renders default slot content', async () => {
    const inner = document.createElement('span');

    inner.setAttribute('data-testid', 'inner');
    inner.textContent = 'Hello';

    const element = mountGridItem({
      content: inner,
    });

    await syncGridItemState();

    expect(element.querySelector('[data-testid="inner"]')?.textContent).toBe('Hello');
  });
});
