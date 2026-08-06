import { afterEach, describe, expect, it, vi } from 'vitest';

import { NavigationLinkElement, defineNavigationLink } from './index.wc';

defineNavigationLink();

const NESTED_NAVIGATION_LINK_TEXT_MUTATION_TAG_NAME = 'test-navigation-link-text-mutation';

class NestedNavigationLinkTextMutationElement extends HTMLElement {
  internalTextNode = document.createTextNode('');

  connectedCallback(): void {
    if (this.internalTextNode.parentNode !== this) {
      this.appendChild(this.internalTextNode);
    }
  }

  setInternalText(value: string): void {
    this.internalTextNode.textContent = value;
  }
}

if (!window.customElements.get(NESTED_NAVIGATION_LINK_TEXT_MUTATION_TAG_NAME)) {
  window.customElements.define(
    NESTED_NAVIGATION_LINK_TEXT_MUTATION_TAG_NAME,
    NestedNavigationLinkTextMutationElement,
  );
}

type MountOptions = {
  ariaLabel?: string;
  attrs?: Record<string, string>;
  content?: Node | string;
  dataTestId?: string;
  path?: string;
  size?: 'm' | 's' | 'xs';
  variant?: 'default' | 'primary';
};

function mountNavigationLink(options: MountOptions = {}): NavigationLinkElement {
  const element = document.createElement(NavigationLinkElement.tagName) as NavigationLinkElement;
  const content = options.content ?? 'Przejdz do budynku';

  element.path = options.path ?? '/building';

  if (options.size !== undefined) {
    element.size = options.size;
  }

  if (options.variant !== undefined) {
    element.variant = options.variant;
  }

  if (options.ariaLabel !== undefined) {
    element.ariaLabel = options.ariaLabel;
  }

  if (options.dataTestId !== undefined) {
    element.dataTestId = options.dataTestId;
  }

  if (options.attrs) {
    for (const [name, value] of Object.entries(options.attrs)) {
      element.setAttribute(name, value);
    }
  }

  if (typeof content === 'string') {
    element.append(content);
  } else {
    element.appendChild(content);
  }

  document.body.appendChild(element);

  return element;
}

async function syncNavigationLinkState() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('NavigationLink (index.wc.ts)', () => {
  it('renders anchor with default variant, size and data-testid bindings', async () => {
    const element = mountNavigationLink({
      dataTestId: 'navigation-link',
    });

    await syncNavigationLinkState();

    const root = element.querySelector('a');

    expect(root?.classList.contains('peaui-navigation-link')).toBe(true);
    expect(root?.classList.contains('peaui-navigation-link--size-s')).toBe(true);
    expect(root?.classList.contains('peaui-navigation-link--variant-default')).toBe(true);
    expect(root?.getAttribute('href')).toBe('/building');
    expect(root?.getAttribute('data-testid')).toBe('navigation-link');
    expect(root?.getAttribute('aria-label')).toBeNull();
  });

  it('renders anchor for internal paths and trims the href value', async () => {
    const element = mountNavigationLink({
      path: '  /results/details  ',
      variant: 'primary',
      size: 'm',
    });

    await syncNavigationLinkState();

    const root = element.querySelector('a');

    expect(root?.getAttribute('href')).toBe('/results/details');
    expect(root?.classList.contains('peaui-navigation-link--size-m')).toBe(true);
    expect(root?.classList.contains('peaui-navigation-link--variant-primary')).toBe(true);
  });

  it('renders anchor for hash links', async () => {
    const element = mountNavigationLink({
      path: '#summary',
    });

    await syncNavigationLinkState();

    expect(element.querySelector('a')?.getAttribute('href')).toBe('#summary');
  });

  it('renders anchor for absolute urls and preserves external target attrs', async () => {
    const element = mountNavigationLink({
      path: 'https://example.com/docs',
      attrs: {
        target: '_blank',
      },
      content: 'Dokumentacja',
    });

    await syncNavigationLinkState();

    const root = element.querySelector('a');

    expect(root?.getAttribute('href')).toBe('https://example.com/docs');
    expect(root?.getAttribute('target')).toBe('_blank');
    expect(root?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('keeps explicit rel when target blank is provided', async () => {
    const element = mountNavigationLink({
      path: 'https://example.com/docs',
      attrs: {
        target: '_blank',
        rel: 'external',
      },
      content: 'Dokumentacja',
    });

    await syncNavigationLinkState();

    expect(element.querySelector('a')?.getAttribute('rel')).toBe('external');
  });

  it('uses ariaLabel when slot does not expose visible text', async () => {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    icon.setAttribute('aria-hidden', 'true');

    const element = mountNavigationLink({
      path: '/icon-only',
      ariaLabel: 'Przejdz do sekcji ikonowej',
      content: icon,
    });

    await syncNavigationLinkState();

    expect(element.querySelector('a')?.getAttribute('aria-label')).toBe(
      'Przejdz do sekcji ikonowej',
    );
  });

  it('falls back to the path when slot text and ariaLabel are missing', async () => {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    icon.setAttribute('aria-hidden', 'true');

    const element = mountNavigationLink({
      path: '/icon-only',
      content: icon,
    });

    await syncNavigationLinkState();

    expect(element.querySelector('a')?.getAttribute('aria-label')).toBe('/icon-only');
  });

  it('does not render href when path is empty and falls back to title for the accessible name', async () => {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    icon.setAttribute('aria-hidden', 'true');

    const element = mountNavigationLink({
      path: '   ',
      attrs: {
        title: 'Przejdz do raportu',
      },
      content: icon,
    });

    await syncNavigationLinkState();

    expect(element.querySelector('a')?.hasAttribute('href')).toBe(false);
    expect(element.querySelector('a')?.getAttribute('aria-label')).toBe('Przejdz do raportu');
  });

  it('forwards attrs and merges custom class on root element', async () => {
    const element = mountNavigationLink({
      attrs: {
        id: 'main-navigation-link',
        class: 'custom-link',
        'data-foo': 'bar',
        'aria-current': 'page',
      },
    });

    await syncNavigationLinkState();

    const root = element.querySelector('a');

    expect(root?.getAttribute('id')).toBe('main-navigation-link');
    expect(root?.getAttribute('data-foo')).toBe('bar');
    expect(root?.getAttribute('aria-current')).toBe('page');
    expect(root?.classList.contains('peaui-navigation-link')).toBe(true);
    expect(root?.classList.contains('custom-link')).toBe(true);
  });

  it('does not re-render when a nested custom element updates its own text content', async () => {
    const renderSpy = vi.spyOn(NavigationLinkElement.prototype, 'render');
    const nestedElement = document.createElement(
      NESTED_NAVIGATION_LINK_TEXT_MUTATION_TAG_NAME,
    ) as NestedNavigationLinkTextMutationElement;

    mountNavigationLink({
      content: nestedElement,
    });

    await syncNavigationLinkState();
    renderSpy.mockClear();

    nestedElement.setInternalText('Updated nested label');
    await syncNavigationLinkState();

    expect(renderSpy).not.toHaveBeenCalled();
  });
});
