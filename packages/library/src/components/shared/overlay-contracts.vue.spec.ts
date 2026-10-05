import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FullscreenContainer from '../layout/FullscreenContainer/index.vue';
describe('regressions: Vue fullscreen', () => {
  it('closes on Escape and restores focus while retaining another fullscreen lock', async () => {
    const first = mount(FullscreenContainer, { attachTo: document.body });
    const second = mount(FullscreenContainer, { attachTo: document.body });
    try {
      await first.get('button').trigger('click');
      await second.get('button').trigger('click');
      await first.get('button').trigger('keydown', { key: 'Escape' });
      expect(first.get('button').attributes('aria-pressed')).toBe('false');
      expect(document.activeElement).toBe(first.get('button').element);
      expect(document.body.classList.contains('peaui-fullscreen-container--scroll-hidden')).toBe(
        true,
      );
    } finally {
      first.unmount();
      second.unmount();
    }
    expect(document.body.classList.contains('peaui-fullscreen-container--scroll-hidden')).toBe(
      false,
    );
  });
});
