import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  props: {
    name: { type: String, required: true },
  },
  setup(props) {
    return () => h('span', { 'data-icon': props.name });
  },
});

const ButtonActionStub = defineComponent({
  name: 'ButtonAction',
  props: {
    ariaLabel: { type: String, required: true },
    disabled: { type: Boolean, required: false },
    dataTestId: { type: String, required: false },
  },
  emits: ['click'],
  setup(props, { slots, attrs, emit }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          'aria-label': props.ariaLabel,
          disabled: props.disabled,
          'data-testid': props.dataTestId,
          onClick: () => emit('click'),
        },
        slots.default?.(),
      );
  },
});

import SearchInput from './index.vue';

const mountComponent = (
  props: Record<string, unknown> = {},
  attrs: Record<string, unknown> = {},
) => {
  const wrapper: ReturnType<typeof mount<typeof SearchInput>> = mount(SearchInput, {
    props: {
      value: '',
      debounceTime: 300,
      dataTestId: 'search-input',
      'onUpdate:value': async (value: string | undefined) => {
        await wrapper.setProps({ value });
      },
      ...props,
    },
    attrs,
    global: {
      stubs: {
        ButtonAction: ButtonActionStub,
        SvgIcon: SvgIconStub,
      },
    },
  });

  return wrapper;
};

