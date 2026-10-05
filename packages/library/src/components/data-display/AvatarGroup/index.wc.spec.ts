import '@testing-library/jest-dom/vitest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { avatarGroupDemoItems } from './avatar-group.demo';
import { AvatarGroupElement, defineAvatarGroup } from './index.wc';

type AvatarGroupTestElement = InstanceType<typeof AvatarGroupElement> & {
  items: typeof avatarGroupDemoItems;
  maxVisible: number;
  open: boolean;
  overflowMode: string;
};

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
};

function createGroup(): AvatarGroupTestElement {
  const element = document.createElement(AvatarGroupElement.tagName) as AvatarGroupTestElement;
  element.items = avatarGroupDemoItems;
  element.maxVisible = 2;
  document.body.append(element);
  return element;
}

afterEach(() => document.body.replaceChildren());

describe('AvatarGroup Web Component', () => {
  it('does not mount hidden members until the overflow opens', async () => {
    const element = createGroup();
    Object.assign(element, {
      items: Array.from({ length: 1000 }, (_, id) => ({ id, name: `Person ${id}` })),
      overflowMode: 'popover',
    });
    await flush();
    expect(element.querySelectorAll('.peaui-avatar-group__popover-button')).toHaveLength(0);
    expect(element.querySelectorAll('*').length).toBeLessThan(60);
  });

  it.each(['disabled', 'loading'] as const)(
    'preserves focus when %s is enabled while open',
    async (state) => {
      const element = createGroup();
      element.overflowMode = 'popover';
      await flush();
      element.querySelector<HTMLButtonElement>('.peaui-avatar-group__overflow-button')!.click();
      await flush();
      element.setAttribute(state, '');
      await flush();
      const popup = element.querySelector<HTMLElement>('[role="dialog"]')!;
      if (state === 'disabled') {
        expect(popup).not.toBeVisible();
        expect(document.activeElement).toBe(element.querySelector('.peaui-avatar-group'));
      } else {
        expect(popup).toHaveFocus();
        popup.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await flush();
        expect(popup).not.toBeVisible();
      }
    },
  );
  it('rejestruje publiczny custom element i renderuje ten sam kontrakt BEM', async () => {
    expect(defineAvatarGroup()).toBe(AvatarGroupElement);
    expect(customElements.get(AvatarGroupElement.tagName)).toBe(AvatarGroupElement);
    const element = createGroup();
    await flush();

    expect(element.querySelector('[role="list"]')).toHaveAttribute(
      'aria-label',
      'Członkowie grupy',
    );
    expect(element.querySelectorAll('.peaui-avatar-group__avatar-button')).toHaveLength(2);
    expect(element.querySelector('.peaui-avatar-group__overflow-button')).toHaveTextContent('+3');
  });

  it('przekazuje rekord i indeks przez CustomEvent select', async () => {
    const element = createGroup();
    const onSelect = vi.fn();
    element.addEventListener('select', onSelect);
    await flush();

    (
      element.querySelectorAll('.peaui-avatar-group__avatar-button')[1] as HTMLButtonElement
    ).click();
    expect(onSelect).toHaveBeenCalledOnce();
    expect((onSelect.mock.calls[0]?.[0] as CustomEvent).detail).toEqual([
      avatarGroupDemoItems[1],
      1,
    ]);
  });

  it('obsługuje property open, ARIA, Escape i fokus panelu', async () => {
    const element = createGroup();
    element.overflowMode = 'popover';
    const onOpen = vi.fn();
    element.addEventListener('update:open', onOpen);
    await flush();
    const overflow = element.querySelector(
      '.peaui-avatar-group__overflow-button',
    ) as HTMLButtonElement;

    overflow.click();
    await flush();
    expect(overflow).toHaveAttribute('aria-expanded', 'true');
    expect(overflow).toHaveAttribute('aria-haspopup', 'dialog');
    expect(element.querySelector('[role="dialog"]')).toBeVisible();
    expect(onOpen).toHaveBeenCalled();
    expect(document.activeElement).toBe(
      element.querySelector('.peaui-avatar-group__popover-button:not(:disabled)'),
    );

    element
      .querySelector('.peaui-avatar-group')
      ?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    await flush();
    expect(overflow).toHaveFocus();
    expect(overflow).toHaveAttribute('aria-expanded', 'false');
  });

  it('respektuje disabled oraz tryb overflow none', async () => {
    const element = createGroup();
    element.setAttribute('disabled', '');
    element.setAttribute('overflow-mode', 'none');
    await flush();

    expect(
      [...element.querySelectorAll<HTMLButtonElement>('.peaui-avatar-group__avatar-button')].every(
        (button) => button.disabled,
      ),
    ).toBe(true);
    expect(element.querySelector('.peaui-avatar-group__overflow-button')).toBeNull();
  });
});
