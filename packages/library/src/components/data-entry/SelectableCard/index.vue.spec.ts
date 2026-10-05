import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'uikit',
}));

import SelectableCard from './index.vue';

describe('SelectableCard (index.vue)', () => {
  it('renders root as button type="button"', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'Card' },
    });

    const button = wrapper.get('button');
    expect(button.attributes('type')).toBe('button');
  });

  it('uses aria-label prop when no visible title/description is rendered', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'My card' },
    });

    expect(wrapper.get('button').attributes('aria-label')).toBe('My card');
  });

  it('uses attrs aria-label when prop and visible title/description are missing', () => {
    const wrapper = mount(SelectableCard, {
      attrs: { 'aria-label': 'Attrs card' },
    });

    const button = wrapper.get('button');

    expect(button.attributes('aria-label')).toBe('Attrs card');
    expect(button.attributes('aria-labelledby')).toBeUndefined();
  });

  it('uses attrs aria-labelledby when prop and visible title/description are missing', () => {
    const wrapper = mount(SelectableCard, {
      attrs: { 'aria-labelledby': 'external-title' },
    });

    const button = wrapper.get('button');

    expect(button.attributes('aria-labelledby')).toBe('external-title');
    expect(button.attributes('aria-label')).toBeUndefined();
  });

  it('falls back to generic accessible name when no visible content and no explicit aria attrs exist', () => {
    const wrapper = mount(SelectableCard);

    const button = wrapper.get('button');

    expect(button.attributes('aria-label')).toBe('Karta wyboru');
    expect(button.attributes('aria-labelledby')).toBeUndefined();
  });

  it('prefers aria-labelledby from visible title/description even when ariaLabel is provided', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'My card' },
      slots: { title: 'Title', description: 'Description' },
    });

    const button = wrapper.get('button');
    const labelledBy = button.attributes('aria-labelledby');

    expect(button.attributes('aria-label')).toBeUndefined();
    expect(labelledBy).toBeTruthy();
    expect(labelledBy!.split(' ')).toHaveLength(2);
  });

  it('sets disabled attribute and disabled modifier class', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'Card', disabled: true },
    });

    const button = wrapper.get('button');
    const className = button.attributes('class') ?? '';

    expect((button.element as HTMLButtonElement).disabled).toBe(true);
    expect(className).toContain('uikit-selectable-card');
    expect(className).toContain('uikit-selectable-card--is-disabled');
  });

  it('sets readonly semantics and readonly modifier class without disabling button', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'Card', readonly: true },
    });

    const button = wrapper.get('button');
    const className = button.attributes('class') ?? '';

    expect(button.attributes('aria-readonly')).toBeUndefined();
    expect(button.attributes('readonly')).toBeUndefined();
    expect(button.attributes('aria-disabled')).toBe('true');
    expect((button.element as HTMLButtonElement).disabled).toBe(false);
    expect(className).toContain('uikit-selectable-card--is-readonly');
  });

  it('adds active modifier class when active=true', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'Card', active: true },
    });

    const className = wrapper.get('button').attributes('class') ?? '';
    expect(className).toContain('uikit-selectable-card--is-active');
  });

  it('sets data-testid on button', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'Card', dataTestId: 'card-1' },
    });

    expect(wrapper.get('button').attributes('data-testid')).toBe('card-1');
  });

  it('renders title slot in strong and sets title data-testid', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'Card', dataTestId: 'card-1' },
      slots: {
        title: 'Title',
      },
    });

    const title = wrapper.get('[data-testid="card-1-title"]');
    expect(title.element.tagName.toLowerCase()).toBe('strong');
    expect(title.text()).toContain('Title');
  });

  it('renders description slot in p and sets description data-testid', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'Card', dataTestId: 'card-1' },
      slots: {
        description: 'Description',
      },
    });

    const description = wrapper.get('[data-testid="card-1-description"]');
    expect(description.element.tagName.toLowerCase()).toBe('p');
    expect(description.text()).toBe('Description');
  });

  it('does not render strong when title slot is missing', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'Card' },
    });

    expect(wrapper.find('strong').exists()).toBe(false);
  });

  it('does not render p when description slot is missing', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'Card' },
    });

    expect(wrapper.find('p').exists()).toBe(false);
  });

  it('does not expose aria-labelledby when title and description are missing', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'Card' },
    });

    expect(wrapper.get('button').attributes('aria-labelledby')).toBeUndefined();
  });

  it('uses one aria-labelledby token when only title exists and ariaLabel is empty', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: '' },
      slots: { title: 'Title' },
    });

    const labelledBy = wrapper.get('button').attributes('aria-labelledby');
    expect(labelledBy).toBeTruthy();

    const tokens = labelledBy!.split(' ');
    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toMatch(/^uikit-selectable-card-title-/);
  });

  it('uses two aria-labelledby tokens when title and description exist and ariaLabel is empty', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: '' },
      slots: { title: 'Title', description: 'Description' },
    });

    const labelledBy = wrapper.get('button').attributes('aria-labelledby');
    expect(labelledBy).toBeTruthy();

    const tokens = labelledBy!.split(' ');
    expect(tokens).toHaveLength(2);
    expect(tokens[0]).toMatch(/^uikit-selectable-card-title-/);
    expect(tokens[1]).toMatch(/^uikit-selectable-card-description-/);
  });

  it('renders additional slot', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'Card' },
      slots: {
        additional: '<span data-testid="extra">EXTRA</span>',
      },
    });

    expect(wrapper.get('[data-testid="extra"]').text()).toBe('EXTRA');
  });

  it('opens tooltip only from the hint trigger, not from the whole card', async () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'Card' },
      slots: {
        hint: 'Hint',
      },
    });

    const button = wrapper.get('button');
    const hint = wrapper.get('.uikit-info-tooltip');

    expect(button.find('.uikit-info-tooltip').exists()).toBe(false);

    await button.trigger('mouseenter');
    expect(hint.attributes('data-open')).toBeUndefined();

    await button.trigger('focusin');
    expect(hint.attributes('data-open')).toBeUndefined();

    await hint.trigger('mouseenter');
    expect(hint.attributes('data-open')).toBe('true');

    await hint.trigger('mouseleave');
    await vi.waitFor(() => expect(hint.attributes('data-open')).toBeUndefined());

    await hint.trigger('focusin');
    expect(hint.attributes('data-open')).toBe('true');
  });

  it('forwards attrs to button', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'Card' },
      attrs: {
        id: 'my-btn',
        'data-foo': 'bar',
        tabindex: '0',
      },
    });

    const button = wrapper.get('button');
    expect(button.attributes('id')).toBe('my-btn');
    expect(button.attributes('data-foo')).toBe('bar');
    expect(button.attributes('tabindex')).toBe('0');
  });

  it('ariaLabel prop overrides aria-label from attrs when no visible title/description exists', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'PROP' },
      attrs: { 'aria-label': 'ATTRS' },
    });

    expect(wrapper.get('button').attributes('aria-label')).toBe('PROP');
  });

  it('ignores aria-label from prop and attrs when visible title/description exists', () => {
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'PROP' },
      attrs: { 'aria-label': 'ATTRS' },
      slots: { title: 'Title', description: 'Description' },
    });

    const button = wrapper.get('button');

    expect(button.attributes('aria-label')).toBeUndefined();
    expect(button.attributes('aria-labelledby')).toBeTruthy();
  });

  it('does not call click handler from attrs when readonly=true', async () => {
    const onClick = vi.fn();
    const wrapper = mount(SelectableCard, {
      props: { ariaLabel: 'Card', readonly: true },
      attrs: { onClick },
    });

    await wrapper.get('button').trigger('click');

    expect(onClick).not.toHaveBeenCalled();
  });
});