describe('SearchInput (index.vue)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders searchbox with fallback aria-label when label is not provided', () => {
    const wrapper = mountComponent({
      ariaLabel: 'Szukaj w dokumentach',
    });

    const root = wrapper.get('[data-testid="search-input"]');
    const input = wrapper.get('input');

    expect(root.attributes('role')).toBe('search');
    expect(root.attributes('aria-label')).toBe('Szukaj w dokumentach');
    expect(input.attributes('type')).toBe('search');
    expect(input.attributes('role')).toBe('searchbox');
    expect(input.attributes('aria-label')).toBe('Szukaj w dokumentach');
    expect(input.attributes('placeholder')).toBe('Wpisz czego szukasz');
    expect(input.attributes('data-testid')).toBe('search-input-element');
  });

  it('uses unique field id, default name and icon-only search button', () => {
    const wrapper = mountComponent();
    const button = wrapper.get('[data-testid="search-input-search-button"]');
    const field = wrapper.get('[data-testid="search-input-field"]');

    expect(wrapper.get('input').attributes('id')).toContain('peaui-search-input-');
    expect(wrapper.get('input').attributes('name')).toBe('search-input');
    expect(field.find('[data-icon="search"]').exists()).toBe(true);
    expect(button.attributes('aria-label')).toBe('Wyszukaj');
    expect(button.attributes('disabled')).toBeUndefined();
    expect(button.text()).toBe('');
    expect(button.find('[data-icon="search"]').exists()).toBe(true);
  });

  it('preserves explicit id and name attrs passed to the input', () => {
    const wrapper = mountComponent({}, { id: 'custom-search-id', name: 'filters.search' });

    expect(wrapper.get('input').attributes('id')).toBe('custom-search-id');
    expect(wrapper.get('input').attributes('name')).toBe('filters.search');
  });

  it('generates unique ids for multiple component instances', () => {
    const HostComponent = defineComponent({
      components: { SearchInput },
      template: `
        <div>
          <SearchInput dataTestId="search-input-first" />
          <SearchInput dataTestId="search-input-second" />
        </div>
      `,
    });

    const wrapper = mount(HostComponent, {
      global: {
        stubs: {
          ButtonAction: ButtonActionStub,
          SvgIcon: SvgIconStub,
        },
      },
    });

    expect(wrapper.get('[data-testid="search-input-first-element"]').attributes('id')).not.toBe(
      wrapper.get('[data-testid="search-input-second-element"]').attributes('id'),
    );
  });

  it('emits debounced search only after typing at least three characters and updates model value', async () => {
    const wrapper = mountComponent();
    const input = wrapper.get('input');

    await input.setValue('ra');

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['ra']);
    expect(wrapper.emitted('on:search')).toBeUndefined();

    vi.runAllTimers();

    expect(wrapper.emitted('on:search')).toBeUndefined();

    await input.setValue('rap');

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['rap']);
    expect(wrapper.emitted('on:search')).toBeUndefined();

    vi.advanceTimersByTime(299);

    expect(wrapper.emitted('on:search')).toBeUndefined();

    vi.advanceTimersByTime(1);

    expect(wrapper.emitted('on:search')?.at(-1)).toEqual(['rap']);
  });

  it('cancels pending debounced search when input shrinks below three characters', async () => {
    const wrapper = mountComponent();
    const input = wrapper.get('input');

    await input.setValue('raport');
    await input.setValue('ra');

    vi.runAllTimers();

    expect(wrapper.emitted('on:search')).toBeUndefined();
  });

  it('runs immediate search on Enter and cancels stale debounced duplicate', async () => {
    const wrapper = mountComponent();
    const input = wrapper.get('input');

    await input.setValue('certyfikat');
    await input.trigger('keydown', { key: 'Enter' });

    expect(wrapper.emitted('on:search')?.at(-1)).toEqual(['certyfikat']);

    vi.runAllTimers();

    expect(wrapper.emitted('on:search')).toHaveLength(1);
  });

  it('does not run immediate search below three characters when clicking search button', async () => {
    const wrapper = mountComponent({
      value: 'ab',
    });

    const button = wrapper.get('[data-testid="search-input-search-button"]');

    expect(button.attributes('disabled')).toBeUndefined();

    await button.trigger('click');

    expect(wrapper.emitted('on:search')).toBeUndefined();
  });

  it('runs immediate search when clicking search button', async () => {
    const wrapper = mountComponent({
      value: 'inspekcja',
    });

    const button = wrapper.get('[data-testid="search-input-search-button"]');

    expect(button.attributes('disabled')).toBeUndefined();

    await button.trigger('click');

    expect(wrapper.emitted('on:search')?.at(-1)).toEqual(['inspekcja']);
  });

  it('does not run immediate search on Enter below three characters', async () => {
    const wrapper = mountComponent();
    const input = wrapper.get('input');

    await input.setValue('ab');
    await input.trigger('keydown', { key: 'Enter' });

    expect(wrapper.emitted('on:search')).toBeUndefined();
  });

  it('clears value and emits remove plus empty search when erase is used', async () => {
    const wrapper = mountComponent({
      value: 'archiwum',
    });

    await wrapper.get('[data-testid="search-input-field-erase-button"]').trigger('click');

    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['']);
    expect(wrapper.emitted('on:remove')).toEqual([[]]);
    expect(wrapper.emitted('on:search')?.at(-1)).toEqual(['']);
  });

  it('does not bind custom keyup.enter to the native erase button', async () => {
    const wrapper = mountComponent({
      value: 'archiwum',
    });

    await wrapper.get('[data-testid="search-input-field-erase-button"]').trigger('keyup', {
      key: 'Enter',
    });

    expect(wrapper.emitted('on:remove')).toBeUndefined();
    expect(wrapper.emitted('on:search')).toBeUndefined();
  });

  it('does not render helper messages below the control', () => {
    const wrapper = mountComponent({
      value: 'fraza',
    });

    expect(wrapper.find('.peaui-search-input__message').exists()).toBe(false);
    expect(wrapper.get('input').attributes('aria-describedby')).toBeUndefined();
    expect(wrapper.get('input').attributes('aria-invalid')).toBeUndefined();
  });

  it('shows erase button by default when value exists', () => {
    const wrapper = mountComponent({
      value: 'kontrola',
    });

    expect(wrapper.find('[data-testid="search-input-field-erase-button"]').exists()).toBe(true);
  });
});
