import { describe, expect, it } from 'vitest';

import { acquireDocumentScrollLock, prefersReducedMotion } from '../../helpers/browser.helper';
import { collectFocusableElements, trapTabKey } from '../../helpers/focus.helper';

describe('shared browser and focus helpers', () => {
  it('reference-counts document scroll locks', () => {
    const firstRelease = acquireDocumentScrollLock('test-scroll-lock');
    const secondRelease = acquireDocumentScrollLock('test-scroll-lock');
    expect(document.body.classList.contains('test-scroll-lock')).toBe(true);
    firstRelease();
    expect(document.body.classList.contains('test-scroll-lock')).toBe(true);
    secondRelease();
    expect(document.body.classList.contains('test-scroll-lock')).toBe(false);
  });

  it('handles missing matchMedia and traps focus at both tab boundaries', () => {
    expect(prefersReducedMotion({ matchMedia: undefined } as unknown as Window)).toBe(false);
    const root = document.createElement('div');
    root.innerHTML = '<button>one</button><button>two</button>';
    document.body.appendChild(root);
    const focusable = collectFocusableElements([root]);
    focusable[1]?.focus();
    const forward = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    trapTabKey(forward, focusable, root);
    expect(forward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(focusable[0]);
    focusable[0]?.focus();
    const backward = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      cancelable: true,
    });
    trapTabKey(backward, focusable, root);
    expect(document.activeElement).toBe(focusable[1]);
    root.remove();
  });
});
