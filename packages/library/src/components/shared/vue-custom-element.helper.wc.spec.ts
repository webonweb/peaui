import { defineComponent, h, nextTick } from 'vue';
import { afterEach, expect, it, vi } from 'vitest';
import {
  createVueCustomElement,
  definePeauiCustomElement,
} from '@/helpers/vue-custom-element.helper';

afterEach(() => document.body.replaceChildren());
const Component = defineComponent({
  emits: ['select'],
  setup(_, { emit }) {
    return () => h('button', { onClick: () => emit('select', 'item') }, 'Select');
  },
});
const Element = createVueCustomElement(Component, 'peaui-event-contract-test');
definePeauiCustomElement(Element);

it('preserves consumer CustomEvent identity, detail, propagation flags and cancellation', () => {
  const element = new Element();
  const event = new CustomEvent('consumer-event', { detail: ['value'], cancelable: true });
  const listener = vi.fn((received: Event) => received.preventDefault());
  element.addEventListener('consumer-event', listener);
  expect(element.dispatchEvent(event)).toBe(false);
  expect(listener).toHaveBeenCalledWith(event);
  expect(event.detail).toEqual(['value']);
  expect(event.defaultPrevented).toBe(true);
  expect(event.bubbles).toBe(false);
  expect(event.composed).toBe(false);
});

it('normalizes only declared component events for the public WC contract', async () => {
  const element = new Element();
  document.body.append(element);
  await nextTick();
  const listener = vi.fn();
  element.addEventListener('select', listener);
  element.querySelector('button')?.click();
  const event = listener.mock.calls[0]![0]! as CustomEvent;
  expect(event.detail).toBe('item');
  expect(event.bubbles).toBe(true);
  expect(event.composed).toBe(true);
});

it('does not mistake an unchanged automatic model write for a consumer override', async () => {
  const ModelComponent = defineComponent({
    props: { value: Boolean },
    emits: ['update:value'],
    setup(props, { emit }) {
      return () =>
        h(
          'button',
          {
            onClick: () => {
              emit('update:value', true);
              emit('update:value', false);
            },
          },
          String(props.value),
        );
    },
  });
  const ModelElement = createVueCustomElement<{ value: boolean }>(
    ModelComponent,
    'peaui-consecutive-model-test',
  );
  definePeauiCustomElement(ModelElement);
  const element = new ModelElement();
  element.value = true;
  document.body.append(element);
  await nextTick();
  element.querySelector('button')!.click();
  await nextTick();
  await nextTick();
  expect(element.value).toBe(false);
  expect(element.querySelector('button')!.textContent).toBe('false');
});
