import { avatarDemoImage } from '../Avatar/avatar.demo';

type AvatarGroupDemoItem = {
  id: string;
  initials?: string;
  name: string;
  src?: string;
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
};

export const avatarGroupDemoItems: AvatarGroupDemoItem[] = [
  {
    id: 'anna',
    name: 'Anna Kowalska',
    src: avatarDemoImage,
    status: 'online',
  },
  { id: 'jan', name: 'Jan Nowak', initials: 'JN', status: 'away' },
  { id: 'maria', name: 'Maria Wiśniewska', initials: 'MW', status: 'busy' },
  { id: 'piotr', name: 'Piotr Zieliński', initials: 'PZ', status: 'offline' },
  { id: 'zofia', name: 'Zofia Lewandowska', initials: 'ZL' },
];

export const avatarGroupDemoProps = {
  ariaLabel: 'Zespół projektu',
  items: avatarGroupDemoItems,
  maxVisible: 3,
  overflowMode: 'popover' as const,
  size: 'l' as const,
};
