/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';

import { keyboardKeyDemoProps } from './keyboard-key.demo';
import KeyboardKey from './index';

const meta = {
  title: 'React/data-display/KeyboardKey',
  component: KeyboardKey,
  args: keyboardKeyDemoProps,
  argTypes: {
    format: { control: 'select', options: ['symbol', 'text'] },
    platform: { control: 'select', options: ['auto', 'windows', 'mac', 'linux', 'generic'] },
    size: { control: 'select', options: ['xs', 's', 'm'] },
  },
  parameters: {
    layout: 'padded',
    description: 'Natywny React o semantyce, mapowaniu, SSR i wyglądzie 1:1 z Vue.',
  },
} satisfies Meta<typeof KeyboardKey>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SingleKey: Story = { args: { keys: 'Escape' } };
export const TextFormat: Story = { args: { format: 'text', keys: ['Mod', 'Enter'] } };
export const Block: Story = { args: { inline: false } };
export const Muted: Story = { args: { muted: true } };
export const CustomAccessibleLabel: Story = {
  args: { ariaLabel: 'Otwórz globalne wyszukiwanie', keys: ['Mod', 'K'] },
};
export const PlatformMatrix: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '.75rem' }}>
      {(['windows', 'mac', 'linux', 'generic'] as const).map((platform) => (
        <div key={platform} style={{ alignItems: 'center', display: 'flex', gap: '.75rem' }}>
          <span style={{ inlineSize: '5rem' }}>{platform}</span>
          <KeyboardKey keys={['Mod', 'Shift', 'K']} platform={platform} />
        </div>
      ))}
    </div>
  ),
};
export const InlineSentence: Story = {
  args: { keys: ['Mod', 'S'], platform: 'mac', size: 'xs' },
  render: (args) => (
    <p>
      Aby zapisać dokument, naciśnij <KeyboardKey {...args} /> przed zamknięciem okna.
    </p>
  ),
};
export const LongNames: Story = {
  args: { format: 'text', keys: ['Control', 'PrintScreen', 'PageDown'], platform: 'windows' },
};
export const NarrowContainer: Story = {
  args: { format: 'text', keys: ['Control', 'Shift', 'PrintScreen'], platform: 'windows' },
  render: (args) => (
    <div data-keyboard-key-narrow style={{ inlineSize: '10rem', maxInlineSize: '100%' }}>
      <KeyboardKey {...args} />
    </div>
  ),
};
export const CustomSlots: Story = {
  args: { keys: ['Mod', 'K'], platform: 'mac' },
  render: (args) => (
    <KeyboardKey
      {...args}
      renderKey={({ visualLabel }) => <strong>{visualLabel}</strong>}
      renderSeparator={() => 'then'}
    />
  ),
};
