import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import ScrollAreaVueComponent from './index.ce.vue';
import { defineScrollArea, ScrollAreaElement } from './index.wc';
import { scrollAreaDemoItems } from './scroll-area.demo';

defineScrollArea();

function renderArea(
  args: VueCustomElementStoryArgs,
  mode: 'cards' | 'horizontal' | 'both' | 'short' = 'cards',
): HTMLElement {
  const element = document.createElement(ScrollAreaElement.tagName) as ScrollAreaElement &
    Record<string, unknown>;
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }
  Object.assign(element.style, {
    blockSize: mode === 'short' ? '12rem' : '18rem',
    maxInlineSize: '40rem',
  });
  if (mode === 'both') {
    element.innerHTML =
      '<div style="inline-size:54rem;block-size:36rem;padding:1rem">Duża powierzchnia w obu osiach</div>';
  } else if (mode === 'short') {
    element.innerHTML = '<p style="padding:1rem">Krótka treść bez przepełnienia.</p>';
  } else {
    const items = mode === 'horizontal' ? scrollAreaDemoItems.slice(0, 6) : scrollAreaDemoItems;
    const style =
      mode === 'horizontal'
        ? 'display:flex;inline-size:max-content;gap:.75rem;padding:.75rem'
        : 'display:grid;gap:.625rem;padding:.75rem';
    element.innerHTML = `<div style="${style}">${items.map((item) => `<article id="${item.id}" style="${mode === 'horizontal' ? 'inline-size:14rem;' : ''}padding:.875rem;border:1px solid #dfe5eb;border-radius:.625rem"><strong>${item.title}</strong><p>${item.description}</p></article>`).join('')}</div>`;
  }
  return element;
}

const meta = {
  title: '6. Layout/ScrollArea WC',
  component: ScrollAreaElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(ScrollAreaVueComponent),
    ariaLabel: 'Sekcje raportu',
    orientation: 'vertical',
    scrollbarVisibility: 'auto',
    tabindex: 0,
    type: 'styled',
  },
  argTypes: {
    ...createVueCustomElementArgTypes(ScrollAreaVueComponent),
    type: { control: 'select', options: ['native', 'styled'] },
    orientation: { control: 'select', options: ['vertical', 'horizontal', 'both'] },
    scrollbarVisibility: { control: 'select', options: ['auto', 'always', 'hover'] },
  },
  parameters: {
    name: 'ScrollArea',
    description:
      'Light-DOM Web Component korzystający z tej samej implementacji, ARIA i geometrii co Vue.',
    code: `<script type="module">import '@peaui/ui/wc/layout/ScrollArea';</script>
<peaui-scroll-area aria-label="Sekcje raportu" tabindex="0"></peaui-scroll-area>`,
  },
  render: (args: VueCustomElementStoryArgs) => renderArea(args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Vertical: Story = {};
export const Native: Story = { args: { type: 'native' } };
export const AlwaysVisible: Story = { args: { scrollbarVisibility: 'always' } };
export const HoverVisible: Story = { args: { scrollbarVisibility: 'hover' } };
export const NoOverflow: Story = { render: (args) => renderArea(args, 'short') };
export const Horizontal: Story = {
  args: { orientation: 'horizontal', scrollbarVisibility: 'always' },
  render: (args) => renderArea(args, 'horizontal'),
};
export const BothAxes: Story = {
  args: { orientation: 'both', scrollbarVisibility: 'always' },
  render: (args) => renderArea(args, 'both'),
};
export const RTL: Story = {
  args: { orientation: 'horizontal', scrollbarVisibility: 'always' },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.dir = 'rtl';
    wrapper.append(renderArea(args, 'horizontal'));
    return wrapper;
  },
};
export const DynamicAndNarrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.style.inlineSize = '14rem';
    wrapper.append(renderArea(args));
    return wrapper;
  },
};
export const Nested: Story = {
  render: (args) => {
    const outer = renderArea(args);
    const inner = renderArea(
      {
        ...args,
        ariaLabel: 'Wewnętrzny obszar',
        orientation: 'horizontal',
        scrollbarVisibility: 'always',
      },
      'horizontal',
    );
    inner.style.blockSize = '9rem';
    outer.append(inner);
    return outer;
  },
};
