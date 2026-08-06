import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { avatarDemoImage, avatarDemoProps } from './avatar.demo';
import { AvatarElement, defineAvatar } from './index.wc';

defineAvatar();

type AvatarStoryArgs = {
  alt?: string;
  ariaLabel?: string;
  disabled?: boolean;
  fallbackIcon?: string;
  initials?: string;
  interactive?: boolean;
  loading?: 'eager' | 'lazy';
  name?: string;
  shape?: 'circle' | 'rounded';
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  src?: string;
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
  statusLabel?: string;
};

const meta = {
  title: '2. Data Display/Avatar',
  component: AvatarElement.tagName,
  parameters: {
    name: 'Avatar',
    description:
      'Web Component awatara z obrazem, inicjałami, ikoną zastępczą, statusem i semantycznym trybem interaktywnym.',
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
    shape: { control: 'select', options: ['circle', 'rounded'] },
    status: { control: 'select', options: ['none', 'online', 'offline', 'away', 'busy'] },
    loading: { control: 'select', options: ['lazy', 'eager'] },
  },
} satisfies Meta<AvatarStoryArgs>;

export default meta;
type Story = StoryObj<AvatarStoryArgs>;

function createAvatar(args: Partial<AvatarStoryArgs>, fallback?: string): AvatarElement {
  const element = document.createElement(AvatarElement.tagName) as AvatarElement;

  Object.assign(element, args);
  if (fallback) element.textContent = fallback;

  return element;
}

function preview(node: Node): HTMLElement {
  return createStoryContent({ preview: node, settings: meta.parameters });
}

export const Playground: Story = {
  render: (args) => preview(createAvatar(args)),
  args: { ...avatarDemoProps },
};

export const FallbackOrder: Story = {
  render: () => {
    const gallery = document.createElement('div');
    gallery.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:1rem';
    gallery.append(
      createAvatar({
        alt: 'Portret Anny Kowalskiej',
        name: 'Anna Kowalska',
        size: 'xl',
        src: avatarDemoImage,
      }),
      createAvatar({ name: 'Anna Maria Kowalska', size: 'xl' }),
      createAvatar({ ariaLabel: 'Zespół PEAUI', initials: 'pea', size: 'xl' }),
      createAvatar({ ariaLabel: 'Nieznany użytkownik', fallbackIcon: 'users', size: 'xl' }),
      createAvatar({ name: 'DługiWieloczłonowyTekstBezSpacji', size: 'xl' }),
    );

    return preview(gallery);
  },
};

export const SizesShapesAndStatuses: Story = {
  render: () => {
    const gallery = document.createElement('div');
    gallery.style.cssText = 'display:grid;gap:1.5rem';
    const sizes = ['xs', 's', 'm', 'l', 'xl'] as const;
    const shapes = ['circle', 'rounded'] as const;
    const statuses = ['online', 'offline', 'away', 'busy'] as const;

    for (const shape of shapes) {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:1rem';
      for (const size of sizes) row.append(createAvatar({ name: 'Anna Kowalska', shape, size }));
      gallery.append(row);
    }

    const statusRow = document.createElement('div');
    statusRow.style.cssText = 'display:flex;align-items:center;gap:1rem';
    for (const status of statuses) {
      statusRow.append(
        createAvatar({ name: 'Anna Kowalska', size: 'l', status, statusLabel: status }),
      );
    }
    gallery.append(statusRow);

    return preview(gallery);
  },
};

export const LoadingErrorAndCustomContent: Story = {
  render: () => {
    const gallery = document.createElement('div');
    gallery.style.cssText =
      'display:flex;flex-wrap:wrap;align-items:center;gap:1rem;padding:1rem;background:#172033;border-radius:.75rem';
    const customAvatar = createAvatar(
      {
        ariaLabel: 'Niestandardowy awatar',
        size: 'xl',
        status: 'busy',
        statusLabel: 'Nie przeszkadzać',
      },
      'UI',
    );
    const customStatus = document.createElement('span');
    customStatus.slot = 'status';
    customStatus.textContent = '!';
    customAvatar.append(customStatus);
    gallery.append(
      createAvatar({
        name: 'Bardzo Długa Nazwa Użytkownika',
        size: 'xl',
        src: '/missing-avatar.jpg',
        status: 'offline',
      }),
      customAvatar,
    );

    return preview(gallery);
  },
};

export const Interactive: Story = {
  render: () => {
    const gallery = document.createElement('div');
    gallery.style.cssText = 'display:flex;align-items:center;gap:1rem';
    gallery.append(
      createAvatar({
        ariaLabel: 'Otwórz profil Anny',
        interactive: true,
        name: 'Anna Kowalska',
        size: 'l',
        status: 'online',
      }),
      createAvatar({
        ariaLabel: 'Profil Anny jest niedostępny',
        disabled: true,
        interactive: true,
        name: 'Anna Kowalska',
        size: 'l',
      }),
    );

    return preview(gallery);
  },
};
