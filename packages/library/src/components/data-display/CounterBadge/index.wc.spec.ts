import { afterEach, describe, expect, it } from 'vitest';

import { CounterBadgeElement, defineCounterBadge } from './index.wc';

defineCounterBadge();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('CounterBadge (index.wc.ts)', () => {
  it('registers the public custom element', () => {
    expect(customElements.get(CounterBadgeElement.tagName)).toBe(CounterBadgeElement);
  });

  it('renders the Vue implementation and reacts to public properties', async () => {
    const element = document.createElement(CounterBadgeElement.tagName) as HTMLElement & {
      value: number;
      variant: string;
    };
    element.value = 3;
    element.variant = 'success';
    document.body.appendChild(element);
    await Promise.resolve();

    const badge = element.querySelector('[role="status"]');

    expect(badge).toHaveTextContent('3');
    expect(badge).toHaveClass('peaui-counter-badge--variant-success');

    element.value = 12;
    await Promise.resolve();

    expect(badge).toHaveTextContent('12');
  });
});
