import { afterEach, describe, expect, it } from 'vitest';

import { waitForSvgElement } from '@/helpers/test-wc.helper';
import { MessageTextElement, defineMessageText } from './index.wc';

defineMessageText();

type MountOptions = {
  content?: Node | string;
  dataTestId?: string;
  id?: string;
  ownIcon?: string;
  size?:
    'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'heading-xs' | 'heading-s' | 'heading-m' | 'heading-l';
  variant?: 'info' | 'error' | 'success' | 'danger' | 'default' | 'white';
  withIcon?: boolean;
};

function mountMessageText(options: MountOptions): MessageTextElement {
  const element = document.createElement(MessageTextElement.tagName) as MessageTextElement;

  if (options.id !== undefined) {
    element.id = options.id;
  }

  if (options.dataTestId !== undefined) {
    element.dataTestId = options.dataTestId;
  }

  if (options.variant !== undefined) {
    element.variant = options.variant;
  }

  if (options.size !== undefined) {
    element.size = options.size;
  }

  if (options.withIcon !== undefined) {
    element.withIcon = options.withIcon;
  }

  if (options.ownIcon !== undefined) {
    element.ownIcon = options.ownIcon;
  }

  const content = options.content ?? 'Hello';

  if (typeof content === 'string') {
    element.append(content);
  } else {
    element.appendChild(content);
  }

  document.body.appendChild(element);

  return element;
}

async function waitForSvg(element: Element): Promise<SVGSVGElement> {
  return waitForSvgElement(element, 'SVG did not render in time.');
}

async function syncMessageTextState() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('MessageText (index.wc.ts)', () => {
  it('renders root div with correct id `${id}-${variant}`', async () => {
    const element = mountMessageText({
      id: 'msg',
      variant: 'info',
    });

    await syncMessageTextState();

    const root = element.querySelector('div');

    expect(root?.getAttribute('id')).toBe('msg-info');
  });

  it('sets data-testid on root when provided', async () => {
    const element = mountMessageText({
      id: 'msg',
      dataTestId: 'message-text',
    });

    await syncMessageTextState();

    expect(element.querySelector('div')?.getAttribute('data-testid')).toBe('message-text');
  });

  it('adds BEM-like modifier classes for size and variant', async () => {
    const element = mountMessageText({
      id: 'msg',
      variant: 'success',
      size: 'm',
    });

    await syncMessageTextState();

    const className = element.querySelector('div')?.getAttribute('class') ?? '';

    expect(className).toContain('peaui-message-text');
    expect(className).toContain('peaui-message-text--size-m');
    expect(className).toContain('peaui-message-text--variant-success');
  });

  it('applies white variant classes and does not render a built-in status icon', async () => {
    const element = mountMessageText({
      id: 'msg',
      variant: 'white',
    });

    await syncMessageTextState();

    const root = element.querySelector('div');
    const className = root?.getAttribute('class') ?? '';

    expect(root?.getAttribute('id')).toBe('msg-white');
    expect(className).toContain('peaui-message-text--variant-white');
    expect(element.querySelector('svg')).toBeNull();
    expect(element.querySelectorAll('path')).toHaveLength(0);
  });

  it('renders icon svg when variant is a status variant', async () => {
    const element = mountMessageText({
      id: 'msg',
      variant: 'error',
      dataTestId: 'message-text',
    });

    await syncMessageTextState();

    const svg = await waitForSvg(element);

    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
    expect(svg.getAttribute('data-testid')).toBe('message-text-icon');
    expect(svg.getAttribute('class')).toContain('peaui-message-text__icon');
  });

  it('renders the variant icon path by default when withIcon is not provided', async () => {
    const element = mountMessageText({
      id: 'msg',
      variant: 'info',
    });

    await syncMessageTextState();

    expect(element.querySelector('svg')).not.toBeNull();
    expect(element.querySelectorAll('path')).toHaveLength(1);
  });

  it('does not render variant icon when withIcon is false', async () => {
    const element = mountMessageText({
      id: 'msg',
      variant: 'danger',
      withIcon: false,
    });

    await syncMessageTextState();

    expect(element.querySelector('svg')).toBeNull();
    expect(element.querySelectorAll('path')).toHaveLength(0);
  });

  it('renders custom icon when ownIcon is provided', async () => {
    const element = mountMessageText({
      id: 'msg',
      variant: 'default',
      ownIcon: 'plus',
      dataTestId: 'message-text',
    });

    const icon = await waitForSvg(element);

    expect(icon.getAttribute('data-testid')).toBe('message-text-icon');
    expect(icon.getAttribute('class')).toContain('peaui-message-text__icon-own');
    expect(element.querySelectorAll('svg')).toHaveLength(1);
    expect(element.querySelector('path')).not.toBeNull();
  });

  it('adds white variant class to custom icon when ownIcon is provided', async () => {
    const element = mountMessageText({
      id: 'msg',
      variant: 'white',
      ownIcon: 'plus',
      dataTestId: 'message-text',
    });

    const icon = await waitForSvg(element);

    expect(icon.getAttribute('class')).toContain('peaui-message-text__icon-own--variant-white');
  });

  it('does not render icon svg when variant is default (or omitted)', async () => {
    const wrapperDefault = mountMessageText({
      id: 'msg',
      variant: 'default',
    });
    const wrapperOmitted = mountMessageText({
      id: 'msg',
    });

    await syncMessageTextState();

    expect(wrapperDefault.querySelector('svg')).toBeNull();
    expect(wrapperOmitted.querySelector('svg')).toBeNull();
  });

  it('renders message content in <p> with correct class and optional data-testid', async () => {
    const inner = document.createElement('span');

    inner.setAttribute('data-testid', 'inner');
    inner.textContent = 'Hi';

    const element = mountMessageText({
      id: 'msg',
      dataTestId: 'message-text',
      content: inner,
    });

    await syncMessageTextState();

    const paragraph = element.querySelector('p');

    expect(paragraph?.getAttribute('class')).toContain('peaui-message-text__content');
    expect(paragraph?.getAttribute('data-testid')).toBe('message-text-title');
    expect(element.querySelector('[data-testid="inner"]')?.textContent).toBe('Hi');
  });

  it('uses default props: variant=default and size=s when not provided', async () => {
    const element = mountMessageText({
      id: 'msg',
    });

    await syncMessageTextState();

    const className = element.querySelector('div')?.getAttribute('class') ?? '';

    expect(className).toContain('peaui-message-text--size-s');
    expect(className).toContain('peaui-message-text--variant-default');
  });

  it('renders the correct root id for each variant', async () => {
    const element = mountMessageText({
      id: 'msg',
      variant: 'danger',
    });

    await syncMessageTextState();

    expect(element.querySelector('div')?.getAttribute('id')).toBe('msg-danger');
  });
});
