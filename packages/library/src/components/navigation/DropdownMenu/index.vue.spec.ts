import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { dropdownMenuDemoItems } from './dropdown-menu.demo';
import DropdownMenu from './index.vue';
import type { DropdownMenuItem } from './index.vue';

const keyboardItems: DropdownMenuItem[] = [
  { id: 'disabled', label: 'Niedostępna', disabled: true },
  { id: 'alpha', label: 'Alfa' },
  { id: 'separator', type: 'separator' },
  { id: 'beta', label: 'Beta' },
  { id: 'gamma', label: 'Gamma' },
];

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
};

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('DropdownMenu Vue', () => {
  it('wiąże trigger i powierzchnię poprawnym kontraktem ARIA', async () => {
    const wrapper = mount(DropdownMenu, {
      attachTo: document.body,
      props: { ariaLabel: 'Akcje rekordu', dataTestId: 'actions', items: dropdownMenuDemoItems },
    });
    const trigger = wrapper.get<HTMLButtonElement>('button.peaui-dropdown-menu__trigger');

    expect(trigger.attributes('aria-haspopup')).toBe('menu');
    expect(trigger.attributes('aria-expanded')).toBe('false');
    await trigger.trigger('click');
    await flush();

    const menu = wrapper.get('[role="menu"]');
    expect(trigger.attributes('aria-expanded')).toBe('true');
    expect(trigger.attributes('aria-controls')).toBe(menu.attributes('id'));
    expect(menu.attributes('aria-label')).toBe('Akcje rekordu');
    expect(menu.attributes('data-testid')).toBe('actions-menu');
    expect(wrapper.findAll('[role="menuitemcheckbox"]')).toHaveLength(1);
    expect(wrapper.findAll('[role="menuitemradio"]')).toHaveLength(2);
    expect(wrapper.find('[role="group"]').attributes('aria-labelledby')).toBeTruthy();
  });

  it('otwiera skrajną dostępną pozycję i nawiguje bez disabled oraz separatorów', async () => {
    const wrapper = mount(DropdownMenu, {
      attachTo: document.body,
      props: { items: keyboardItems },
    });
    const trigger = wrapper.get<HTMLButtonElement>('.peaui-dropdown-menu__trigger');

    await trigger.trigger('keydown', { key: 'ArrowDown' });
    await flush();
    expect(document.activeElement?.textContent).toContain('Alfa');

    await wrapper.get('[data-menu-path="1"]').trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement?.textContent).toContain('Beta');
    await wrapper.get('[data-menu-path="3"]').trigger('keydown', { key: 'End' });
    expect(document.activeElement?.textContent).toContain('Gamma');

    await wrapper.get('[data-menu-path="4"]').trigger('keydown', { key: 'ArrowDown' });
    expect(document.activeElement?.textContent).toContain('Alfa');
  });

  it('obsługuje ArrowUp na triggerze i typeahead bez znaków diakrytycznych', async () => {
    const items: DropdownMenuItem[] = [
      { id: 'one', label: 'Alfa' },
      { id: 'two', label: 'Ścieżka' },
      { id: 'three', label: 'Żuraw' },
    ];
    const wrapper = mount(DropdownMenu, { attachTo: document.body, props: { items } });
    const trigger = wrapper.get('.peaui-dropdown-menu__trigger');

    await trigger.trigger('keydown', { key: 'ArrowUp' });
    await flush();
    expect(document.activeElement?.textContent).toContain('Żuraw');

    await wrapper.get('[data-menu-path="2"]').trigger('keydown', { key: 's' });
    expect(document.activeElement?.textContent).toContain('Ścieżka');
  });

  it('emituje wybór i zamyka zwykłą akcję z przywróceniem fokusu', async () => {
    const wrapper = mount(DropdownMenu, {
      attachTo: document.body,
      props: { items: keyboardItems },
    });
    const trigger = wrapper.get<HTMLButtonElement>('.peaui-dropdown-menu__trigger');
    await trigger.trigger('click');
    await flush();
    await wrapper.get('[data-menu-path="1"]').trigger('click');
    await flush();

    expect(wrapper.emitted('select')?.[0]).toEqual([keyboardItems[1], [1]]);
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false]);
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false]);
    expect(document.activeElement).toBe(trigger.element);
  });

  it('checkbox i radio emitują kontrolowane intencje i pozostają otwarte', async () => {
    const items: DropdownMenuItem[] = [
      { id: 'check', type: 'checkbox', label: 'Powiadomienia', checked: true },
      { id: 'radio', type: 'radio', label: 'Kompaktowy', value: 'compact' },
    ];
    const wrapper = mount(DropdownMenu, {
      attachTo: document.body,
      props: { items },
    });
    await wrapper.get('.peaui-dropdown-menu__trigger').trigger('click');
    await flush();
    await wrapper.get('[data-menu-path="0"]').trigger('click');
    await wrapper.get('[data-menu-path="1"]').trigger('click');

    expect(wrapper.emitted('checkedChange')).toEqual([
      [items[0], false, [0]],
      [items[1], true, [1]],
    ]);
    expect(wrapper.emitted('valueChange')).toEqual([[items[1], 'compact', [1]]]);
    expect(wrapper.get('[role="menu"]').isVisible()).toBe(true);
  });

  it('otwiera podmenu klawiaturą, zamyka jego poziom ArrowLeft i całość Escape', async () => {
    const items: DropdownMenuItem[] = [
      {
        id: 'share',
        type: 'submenu',
        label: 'Udostępnij',
        children: [
          { id: 'link', label: 'Kopiuj link' },
          { id: 'mail', label: 'E-mail' },
        ],
      },
    ];
    const onEscape = vi.fn();
    const wrapper = mount(DropdownMenu, {
      attachTo: document.body,
      props: { items, onEscape },
    });
    const trigger = wrapper.get<HTMLButtonElement>('.peaui-dropdown-menu__trigger');
    await trigger.trigger('click');
    await flush();
    const parent = wrapper.get('[data-menu-path="0"]');
    await parent.trigger('keydown', { key: 'ArrowRight' });
    await flush();

    expect(parent.attributes('aria-expanded')).toBe('true');
    expect(document.activeElement?.textContent).toContain('Kopiuj link');
    await wrapper.get('[data-menu-path="0-0"]').trigger('keydown', { key: 'ArrowLeft' });
    expect(parent.attributes('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(parent.element);
    await parent.trigger('keydown', { key: 'Escape' });
    await flush();
    expect(onEscape).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(trigger.element);
  });

  it('zamyka się po pointerdown poza komponentem bez pułapki fokusu', async () => {
    const onOutsideClick = vi.fn();
    const wrapper = mount(DropdownMenu, {
      attachTo: document.body,
      props: { items: keyboardItems, onOutsideClick },
    });
    await wrapper.get('.peaui-dropdown-menu__trigger').trigger('click');
    await flush();
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    outside.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flush();

    expect(onOutsideClick).toHaveBeenCalledOnce();
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false]);
    expect(document.activeElement).toBe(outside);
  });

  it('przekazuje ARIA do interaktywnego triggera ze slotu i respektuje disabled', async () => {
    const wrapper = mount(DropdownMenu, {
      attachTo: document.body,
      props: { disabled: true, items: keyboardItems },
      slots: { trigger: '<button type="button">Więcej</button>' },
    });
    await flush();
    const trigger = wrapper.get<HTMLButtonElement>('.peaui-dropdown-menu__trigger-host button');

    expect(trigger.attributes('aria-haspopup')).toBe('menu');
    expect(trigger.attributes('aria-expanded')).toBe('false');
    expect(trigger.element.disabled).toBe(true);
    await trigger.trigger('click');
    expect(wrapper.get('[role="menu"]').isVisible()).toBe(false);
  });

  it('zachowuje poprawne dzieci menu w stanach empty i loading', async () => {
    const wrapper = mount(DropdownMenu, {
      props: { items: [], open: true },
    });

    const emptyItem = wrapper.get('[role="menuitem"]');
    expect(emptyItem.attributes('aria-disabled')).toBe('true');
    expect(emptyItem.text()).toContain('Brak dostępnych akcji');

    await wrapper.setProps({ loading: true });
    const loadingItem = wrapper.get('[role="menuitem"]');
    expect(loadingItem.attributes('aria-live')).toBe('polite');
    expect(loadingItem.text()).toContain('Ładowanie menu');
  });
});
