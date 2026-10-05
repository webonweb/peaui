import { afterEach, expect, it } from 'vitest';
import { collectFocusableElements, trapTabKey } from '@/helpers/focus.helper';

afterEach(() => document.body.replaceChildren());

it('O01: Tab skips descendants of hidden, inert and display:none ancestors', () => {
  const dialog = document.createElement('section');
  dialog.tabIndex = -1;
  dialog.innerHTML =
    '<div hidden><button>Hidden</button></div><div inert><button>Inert</button></div><div style="display:none"><button>CSS hidden</button></div><button>Visible action</button>';
  document.body.append(dialog);
  dialog.focus();
  const focusable = collectFocusableElements([dialog]);
  expect(focusable.map((el) => el.textContent)).toEqual(['Visible action']);
  trapTabKey(new KeyboardEvent('keydown', { key: 'Tab', cancelable: true }), focusable, dialog);
  expect(document.activeElement?.textContent).toBe('Visible action');
});
