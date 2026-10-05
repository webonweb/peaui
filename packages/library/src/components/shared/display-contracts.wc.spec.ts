import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import FormFieldLabel from '../form/FormFieldLabel/index.wc';
import CounterBadge from '../data-display/CounterBadge/index.wc';
afterEach(() => document.body.replaceChildren());
describe('regressions: WC composition parity', () => {
  it('projects the default label slot, preserving node identity and restoring fallback on removal', async () => {
    const label = new FormFieldLabel();
    Object.assign(label, { for: 'field', text: 'Fallback' });
    const strong = document.createElement('strong');
    strong.textContent = 'Rich label';
    label.append(strong);
    document.body.append(label);
    await nextTick();
    expect(label.querySelector('label strong')).toBe(strong);
    expect(label.querySelector('label')?.textContent).not.toContain('Fallback');
    strong.remove();
    await nextTick();
    await nextTick();
    expect(label.querySelector('label')?.textContent).toContain('Fallback');
  });
  it('keeps the shared counter live region and size', () => {
    const badge = new CounterBadge();
    badge.value = 2;
    document.body.append(badge);
    expect(badge.querySelector('[role="status"]')?.getAttribute('aria-live')).toBe('polite');
    expect(badge.querySelector('.peaui-counter-badge--size-s')).not.toBeNull();
  });
});
