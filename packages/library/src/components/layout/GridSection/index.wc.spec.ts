import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ButtonActionElement,
  defineButtonAction,
} from '@/components/data-entry/ButtonAction/index.wc';
import {
  SectionHeadingElement,
  defineSectionHeading,
} from '@/components/data-display/SectionHeading/index.wc';
import { GridSectionElement, defineGridSection } from './index.wc';

defineButtonAction();
defineSectionHeading();
defineGridSection();

const NESTED_GRID_SECTION_SLOT_MUTATION_TAG_NAME = 'test-grid-section-slot-mutation';

class NestedGridSectionSlotMutationElement extends HTMLElement {
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

if (!window.customElements.get(NESTED_GRID_SECTION_SLOT_MUTATION_TAG_NAME)) {
  window.customElements.define(
    NESTED_GRID_SECTION_SLOT_MUTATION_TAG_NAME,
    NestedGridSectionSlotMutationElement,
  );
}

type MountOptions = {
  additional?: Array<Node | string> | Node | string;
  attrs?: Record<string, string>;
  columns?: number;
  content?: Array<Node | string> | Node | string;
  gap?: number;
};

function appendNodes(
  element: GridSectionElement,
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

      const textWrapper = document.createElement('span');

      textWrapper.setAttribute('slot', slotName);
      textWrapper.textContent = item;
      element.appendChild(textWrapper);
      continue;
    }

    if (slotName && item instanceof Element) {
      item.setAttribute('slot', slotName);
    }

    element.appendChild(item);
  }
}

function mountGridSection(options: MountOptions = {}): GridSectionElement {
  const element = document.createElement(GridSectionElement.tagName) as GridSectionElement;

  if (options.columns !== undefined) {
    element.columns = options.columns;
  }

  if (options.gap !== undefined) {
    element.gap = options.gap;
  }

  if (options.attrs) {
    for (const [name, value] of Object.entries(options.attrs)) {
      element.setAttribute(name, value);
    }
  }

  if (options.additional !== undefined) {
    appendNodes(element, options.additional, 'additional');
  }

  appendNodes(
    element,
    options.content ??
      (() => {
        const item = document.createElement('div');

        item.textContent = 'Item';
        return item;
      })(),
  );

  document.body.appendChild(element);

  return element;
}

