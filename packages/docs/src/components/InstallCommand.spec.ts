import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setLocale } from '../i18n';
import { copyText } from '../utils/clipboard';
import InstallCommand from './InstallCommand.vue';

vi.mock('../utils/clipboard', () => ({ copyText: vi.fn() }));

const mockedCopyText = vi.mocked(copyText);

describe('InstallCommand', () => {
  beforeEach(() => {
    mockedCopyText.mockReset();
    setLocale('en', false);
  });

  it('announces a successful copy and resets its state', async () => {
    vi.useFakeTimers();
    mockedCopyText.mockResolvedValue('api');
    const wrapper = mount(InstallCommand);

    await wrapper.get('button').trigger('click');
    await flushPromises();

    expect(wrapper.get('[role="status"]').text()).toBe('Copied');
    expect(wrapper.get('button').text()).toContain('Copied');

    await vi.advanceTimersByTimeAsync(2200);
    expect(wrapper.get('[role="status"]').text()).toBe('');
    expect(wrapper.get('button').text()).toContain('Copy');
  });

  it('announces the successful copy in Polish', async () => {
    setLocale('pl', false);
    mockedCopyText.mockResolvedValue('fallback');
    const wrapper = mount(InstallCommand);

    await wrapper.get('button').trigger('click');
    await flushPromises();

    expect(wrapper.get('[role="status"]').text()).toBe('Skopiowano');
  });

  it('shows and announces a localized error', async () => {
    mockedCopyText.mockRejectedValue(new Error('unavailable'));
    const wrapper = mount(InstallCommand);

    await wrapper.get('button').trigger('click');
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toContain('could not be copied');
    expect(wrapper.get('[role="status"]').text()).toContain('could not be copied');
  });
});
