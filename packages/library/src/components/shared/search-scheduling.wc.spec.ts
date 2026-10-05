import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import SearchInput from '../data-entry/SearchInput/index.wc';
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
});
it('cancels a pending query when debounce configuration changes', async () => {
  const element = new SearchInput();
  Object.assign(element, { debounceTime: 200 });
  document.body.append(element);
  await nextTick();
  const onSearch = vi.fn();
  element.addEventListener('on:search', onSearch);
  const input = element.querySelector('input')!;
  input.value = 'abc';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await nextTick();
  Object.assign(element, { debounceTime: 500 });
  await nextTick();
  await vi.advanceTimersByTimeAsync(600);
  expect(onSearch).not.toHaveBeenCalled();
  element.remove();
  await nextTick();
});
