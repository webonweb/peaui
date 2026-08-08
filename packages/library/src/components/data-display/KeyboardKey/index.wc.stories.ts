import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import { keyboardKeyDemoProps } from './keyboard-key.demo';
import KeyboardKeyVueComponent from './index.vue';
import { defineKeyboardKey, KeyboardKeyElement } from './index.wc';

defineKeyboardKey();

function renderKeyboardKey(args: VueCustomElementStoryArgs): KeyboardKeyElement {
  const element = document.createElement(KeyboardKeyElement.tagName) as KeyboardKeyElement &
    Record<string, unknown>;
  Object.entries(args).forEach(([name, value]) => {
    if (value !== undefined) element[name] = value;
  });
  return element;
}

const meta = {
  title: '4. Data Display/KeyboardKey WC',
  component: KeyboardKeyElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(KeyboardKeyVueComponent),
    ...keyboardKeyDemoProps,
  },
  argTypes: {
    ...createVueCustomElementArgTypes(KeyboardKeyVueComponent),
    format: { control: 'select', options: ['symbol', 'text'] },
    platform: { control: 'select', options: ['auto', 'windows', 'mac', 'linux', 'generic'] },
    size: { control: 'select', options: ['xs', 's', 'm'] },
  },
  parameters: {
    name: 'KeyboardKey',
    description: 'Light-DOM WC o semantyce, mapowaniu, SSR i wyglądzie 1:1 z Vue i React.',
    code: `<script type="module">import '@peaui/ui/wc/data-display/KeyboardKey'; import '@peaui/ui/styles.css';</script>\n<peaui-keyboard-key keys="Mod + K"></peaui-keyboard-key>`,
  },
  render: renderKeyboardKey,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const SingleKey: Story = { args: { keys: 'Escape' } };
export const TextFormat: Story = { args: { format: 'text', keys: ['Mod', 'Enter'] } };
export const Block: Story = { args: { inline: false } };
export const Muted: Story = { args: { muted: true } };
export const CustomAccessibleLabel: Story = {
  args: { ariaLabel: 'Otwórz globalne wyszukiwanie', keys: ['Mod', 'K'] },
};
export const PlatformMatrix: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, { display: 'grid', gap: '.75rem' });
    for (const platform of ['windows', 'mac', 'linux', 'generic'] as const) {
      const row = document.createElement('div');
      Object.assign(row.style, { alignItems: 'center', display: 'flex', gap: '.75rem' });
      const label = document.createElement('span');
      label.textContent = platform;
      label.style.inlineSize = '5rem';
      row.append(label, renderKeyboardKey({ keys: ['Mod', 'Shift', 'K'], platform }));
      wrapper.append(row);
    }
    return wrapper;
  },
};
export const InlineSentence: Story = {
  args: { keys: ['Mod', 'S'], platform: 'mac', size: 'xs' },
  render: (args) => {
    const paragraph = document.createElement('p');
    paragraph.append(
      'Aby zapisać dokument, naciśnij ',
      renderKeyboardKey(args),
      ' przed zamknięciem okna.',
    );
    return paragraph;
  },
};
export const LongNames: Story = {
  args: { format: 'text', keys: ['Control', 'PrintScreen', 'PageDown'], platform: 'windows' },
};
export const NarrowContainer: Story = {
  args: { format: 'text', keys: ['Control', 'Shift', 'PrintScreen'], platform: 'windows' },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.dataset.keyboardKeyNarrow = '';
    wrapper.style.inlineSize = '10rem';
    wrapper.style.maxInlineSize = '100%';
    wrapper.append(renderKeyboardKey(args));
    return wrapper;
  },
};
export const CustomSlots: Story = {
  args: { keys: 'Escape' },
  render: (args) => {
    const element = renderKeyboardKey(args);
    const key = document.createElement('strong');
    key.slot = 'key';
    key.textContent = 'ESC';
    element.append(key);
    return element;
  },
};
