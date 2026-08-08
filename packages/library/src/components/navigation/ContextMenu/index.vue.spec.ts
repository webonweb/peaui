import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { contextMenuDemoItems } from './context-menu.demo';
import ContextMenu from './index.vue';
import type { ContextMenuHandle } from './index.vue';

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
};

function pointerEvent(
  type: string,
  values: Partial<PointerEvent> & { clientX: number; clientY: number },
): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    button: { value: values.button ?? 0 },
    clientX: { value: values.clientX },
    clientY: { value: values.clientY },
    isPrimary: { value: values.isPrimary ?? true },
    pointerId: { value: values.pointerId ?? 1 },
    pointerType: { value: values.pointerType ?? 'touch' },
  });
  return event;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('ContextMenu Vue', () => {
  it('otwiera się przy współrzędnych contextmenu i anuluje natywne menu dopiero po aktywacji', async () => {
    const wrapper = mount(ContextMenu, {
      attachTo: document.body,
      props: { ariaLabel: 'Akcje rekordu', context: { id: 7 }, items: contextMenuDemoItems },
      slots: { default: '<button type="button">Raport kwartalny</button>' },
    });
    const target = wrapper.get<HTMLButtonElement>('.peaui-context-menu__target button');
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 120,
      clientY: 90,
    });
    target.element.dispatchEvent(event);
    await flush();

    const menu = wrapper.get('[role="menu"]');
    expect(event.defaultPrevented).toBe(true);
    expect(menu.isVisible()).toBe(true);
    expect(menu.attributes('aria-label')).toBe('Akcje rekordu');
    expect(target.attributes('aria-haspopup')).toBe('menu');
    expect(target.attributes('aria-expanded')).toBe('true');
    expect(target.attributes('aria-controls')).toBe(menu.attributes('id'));
    expect(wrapper.emitted('open')?.[0]?.[0]).toMatchObject({ source: 'pointer', x: 120, y: 90 });
  });

  it('nie przechwytuje natywnego menu, gdy komponent jest disabled lub ma trigger keyboard', () => {
    const wrapper = mount(ContextMenu, {
      attachTo: document.body,
      props: { disabled: true, items: contextMenuDemoItems },
    });
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    wrapper.get('.peaui-context-menu__target').element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(wrapper.get('[role="menu"]').isVisible()).toBe(false);
  });

  it('obsługuje Shift+F10, nawigację menu i przywraca fokus po Escape', async () => {
    const wrapper = mount(ContextMenu, {
      attachTo: document.body,
      props: { items: contextMenuDemoItems },
      slots: { default: '<button type="button">Dokument</button>' },
    });
    const target = wrapper.get<HTMLButtonElement>('.peaui-context-menu__target button');
    target.element.focus();
    await target.trigger('keydown', { key: 'F10', shiftKey: true });
    await flush();

    expect(wrapper.get('[role="menu"]').isVisible()).toBe(true);
    expect(document.activeElement?.textContent).toContain('Edytuj profil');
    await wrapper.get('[data-menu-path="0"]').trigger('keydown', { key: 'Escape' });
    await flush();
    expect(wrapper.get('[role="menu"]').isVisible()).toBe(false);
    expect(target.element).toHaveFocus();
  });

  it('nadaje semantykę przycisku fallbackowi i pozwala otworzyć menu klawiszem Enter', async () => {
    const wrapper = mount(ContextMenu, {
      attachTo: document.body,
      props: { items: contextMenuDemoItems },
    });
    const target = wrapper.get<HTMLElement>('.peaui-context-menu__target');
    await flush();

    expect(target.attributes('role')).toBe('button');
    expect(target.attributes('aria-expanded')).toBe('false');
    target.element.focus();
    await target.trigger('keydown', { key: 'Enter' });
    await flush();

    expect(wrapper.get('[role="menu"]').isVisible()).toBe(true);
    expect(target.attributes('aria-expanded')).toBe('true');
  });

  it('przekazuje kontekst w akcjach i zastępuje go przez openAt', async () => {
    const wrapper = mount(ContextMenu, {
      attachTo: document.body,
      props: { context: { id: 'first' }, items: contextMenuDemoItems },
    });
    const handle = wrapper.vm as unknown as ContextMenuHandle;
    expect(handle.openAt({ context: { id: 'second' }, x: 40, y: 60 })).toBe(true);
    await flush();
    await wrapper.get('[data-menu-path="0"]').trigger('click');
    await flush();

    expect(wrapper.emitted('contextChange')?.[0]).toEqual([{ id: 'second' }]);
    expect(wrapper.emitted('select')?.[0]?.[2]).toEqual({ id: 'second' });
    expect(wrapper.emitted('close')?.at(-1)).toEqual(['select']);
  });

  it('otwiera się po long press, ale ruch dotykowy anuluje timer bez blokowania scrolla', async () => {
    vi.useFakeTimers();
    const wrapper = mount(ContextMenu, {
      attachTo: document.body,
      props: { items: contextMenuDemoItems, longPressDelay: 400, longPressMoveThreshold: 8 },
    });
    const target = wrapper.get('.peaui-context-menu__target');
    target.element.dispatchEvent(pointerEvent('pointerdown', { clientX: 20, clientY: 30 }));
    target.element.dispatchEvent(pointerEvent('pointermove', { clientX: 40, clientY: 30 }));
    vi.advanceTimersByTime(450);
    await Promise.resolve();
    expect(wrapper.get('[role="menu"]').isVisible()).toBe(false);
    expect(wrapper.emitted('longPressCancel')?.at(-1)).toEqual(['move']);

    target.element.dispatchEvent(
      pointerEvent('pointerdown', { clientX: 50, clientY: 70, pointerId: 2 }),
    );
    vi.advanceTimersByTime(400);
    await Promise.resolve();
    expect(wrapper.get('[role="menu"]').isVisible()).toBe(true);
    expect(wrapper.emitted('open')?.at(-1)?.[0]).toMatchObject({ source: 'long-press' });
  });

  it('zamyka się na scroll oraz po usunięciu aktywnego celu', async () => {
    const wrapper = mount(ContextMenu, {
      attachTo: document.body,
      props: { items: contextMenuDemoItems },
      slots: { default: '<button type="button">Element</button>' },
    });
    const target = wrapper.get('.peaui-context-menu__target button');
    target.element.dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 10, clientY: 10 }),
    );
    await flush();
    window.dispatchEvent(new Event('scroll'));
    await flush();
    expect(wrapper.emitted('close')?.at(-1)).toEqual(['scroll']);

    target.element.dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 10, clientY: 10 }),
    );
    await flush();
    target.element.remove();
    await flush();
    expect(wrapper.emitted('close')?.at(-1)).toEqual(['target-removed']);
  });
});
