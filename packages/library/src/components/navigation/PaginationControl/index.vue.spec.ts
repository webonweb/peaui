import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

import Component from './index.vue';

vi.mock('@/constants', () => ({ UIKIT_NAME: 'uikit' }));
vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props, { attrs }) {
    return () => h('svg', { ...attrs, 'data-icon-name': props.name });
  },
});

function factory(props?: Partial<InstanceType<typeof Component>['$props']>) {
  return mount(Component, {
    props: {
      ariaLabel: 'Nawigacja stron',
      totalPages: 10,
      page: 1,
      dataTestId: 'pagination-control',
      ...props,
    } as never,
    global: {
      stubs: {
        SvgIcon: SvgIconStub,
      },
    },
  });
}

describe('PaginationControl (index.vue)', () => {
  it('renders root navigation semantics and data test ids', () => {
    const wrapper = factory();

    expect(wrapper.get('nav').classes()).toContain('uikit-pagination-control');
    expect(wrapper.get('nav').attributes('aria-label')).toBe('Nawigacja stron');
    expect(wrapper.get('nav').attributes('data-testid')).toBe('pagination-control');
    expect(
      wrapper.get('[data-testid="pagination-control-button-first-page"]').attributes('type'),
    ).toBe('button');
    expect(
      wrapper.get('[data-testid="pagination-control-button-next-page"]').attributes('type'),
    ).toBe('button');
  });

  it('disables edge controls on first and last page', () => {
    const firstPageWrapper = factory({ page: 1, totalPages: 10 });
    expect(
      firstPageWrapper
        .get('[data-testid="pagination-control-button-first-page"]')
        .attributes('disabled'),
    ).toBeDefined();
    expect(
      firstPageWrapper
        .get('[data-testid="pagination-control-button-previous-page"]')
        .attributes('aria-disabled'),
    ).toBe('true');

    const lastPageWrapper = factory({ page: 10, totalPages: 10 });
    expect(
      lastPageWrapper
        .get('[data-testid="pagination-control-button-next-page"]')
        .attributes('disabled'),
    ).toBeDefined();
    expect(
      lastPageWrapper
        .get('[data-testid="pagination-control-button-last-page"]')
        .attributes('aria-disabled'),
    ).toBe('true');
  });

  it('marks active page and emits update:page for navigation actions', async () => {
    const wrapper = factory({ page: 3, totalPages: 10 });
    const currentPageButton = wrapper.get('[data-testid="pagination-control-button-3-page"]');

    expect(currentPageButton.attributes('aria-current')).toBe('page');
    expect(currentPageButton.attributes('aria-label')).toContain('Aktualna strona 3');
    expect(currentPageButton.attributes('aria-disabled')).toBe('true');
    expect(currentPageButton.attributes('disabled')).toBeDefined();

    await currentPageButton.trigger('click');
    await wrapper.get('[data-testid="pagination-control-button-next-page"]').trigger('click');
    await wrapper.get('[data-testid="pagination-control-button-5-page"]').trigger('click');
    await wrapper.get('[data-testid="pagination-control-button-last-page"]').trigger('click');

    expect(wrapper.emitted('update:page')).toEqual([[4], [5], [10]]);
  });

  it('renders leading and trailing ellipsis based on current position', () => {
    const earlyWrapper = factory({ page: 2, totalPages: 10 });
    expect(earlyWrapper.find('[data-testid="pagination-control-ellipsis-leading"]').exists()).toBe(
      false,
    );
    expect(earlyWrapper.find('[data-testid="pagination-control-ellipsis-trailing"]').exists()).toBe(
      true,
    );

    const lateWrapper = factory({ page: 8, totalPages: 10 });
    expect(lateWrapper.find('[data-testid="pagination-control-ellipsis-leading"]').exists()).toBe(
      true,
    );
    expect(lateWrapper.find('[data-testid="pagination-control-ellipsis-trailing"]').exists()).toBe(
      false,
    );
  });

  it('uses rounded arrow icons for all controls', () => {
    const wrapper = factory();
    const iconNames = wrapper
      .findAll('[data-icon-name]')
      .map((icon) => icon.attributes('data-icon-name'));

    expect(iconNames).toEqual([
      'doubleArrowRounded',
      'arrowRounded',
      'arrowRounded',
      'doubleArrowRounded',
    ]);
  });
});
