import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import ProgressIndicator from './index.vue';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'uikit',
}));

describe('ProgressIndicator (index.vue)', () => {
  it('renderuje poprawne atrybuty ARIA i tekst dla standardowego trybu', () => {
    const wrapper = mount(ProgressIndicator, {
      props: {
        steps: 4,
        active: 1,
        size: 120,
        strokeWidth: 12,
        dataTestId: 'progress',
      },
    });

    const root = wrapper.get('[data-testid="progress"]');

    expect(root.attributes('role')).toBe('progressbar');
    expect(root.attributes('aria-valuemin')).toBe('0');
    expect(root.attributes('aria-valuemax')).toBe('4');
    expect(root.attributes('aria-valuenow')).toBe('1');
    expect(root.attributes('aria-label')).toBe('Postęp: krok 1 z 4.');

    expect((root.element as HTMLElement).style.width).toBe('120px');
    expect((root.element as HTMLElement).style.height).toBe('120px');

    expect(root.text()).toContain('1/4');
  });

  it('clampuje active do zakresu [0..steps] i ustawia dashoffset na 0 przy 100%', () => {
    const wrapper = mount(ProgressIndicator, {
      props: {
        steps: 4,
        active: 10,
        size: 100,
        strokeWidth: 10,
      },
    });

    const root = wrapper.get('[role="progressbar"]');
    expect(root.attributes('aria-valuenow')).toBe('4');
    expect(root.text()).toContain('4/4');

    const circles = wrapper.findAll('circle');
    expect(circles.length).toBe(2);

    const progressCircle = circles[1];
    const dashOffset = parseFloat(progressCircle!.attributes('stroke-dashoffset')!);
    expect(dashOffset).toBeCloseTo(0, 6);
  });

  it('poprawnie liczy dashoffset dla częściowego postępu (np. 1/4)', () => {
    const wrapper = mount(ProgressIndicator, {
      props: {
        steps: 4,
        active: 1,
        size: 120,
        strokeWidth: 12,
      },
    });

    const circles = wrapper.findAll('circle');
    const progressCircle = circles[1];

    const center = 120 / 2;
    const radius = Math.max(center - 12 / 2, 0);
    const circumference = 2 * Math.PI * radius;
    const progressPct = 1 / 4;
    const expectedDashOffset = circumference * (1 - progressPct);

    const dashOffset = parseFloat(progressCircle!.attributes('stroke-dashoffset')!);
    expect(dashOffset).toBeCloseTo(expectedDashOffset, 4);

    const dashArray = parseFloat(progressCircle!.attributes('stroke-dasharray')!);
    expect(dashArray).toBeCloseTo(circumference, 4);
  });

  it('tryb removeActive: ukrywa progress, zmienia label i tekst', () => {
    const wrapper = mount(ProgressIndicator, {
      props: {
        steps: 4,
        active: 2,
        removeActive: true,
      },
    });

    const root = wrapper.get('[role="progressbar"]');
    expect(root.attributes('aria-label')).toBe('Postęp: 4 kroków.');

    // tekst w środku: tylko liczba kroków
    expect(root.text()).toContain('4');
    expect(root.text()).not.toContain('2/4');

    const circles = wrapper.findAll('circle');
    const trackCircle = circles[0];
    const progressCircle = circles[1];

    expect(trackCircle!.attributes('class')).toContain('uikit-progress-indicator__track');
    expect(trackCircle!.attributes('class')).toContain('uikit-progress-indicator__track--inactive');

    expect(progressCircle!.attributes('class')).toContain('uikit-progress-indicator__progress');
    expect(progressCircle!.attributes('class')).toContain(
      'uikit-progress-indicator__progress--hidden',
    );
  });

  it('gdy steps <= 0: label i tekst są 0/0, aria-max=0, aria-now=0', () => {
    const wrapper = mount(ProgressIndicator, {
      props: {
        steps: -2,
        active: 5,
      },
    });

    const root = wrapper.get('[role="progressbar"]');
    expect(root.attributes('aria-valuemax')).toBe('0');
    expect(root.attributes('aria-valuenow')).toBe('0');
    expect(root.attributes('aria-label')).toBe('Postęp: brak zdefiniowanych kroków.');

    expect(root.text()).toContain('0/0');
  });
});
