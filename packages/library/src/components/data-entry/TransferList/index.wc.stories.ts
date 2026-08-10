import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import TransferListVueComponent from './index.vue';
import { defineTransferList, TransferListElement } from './index.wc';
import {
  transferListDemoValue,
  transferListItems,
  transferListLongItems,
} from './transfer-list.demo';

defineTransferList();

function renderTransfer(args: VueCustomElementStoryArgs): HTMLElement {
  const element = document.createElement(TransferListElement.tagName) as HTMLElement &
    Record<string, unknown>;
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }
  return element;
}

const meta = {
  title: '3. Data Entry/TransferList WC',
  component: TransferListElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(TransferListVueComponent),
    dataTestId: 'transfer-list-default',
    items: transferListItems,
    value: [...transferListDemoValue],
  },
  argTypes: {
    ...createVueCustomElementArgTypes(TransferListVueComponent),
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    size: { control: 'select', options: ['compact', 'standard'] },
    sort: { control: 'select', options: [false, 'asc', 'desc'] },
  },
  parameters: {
    name: 'TransferList',
    description: 'Light-DOM WC o kontrakcie i wyglądzie 1:1 z Vue oraz React.',
    code: `<script type="module">import '@peaui/ui/wc/data-entry/TransferList';</script>\n<peaui-transfer-list></peaui-transfer-list>`,
  },
  render: renderTransfer,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const SearchAndSort: Story = { args: { sort: 'asc' } };
export const Compact: Story = { args: { size: 'compact' } };
export const DisabledItems: Story = { args: { disabledKeys: ['billing', 'exports'] } };
export const Empty: Story = { args: { items: [], value: [] } };
export const LoadingPerPanel: Story = { args: { loading: { source: true } } };
export const Error: Story = { args: { error: 'Nie udało się zapisać przypisania.' } };
export const ObjectsAndLongLabels: Story = { args: { items: transferListLongItems } };
export const VerticalMobile: Story = {
  args: { orientation: 'vertical' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.dataset.transferListNarrow = '';
    Object.assign(wrapper.style, { inlineSize: '18rem', maxInlineSize: '100%' });
    wrapper.append(renderTransfer(args));
    return wrapper;
  },
};
