import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import VirtualListVueComponent from './index.vue';
import { defineVirtualList, VirtualListElement } from './index.wc';
import { virtualListDemoItems } from './virtual-list.demo';

defineVirtualList();

function renderVirtualList(args: VueCustomElementStoryArgs): VirtualListElement {
  const element = document.createElement(VirtualListElement.tagName) as VirtualListElement &
    Record<string, unknown>;
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }
  return element;
}

const meta = {
  title: '4. Data Display/VirtualList WC',
  component: VirtualListElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(VirtualListVueComponent),
    ariaLabel: 'Wyniki wyszukiwania',
    dataTestId: 'virtual-list-default',
    height: 320,
    items: virtualListDemoItems,
    itemSize: 64,
    overscan: 4,
  },
  argTypes: {
    ...createVueCustomElementArgTypes(VirtualListVueComponent),
    semanticRole: { control: 'select', options: ['list', 'listbox'] },
    height: { control: 'text' },
  },
  parameters: {
    name: 'VirtualList',
    description: 'Light-DOM WC o kontrakcie, wyglądzie, ARIA i wydajności 1:1 z Vue i React.',
    code: `<script type="module">import '@peaui/ui/wc/data-display/VirtualList'; import '@peaui/ui/styles.css';</script>\n<peaui-virtual-list></peaui-virtual-list>`,
  },
  render: renderVirtualList,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const LargeDataset: Story = {};
export const ListboxKeyboard: Story = {
  args: { activeIndex: 0, semanticRole: 'listbox' },
};
export const Empty: Story = { args: { items: [] } };
export const InitialLoading: Story = { args: { items: [], loading: true } };
export const LoadingMore: Story = { args: { hasMore: true, loading: true } };
export const Error: Story = { args: { error: 'Nie udało się pobrać kolejnej strony.' } };

export const Programmatic: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, { display: 'grid', gap: '0.75rem' });
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Przejdź do wyniku 7501';
    const list = renderVirtualList(args);
    button.addEventListener('click', () => list.scrollToIndex(7500, 'center'));
    wrapper.append(button, list);
    return wrapper;
  },
};

export const DynamicCollection: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, { display: 'grid', gap: '0.75rem' });
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Zmień liczbę elementów';
    const list = renderVirtualList({ ...args, items: virtualListDemoItems.slice(0, 100) });
    let count = 100;
    button.addEventListener('click', () => {
      count = count === 100 ? 250 : 100;
      list.items = virtualListDemoItems.slice(0, count);
    });
    wrapper.append(button, list);
    return wrapper;
  },
};

export const LongContentMobile: Story = {
  args: {
    height: 280,
    items: virtualListDemoItems.slice(0, 500).map((item) => ({
      ...item,
      label: `${item.label} — bardzo długa nazwa tolerująca wąski kontener i powiększony tekst`,
    })),
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.dataset.virtualListNarrow = '';
    Object.assign(wrapper.style, { inlineSize: '18rem', maxInlineSize: '100%' });
    wrapper.append(renderVirtualList(args));
    return wrapper;
  },
};
