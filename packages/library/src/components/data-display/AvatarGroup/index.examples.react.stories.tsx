import type { Meta, StoryObj } from '@storybook/react';

import { avatarGroupDemoItems, avatarGroupDemoProps } from './avatar-group.demo';
import AvatarGroup from './index';

const meta = {
  title: 'React/data-display/AvatarGroup examples',
  component: AvatarGroup,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LayoutsAndDirections: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.75rem' }}>
      <AvatarGroup {...avatarGroupDemoProps} direction="start" maxVisible={5} />
      <AvatarGroup {...avatarGroupDemoProps} direction="end" maxVisible={5} />
      <AvatarGroup {...avatarGroupDemoProps} maxVisible={5} overlap={false} shape="rounded" />
    </div>
  ),
};

export const CountAndPopover: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <AvatarGroup {...avatarGroupDemoProps} maxVisible={2} overflowMode="count" />
      <AvatarGroup {...avatarGroupDemoProps} defaultOpen maxVisible={2} overflowMode="popover" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <AvatarGroup ariaLabel="Pusty zespół" items={[]} />
      <AvatarGroup {...avatarGroupDemoProps} disabled />
      <AvatarGroup {...avatarGroupDemoProps} defaultOpen loading maxVisible={2} />
    </div>
  ),
};

export const MobileLongNamesAndCustomRendering: Story = {
  render: () => (
    <div style={{ maxWidth: '100%', width: 220 }}>
      <AvatarGroup
        {...avatarGroupDemoProps}
        defaultOpen
        items={[
          ...avatarGroupDemoItems,
          { id: 'long', name: 'Aleksandra Bardzo Długa Wieloczłonowa Nazwa Użytkownika' },
        ]}
        maxVisible={2}
        popoverHeader={<strong>Pełny skład zespołu</strong>}
        renderOverflow={(count) => <strong>+{count}</strong>}
        size="s"
      />
    </div>
  ),
};
