import { afterEach, describe, expect, it, vi } from 'vitest';

import { AvatarElement, defineAvatar } from './index.wc';

defineAvatar();

type AvatarMountOptions = {
  alt?: string;
  ariaLabel?: string;
  dataTestId?: string;
  disabled?: boolean;
  fallback?: string;
  initials?: string;
  interactive?: boolean;
  name?: string;
  shape?: 'circle' | 'rounded';
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  src?: string;
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
  statusContent?: string;
  statusLabel?: string;
};

function mountAvatar(options: AvatarMountOptions = {}): AvatarElement {
  const element = document.createElement(AvatarElement.tagName) as AvatarElement;

  for (const property of [
    'alt',
    'ariaLabel',
    'dataTestId',
    'disabled',
    'initials',
    'interactive',
    'name',
    'shape',
    'size',
    'src',
    'status',
    'statusLabel',
  ] as const) {
    const value = options[property];
    if (value !== undefined) Object.assign(element, { [property]: value });
  }

  if (options.fallback !== undefined) {
    const fallback = document.createElement('span');
    fallback.dataset.testid = 'custom-fallback';
    fallback.textContent = options.fallback;
    element.appendChild(fallback);
  }

  if (options.statusContent !== undefined) {
    const status = document.createElement('span');
    status.dataset.testid = 'custom-status';
    status.slot = 'status';
    status.textContent = options.statusContent;
    element.appendChild(status);
  }

  document.body.appendChild(element);

  return element;
}

function getRoot(element: AvatarElement): HTMLElement {
  const root = element.querySelector<HTMLElement>('.peaui-avatar');
  if (!root) throw new Error('Avatar root was not rendered.');

  return root;
}

async function syncAvatarState(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Avatar (index.wc.ts)', () => {
  it('registers the element and renders initials without an extra tab stop', async () => {
    const element = mountAvatar({ name: 'Anna Maria Kowalska' });
    await syncAvatarState();

    const root = getRoot(element);
    expect(customElements.get(AvatarElement.tagName)).toBe(AvatarElement);
    expect(root.tagName).toBe('SPAN');
    expect(root).toHaveAttribute('role', 'img');
    expect(root).toHaveAttribute('aria-label', 'Anna Maria Kowalska');
    expect(root).not.toHaveAttribute('tabindex');
    expect(root.querySelector('.peaui-avatar__initials')).toHaveTextContent('AK');
  });

  it('renders the icon fallback in one shared sizing wrapper', async () => {
    const element = mountAvatar({ ariaLabel: 'Nieznany użytkownik' });
    await syncAvatarState();

    const iconWrapper = element.querySelector('.peaui-avatar__icon');
    const icon = iconWrapper?.querySelector('peaui-svg-icon');

    expect(iconWrapper?.tagName).toBe('SPAN');
    expect(icon).toBeInstanceOf(HTMLElement);
    expect(icon).not.toHaveClass('peaui-avatar__icon');
  });

  it('handles image load and error events and resets after src changes', async () => {
    const onLoad = vi.fn();
    const onError = vi.fn();
    const element = mountAvatar({
      alt: 'Portret Anny',
      dataTestId: 'avatar',
      name: 'Anna Kowalska',
      src: '/anna.jpg',
    });
    element.addEventListener('load', onLoad);
    element.addEventListener('error', onError);
    await syncAvatarState();

    const firstImage = element.querySelector<HTMLImageElement>('img');
    expect(getRoot(element)).toHaveAttribute('data-state', 'loading');
    firstImage?.dispatchEvent(new Event('load'));
    await syncAvatarState();
    expect(onLoad).toHaveBeenCalledOnce();
    expect(firstImage).toHaveAttribute('alt', 'Portret Anny');

    element.src = '/replacement.jpg';
    await syncAvatarState();
    expect(getRoot(element)).toHaveAttribute('data-state', 'loading');

    element.querySelector('img')?.dispatchEvent(new Event('error'));
    await syncAvatarState();
    expect(onError).toHaveBeenCalledOnce();
    expect(element.querySelector('img')).toBeNull();
    expect(element.querySelector('.peaui-avatar__initials')).toHaveTextContent('AK');
  });

  it('uses native button and disabled behavior in interactive mode', async () => {
    const onClick = vi.fn();
    const element = mountAvatar({
      ariaLabel: 'Otwórz profil Anny',
      interactive: true,
    });
    element.addEventListener('click', onClick);
    await syncAvatarState();

    const button = getRoot(element);
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'Otwórz profil Anny');
    button.click();
    expect(onClick).toHaveBeenCalledOnce();

    element.disabled = true;
    await syncAvatarState();
    expect(getRoot(element)).toBeDisabled();
    getRoot(element).click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('keeps decorative images out of the accessibility tree', async () => {
    const element = mountAvatar({ alt: '', src: '/decorative.jpg' });
    await syncAvatarState();
    element.querySelector('img')?.dispatchEvent(new Event('load'));
    await syncAvatarState();

    expect(getRoot(element)).not.toHaveAttribute('role');
    expect(getRoot(element)).not.toHaveAttribute('aria-label');
    expect(element.querySelector('img')).toHaveAttribute('alt', '');
    expect(element.querySelector('img')).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes a non-live status label and supports light-DOM slots', async () => {
    const element = mountAvatar({
      fallback: 'A',
      name: 'Anna Kowalska',
      status: 'busy',
      statusContent: '!',
      statusLabel: 'Nie przeszkadzać',
    });
    await syncAvatarState();

    const root = getRoot(element);
    const statusLabel = element.querySelector<HTMLElement>('.peaui-avatar__status-label');
    expect(element.querySelector('[data-testid="custom-fallback"]')).toHaveTextContent('A');
    expect(element.querySelector('[data-testid="custom-status"]')).toHaveTextContent('!');
    expect(statusLabel).toHaveTextContent('Nie przeszkadzać');
    expect(statusLabel).not.toHaveAttribute('aria-live');
    expect(root.getAttribute('aria-describedby')?.split(' ')).toContain(statusLabel?.id);
  });

  it('applies public size, shape and test-id classes consistently', async () => {
    const element = mountAvatar({
      dataTestId: 'profile-avatar',
      name: 'Anna Kowalska',
      shape: 'rounded',
      size: 'xl',
    });
    await syncAvatarState();

    const root = getRoot(element);
    expect(root).toHaveClass('peaui-avatar--size-xl', 'peaui-avatar--shape-rounded');
    expect(root).toHaveAttribute('data-testid', 'profile-avatar');
  });
});
