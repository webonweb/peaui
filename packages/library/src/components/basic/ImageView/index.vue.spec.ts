import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

import ImageView from './index.vue';

describe('ImageView (index.vue)', () => {
  it('renders image with explicit alt text and default size class', () => {
    const wrapper = mount(ImageView, {
      props: {
        src: '/images/example-photo.png',
        alt: 'Przykladowe zdjecie',
        dataTestId: 'image-view',
      },
    });

    const root = wrapper.get('span');
    const image = wrapper.get('img');

    expect(root.classes()).toContain('peaui-image-view');
    expect(root.classes()).toContain('peaui-image-view--size-auto');
    expect(root.attributes('style')).toBeUndefined();
    expect(image.attributes('src')).toBe('/images/example-photo.png');
    expect(image.attributes('alt')).toBe('Przykladowe zdjecie');
    expect(image.attributes('data-testid')).toBe('image-view');
  });

  it('creates a fallback alt from the source name when alt is missing', () => {
    const wrapper = mount(ImageView, {
      props: {
        src: '/images/user-profile_photo.png?version=1',
      },
    });

    expect(wrapper.get('img').attributes('alt')).toBe('user profile photo');
  });

  it('keeps explicit empty alt as decorative and hides the image from assistive tech', () => {
    const wrapper = mount(ImageView, {
      props: {
        src: '/images/hero-banner.png',
        alt: '',
      },
    });

    const image = wrapper.get('img');

    expect(image.attributes('alt')).toBe('');
    expect(image.attributes('aria-hidden')).toBe('true');
    expect(image.attributes('role')).toBe('presentation');
  });

  it('forwards image attrs to img and keeps unrelated attrs on the wrapper', () => {
    const wrapper = mount(ImageView, {
      props: {
        src: '/images/example-photo.png',
        size: 'l',
      },
      attrs: {
        id: 'image-root',
        class: 'custom-image',
        loading: 'lazy',
        'aria-label': 'Hero image',
        'data-foo': 'bar',
      },
    });

    const root = wrapper.get('#image-root');
    const image = wrapper.get('img');

    expect(root.classes()).toContain('peaui-image-view');
    expect(root.classes()).toContain('peaui-image-view--size-l');
    expect(root.classes()).toContain('custom-image');
    expect(root.attributes('data-foo')).toBe('bar');
    expect(root.attributes('loading')).toBeUndefined();
    expect(image.attributes('loading')).toBe('lazy');
    expect(image.attributes('aria-label')).toBe('Hero image');
    expect(image.attributes('alt')).toBe('Hero image');
  });

  it('applies max-width from the max prop without dropping other inline styles', () => {
    const wrapper = mount(ImageView, {
      props: {
        src: '/images/example-photo.png',
        max: '20rem',
      },
      attrs: {
        style: 'padding: 1rem;',
      },
    });

    const root = wrapper.get('span');

    expect(root.attributes('style')).toContain('padding: 1rem;');
    expect(root.attributes('style')).toContain('max-width: 20rem;');
  });
});
