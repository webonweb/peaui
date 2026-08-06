import { afterEach, describe, expect, it } from 'vitest';

import { SectionHeadingElement, defineSectionHeading } from './index.wc';

defineSectionHeading();

type MountOptions = {
  as?: 'section' | 'div' | 'header';
  attrs?: Record<string, string>;
  dataTestId?: string;
  description?: Node | string;
  hint?: Node | string;
  size?: 'heading-l' | 'heading-m' | 'heading-s' | 'heading-xs' | 'xl' | 'l' | 'm' | 's';
  title?: Node | string;
  variant?: 'default' | 'primary' | 'secondary';
};

function appendSlotNode(
  element: SectionHeadingElement,
  slotName: 'title' | 'description' | 'hint',
  value: Node | string,
): void {
  if (typeof value === 'string') {
    const slotElement = document.createElement('span');

    slotElement.setAttribute('slot', slotName);
    slotElement.textContent = value;
    element.appendChild(slotElement);
    return;
  }

  if (value instanceof Element) {
    value.setAttribute('slot', slotName);
  }

  element.appendChild(value);
}

function mountSectionHeading(options: MountOptions = {}): SectionHeadingElement {
  const element = document.createElement(SectionHeadingElement.tagName) as SectionHeadingElement;

  if (options.size !== undefined) {
    element.size = options.size;
  }

  if (options.as !== undefined) {
    element.as = options.as;
  }

  if (options.variant !== undefined) {
    element.variant = options.variant;
  }

  if (options.dataTestId !== undefined) {
    element.dataTestId = options.dataTestId;
  }

  if (options.attrs) {
    for (const [name, value] of Object.entries(options.attrs)) {
      element.setAttribute(name, value);
    }
  }

  if (options.title !== undefined) {
    appendSlotNode(element, 'title', options.title);
  }

  if (options.description !== undefined) {
    appendSlotNode(element, 'description', options.description);
  }

  if (options.hint !== undefined) {
    appendSlotNode(element, 'hint', options.hint);
  }

  document.body.appendChild(element);

  return element;
}

function getWrapper(element: SectionHeadingElement): HTMLElement {
  const wrapper = element.firstElementChild;

  if (!(wrapper instanceof HTMLElement)) {
    throw new Error('SectionHeading wrapper was not rendered.');
  }

  return wrapper;
}

