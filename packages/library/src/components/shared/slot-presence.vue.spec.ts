import { mount } from '@vue/test-utils';
import { h, nextTick, ref, type Component } from 'vue';
import { afterEach, expect, it, vi } from 'vitest';
import { computeAccessibleName } from 'dom-accessibility-api';
import FormCheckbox from '../form/FormCheckbox/index.vue';
import FormRadio from '../form/FormRadio/index.vue';
import FormButtonCheckbox from '../form/FormButtonCheckbox/index.vue';
import ModalDialog from '../overlayer/ModalDialog/index.vue';
import DrawerPanel from '../overlayer/DrawerPanel/index.vue';

const cleanups: (() => void)[] = [];
afterEach(() => {
  cleanups.splice(0).forEach((cleanup) => cleanup());
  document.body.replaceChildren();
});

for (const [name, component] of Object.entries({ FormCheckbox, FormRadio, FormButtonCheckbox })) {
  it(`${name} restores native checked state when a controlled change is rejected`, async () => {
    const onUpdate = vi.fn();
    const wrapper = mount(component as Component, {
      props: {
        id: 'choice',
        name: 'choice',
        value: true,
        optionValue: false,
        'onUpdate:value': onUpdate,
      },
    });
    cleanups.push(() => wrapper.unmount());
    const input = wrapper.get('input');
    const initialChecked = input.element.checked;
    input.element.checked = !initialChecked;
    await input.trigger('change');
    expect(onUpdate).toHaveBeenCalledWith(false);
    expect(input.element.checked).toBe(initialChecked);
  });

  it(`${name} updates its accessible label when a conditional slot changes`, async () => {
    const visible = ref(false);
    const wrapper = mount(
      {
        setup: () => () =>
          h(
            component as Component,
            { id: 'choice', name: 'choice', value: false, optionValue: true },
            visible.value ? { default: () => 'Accept terms' } : {},
          ),
      },
      { attachTo: document.body },
    );
    cleanups.push(() => wrapper.unmount());
    expect(computeAccessibleName(wrapper.get('input').element)).toBe('choice');
    visible.value = true;
    await nextTick();
    expect(computeAccessibleName(wrapper.get('input').element)).toBe('Accept terms');
    visible.value = false;
    await nextTick();
    expect(computeAccessibleName(wrapper.get('input').element)).toBe('choice');
  });
}

for (const [name, component] of Object.entries({ ModalDialog, DrawerPanel })) {
  it(`${name} updates its accessible name relationship when a conditional header changes`, async () => {
    const visible = ref(false);
    const wrapper = mount({
      setup: () => () =>
        h(
          component as Component,
          { open: false, ariaLabel: 'Fallback' },
          visible.value ? { header: () => 'Confirm changes' } : {},
        ),
    });
    cleanups.push(() => wrapper.unmount());
    visible.value = true;
    await nextTick();
    expect(wrapper.find('header').exists()).toBe(true);
    expect(wrapper.get('dialog').attributes('aria-labelledby')).toBe(
      wrapper.get('header').attributes('id'),
    );
    visible.value = false;
    await nextTick();
    expect(wrapper.find('header').exists()).toBe(false);
    expect(wrapper.get('dialog').attributes('aria-label')).toBe('Fallback');
  });
}
