import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import InlineEditVueComponent from './index.ce.vue';
import { inlineEditDemoProps, inlineEditOptions } from './inline-edit.demo';
import { defineInlineEdit, InlineEditElement } from './index.wc';

defineInlineEdit();

function renderInlineEdit(args: VueCustomElementStoryArgs): InlineEditElement {
  const element = document.createElement(InlineEditElement.tagName) as InlineEditElement &
    Record<string, unknown>;
  Object.entries(args).forEach(([name, value]) => {
    if (value !== undefined) element[name] = value;
  });
  return element;
}

const meta = {
  title: '3. Data Entry/InlineEdit WC',
  component: InlineEditElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(InlineEditVueComponent),
    ...inlineEditDemoProps,
  },
  argTypes: {
    ...createVueCustomElementArgTypes(InlineEditVueComponent),
    actions: { control: 'select', options: ['buttons', 'keyboard', 'both'] },
    activation: { control: 'select', options: ['button', 'click', 'dblclick'] },
    display: { control: 'select', options: ['inline', 'block'] },
    editor: { control: 'select', options: ['text', 'number', 'select', 'textarea', 'custom'] },
    saveMode: { control: 'select', options: ['sync', 'async'] },
    tabBehavior: { control: 'select', options: ['commit', 'cancel', 'stay'] },
  },
  parameters: {
    name: 'InlineEdit',
    description: 'Light-DOM WC o zachowaniu, wyglądzie i relacjach ARIA 1:1 z Vue i React.',
    code: `<script type="module">import '@peaui/ui/wc/data-entry/InlineEdit'; import '@peaui/ui/styles.css';</script>\n<peaui-inline-edit value="Panel klienta"></peaui-inline-edit>`,
  },
  render: renderInlineEdit,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Text: Story = {};
export const NumberEditor: Story = { args: { editor: 'number', value: 12 } };
export const SelectEditor: Story = {
  args: {
    editor: 'select',
    editorProps: { options: inlineEditOptions, searchable: false },
    value: 'review',
  },
};
export const TextareaKeyboard: Story = {
  args: { actions: 'keyboard', editor: 'textarea', value: 'Opis projektu i jego zakres.' },
};
export const Validation: Story = {
  args: {
    validate: (value: unknown) =>
      String(value).trim().length >= 3 ? true : 'Wpisz co najmniej 3 znaki.',
  },
};
export const AsyncSave: Story = {
  args: { saveMode: 'async' },
  render: (args) => {
    const element = renderInlineEdit(args);
    element.addEventListener('save', (event) => {
      element.loading = true;
      const next = (event as CustomEvent<{ value: unknown }>).detail.value;
      window.setTimeout(() => {
        element.value = next;
        element.loading = false;
        element.editing = false;
      }, 800);
    });
    return element;
  },
};
export const Empty: Story = { args: { value: '' } };
export const Readonly: Story = { args: { readonly: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DoubleClickWithVisibleButton: Story = { args: { activation: 'dblclick' } };
export const NarrowContainer: Story = {
  args: { display: 'block', value: 'Długa nazwa projektu w responsywnym kontenerze' },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.style.inlineSize = '14rem';
    wrapper.style.maxInlineSize = '100%';
    wrapper.append(renderInlineEdit(args));
    return wrapper;
  },
};
