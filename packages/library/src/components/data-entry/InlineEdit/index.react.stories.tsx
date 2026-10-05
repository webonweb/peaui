/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import InlineEdit from './index';
import { inlineEditDemoProps, inlineEditOptions } from './inline-edit.demo';

const meta = {
  title: 'React/data-entry/InlineEdit',
  component: InlineEdit,
  args: inlineEditDemoProps,
  argTypes: {
    actions: { control: 'select', options: ['buttons', 'keyboard', 'both'] },
    activation: { control: 'select', options: ['button', 'click', 'dblclick'] },
    display: { control: 'select', options: ['inline', 'block'] },
    editor: { control: 'select', options: ['text', 'number', 'select', 'textarea', 'custom'] },
    saveMode: { control: 'select', options: ['sync', 'async'] },
    tabBehavior: { control: 'select', options: ['commit', 'cancel', 'stay'] },
  },
  parameters: {
    layout: 'padded',
    description: 'Natywny React z zachowaniem, klasami, ARIA i wymiarami 1:1 względem Vue.',
  },
} satisfies Meta<typeof InlineEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Text: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <InlineEdit {...args} value={value} onValueChange={setValue} />;
  },
};
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
    validate: (value) => (String(value).trim().length >= 3 ? true : 'Wpisz co najmniej 3 znaki.'),
  },
};
export const AsyncSave: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    return (
      <InlineEdit
        {...args}
        editing={editing}
        loading={loading}
        saveMode="async"
        value={value}
        onEditingChange={setEditing}
        onSave={({ value: next }) => {
          setLoading(true);
          window.setTimeout(() => {
            setValue(next);
            setLoading(false);
            setEditing(false);
          }, 800);
        }}
      />
    );
  },
};
export const Empty: Story = { args: { value: '' } };
export const Readonly: Story = { args: { readonly: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DoubleClickWithVisibleButton: Story = { args: { activation: 'dblclick' } };
export const NarrowContainer: Story = {
  args: { display: 'block', value: 'Długa nazwa projektu w responsywnym kontenerze' },
  render: (args) => (
    <div style={{ inlineSize: '14rem', maxInlineSize: '100%' }}>
      <InlineEdit {...args} />
    </div>
  ),
};
export const CustomEditor: Story = {
  args: { editor: 'custom', value: 'PL-2026' },
  render: (args) => (
    <InlineEdit
      {...args}
      renderEditor={({ draft, updateDraft }) => (
        <input
          aria-label="Kod projektu"
          data-inline-edit-control=""
          value={String(draft)}
          onChange={(event) => updateDraft(event.target.value)}
        />
      )}
    />
  ),
};
