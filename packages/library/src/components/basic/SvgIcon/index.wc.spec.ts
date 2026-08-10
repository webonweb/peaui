import { afterEach, describe, expect, it } from 'vitest';

import { waitForDomCondition, waitForSvgElement } from '@/helpers/test-wc.helper';
import { SvgIconElement, defineSvgIcon } from './index.wc';

defineSvgIcon();

type MountOptions = {
  ariaHidden?: string;
  className?: string;
  dataTestId?: string;
  focusable?: string;
  name?: string;
  role?: string;
};

function mountSvgIcon(options: MountOptions = {}): SvgIconElement {
  const element = document.createElement(SvgIconElement.tagName) as SvgIconElement;

  if (options.name !== undefined) {
    element.name = options.name;
  }

  if (options.dataTestId !== undefined) {
    element.dataTestId = options.dataTestId;
  }

  if (options.className !== undefined) {
    element.setAttribute('class', options.className);
  }

  if (options.ariaHidden !== undefined) {
    element.setAttribute('aria-hidden', options.ariaHidden);
  }

  if (options.focusable !== undefined) {
    element.setAttribute('focusable', options.focusable);
  }

  if (options.role !== undefined) {
    element.setAttribute('role', options.role);
  }

  document.body.appendChild(element);

  return element;
}

async function waitForSvg(element: SvgIconElement): Promise<SVGSVGElement> {
  return waitForSvgElement(element, 'SVG icon did not render in time.', 5000);
}

async function waitForInnerHtmlChange(
  element: SvgIconElement,
  previousMarkup: string,
): Promise<void> {
  await waitForDomCondition(element, () => element.innerHTML !== previousMarkup, {
    errorMessage: 'SVG icon markup did not change in time.',
    timeoutMs: 5000,
  });
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('SvgIcon (index.wc.ts)', () => {
  it('renders async icon root with decorative defaults and base class', async () => {
    const element = mountSvgIcon({
      name: 'cross',
      dataTestId: 'svg-icon',
    });

    const svg = await waitForSvg(element);

    expect(svg.getAttribute('data-testid')).toBe('svg-icon');
    expect(svg.getAttribute('id')).toBeTruthy();
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
    expect(svg.classList.contains('peaui-svg-icon')).toBe(true);
  });

  it('allows explicit accessibility attrs to override decorative defaults', async () => {
    const element = mountSvgIcon({
      name: 'cross',
      ariaHidden: 'false',
      focusable: 'true',
      role: 'img',
    });

    const svg = await waitForSvg(element);

    expect(svg.getAttribute('aria-hidden')).toBe('false');
    expect(svg.getAttribute('focusable')).toBe('true');
    expect(svg.getAttribute('role')).toBe('img');
  });

  it('renders a normalized catalog icon and derives accessible image semantics', async () => {
    const element = mountSvgIcon({
      name: 'tile/tile-accessibility',
    });
    element.setAttribute('aria-label', 'Dostepnosc');

    const svg = await waitForSvg(element);

    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg.getAttribute('fill')).toBe('none');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
    expect(svg.getAttribute('stroke-width')).toBe('1.8');
    expect(svg.querySelector('circle')).not.toBeNull();
    expect(svg.getAttribute('aria-label')).toBe('Dostepnosc');
    expect(svg.hasAttribute('aria-hidden')).toBe(false);
    expect(svg.getAttribute('role')).toBe('img');
  });

  it('merges external host class with the base svg icon class', async () => {
    const element = mountSvgIcon({
      name: 'plus',
      className: 'custom-icon',
    });

    const svg = await waitForSvg(element);

    expect(svg.classList.contains('peaui-svg-icon')).toBe(true);
    expect(svg.classList.contains('custom-icon')).toBe(true);
  });

  it('recomputes icon markup when name prop changes', async () => {
    const element = mountSvgIcon({
      name: 'plus',
    });

    await waitForSvg(element);
    const initialMarkup = element.innerHTML;

    element.name = 'close';

    await waitForInnerHtmlChange(element, initialMarkup);
    const svg = await waitForSvg(element);

    expect(element.innerHTML).not.toBe(initialMarkup);
    expect(svg.getAttribute('id')).toBeTruthy();
  });

  it('clears rendered output when icon name becomes unknown', async () => {
    const element = mountSvgIcon({
      name: 'plus',
    });

    await waitForSvg(element);
    element.name = 'missing-icon';

    await waitForDomCondition(element, () => element.querySelector('svg') === null, {
      errorMessage: 'SVG icon did not clear in time.',
    });

    expect(element.querySelector('svg')).toBeNull();
    expect(element.innerHTML).toBe('');
  });

  it('does not render svg when required name is missing', async () => {
    const element = mountSvgIcon();

    await waitForDomCondition(element, () => element.innerHTML === '', {
      errorMessage: 'Empty SVG icon state did not settle in time.',
    });

    expect(element.querySelector('svg')).toBeNull();
    expect(element.innerHTML).toBe('');
  });
});
