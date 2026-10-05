import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SearchInput from '../data-entry/SearchInput/index.vue';
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
});
it('cancels a pending query when debounce configuration changes', async () => {
  const view = mount(SearchInput, { props: { debounceTime: 200 } });
  const input = view.get('input');
  await input.setValue('abc');
  await view.setProps({ debounceTime: 500 });
  await vi.advanceTimersByTimeAsync(600);
  expect(view.emitted('on:search')).toBeUndefined();
  view.unmount();
});
