import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';
import { ClipboardError } from '@/helpers/functions.helper';

import { copyButtonDemoProps } from './copy-button.demo';
import CopyButtonVueComponent from './index.ce.vue';
import { CopyButtonElement, defineCopyButton } from './index.wc';

defineCopyButton();

function renderCopyButton(args: VueCustomElementStoryArgs): CopyButtonElement {
  const element = document.createElement(CopyButtonElement.tagName) as CopyButtonElement &
    Record<string, unknown>;
  Object.entries(args).forEach(([name, value]) => {
    if (value !== undefined) element[name] = value;
  });
  return element;
}

const meta = {
  title: '3. Data Entry/CopyButton WC',
  component: CopyButtonElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(CopyButtonVueComponent),
    ...copyButtonDemoProps,
  },
  argTypes: {
    ...createVueCustomElementArgTypes(CopyButtonVueComponent),
    content: { control: 'select', options: ['icon', 'text', 'icon-text'] },
    size: { control: 'select', options: ['xxs', 'xs', 's', 'm', 'l'] },
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
  },
  parameters: {
    name: 'CopyButton',
    description: 'Light-DOM WC o zachowaniu, wyglądzie i komunikatach ARIA 1:1 z Vue i React.',
    code: `<script type="module">import '@peaui/ui/wc/data-entry/CopyButton'; import '@peaui/ui/styles.css';</script>\n<peaui-copy-button text="PEA-2026-022"></peaui-copy-button>`,
  },
  render: renderCopyButton,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const IconAndText: Story = {};
export const TextOnly: Story = { args: { content: 'text' } };
export const IconOnly: Story = {
  args: { ariaLabel: 'Kopiuj identyfikator', content: 'icon', showStatus: false },
};
export const Primary: Story = { args: { variant: 'primary' } };
export const VisibleStatus: Story = { args: { showStatus: true } };
export const ResetTimer: Story = { args: { resetDelay: 900 } };
export const AsyncText: Story = {
  args: {
    getText: () =>
      new Promise<string>((resolve) => window.setTimeout(() => resolve('ASYNC-PEA-022'), 700)),
  },
};
export const ResolverError: Story = {
  args: { getText: () => Promise.reject(new Error('Nie udało się pobrać treści.')) },
};
export const ClipboardUnavailable: Story = {
  args: { getText: () => Promise.reject(new ClipboardError('unavailable')) },
};
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const NarrowContainer: Story = {
  args: { label: 'Kopiuj bardzo długi identyfikator dokumentu', showStatus: true },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.style.inlineSize = '12rem';
    wrapper.style.maxInlineSize = '100%';
    wrapper.append(renderCopyButton(args));
    return wrapper;
  },
};
export const CustomSlots: Story = {
  render: (args) => {
    const element = renderCopyButton(args);
    const icon = document.createElement('span');
    icon.slot = 'icon';
    icon.textContent = '⧉';
    const copiedIcon = document.createElement('span');
    copiedIcon.slot = 'copied-icon';
    copiedIcon.textContent = '✓';
    element.append(icon, copiedIcon);
    return element;
  },
};
