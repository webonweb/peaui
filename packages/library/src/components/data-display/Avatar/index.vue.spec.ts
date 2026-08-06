import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import Avatar from './index.vue';

const global = {
  stubs: {
    SvgIcon: {
      props: ['name', 'dataTestId'],
      template: '<svg aria-hidden="true" :data-icon-name="name" :data-testid="dataTestId"></svg>',
    },
  },
};

function mountAvatar(
  options: Parameters<typeof mount<typeof Avatar>>[1] = {},
): VueWrapper<InstanceType<typeof Avatar>> {
  return mount(Avatar, {
    ...options,
    global: {
      ...global,
      ...options.global,
      stubs: { ...global.stubs, ...options.global?.stubs },
    },
  });
}

describe('Avatar (index.vue)', () => {
  it('renders stable initials fallback without adding a tab stop', () => {
    const wrapper = mountAvatar({ props: { name: 'Anna Maria Kowalska' } });
    const root = wrapper.get('.peaui-avatar');

    expect(root.element.tagName).toBe('SPAN');
    expect(root.attributes('role')).toBe('img');
    expect(root.attributes('aria-label')).toBe('Anna Maria Kowalska');
    expect(root.attributes('tabindex')).toBeUndefined();
    expect(root.attributes('data-state')).toBe('idle');
    expect(wrapper.get('.peaui-avatar__initials').text()).toBe('AK');
  });

  it('prefers normalized explicit initials and caps their length', () => {
    const wrapper = mountAvatar({ props: { initials: ' a k z x ', name: 'Ignored Name' } });

    expect(wrapper.get('.peaui-avatar__initials').text()).toBe('AKZ');
  });

  it('uses the icon fallback when initials cannot be created', () => {
    const wrapper = mountAvatar({ props: { fallbackIcon: 'users', dataTestId: 'avatar' } });

    expect(wrapper.get('[data-testid="avatar-icon"]').element).toHaveAttribute(
      'data-icon-name',
      'users',
    );
    expect(wrapper.get('.peaui-avatar').attributes('aria-label')).toBe('Awatar użytkownika');
  });

  it('keeps the fallback visible while loading and reveals a meaningful image after load', async () => {
    const wrapper = mountAvatar({
      props: {
        alt: 'Portret Anny Kowalskiej',
        dataTestId: 'avatar',
        name: 'Anna Kowalska',
        src: '/anna.jpg',
      },
    });
    const root = wrapper.get('.peaui-avatar');
    const image = wrapper.get('img');

    expect(root.attributes('data-state')).toBe('loading');
    expect(wrapper.find('[data-testid="avatar-fallback"]').exists()).toBe(true);
    expect(image.attributes('alt')).toBe('');

    await image.trigger('load');

    expect(root.attributes('data-state')).toBe('loaded');
    expect(root.attributes('role')).toBeUndefined();
    expect(wrapper.find('[data-testid="avatar-fallback"]').exists()).toBe(false);
    expect(image.attributes('alt')).toBe('Portret Anny Kowalskiej');
    expect(image.classes()).toContain('peaui-avatar__image--visible');
    expect(wrapper.emitted('load')).toHaveLength(1);
  });

  it('falls back after an image error and resets when src changes', async () => {
    const wrapper = mountAvatar({
      props: { name: 'Anna Kowalska', src: '/broken.jpg' },
    });

    await wrapper.get('img').trigger('error');

    expect(wrapper.get('.peaui-avatar').attributes('data-state')).toBe('error');
    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.get('.peaui-avatar__initials').text()).toBe('AK');
    expect(wrapper.emitted('error')).toHaveLength(1);

    await wrapper.setProps({ src: '/replacement.jpg' });

    expect(wrapper.get('.peaui-avatar').attributes('data-state')).toBe('loading');
    expect(wrapper.get('img').attributes('src')).toBe('/replacement.jpg');
  });

  it('preserves explicitly decorative image semantics', async () => {
    const wrapper = mountAvatar({ props: { alt: '', src: '/decoration.jpg' } });
    const image = wrapper.get('img');

    await image.trigger('load');

    expect(wrapper.get('.peaui-avatar').attributes('role')).toBeUndefined();
    expect(wrapper.get('.peaui-avatar').attributes('aria-label')).toBeUndefined();
    expect(image.attributes('alt')).toBe('');
    expect(image.attributes('aria-hidden')).toBe('true');
    expect(image.attributes('role')).toBe('presentation');
  });

  it('uses the root as the accessible image when alt is omitted', async () => {
    const wrapper = mountAvatar({ props: { name: 'Anna Kowalska', src: '/anna.jpg' } });

    await wrapper.get('img').trigger('load');

    expect(wrapper.get('.peaui-avatar').attributes('role')).toBe('img');
    expect(wrapper.get('.peaui-avatar').attributes('aria-label')).toBe('Anna Kowalska');
    expect(wrapper.get('img').attributes('aria-hidden')).toBe('true');
  });

  it('renders a semantic button only in interactive mode', async () => {
    const onClick = vi.fn();
    const wrapper = mountAvatar({
      props: { ariaLabel: 'Otwórz profil Anny', interactive: true },
      attrs: { onClick },
    });
    const button = wrapper.get('button');

    expect(button.attributes('type')).toBe('button');
    expect(button.attributes('aria-label')).toBe('Otwórz profil Anny');
    expect(button.attributes('tabindex')).toBeUndefined();

    await button.trigger('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not expose click behavior on a presentational avatar', async () => {
    const onClick = vi.fn();
    const wrapper = mountAvatar({ props: { name: 'Anna Kowalska' }, attrs: { onClick } });

    await wrapper.get('.peaui-avatar').trigger('click');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('uses native disabled semantics for an interactive avatar', async () => {
    const onClick = vi.fn();
    const wrapper = mountAvatar({
      props: { disabled: true, interactive: true, name: 'Anna Kowalska' },
      attrs: { onClick },
    });
    const button = wrapper.get('button');

    expect(button.attributes('disabled')).toBeDefined();
    expect(button.classes()).toContain('peaui-avatar--disabled');

    await button.trigger('click');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('exposes status text without using a live region', () => {
    const wrapper = mountAvatar({
      props: { name: 'Anna Kowalska', status: 'online', statusLabel: 'Dostępna teraz' },
    });
    const root = wrapper.get('.peaui-avatar');
    const statusLabel = wrapper.get('.peaui-avatar__status-label');

    expect(statusLabel.text()).toBe('Dostępna teraz');
    expect(statusLabel.attributes('aria-live')).toBeUndefined();
    expect(root.attributes('aria-describedby')?.split(' ')).toContain(statusLabel.attributes('id'));
    expect(wrapper.get('.peaui-avatar__status').attributes('aria-hidden')).toBe('true');
  });

  it('supports custom fallback and status content', () => {
    const wrapper = mountAvatar({
      props: { name: 'Anna Kowalska', status: 'busy' },
      slots: {
        default: '<span data-testid="custom-fallback">A</span>',
        status: '<span data-testid="custom-status">!</span>',
      },
    });

    expect(wrapper.get('[data-testid="custom-fallback"]').text()).toBe('A');
    expect(wrapper.get('[data-testid="custom-status"]').text()).toBe('!');
  });

  it('applies size, shape, loading strategy and test id contract', () => {
    const wrapper = mountAvatar({
      props: {
        alt: 'Portret',
        dataTestId: 'profile-avatar',
        loading: 'eager',
        shape: 'rounded',
        size: 'xl',
        src: '/profile.jpg',
      },
    });
    const root = wrapper.get('[data-testid="profile-avatar"]');

    expect(root.classes()).toContain('peaui-avatar--size-xl');
    expect(root.classes()).toContain('peaui-avatar--shape-rounded');
    expect(wrapper.get('[data-testid="profile-avatar-image"]').attributes('loading')).toBe('eager');
  });
});
