import { afterEach, expect, it, vi } from 'vitest';
import { observeAvatarGroupPopover } from './avatar-group.shared';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.replaceChildren();
});

it('clamps an end-aligned panel at the left viewport edge and releases listeners', () => {
  const root = document.createElement('div');
  const panel = document.createElement('section');
  root.append(panel);
  document.body.append(root);
  panel.style.marginTop = '8px';
  vi.spyOn(root, 'getBoundingClientRect').mockReturnValue(new DOMRect(16, 80, 78, 24));
  vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue(new DOMRect(-146, 112, 240, 150));
  const remove = vi.spyOn(window, 'removeEventListener');
  const stop = observeAvatarGroupPopover(root, panel, 'end');
  expect(panel.style.left).toBe('0px');
  expect(panel.style.top).toBe('24px');
  expect(panel.style.right).toBe('auto');
  stop();
  expect(remove).toHaveBeenCalledWith('resize', expect.any(Function));
  expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function), true);
  expect(panel.style.left).toBe('');
});
