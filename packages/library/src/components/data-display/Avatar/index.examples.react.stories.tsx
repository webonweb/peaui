import type { Meta, StoryObj } from '@storybook/react';

import { avatarDemoImage } from './avatar.demo';
import Avatar from './index';

const meta = {
  title: 'React/data-display/Avatar examples',
  component: Avatar,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FallbackOrder: Story = {
  render: () => (
    <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      <Avatar alt="Portret Anny Kowalskiej" name="Anna Kowalska" size="xl" src={avatarDemoImage} />
      <Avatar name="Anna Maria Kowalska" size="xl" />
      <Avatar ariaLabel="Zespół PEAUI" initials="pea" size="xl" />
      <Avatar ariaLabel="Nieznany użytkownik" fallbackIcon="users" size="xl" />
      <Avatar name="DługiWieloczłonowyTekstBezSpacji" size="xl" />
    </div>
  ),
};

export const SizesShapesAndStatuses: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {(['circle', 'rounded'] as const).map((shape) => (
        <div key={shape} style={{ alignItems: 'center', display: 'flex', gap: '1rem' }}>
          {(['xs', 's', 'm', 'l', 'xl'] as const).map((size) => (
            <Avatar key={size} name="Anna Kowalska" shape={shape} size={size} />
          ))}
        </div>
      ))}
      <div style={{ alignItems: 'center', display: 'flex', gap: '1rem' }}>
        {(['online', 'offline', 'away', 'busy'] as const).map((status) => (
          <Avatar key={status} name="Anna Kowalska" size="l" status={status} statusLabel={status} />
        ))}
      </div>
    </div>
  ),
};

export const LoadingErrorAndCustomContent: Story = {
  render: () => (
    <div
      style={{
        alignItems: 'center',
        background: '#172033',
        borderRadius: '.75rem',
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
      }}
    >
      <Avatar
        name="Bardzo Długa Nazwa Użytkownika"
        size="xl"
        src="/missing-avatar.jpg"
        status="offline"
      />
      <Avatar ariaLabel="Niestandardowy awatar" size="xl" status="busy" statusContent="!">
        UI
      </Avatar>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Avatar
        ariaLabel="Otwórz profil Anny"
        interactive
        name="Anna Kowalska"
        size="l"
        status="online"
      />
      <Avatar
        ariaLabel="Profil Anny jest niedostępny"
        disabled
        interactive
        name="Anna Kowalska"
        size="l"
      />
    </div>
  ),
};
