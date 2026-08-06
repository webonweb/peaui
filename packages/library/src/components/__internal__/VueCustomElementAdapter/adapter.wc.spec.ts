import { defineComponent, h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

const TEST_TAG = 'peaui-test-vue-adapter';
const TestComponent = defineComponent({
  props: {
    count: { type: Number, default: 0 },
    disabled: Boolean,
  },
  setup(props) {
    return () =>
      h(
        'button',
        {
          disabled: props.disabled,
        },
        String(props.count),
      );
  },
});
const TestElement = createVueCustomElement(TestComponent, TEST_TAG);

const SLOT_TEST_TAG = 'peaui-test-vue-adapter-slot';
const SlotTestComponent = defineComponent({
  props: { count: { type: Number, default: 0 } },
  emits: ['on:change'],
  setup(props, { emit }) {
    return () =>
      h('button', { onClick: () => emit('on:change', props.count) }, h('slot', 'Treść zapasowa'));
  },
});
const SlotTestElement = createVueCustomElement(SlotTestComponent, SLOT_TEST_TAG);

definePeauiCustomElement(TestElement);
definePeauiCustomElement(SlotTestElement);

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Vue Custom Element adapter', () => {
  it('maps attributes and properties to the original Vue props', async () => {
    const element = document.createElement(TEST_TAG) as HTMLElement & {
      count: number;
      disabled: boolean;
    };
    element.count = 3;
    element.disabled = true;
    document.body.appendChild(element);
    await nextTick();

    expect(element.querySelector('button')).toBeDisabled();
    expect(element).toHaveTextContent('3');

    element.count = 8;
    await nextTick();

    expect(element).toHaveTextContent('8');
  });

  it('preserves light-DOM slots and component events', async () => {
    const element = document.createElement(SLOT_TEST_TAG) as HTMLElement & { count: number };
    const listener = vi.fn();
    element.count = 4;
    element.append('Treść slotu');
    element.addEventListener('on:change', listener);
    document.body.appendChild(element);
    await nextTick();

    element.querySelector('button')?.click();

    expect(element).toHaveTextContent('Treść slotu');
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]?.[0] as CustomEvent<number>).detail).toBe(4);
  });
});
