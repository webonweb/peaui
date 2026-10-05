import type { CommandPaletteCommand, CommandPaletteGroup } from './command-palette.shared';

export const commandPaletteDemoGroups: readonly CommandPaletteGroup[] = [
  { id: 'navigation', label: 'Navigation', order: 1 },
  { id: 'actions', label: 'Actions', order: 2 },
  { id: 'settings', label: 'Settings', order: 3 },
];

export const commandPaletteDemoCommands: readonly CommandPaletteCommand[] = [
  {
    id: 'home',
    label: 'Go to dashboard',
    description: 'Open the main workspace',
    keywords: ['home', 'start'],
    group: 'navigation',
    shortcut: ['Mod', 'H'],
  },
  {
    id: 'projects',
    label: 'Open project',
    description: 'Choose one of the recent projects',
    group: 'navigation',
    children: [
      { id: 'project-peaui', label: 'PEAUI library', group: 'navigation' },
      { id: 'project-docs', label: 'Documentation portal', group: 'navigation' },
    ],
  },
  {
    id: 'create-document',
    label: 'Create document',
    description: 'Start with a blank document',
    keywords: ['new', 'file'],
    group: 'actions',
    shortcut: ['Mod', 'N'],
  },
  {
    id: 'invite',
    label: 'Invite teammate',
    description: 'Send an invitation by email',
    group: 'actions',
  },
  {
    id: 'theme',
    label: 'Change theme',
    description: 'Switch the application appearance',
    group: 'settings',
  },
  {
    id: 'billing',
    label: 'Manage billing',
    description: 'Available to workspace owners',
    group: 'settings',
    disabled: true,
  },
];

export const commandPaletteDemoProps = {
  commands: commandPaletteDemoCommands,
  groups: commandPaletteDemoGroups,
  recentIds: ['create-document', 'home'],
  open: true,
  mode: 'embedded',
  registerShortcut: false,
  dataTestId: 'command-palette-demo',
} as const;