async function syncSectionHeadingState() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('SectionHeading (index.wc.ts)', () => {
  it('renders wrapper as div by default and applies base block class', async () => {
    const element = mountSectionHeading({
      title: 'Title',
    });

    await syncSectionHeadingState();

    const wrapper = getWrapper(element);

    expect(wrapper.tagName.toLowerCase()).toBe('div');
    expect(wrapper.getAttribute('class')).toMatch(/\b\S+-section-heading\b/);
  });

  it('renders wrapper as the as prop (section/header)', async () => {
    const sectionElement = mountSectionHeading({
      as: 'section',
      title: 'Title',
    });
    const headerElement = mountSectionHeading({
      as: 'header',
      title: 'Title',
    });

    await syncSectionHeadingState();

    expect(getWrapper(sectionElement).tagName.toLowerCase()).toBe('section');
    expect(getWrapper(headerElement).tagName.toLowerCase()).toBe('header');
  });

  it('renders title as h3 for size=l (default) and adds --large modifier', async () => {
    const element = mountSectionHeading({
      title: 'Hello',
    });

    await syncSectionHeadingState();

    const title = getWrapper(element).querySelector('h3');

    expect(title).not.toBeNull();
    expect(title?.getAttribute('class')).toMatch(/__title\b/);
    expect(title?.getAttribute('class')).toMatch(/__title--large\b/);
    expect(title?.getAttribute('class')).toMatch(/__title--variant-default\b/);
  });

  it('renders title as h4 for size=m and does not add --large modifier', async () => {
    const element = mountSectionHeading({
      size: 'm',
      title: 'Hello',
    });

    await syncSectionHeadingState();

    const title = getWrapper(element).querySelector('h4');

    expect(title).not.toBeNull();
    expect(title?.getAttribute('class')).toMatch(/__title\b/);
    expect(title?.getAttribute('class')).not.toMatch(/__title--large\b/);
  });

  it('renders title as h5 for size=s and adds small modifier', async () => {
    const element = mountSectionHeading({
      size: 's',
      title: 'Hello',
    });

    await syncSectionHeadingState();

    const title = getWrapper(element).querySelector('h5');
    const className = title?.getAttribute('class') ?? '';

    expect(title).not.toBeNull();
    expect(className).toMatch(/__title\b/);
    expect(className).toMatch(/__title--small\b/);
    expect(className).not.toMatch(/__title--large\b/);
    expect(className).not.toMatch(/__title--extra-large\b/);
    expect(className).not.toMatch(/__title--heading-large\b/);
    expect(className).toMatch(/__title--variant-default\b/);
  });

  it('renders title as h2 for size=heading-m and adds heading-medium modifiers', async () => {
    const element = mountSectionHeading({
      size: 'heading-m',
      title: 'Hello',
      description: 'Desc',
    });

    await syncSectionHeadingState();

    const wrapper = getWrapper(element);
    const title = wrapper.querySelector('h2');
    const titleClassName = title?.getAttribute('class') ?? '';
    const description = wrapper.querySelector('p');
    const descriptionClassName = description?.getAttribute('class') ?? '';

    expect(title).not.toBeNull();
    expect(titleClassName).toMatch(/__title\b/);
    expect(titleClassName).toMatch(/__title--heading-medium\b/);
    expect(titleClassName).not.toMatch(/__title--heading-large\b/);
    expect(titleClassName).not.toMatch(/__title--large\b/);
    expect(titleClassName).not.toMatch(/__title--extra-large\b/);
    expect(descriptionClassName).toMatch(/__description\b/);
    expect(descriptionClassName).toMatch(/__description--large\b/);
    expect(descriptionClassName).not.toMatch(/__description--heading-medium\b/);
  });

  it('renders title as h2 for size=heading-s and adds heading-small modifiers', async () => {
    const element = mountSectionHeading({
      size: 'heading-s',
      title: 'Hello',
      description: 'Desc',
    });

    await syncSectionHeadingState();

    const wrapper = getWrapper(element);
    const title = wrapper.querySelector('h2');
    const titleClassName = title?.getAttribute('class') ?? '';
    const description = wrapper.querySelector('p');
    const descriptionClassName = description?.getAttribute('class') ?? '';

    expect(title).not.toBeNull();
    expect(titleClassName).toMatch(/__title\b/);
    expect(titleClassName).toMatch(/__title--heading-small\b/);
    expect(titleClassName).not.toMatch(/__title--heading-large\b/);
    expect(titleClassName).not.toMatch(/__title--heading-medium\b/);
    expect(titleClassName).not.toMatch(/__title--large\b/);
    expect(titleClassName).not.toMatch(/__title--extra-large\b/);
    expect(descriptionClassName).toMatch(/__description\b/);
    expect(descriptionClassName).toMatch(/__description--heading-small\b/);
    expect(descriptionClassName).not.toMatch(/__description--heading-medium\b/);
  });

  it('renders title as h2 for size=heading-xs and adds heading-extra-small modifiers', async () => {
    const element = mountSectionHeading({
      size: 'heading-xs',
      title: 'Hello',
      description: 'Desc',
    });

    await syncSectionHeadingState();

    const wrapper = getWrapper(element);
    const title = wrapper.querySelector('h2');
    const titleClassName = title?.getAttribute('class') ?? '';
    const description = wrapper.querySelector('p');
    const descriptionClassName = description?.getAttribute('class') ?? '';

    expect(title).not.toBeNull();
    expect(titleClassName).toMatch(/__title\b/);
    expect(titleClassName).toMatch(/__title--heading-extra-small\b/);
    expect(titleClassName).not.toMatch(/__title--heading-large\b/);
    expect(titleClassName).not.toMatch(/__title--heading-medium\b/);
    expect(titleClassName).not.toMatch(/__title--heading-small\b/);
    expect(titleClassName).not.toMatch(/__title--large\b/);
    expect(titleClassName).not.toMatch(/__title--extra-large\b/);
    expect(descriptionClassName).toMatch(/__description\b/);
    expect(descriptionClassName).toMatch(/__description--heading-extra-small\b/);
    expect(descriptionClassName).not.toMatch(/__description--heading-medium\b/);
  });

  it('renders title as h1 for size=heading-l and adds heading-large modifiers', async () => {
    const element = mountSectionHeading({
      size: 'heading-l',
      title: 'Hello',
      description: 'Desc',
    });

    await syncSectionHeadingState();

    const wrapper = getWrapper(element);
    const title = wrapper.querySelector('h1');
    const titleClassName = title?.getAttribute('class') ?? '';
    const description = wrapper.querySelector('p');
    const descriptionClassName = description?.getAttribute('class') ?? '';

    expect(title).not.toBeNull();
    expect(titleClassName).toMatch(/__title\b/);
    expect(titleClassName).toMatch(/__title--heading-large\b/);
    expect(titleClassName).not.toMatch(/__title--heading-medium\b/);
    expect(titleClassName).not.toMatch(/__title--large\b/);
    expect(titleClassName).not.toMatch(/__title--extra-large\b/);
    expect(descriptionClassName).toMatch(/__description\b/);
    expect(descriptionClassName).toMatch(/__description--heading-large\b/);
  });

  it('renders title as h2 for size=xl and adds extra-large modifiers', async () => {
    const element = mountSectionHeading({
      size: 'xl',
      title: 'Hello',
      description: 'Desc',
    });

    await syncSectionHeadingState();

    const wrapper = getWrapper(element);
    const title = wrapper.querySelector('h2');
    const titleClassName = title?.getAttribute('class') ?? '';
    const description = wrapper.querySelector('p');
    const descriptionClassName = description?.getAttribute('class') ?? '';

    expect(title).not.toBeNull();
    expect(titleClassName).toMatch(/__title\b/);
    expect(titleClassName).toMatch(/__title--extra-large\b/);
    expect(titleClassName).not.toMatch(/__title--heading-medium\b/);
    expect(titleClassName).not.toMatch(/__title--large\b/);
    expect(descriptionClassName).toMatch(/__description\b/);
    expect(descriptionClassName).toMatch(/__description--extra-large\b/);
    expect(descriptionClassName).not.toMatch(/__description--heading-medium\b/);
    expect(descriptionClassName).not.toMatch(/__description--large\b/);
  });

  it('applies primary and secondary variant classes', async () => {
    const primaryElement = mountSectionHeading({
      variant: 'primary',
      title: 'Hello',
    });
    const secondaryElement = mountSectionHeading({
      variant: 'secondary',
      title: 'Hello',
      description: 'Desc',
    });

    await syncSectionHeadingState();

    const primaryTitle = getWrapper(primaryElement).querySelector('h3');
    const secondaryTitle = getWrapper(secondaryElement).querySelector('h3');
    const secondaryDescription = getWrapper(secondaryElement).querySelector('p');

    expect(primaryTitle?.getAttribute('class')).toMatch(/__title--variant-primary\b/);
    expect(primaryTitle?.getAttribute('class')).not.toMatch(/__title--variant-default\b/);
    expect(secondaryTitle?.getAttribute('class')).toMatch(/__title--variant-secondary\b/);
    expect(secondaryTitle?.getAttribute('class')).not.toMatch(/__title--variant-default\b/);
    expect(secondaryDescription?.getAttribute('class')).toMatch(
      /__description--variant-secondary\b/,
    );
  });

  it('renders description only when description slot is provided', async () => {
    const withoutDescription = mountSectionHeading({
      title: 'Title',
    });
    const withDescription = mountSectionHeading({
      title: 'Title',
      description: 'Desc',
    });

    await syncSectionHeadingState();

    expect(getWrapper(withoutDescription).querySelector('p')).toBeNull();

    const description = getWrapper(withDescription).querySelector('p');

    expect(description).not.toBeNull();
    expect(description?.getAttribute('class')).toMatch(/__description\b/);
    expect(description?.getAttribute('class')).toMatch(/__description--large\b/);
  });

  it('sets aria-labelledby on wrapper only when title slot exists, and points to title id', async () => {
    const withTitle = mountSectionHeading({
      title: 'Title',
    });
    const withoutTitle = mountSectionHeading({
      description: 'Desc only',
    });

    await syncSectionHeadingState();

    const wrapper = getWrapper(withTitle);
    const title = wrapper.querySelector('h3');

    expect(wrapper.getAttribute('aria-labelledby')).toBeTruthy();
    expect(title?.id).toBeTruthy();
    expect(wrapper.getAttribute('aria-labelledby')).toBe(title?.id);
    expect(getWrapper(withoutTitle).getAttribute('aria-labelledby')).toBeNull();
  });

  it('applies data-testid on wrapper and generates title and description testids', async () => {
    const element = mountSectionHeading({
      dataTestId: 'section-heading',
      title: 'Title',
      description: 'Desc',
    });

    await syncSectionHeadingState();

    const wrapper = getWrapper(element);
    const title = wrapper.querySelector('h3');
    const description = wrapper.querySelector('p');

    expect(wrapper.getAttribute('data-testid')).toBe('section-heading');
    expect(title?.getAttribute('data-testid')).toBe('section-heading-title');
    expect(description?.getAttribute('data-testid')).toBe('section-heading-description');
  });

  it('renders hint tooltip only when hint slot is provided and passes generated hint test id', async () => {
    const withoutHint = mountSectionHeading({
      dataTestId: 'section-heading',
      title: 'Title',
    });
    const withHint = mountSectionHeading({
      dataTestId: 'section-heading',
      title: 'Title',
      hint: 'Helpful hint',
    });

    await syncSectionHeadingState();

    expect(
      getWrapper(withoutHint).querySelector('[data-testid="section-heading-hint-content"]'),
    ).toBeNull();

    const wrapper = getWrapper(withHint);
    const tooltipContent = wrapper.querySelector('[data-testid="section-heading-hint-content"]');
    const tooltip = wrapper.querySelector('[data-testid="section-heading-hint-tooltip"]');

    expect(wrapper.querySelector('svg')).not.toBeNull();
    expect(tooltipContent).not.toBeNull();
    expect(tooltip?.getAttribute('class')).toMatch(/__content--placement-right\b/);
    expect(tooltip?.textContent).toContain('Helpful hint');
  });

  it('does not render title and description testids when dataTestId is not provided', async () => {
    const element = mountSectionHeading({
      title: 'Title',
      description: 'Desc',
    });

    await syncSectionHeadingState();

    const wrapper = getWrapper(element);
    const title = wrapper.querySelector('h3');
    const description = wrapper.querySelector('p');

    expect(title?.getAttribute('data-testid')).toBeNull();
    expect(description?.getAttribute('data-testid')).toBeNull();
    expect(wrapper.getAttribute('data-testid')).toBeNull();
  });

  it('forwards attrs to wrapper (data-*, aria-*, class, style)', async () => {
    const element = mountSectionHeading({
      attrs: {
        'data-qa': 'section-heading',
        'aria-label': 'Heading region',
        class: 'external-class',
        style: 'padding: 10px;',
      },
      title: 'Title',
    });

    await syncSectionHeadingState();

    const wrapper = getWrapper(element);

    expect(wrapper.getAttribute('data-qa')).toBe('section-heading');
    expect(wrapper.getAttribute('aria-label')).toBe('Heading region');
    expect(wrapper.getAttribute('class')).toMatch(/external-class/);
    expect(wrapper.getAttribute('class')).toMatch(/-section-heading/);
    expect(wrapper.getAttribute('style') ?? '').toContain('padding: 10px');
  });

  it('allows consumers to override aria-labelledby on the wrapper', async () => {
    const element = mountSectionHeading({
      attrs: {
        'aria-labelledby': 'external-heading-id',
      },
      title: 'Title',
    });

    await syncSectionHeadingState();

    expect(getWrapper(element).getAttribute('aria-labelledby')).toBe('external-heading-id');
  });

  it('renders nothing for title and description when slots are missing', async () => {
    const element = mountSectionHeading();

    await syncSectionHeadingState();

    const wrapper = getWrapper(element);

    expect(wrapper.querySelector('h1')).toBeNull();
    expect(wrapper.querySelector('h2')).toBeNull();
    expect(wrapper.querySelector('h3')).toBeNull();
    expect(wrapper.querySelector('h4')).toBeNull();
    expect(wrapper.querySelector('h5')).toBeNull();
    expect(wrapper.querySelector('p')).toBeNull();
  });
});
