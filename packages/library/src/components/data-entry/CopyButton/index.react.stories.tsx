/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';

import { ClipboardError } from '@/helpers/functions.helper';

import { copyButtonDemoProps } from './copy-button.demo';
import CopyButton from './index';

const meta = {
  title: 'React/data-entry/CopyButton',
  component: CopyButton,
  args: copyButtonDemoProps,
  argTypes: {
    content: { control: 'select', options: ['icon', 'text', 'icon-text'] },
    size: { control: 'select', options: ['xxs', 'xs', 's', 'm', 'l'] },
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
  },
  parameters: {
    layout: 'padded',
    description: 'Natywny React z zachowaniem, stylami i komunikatami ARIA 1:1 względem Vue.',
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
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
  render: (args) => (
    <div style={{ inlineSize: '12rem', maxInlineSize: '100%' }}>
      <CopyButton {...args} />
    </div>
  ),
};
export const CustomSlots: Story = {
  render: (args) => (
    <CopyButton
      {...args}
      copiedIcon={<span>✓</span>}
      icon={<span>⧉</span>}
      renderStatus={({ message }) => <strong>{message}</strong>}
    />
  ),
};
