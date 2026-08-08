import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';

import { setLocale } from '../i18n';
import HomeComponentPreview from './HomeComponentPreview.vue';

describe('HomeComponentPreview', () => {
  beforeEach(() => setLocale('en', false));

  it('renders real labeled controls and responds to user input', async () => {
    const wrapper = mount(HomeComponentPreview);
    const nameInput = wrapper.get('input[type="text"]');
    const checkbox = wrapper.get('input[type="checkbox"]');
    const densityButtons = wrapper.findAll('.home-preview__density button');

    expect(nameInput.attributes('id')).toBe('home-preview-workspace');
    expect(wrapper.get('label[for="home-preview-workspace"]').text()).toContain('Workspace name');
    expect(checkbox.attributes('id')).toBe('home-preview-notifications');
    expect(densityButtons).toHaveLength(2);

    await nameInput.setValue('Accessibility team');
    await densityButtons[1]?.trigger('click');
    expect(densityButtons[1]?.attributes('aria-pressed')).toBe('true');

    await wrapper.get('form').trigger('submit');
    expect(wrapper.get('[role="status"]').text()).toContain('settings were updated locally');
  });

  it('renders the same interaction labels in Polish', () => {
    setLocale('pl', false);
    const wrapper = mount(HomeComponentPreview);

    expect(wrapper.text()).toContain('Ustawienia obszaru roboczego');
    expect(wrapper.text()).toContain('Wysyłaj informacje o przeglądzie dostępności');
    expect(wrapper.get('button[type="submit"]').text()).toContain('Zapisz ustawienia');
  });
});
