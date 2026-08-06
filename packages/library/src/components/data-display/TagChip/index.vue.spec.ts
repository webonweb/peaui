// index.spec.ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TagChip from './index.vue';

describe('TagChip (index.vue)', () => {
  it('renders a button with label', () => {
    const wrapper = mount(TagChip, {
      props: {
        label: 'Hello',
      },
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe('button');
    expect(wrapper.text()).toBe('Hello');
  });

  it('does not expose aria-pressed for non-interactive button usage by default', () => {
    const wrapper = mount(TagChip, {
      props: {
        label: 'Hello',
        active: true,
      },
    });

    expect(wrapper.attributes('aria-pressed')).toBeUndefined();
  });

  it("renders a span when as='span' is provided", () => {
    const wrapper = mount(TagChip, {
      props: {
        label: 'Hello',
        as: 'span',
      },
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe('span');
    expect(wrapper.text()).toBe('Hello');
    expect(wrapper.attributes('aria-pressed')).toBeUndefined();
  });

  it('applies default size xs and variant outline when not provided', () => {
    const wrapper = mount(TagChip, {
      props: {
        label: 'Tag',
      },
    });

    const cls = wrapper.attributes('class') ?? '';
    expect(cls).toMatch(/-tag-chip\b/);
    expect(cls).toMatch(/--size-xs\b/);
    expect(cls).toMatch(/--variant-outline\b/);
    expect(cls).not.toMatch(/-active\b/);
  });

  it('applies provided size and variant', () => {
    const wrapper = mount(TagChip, {
      props: {
        label: 'Tag',
        size: 's',
        variant: 'green',
      },
    });

    const cls = wrapper.attributes('class') ?? '';
    expect(cls).toMatch(/--size-s\b/);
    expect(cls).toMatch(/--variant-green\b/);
  });

  it('adds -active suffix when active=true', () => {
    const wrapper = mount(TagChip, {
      props: {
        label: 'Active',
        active: true,
      },
    });

    const cls = wrapper.attributes('class') ?? '';
    expect(cls).toMatch(/-active\b/);
  });

  it('sets aria-pressed for interactive button usage when active prop is provided', () => {
    const wrapper = mount(TagChip, {
      props: {
        label: 'Filter',
        active: true,
      },
      attrs: {
        onClick: () => undefined,
      },
    });

    expect(wrapper.attributes('aria-pressed')).toBe('true');
  });

  it('sets aria-pressed=false for interactive inactive button usage', () => {
    const wrapper = mount(TagChip, {
      props: {
        label: 'Filter',
        active: false,
      },
      attrs: {
        onClick: () => undefined,
      },
    });

    expect(wrapper.attributes('aria-pressed')).toBe('false');
  });

  it('preserves explicit aria-pressed passed by consumer', () => {
    const wrapper = mount(TagChip, {
      props: {
        label: 'Filter',
        active: false,
      },
      attrs: {
        'aria-pressed': 'mixed',
      },
    });

    expect(wrapper.attributes('aria-pressed')).toBe('mixed');
  });

  it('does not add -active suffix when active=false', () => {
    const wrapper = mount(TagChip, {
      props: {
        label: 'Inactive',
        active: false,
      },
    });

    const cls = wrapper.attributes('class') ?? '';
    expect(cls).not.toMatch(/-active\b/);
  });

  it('sets data-testid when provided', () => {
    const wrapper = mount(TagChip, {
      props: {
        label: 'Tag',
        dataTestId: 'tag-chip',
      },
    });

    expect(wrapper.attributes('data-testid')).toBe('tag-chip');
  });

  it('does not set data-testid when not provided', () => {
    const wrapper = mount(TagChip, {
      props: {
        label: 'Tag',
      },
    });

    expect(wrapper.attributes('data-testid')).toBeUndefined();
  });
});
