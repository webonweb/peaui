import '@testing-library/jest-dom/vitest';

import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';

import TransferList from './index.vue';
import { transferListItems } from './transfer-list.demo';

const mounted: Array<ReturnType<typeof mount>> = [];

function createTransfer(props: Record<string, unknown> = {}) {
  const wrapper = mount(TransferList, {
    attachTo: document.body,
    props: {
      dataTestId: 'transfer',
      items: transferListItems,
      value: ['analytics', 'security'],
      ...props,
    },
  });
  mounted.push(wrapper);
  return wrapper;
}

afterEach(() => {
  for (const wrapper of mounted.splice(0)) wrapper.unmount();
  document.body.replaceChildren();
});

describe('TransferList Vue', () => {
  it('renderuje dwie nazwane multilistboxy i oznacza disabled option', () => {
    const wrapper = createTransfer();
    const listboxes = wrapper.findAll('[role="listbox"]');

    expect(listboxes).toHaveLength(2);
    expect(listboxes[0]?.element).toHaveAccessibleName('Dostępne');
    expect(listboxes[1]?.element).toHaveAccessibleName('Przypisane');
    expect(
      listboxes.every((listbox) => listbox.attributes('aria-multiselectable') === 'true'),
    ).toBe(true);
    expect(
      [...wrapper.get('.peaui-transfer-list__layout').element.children].map(
        (element) => element.getAttribute('data-panel') ?? 'controls',
      ),
    ).toEqual(['source', 'controls', 'target']);
    expect(wrapper.find('[data-key="system"]').attributes('aria-disabled')).toBe('true');
  });

  it('zaznacza wiele opcji i przenosi je atomowo z komunikatem live', async () => {
    const wrapper = createTransfer();
    await wrapper.find('[data-key="billing"]').trigger('click');
    await wrapper.find('[data-key="customers"]').trigger('click');
    await wrapper.find('[data-testid="transfer-move-selected-target"]').trigger('click');

    expect(wrapper.emitted('update:value')?.at(-1)?.[0]).toEqual([
      'analytics',
      'security',
      'billing',
      'customers',
    ]);
    expect(wrapper.emitted('move')?.at(-1)?.[0]).toEqual(
      expect.objectContaining({
        direction: 'to-target',
        movedKeys: ['billing', 'customers'],
      }),
    );
    expect(wrapper.get('[role="status"]').text()).toContain('Przeniesiono 2');
  });

  it('filtruje panele niezależnie i przenosi wszystkie tylko z widocznego wyniku', async () => {
    const wrapper = createTransfer();
    await wrapper.get('[data-testid="transfer-source-search-element"]').setValue('rozliczenia');

    expect(wrapper.findAll('.peaui-transfer-list__panel--source [role="option"]')).toHaveLength(1);
    expect(wrapper.findAll('.peaui-transfer-list__panel--target [role="option"]')).toHaveLength(2);
    await wrapper.get('[data-testid="transfer-move-all-target"]').trigger('click');
    expect(wrapper.emitted('update:value')?.at(-1)?.[0]).toEqual([
      'analytics',
      'security',
      'billing',
    ]);
    expect(wrapper.emitted('search')?.at(-1)?.[0]).toEqual({
      panel: 'source',
      query: 'rozliczenia',
    });
  });

  it('obsługuje Home, End, Shift+Arrow i Ctrl+A zgodnie z listbox pattern', async () => {
    const wrapper = createTransfer({ value: [] });
    const listbox = wrapper.get('[data-testid="transfer-source-listbox"]');
    await listbox.trigger('focus');
    await listbox.trigger('keydown', { key: 'End' });
    expect(listbox.attributes('aria-activedescendant')).toContain('option-6');
    await listbox.trigger('keydown', { key: 'Home' });
    await listbox.trigger('keydown', { key: 'ArrowDown', shiftKey: true });
    expect(wrapper.emitted('update:sourceSelected')?.at(-1)?.[0]).toEqual(['analytics', 'billing']);
    await listbox.trigger('keydown', { key: 'a', ctrlKey: true });
    expect((wrapper.emitted('update:sourceSelected')?.at(-1)?.[0] as unknown[]).length).toBe(7);
  });

  it('nie zaznacza ani nie przenosi zablokowanego elementu', async () => {
    const wrapper = createTransfer({ value: [] });
    await wrapper.get('[data-key="system"]').trigger('click');
    expect(wrapper.emitted('update:sourceSelected')).toBeUndefined();
    await wrapper.get('[data-testid="transfer-move-all-target"]').trigger('click');
    expect(wrapper.emitted('update:value')?.at(-1)?.[0]).not.toContain('system');
  });

  it('wiąże błąd z root i listami oraz pokazuje loading tylko w wybranym panelu', () => {
    const wrapper = createTransfer({ error: 'Nie udało się zapisać', loading: { source: true } });
    const error = wrapper.get('[data-testid="transfer-error"]');

    expect(wrapper.attributes('aria-invalid')).toBe('true');
    expect(wrapper.attributes('aria-describedby')?.split(' ')).toContain(error.attributes('id'));
    expect(
      wrapper.get('[data-testid="transfer-source-listbox"]').attributes('aria-describedby'),
    ).toBe(error.attributes('id'));
    expect(wrapper.find('[data-testid="transfer-source-loading"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="transfer-target-loading"]').exists()).toBe(false);
  });

  it('wspiera nagłówki, item i empty przez sloty bez utraty semantyki', () => {
    const wrapper = mount(TransferList, {
      attachTo: document.body,
      props: { items: [], value: [] },
      slots: {
        'source-header': '<span>Źródło niestandardowe</span>',
        'target-header': '<span>Cel niestandardowy</span>',
        'source-empty': '<p>Brak po lewej</p>',
      },
    });
    mounted.push(wrapper);

    expect(wrapper.get('[role="listbox"]').element).toHaveAccessibleName('Źródło niestandardowe');
    expect(wrapper.text()).toContain('Brak po lewej');
  });
});
