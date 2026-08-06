import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import AvatarGroup from './index.vue';
import type { AvatarGroupItem } from './index.vue';

const items: AvatarGroupItem[] = [
  { id: 'a', name: 'Anna Kowalska', status: 'online' },
  { id: 'b', name: 'Jan Nowak', status: 'away' },
  { id: 'c', name: 'Maria Wiśniewska', disabled: true },
  { id: 'd', name: 'Piotr Zieliński' },
  { id: 'e', name: 'Zofia Lewandowska' },
];

afterEach(() => document.body.replaceChildren());

describe('AvatarGroup', () => {
  it('ogranicza widoczne elementy, zachowuje kolejność DOM i wylicza nadmiar', () => {
    const wrapper = mount(AvatarGroup, {
      props: { ariaLabel: 'Zespół', dataTestId: 'team', items, maxVisible: 3 },
    });

    expect(wrapper.get('ul').attributes('role')).toBe('list');
    expect(wrapper.get('ul').attributes('aria-label')).toBe('Zespół');
    expect(wrapper.findAll('[data-testid^="team-item-"]')).toHaveLength(3);
    expect(
      wrapper
        .findAll('.peaui-avatar-group__avatar-button')
        .map((button) => button.attributes('aria-label')),
    ).toEqual(['Anna Kowalska, Dostępny', 'Jan Nowak, Zaraz wracam', 'Maria Wiśniewska']);
    expect(wrapper.get('[data-testid="team-overflow"]').text()).toBe('+2');
    expect(wrapper.get('[data-testid="team-overflow"]').attributes('aria-label')).toBe(
      'Pokaż 2 pozostałych użytkowników',
    );
  });

  it.each([
    [-4, 0, '+5'],
    [0, 0, '+5'],
    [2.9, 2, '+3'],
    [99, 5, undefined],
  ])('normalizuje limit %s', (maxVisible, visibleCount, overflowText) => {
    const wrapper = mount(AvatarGroup, { props: { items, maxVisible } });
    const overflow = wrapper.find('.peaui-avatar-group__overflow-button');

    expect(wrapper.findAll('.peaui-avatar-group__avatar-button')).toHaveLength(visibleCount);
    expect(overflow.exists() ? overflow.text() : undefined).toBe(overflowText);
  });

  it('emituje wybrany rekord i jego źródłowy indeks, ale respektuje disabled', async () => {
    const wrapper = mount(AvatarGroup, { props: { items, maxVisible: 4 } });
    const buttons = wrapper.findAll('.peaui-avatar-group__avatar-button');

    await buttons[1]?.trigger('click');
    await buttons[2]?.trigger('click');

    expect(wrapper.emitted('select')).toEqual([[items[1], 1]]);
    expect(buttons[2]?.attributes('disabled')).toBeDefined();
  });

  it('otwiera popover, wiąże ARIA i przywraca fokus po Escape', async () => {
    const wrapper = mount(AvatarGroup, {
      attachTo: document.body,
      props: { dataTestId: 'team', items, maxVisible: 2, overflowMode: 'popover' },
    });
    const overflow = wrapper.get<HTMLButtonElement>('[data-testid="team-overflow"]');

    expect(overflow.attributes('aria-expanded')).toBe('false');
    expect(overflow.attributes('aria-haspopup')).toBe('dialog');
    expect(wrapper.get('[data-testid="team-popover"]').isVisible()).toBe(false);

    await overflow.trigger('click');
    expect(wrapper.emitted('overflowClick')?.[0]).toEqual([items.slice(2)]);
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true]);
    expect(overflow.attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('[data-testid="team-popover"]').attributes('id')).toBe(
      overflow.attributes('aria-controls'),
    );
    expect(document.activeElement).toBe(
      wrapper.findAll<HTMLButtonElement>('.peaui-avatar-group__popover-button')[1]?.element,
    );

    await wrapper.trigger('keydown', { key: 'Escape' });
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false]);
    expect(document.activeElement).toBe(overflow.element);
  });

  it('renderuje tylko ukryte osoby w panelu i zamyka go po wyborze', async () => {
    const wrapper = mount(AvatarGroup, {
      attachTo: document.body,
      props: {
        dataTestId: 'team',
        items,
        maxVisible: 2,
        overflowMode: 'popover',
        open: true,
      },
    });
    const popoverButtons = wrapper.findAll('.peaui-avatar-group__popover-button');

    expect(popoverButtons).toHaveLength(3);
    expect(popoverButtons.map((button) => button.attributes('aria-label'))).toEqual([
      'Maria Wiśniewska',
      'Piotr Zieliński',
      'Zofia Lewandowska',
    ]);
    await popoverButtons[1]?.trigger('click');
    expect(wrapper.emitted('select')?.[0]).toEqual([items[3], 3]);
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false]);
  });

  it('obsługuje empty, loading, układ i niestandardowe sloty', () => {
    const empty = mount(AvatarGroup, { slots: { empty: '<span>Brak członków</span>' } });
    expect(empty.get('.peaui-avatar-group__empty').text()).toBe('Brak członków');

    const loading = mount(AvatarGroup, {
      props: {
        direction: 'start',
        items,
        loading: true,
        maxVisible: 1,
        open: true,
        overlap: false,
        overflowMode: 'popover',
        shape: 'rounded',
        size: 'xl',
      },
      slots: { 'popover-header': '<strong>Cały zespół</strong>' },
    });
    expect(loading.classes()).toEqual(
      expect.arrayContaining([
        'peaui-avatar-group--direction-start',
        'peaui-avatar-group--spaced',
        'peaui-avatar-group--shape-rounded',
        'peaui-avatar-group--size-xl',
      ]),
    );
    expect(loading.get('[role="dialog"]').attributes('aria-busy')).toBe('true');
    expect(loading.get('[role="status"]').text()).toContain('Ładowanie');
    expect(loading.get('.peaui-avatar-group__popover-header').text()).toBe('Cały zespół');
  });

  it('zamyka panel po kliknięciu poza grupą bez przejmowania fokusu', async () => {
    const wrapper = mount(AvatarGroup, {
      attachTo: document.body,
      props: { items, maxVisible: 2, open: true, overflowMode: 'popover' },
    });
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    outside.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false]);
    expect(document.activeElement).toBe(outside);
  });
});
