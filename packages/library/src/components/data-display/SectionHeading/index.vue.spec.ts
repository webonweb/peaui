// index.spec.ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SectionHeading from './index.vue';

describe('SectionHeading (index.vue)', () => {
  it('renders wrapper as div by default and applies base block class', () => {
    const wrapper = mount(SectionHeading, {
      slots: {
        title: 'Title',
      },
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe('div');
    expect(wrapper.attributes('class')).toMatch(/\b\S+-section-heading\b/);
  });

  it('renders wrapper as the `as` prop (section/header)', () => {
    const w1 = mount(SectionHeading, {
      props: { as: 'section' },
      slots: { title: 'Title' },
    });
    expect(w1.element.tagName.toLowerCase()).toBe('section');

    const w2 = mount(SectionHeading, {
      props: { as: 'header' },
      slots: { title: 'Title' },
    });
    expect(w2.element.tagName.toLowerCase()).toBe('header');
  });

  it('renders title as h3 for size=l (default) and adds --large modifier', () => {
    const wrapper = mount(SectionHeading, {
      slots: { title: 'Hello' },
    });

    const title = wrapper.find('h3');
    expect(title.exists()).toBe(true);

    const cls = title.attributes('class') ?? '';
    expect(cls).toMatch(/__title\b/);
    expect(cls).toMatch(/__title--large\b/);
    expect(cls).toMatch(/__title--variant-default\b/);
  });

  it('renders title as h4 for size=m and does not add --large modifier', () => {
    const wrapper = mount(SectionHeading, {
      props: { size: 'm' },
      slots: { title: 'Hello' },
    });

    const title = wrapper.find('h4');
    expect(title.exists()).toBe(true);

    const cls = title.attributes('class') ?? '';
    expect(cls).toMatch(/__title\b/);
    expect(cls).not.toMatch(/__title--large\b/);
  });

  it('renders title as strong for size=s and adds small modifier', () => {
    const wrapper = mount(SectionHeading, {
      props: { size: 's' },
      slots: { title: 'Hello' },
    });

    const title = wrapper.find('strong');
    expect(title.exists()).toBe(true);

    const cls = title.attributes('class') ?? '';
    expect(cls).toMatch(/__title\b/);
    expect(cls).toMatch(/__title--small\b/);
    expect(cls).not.toMatch(/__title--large\b/);
    expect(cls).not.toMatch(/__title--extra-large\b/);
    expect(cls).not.toMatch(/__title--heading-large\b/);
    expect(cls).toMatch(/__title--variant-default\b/);
  });

  it('renders title as h2 for size=heading-m and adds heading-medium modifiers', () => {
    const wrapper = mount(SectionHeading, {
      props: { size: 'heading-m' },
      slots: {
        title: 'Hello',
        description: 'Desc',
      },
    });

    const title = wrapper.find('h2');
    expect(title.exists()).toBe(true);

    const titleCls = title.attributes('class') ?? '';
    expect(titleCls).toMatch(/__title\b/);
    expect(titleCls).toMatch(/__title--heading-medium\b/);
    expect(titleCls).not.toMatch(/__title--heading-large\b/);
    expect(titleCls).not.toMatch(/__title--large\b/);
    expect(titleCls).not.toMatch(/__title--extra-large\b/);

    const desc = wrapper.get('p');
    const descCls = desc.attributes('class') ?? '';
    expect(descCls).toMatch(/__description\b/);
    expect(descCls).toMatch(/__description--large\b/);
    expect(descCls).not.toMatch(/__description--heading-medium\b/);
  });

  it('renders title as h2 for size=heading-s and adds heading-small modifiers', () => {
    const wrapper = mount(SectionHeading, {
      props: { size: 'heading-s' },
      slots: {
        title: 'Hello',
        description: 'Desc',
      },
    });

    const title = wrapper.find('h2');
    expect(title.exists()).toBe(true);

    const titleCls = title.attributes('class') ?? '';
    expect(titleCls).toMatch(/__title\b/);
    expect(titleCls).toMatch(/__title--heading-small\b/);
    expect(titleCls).not.toMatch(/__title--heading-large\b/);
    expect(titleCls).not.toMatch(/__title--heading-medium\b/);
    expect(titleCls).not.toMatch(/__title--large\b/);
    expect(titleCls).not.toMatch(/__title--extra-large\b/);

    const desc = wrapper.get('p');
    const descCls = desc.attributes('class') ?? '';
    expect(descCls).toMatch(/__description\b/);
    expect(descCls).toMatch(/__description--heading-small\b/);
    expect(descCls).not.toMatch(/__description--heading-medium\b/);
  });

  it('renders title as h2 for size=heading-xs and adds heading-extra-small modifiers', () => {
    const wrapper = mount(SectionHeading, {
      props: { size: 'heading-xs' },
      slots: {
        title: 'Hello',
        description: 'Desc',
      },
    });

    const title = wrapper.find('h2');
    expect(title.exists()).toBe(true);

    const titleCls = title.attributes('class') ?? '';
    expect(titleCls).toMatch(/__title\b/);
    expect(titleCls).toMatch(/__title--heading-extra-small\b/);
    expect(titleCls).not.toMatch(/__title--heading-large\b/);
    expect(titleCls).not.toMatch(/__title--heading-medium\b/);
    expect(titleCls).not.toMatch(/__title--heading-small\b/);
    expect(titleCls).not.toMatch(/__title--large\b/);
    expect(titleCls).not.toMatch(/__title--extra-large\b/);

    const desc = wrapper.get('p');
    const descCls = desc.attributes('class') ?? '';
    expect(descCls).toMatch(/__description\b/);
    expect(descCls).toMatch(/__description--heading-extra-small\b/);
    expect(descCls).not.toMatch(/__description--heading-medium\b/);
  });

  it('renders title as h1 for size=heading-l and adds heading-large modifiers', () => {
    const wrapper = mount(SectionHeading, {
      props: { size: 'heading-l' },
      slots: {
        title: 'Hello',
        description: 'Desc',
      },
    });

    const title = wrapper.find('h1');
    expect(title.exists()).toBe(true);

    const titleCls = title.attributes('class') ?? '';
    expect(titleCls).toMatch(/__title\b/);
    expect(titleCls).toMatch(/__title--heading-large\b/);
    expect(titleCls).not.toMatch(/__title--heading-medium\b/);
    expect(titleCls).not.toMatch(/__title--large\b/);
    expect(titleCls).not.toMatch(/__title--extra-large\b/);

    const desc = wrapper.get('p');
    const descCls = desc.attributes('class') ?? '';
    expect(descCls).toMatch(/__description\b/);
    expect(descCls).toMatch(/__description--heading-large\b/);
  });

  it('renders title as h2 for size=xl and adds extra-large modifiers', () => {
    const wrapper = mount(SectionHeading, {
      props: { size: 'xl' },
      slots: {
        title: 'Hello',
        description: 'Desc',
      },
    });

    const title = wrapper.find('h2');
    expect(title.exists()).toBe(true);

    const titleCls = title.attributes('class') ?? '';
    expect(titleCls).toMatch(/__title\b/);
    expect(titleCls).toMatch(/__title--extra-large\b/);
    expect(titleCls).not.toMatch(/__title--heading-medium\b/);
    expect(titleCls).not.toMatch(/__title--large\b/);

    const desc = wrapper.get('p');
    const descCls = desc.attributes('class') ?? '';
    expect(descCls).toMatch(/__description\b/);
    expect(descCls).toMatch(/__description--extra-large\b/);
    expect(descCls).not.toMatch(/__description--heading-medium\b/);
    expect(descCls).not.toMatch(/__description--large\b/);
  });

  it('applies primary title variant class when variant=primary', () => {
    const wrapper = mount(SectionHeading, {
      props: { variant: 'primary' },
      slots: { title: 'Hello' },
    });

    const title = wrapper.get('h3');
    const cls = title.attributes('class') ?? '';

    expect(cls).toMatch(/__title--variant-primary\b/);
    expect(cls).not.toMatch(/__title--variant-default\b/);
  });

  it('applies secondary title variant class when variant=secondary', () => {
    const wrapper = mount(SectionHeading, {
      props: { variant: 'secondary' },
      slots: {
        title: 'Hello',
        description: 'Desc',
      },
    });

    const title = wrapper.get('h3');
    const cls = title.attributes('class') ?? '';

    expect(cls).toMatch(/__title--variant-secondary\b/);
    expect(cls).not.toMatch(/__title--variant-default\b/);

    const description = wrapper.get('p');
    const descriptionCls = description.attributes('class') ?? '';

    expect(descriptionCls).toMatch(/__description--variant-secondary\b/);
  });

  it('renders description only when description slot is provided', () => {
    const w1 = mount(SectionHeading, {
      slots: { title: 'Title' },
    });
    expect(w1.find('p').exists()).toBe(false);

    const w2 = mount(SectionHeading, {
      slots: {
        title: 'Title',
        description: 'Desc',
      },
    });
    const p = w2.find('p');
    expect(p.exists()).toBe(true);

    const cls = p.attributes('class') ?? '';
    expect(cls).toMatch(/__description\b/);
    expect(cls).toMatch(/__description--large\b/);
  });

  it('sets aria-labelledby on wrapper only when title slot exists, and points to title id', () => {
    const withTitle = mount(SectionHeading, {
      slots: { title: 'Title' },
    });

    const wrapperAria = withTitle.attributes('aria-labelledby');
    expect(wrapperAria).toBeTruthy();

    const title = withTitle.find('h3');
    const titleId = title.attributes('id');
    expect(titleId).toBeTruthy();
    expect(wrapperAria).toBe(titleId);

    const noTitle = mount(SectionHeading, {
      slots: { description: 'Desc only' },
    });
    expect(noTitle.attributes('aria-labelledby')).toBeUndefined();
  });

  it('applies data-testid on wrapper and generates -title and -description testids', () => {
    const wrapper = mount(SectionHeading, {
      props: { dataTestId: 'section-heading' },
      slots: {
        title: 'Title',
        description: 'Desc',
      },
    });

    expect(wrapper.attributes('data-testid')).toBe('section-heading');

    const title = wrapper.find('h3');
    expect(title.attributes('data-testid')).toBe('section-heading-title');

    const desc = wrapper.find('p');
    expect(desc.attributes('data-testid')).toBe('section-heading-description');
  });

  it('renders hint tooltip only when hint slot is provided and passes generated hint test id', () => {
    const withoutHint = mount(SectionHeading, {
      props: { dataTestId: 'section-heading' },
      slots: { title: 'Title' },
    });
    expect(withoutHint.find('[data-testid="section-heading-hint-content"]').exists()).toBe(false);

    const withHint = mount(SectionHeading, {
      props: { dataTestId: 'section-heading' },
      slots: {
        title: 'Title',
        hint: 'Helpful hint',
      },
    });

    expect(withHint.find('svg').exists()).toBe(true);
    expect(withHint.find('[data-testid="section-heading-hint-content"]').exists()).toBe(true);

    const tooltip = withHint.get('[data-testid="section-heading-hint-tooltip"]');
    expect(tooltip.attributes('class') ?? '').toMatch(/__content--placement-right\b/);
    expect(tooltip.text()).toContain('Helpful hint');
  });

  it('does not render title/description testids when dataTestId is not provided', () => {
    const wrapper = mount(SectionHeading, {
      slots: {
        title: 'Title',
        description: 'Desc',
      },
    });

    const title = wrapper.find('h3');
    expect(title.attributes('data-testid')).toBeUndefined();

    const desc = wrapper.find('p');
    expect(desc.attributes('data-testid')).toBeUndefined();

    expect(wrapper.attributes('data-testid')).toBeUndefined();
  });

  it('forwards attrs to wrapper (id, data-*, aria-*, class, style)', () => {
    const wrapper = mount(SectionHeading, {
      attrs: {
        id: 'my-wrapper',
        'data-qa': 'section-heading',
        'aria-label': 'Heading region',
        class: 'external-class',
        style: 'padding: 10px;',
      },
      slots: { title: 'Title' },
    });

    expect(wrapper.attributes('id')).toBe('my-wrapper');
    expect(wrapper.attributes('data-qa')).toBe('section-heading');
    expect(wrapper.attributes('aria-label')).toBe('Heading region');

    expect(wrapper.classes()).toContain('external-class');
    expect(wrapper.attributes('class')).toMatch(/-section-heading/);

    expect(wrapper.attributes('style') ?? '').toContain('padding: 10px');
  });

  it('renders nothing for title/description when slots are missing', () => {
    const wrapper = mount(SectionHeading);

    expect(wrapper.find('h1').exists()).toBe(false);
    expect(wrapper.find('h3').exists()).toBe(false);
    expect(wrapper.find('h4').exists()).toBe(false);
    expect(wrapper.find('p').exists()).toBe(false);
  });
});
