import { afterEach, describe, expect, it, vi } from 'vitest';

import { ToastAlertElement, defineToastAlert } from './index.wc';

defineToastAlert();

type MountOptions = {
  canClose?: boolean;
  dataTestId?: string;
  description?: string;
  size?: 's' | 'm' | 'l';
  title?: string;
  variant?: 'info' | 'error' | 'success' | 'danger';
  withBorder?: boolean;
  withShadow?: boolean;
};

function mountToastAlert(options: MountOptions = {}): ToastAlertElement {
  const element = document.createElement(ToastAlertElement.tagName) as ToastAlertElement;

  if (options.variant !== undefined) {
    element.variant = options.variant;
  }

  if (options.title !== undefined) {
    element.title = options.title;
  }

  if (options.description !== undefined) {
    element.description = options.description;
  }

  if (options.dataTestId !== undefined) {
    element.dataTestId = options.dataTestId;
  }

  if (options.size !== undefined) {
    element.size = options.size;
  }

  if (options.withShadow !== undefined) {
    element.withShadow = options.withShadow;
  }

  if (options.withBorder !== undefined) {
    element.withBorder = options.withBorder;
  }

  if (options.canClose !== undefined) {
    element.canClose = options.canClose;
  }

  document.body.appendChild(element);

  return element;
}