async function syncGridSectionState() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('GridSection (index.wc.ts)', () => {
  it('renders root element with the base BEM class', async () => {
    const element = mountGridSection();

    await syncGridSectionState();

    expect(element.classList.contains('peaui-grid-section')).toBe(true);
  });

  it('does not render the additional section when there is no additional slot content', async () => {
    const element = mountGridSection();

    await syncGridSectionState();

    expect(Boolean(element.querySelector('.peaui-grid-section__additional'))).toBe(false);
  });

  it('renders the additional section when additional slot content is provided', async () => {
    const additional = document.createElement('div');

    additional.setAttribute('data-testid', 'additional');
    additional.textContent = 'Additional';

    const element = mountGridSection({
      additional,
    });

    await syncGridSectionState();

    expect(
      element.querySelector('.peaui-grid-section__additional [data-testid="additional"]')
        ?.textContent,
    ).toBe('Additional');
  });

  it('adds the multi modifier on content when columns > 1', async () => {
    const element = mountGridSection({
      columns: 2,
    });

    await syncGridSectionState();

    expect(
      element
        .querySelector('.peaui-grid-section__content')
        ?.classList.contains('peaui-grid-section__content--multi'),
    ).toBe(true);
  });

  it('does not add the multi modifier on content when columns <= 1', async () => {
    const element = mountGridSection({
      columns: 1,
    });

    await syncGridSectionState();

    expect(
      element
        .querySelector('.peaui-grid-section__content')
        ?.classList.contains('peaui-grid-section__content--multi'),
    ).toBe(false);
  });

  it('sets CSS variables on content for gap, columns and columns-minus-one', async () => {
    const element = mountGridSection({
      columns: 4,
      gap: 6,
    });

    await syncGridSectionState();

    const styleAttr =
      element.querySelector('.peaui-grid-section__content')?.getAttribute('style') ?? '';

    expect(styleAttr).toContain('--peaui-grid-gap-y: 6');
    expect(styleAttr).toContain('--columns: 4');
    expect(styleAttr).toContain('--columns-minus-one: 3');
  });

  it('clamps columns-minus-one to minimum 1 when columns is 0 or 1', async () => {
    const element = mountGridSection({
      columns: 0,
      gap: 6,
    });

    await syncGridSectionState();

    const styleAttr =
      element.querySelector('.peaui-grid-section__content')?.getAttribute('style') ?? '';

    expect(styleAttr).toContain('--columns: 0');
    expect(styleAttr).toContain('--columns-minus-one: 1');
  });

  it('passes attrs through to the host root element', async () => {
    const element = mountGridSection({
      attrs: {
        id: 'grid-root',
        'data-foo': 'bar',
        tabindex: '0',
      },
    });

    await syncGridSectionState();

    expect(element.getAttribute('id')).toBe('grid-root');
    expect(element.getAttribute('data-foo')).toBe('bar');
    expect(element.getAttribute('tabindex')).toBe('0');
  });

  it('renders default slot content inside the content wrapper', async () => {
    const item = document.createElement('span');

    item.setAttribute('data-testid', 'item');
    item.textContent = 'Hello';

    const element = mountGridSection({
      content: item,
    });

    await syncGridSectionState();

    expect(
      element.querySelector('.peaui-grid-section__content [data-testid="item"]')?.textContent,
    ).toBe('Hello');
  });

  it('preserves the original order of custom element children inside the content wrapper', async () => {
    const heading = document.createElement(SectionHeadingElement.tagName) as SectionHeadingElement;
    const title = document.createElement('span');
    const button = document.createElement(ButtonActionElement.tagName) as ButtonActionElement;

    heading.size = 'heading-xs';
    title.setAttribute('slot', 'title');
    title.textContent = 'Instruction';
    heading.appendChild(title);
    button.textContent = 'login.gov.pl';

    const element = mountGridSection({
      columns: 1,
      content: [heading, button],
    });

    await syncGridSectionState();

    const contentChildren = Array.from(
      element.querySelector('.peaui-grid-section__content')?.children ?? [],
    );

    expect(contentChildren[0]).toBe(heading);
    expect(contentChildren[1]).toBe(button);
  });

  it('appends newly added content after the existing content order', async () => {
    const first = document.createElement('div');
    const second = document.createElement('div');
    const third = document.createElement('div');

    first.textContent = 'First';
    second.textContent = 'Second';
    third.textContent = 'Third';

    const element = mountGridSection({
      content: [first, second],
    });

    await syncGridSectionState();

    element.appendChild(third);
    await syncGridSectionState();

    const contentChildren = Array.from(
      element.querySelector('.peaui-grid-section__content')?.children ?? [],
    );

    expect(contentChildren[0]).toBe(first);
    expect(contentChildren[1]).toBe(second);
    expect(contentChildren[2]).toBe(third);
  });

  it('ignores managed mutations to avoid an internal render loop', async () => {
    const renderSpy = vi.spyOn(GridSectionElement.prototype, 'render');
    const additional = document.createElement('div');
    const content = document.createElement('div');

    additional.textContent = 'Additional';
    content.textContent = 'Item';

    mountGridSection({
      additional,
      content,
    });

    await syncGridSectionState();

    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('does not re-render when a nested custom element mutates its internal slot attributes', async () => {
    const renderSpy = vi.spyOn(GridSectionElement.prototype, 'render');
    const nestedElement = document.createElement(
      NESTED_GRID_SECTION_SLOT_MUTATION_TAG_NAME,
    ) as NestedGridSectionSlotMutationElement;

    mountGridSection({
      content: nestedElement,
    });

    await syncGridSectionState();
    renderSpy.mockClear();

    nestedElement.setInternalSlot('internal');
    await syncGridSectionState();

    expect(renderSpy).not.toHaveBeenCalled();
  });
});
