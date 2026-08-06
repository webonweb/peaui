import { afterEach, describe, expect, it } from 'vitest';

import { CardPanelElement, defineCardPanel } from './index.wc';

defineCardPanel();

type MountOptions = {
  ariaLabel?: string;
  as?: 'div' | 'section' | 'article' | 'a';
  backgroundColor?: 'default' | 'primary' | 'grey';
  borderColor?: 'default' | 'primary' | 'grey';
  content?: Node | string;
  dataTestId?: string;
  header?: Node | string;
  isHoverEnabled?: boolean;
  isShadowEnabled?: boolean;
  size?: 'xs' | 's' | 'm' | 'l';
};

function mountCardPanel(options: MountOptions = {}): CardPanelElement {
  const element = document.createElement(CardPanelElement.tagName) as CardPanelElement;

  if (options.as !== undefined) {
    element.as = options.as;
  }

  if (options.ariaLabel !== undefined) {
    element.ariaLabel = options.ariaLabel;
  }

  if (options.isShadowEnabled !== undefined) {
    element.isShadowEnabled = options.isShadowEnabled;
  }

  if (options.isHoverEnabled !== undefined) {
    element.isHoverEnabled = options.isHoverEnabled;
  }

  if (options.dataTestId !== undefined) {
    element.dataTestId = options.dataTestId;
  }

  if (options.backgroundColor !== undefined) {
    element.backgroundColor = options.backgroundColor;
  }

  if (options.borderColor !== undefined) {
    element.borderColor = options.borderColor;
  }

  if (options.size !== undefined) {
    element.size = options.size;
  }

  if (options.header !== undefined) {
    if (typeof options.header === 'string') {
      const header = document.createElement('div');

      header.setAttribute('slot', 'header');
      header.textContent = options.header;
      element.appendChild(header);
    } else {
      if (options.header instanceof Element) {
        options.header.setAttribute('slot', 'header');
      }

      element.appendChild(options.header);
    }
  }

  const content = options.content ?? 'Content';

  if (typeof content === 'string') {
    element.append(content);
  } else {
    element.appendChild(content);
  }

  document.body.appendChild(element);

  return element;
}

async function syncCardPanelState() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

function getRoot(element: CardPanelElement): HTMLElement {
  const root = element.firstElementChild;

  if (!(root instanceof HTMLElement)) {
    throw new Error('CardPanel root was not rendered.');
  }

  return root;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('CardPanelElement', () => {
  it('renders default tag <div> and base class', async () => {
    const element = mountCardPanel();

    await syncCardPanelState();

    const root = getRoot(element);

    expect(root.tagName.toLowerCase()).toBe('div');
    expect(root.classList.contains('peaui-card-panel')).toBe(true);
    expect(root.classList.contains('peaui-card-panel--size-m')).toBe(true);
    expect(root.classList.contains('peaui-card-panel--background-default')).toBe(true);
    expect(root.classList.contains('peaui-card-panel--border-default')).toBe(true);
    expect(root.querySelector('.peaui-card-panel__header')).toBeNull();
    expect(root.querySelector('.peaui-card-panel__content')?.textContent).toBe('Content');
  });

  it('applies explicit size modifier class when size prop is provided', async () => {
    const element = mountCardPanel({ size: 'l' });

    await syncCardPanelState();

    const root = getRoot(element);

    expect(root.classList.contains('peaui-card-panel--size-l')).toBe(true);
    expect(root.classList.contains('peaui-card-panel--size-m')).toBe(false);
  });

  it('applies explicit background and border modifier classes when props are provided', async () => {
    const element = mountCardPanel({
      backgroundColor: 'grey',
      borderColor: 'primary',
    });

    await syncCardPanelState();

    const root = getRoot(element);

    expect(root.classList.contains('peaui-card-panel--background-grey')).toBe(true);
    expect(root.classList.contains('peaui-card-panel--border-primary')).toBe(true);
    expect(root.classList.contains('peaui-card-panel--background-default')).toBe(false);
    expect(root.classList.contains('peaui-card-panel--border-default')).toBe(false);
  });

  it('by default applies hover class and not shadow class', async () => {
    const element = mountCardPanel();

    await syncCardPanelState();

    const root = getRoot(element);

    expect(root.classList.contains('peaui-card-panel--hover-enabled')).toBe(true);
    expect(root.classList.contains('peaui-card-panel--shadow-enabled')).toBe(false);
  });

  it('when isHoverEnabled=false -> hover class is not applied', async () => {
    const element = mountCardPanel({
      isHoverEnabled: false,
    });

    await syncCardPanelState();

    const root = getRoot(element);

    expect(root.classList.contains('peaui-card-panel')).toBe(true);
    expect(root.classList.contains('peaui-card-panel--hover-enabled')).toBe(false);
  });

  it('when isShadowEnabled=true -> shadow class is applied and hover class is not applied', async () => {
    const element = mountCardPanel({
      isShadowEnabled: true,
      isHoverEnabled: true,
    });

    await syncCardPanelState();

    const root = getRoot(element);

    expect(root.classList.contains('peaui-card-panel--shadow-enabled')).toBe(true);
    expect(root.classList.contains('peaui-card-panel--hover-enabled')).toBe(false);
  });

  it('passes data-testid attribute when provided', async () => {
    const element = mountCardPanel({
      dataTestId: 'card-panel',
    });

    await syncCardPanelState();

    expect(getRoot(element).getAttribute('data-testid')).toBe('card-panel');
  });

  it('passes aria-label when provided', async () => {
    const element = mountCardPanel({
      ariaLabel: 'Sekcja filtrow',
    });

    await syncCardPanelState();

    expect(getRoot(element).getAttribute('aria-label')).toBe('Sekcja filtrow');
  });

  it("renders correct element when as='section' | 'article'", async () => {
    const section = mountCardPanel({
      as: 'section',
    });
    const article = mountCardPanel({
      as: 'article',
    });

    await syncCardPanelState();

    expect(getRoot(section).tagName.toLowerCase()).toBe('section');
    expect(getRoot(article).tagName.toLowerCase()).toBe('article');
  });

  it('renders optional header slot and adds separated content wrapper when provided', async () => {
    const element = mountCardPanel({
      header: 'Naglowek panelu',
    });

    await syncCardPanelState();

    const root = getRoot(element);
    const header = root.querySelector('.peaui-card-panel__header');
    const content = root.querySelector('.peaui-card-panel__content');

    expect(header?.textContent).toBe('Naglowek panelu');
    expect(root.classList.contains('peaui-card-panel--with-header')).toBe(true);
    expect(content?.classList.contains('peaui-card-panel__content--with-header')).toBe(true);
    expect(content?.textContent).toBe('Content');
  });

  it('forwards href, target and rel when rendered as an anchor', async () => {
    const element = mountCardPanel({
      as: 'a',
      content: 'Content',
    });

    element.setAttribute('href', '/details');
    element.setAttribute('target', '_blank');
    await syncCardPanelState();

    const root = getRoot(element);

    expect(root.getAttribute('href')).toBe('/details');
    expect(root.getAttribute('target')).toBe('_blank');
    expect(root.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