function getRoot(element: ToastAlertElement): HTMLElement {
  const root = element.querySelector('div');

  if (!(root instanceof HTMLElement)) {
    throw new Error('ToastAlert root was not rendered.');
  }

  return root;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ToastAlert (index.wc.ts)', () => {
  it('uses default variant="info" and renders base + variant classes', () => {
    const element = mountToastAlert();
    const root = getRoot(element);

    expect(root.classList.contains('peaui-toast-alert')).toBe(true);
    expect(root.classList.contains('peaui-toast-alert--variant-info')).toBe(true);
  });

  it('sets role/status and aria-live/polite for non-assertive variants (info/success)', () => {
    const info = mountToastAlert({ variant: 'info' });
    const success = mountToastAlert({ variant: 'success' });

    expect(getRoot(info).getAttribute('role')).toBe('status');
    expect(getRoot(info).getAttribute('aria-live')).toBe('polite');
    expect(getRoot(success).getAttribute('role')).toBe('status');
    expect(getRoot(success).getAttribute('aria-live')).toBe('polite');
  });

  it('sets role/alert and aria-live/assertive for assertive variants (error/danger)', () => {
    const error = mountToastAlert({ variant: 'error' });
    const danger = mountToastAlert({ variant: 'danger' });

    expect(getRoot(error).getAttribute('role')).toBe('alert');
    expect(getRoot(error).getAttribute('aria-live')).toBe('assertive');
    expect(getRoot(danger).getAttribute('role')).toBe('alert');
    expect(getRoot(danger).getAttribute('aria-live')).toBe('assertive');
  });

  it('always sets aria-atomic="true"', () => {
    const element = mountToastAlert();

    expect(getRoot(element).getAttribute('aria-atomic')).toBe('true');
  });

  it('does not render close button by default', () => {
    const element = mountToastAlert();

    expect(element.querySelector('button')).toBeNull();
  });

  it('when title is provided: sets aria-labelledby and does not set aria-label', () => {
    const element = mountToastAlert({ title: 'Tytul' });
    const root = getRoot(element);
    const title = element.querySelector('strong');

    expect(root.getAttribute('aria-labelledby')).toMatch(/^toast-\d+-title$/);
    expect(root.getAttribute('aria-label')).toBeNull();
    expect(title?.textContent).toBe('Tytul');
    expect(title?.getAttribute('id')).toMatch(/^toast-\d+-title$/);
  });

  it('applies title size classes and border modifier', () => {
    const defaultSize = mountToastAlert({ title: 'Tytul' });
    const smallSize = mountToastAlert({ title: 'Tytul', size: 's' });
    const withBorder = mountToastAlert({ variant: 'success', withBorder: true });

    expect(
      defaultSize.querySelector('strong')?.classList.contains('peaui-toast-alert__title--size-m'),
    ).toBe(true);
    expect(
      smallSize.querySelector('strong')?.classList.contains('peaui-toast-alert__title--size-s'),
    ).toBe(true);
    expect(
      smallSize.querySelector('strong')?.classList.contains('peaui-toast-alert__title--size-m'),
    ).toBe(false);
    expect(getRoot(withBorder).classList.contains('peaui-toast-alert--border')).toBe(true);
  });

  it('when description is provided: sets aria-describedby', () => {
    const element = mountToastAlert({ description: 'Opis' });
    const root = getRoot(element);
    const description = element.querySelector('p');

    expect(root.getAttribute('aria-describedby')).toMatch(/^toast-\d+-desc$/);
    expect(description?.textContent).toContain('Opis');
    expect(description?.getAttribute('id')).toMatch(/^toast-\d+-desc$/);
    expect(description?.classList.contains('peaui-toast-alert__description--size-m')).toBe(true);
  });

  it('applies description size class based on size prop', () => {
    const element = mountToastAlert({ description: 'Opis', size: 's' });
    const description = element.querySelector('p');

    expect(description?.classList.contains('peaui-toast-alert__description--size-s')).toBe(true);
    expect(description?.classList.contains('peaui-toast-alert__description--size-m')).toBe(false);
  });

  it('when both title and description are provided: sets labelledby + describedby', () => {
    const element = mountToastAlert({ title: 'Tytul', description: 'Opis' });
    const root = getRoot(element);

    expect(root.getAttribute('aria-labelledby')).toMatch(/^toast-\d+-title$/);
    expect(root.getAttribute('aria-describedby')).toMatch(/^toast-\d+-desc$/);
    expect(root.getAttribute('aria-label')).toBeNull();
  });

  it('when title is not provided: sets aria-label from description or fallback', () => {
    const withDescription = mountToastAlert({ description: 'Opis tylko' });
    const withoutContent = mountToastAlert();

    expect(getRoot(withDescription).getAttribute('aria-label')).toBe('Opis tylko');
    expect(getRoot(withDescription).getAttribute('aria-labelledby')).toBeNull();
    expect(getRoot(withoutContent).getAttribute('aria-label')).toBe('Powiadomienie');
  });

  it('sets data-testid on root and generates icon/title/description ids', () => {
    const element = mountToastAlert({
      dataTestId: 'toast',
      title: 'Tytul',
      description: 'Opis',
    });

    expect(getRoot(element).getAttribute('data-testid')).toBe('toast');
    expect(element.querySelector('svg')?.getAttribute('data-testid')).toBe('toast-icon');
    expect(element.querySelector('strong')?.getAttribute('data-testid')).toBe('toast-title');
    expect(element.querySelector('p')?.getAttribute('data-testid')).toBe('toast-description');
  });

  it('renders close button with aria attributes and data test ids when canClose is true', () => {
    const element = mountToastAlert({
      canClose: true,
      dataTestId: 'toast',
      title: 'Tytul',
    });

    const root = getRoot(element);
    const button = element.querySelector('button');
    const closeIcon = element.querySelector('[data-testid="toast-close-button-icon"]');

    expect(root.getAttribute('id')).toMatch(/^toast-\d+-region$/);
    expect(button?.getAttribute('type')).toBe('button');
    expect(button?.getAttribute('data-testid')).toBe('toast-close-button');
    expect(button?.getAttribute('aria-controls')).toBe(root.getAttribute('id'));
    expect(button?.getAttribute('aria-label')).toBe('Zamknij powiadomienie: Tytul');
    expect(closeIcon?.getAttribute('aria-hidden')).toBe('true');
    expect(closeIcon?.getAttribute('focusable')).toBe('false');
  });

  it('dispatches on:close after clicking close button and not on keyup.enter', () => {
    const element = mountToastAlert({ canClose: true });
    const button = element.querySelector('button');
    const handleClose = vi.fn();

    element.addEventListener('on:close', handleClose);
    button?.click();

    expect(handleClose).toHaveBeenCalledTimes(1);

    button?.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('svg is aria-hidden and not focusable, renders correct icon variants and classes', () => {
    const info = mountToastAlert({ variant: 'info' });
    const success = mountToastAlert({ variant: 'success' });
    const error = mountToastAlert({ variant: 'error' });

    const infoSvg = info.querySelector('svg');

    expect(infoSvg?.getAttribute('aria-hidden')).toBe('true');
    expect(infoSvg?.getAttribute('focusable')).toBe('false');
    expect(info.querySelectorAll('path').length).toBeGreaterThan(0);
    expect(success.querySelector('path[fill="#10893C"]')).not.toBeNull();
    expect(error.querySelector('path[fill="#10893C"]')).toBeNull();
    expect(error.querySelectorAll('path').length).toBeGreaterThan(0);

    for (const variant of ['info', 'error', 'success', 'danger'] as const) {
      const element = mountToastAlert({ variant });

      expect(getRoot(element).classList.contains(`peaui-toast-alert--variant-${variant}`)).toBe(
        true,
      );
    }
  });

  it('does not interpret HTML from title and description properties', () => {
    const title = '<img src=x onerror="alert(1)">Title';
    const description = '<script>alert(1)</script>Description';
    const element = mountToastAlert({ title, description });

    expect(element.querySelector('strong')?.textContent).toBe(title);
    expect(element.querySelector('p')?.textContent).toBe(description);
    expect(element.querySelector('img')).toBeNull();
    expect(element.querySelector('script')).toBeNull();
  });
});
