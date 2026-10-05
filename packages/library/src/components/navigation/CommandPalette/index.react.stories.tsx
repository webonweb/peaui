/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';

import {
  commandPaletteDemoCommands,
  commandPaletteDemoGroups,
  commandPaletteDemoProps,
} from './command-palette.demo';
import CommandPalette from './index';

const meta = {
  title: 'React/navigation/CommandPalette',
  component: CommandPalette,
  args: {
    ...commandPaletteDemoProps,
    onActiveIdChange: fn(),
    onExecute: fn(),
    onExecutionError: fn(),
    onExecutionSuccess: fn(),
    onLevelChange: fn(),
    onOpenChange: fn(),
    onQueryChange: fn(),
    onSelect: fn(),
  },
  argTypes: { mode: { control: 'select', options: ['modal', 'embedded'] } },
  parameters: {
    layout: 'centered',
    description: 'Native React command palette with the same state, keyboard and ARIA contract.',
  },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FuzzySearch: Story = { args: { query: 'oppr' } };
export const GroupsAndRecent: Story = {
  args: { groups: commandPaletteDemoGroups, recentIds: ['theme', 'home'] },
};
export const AsyncSuccess: Story = {
  args: {
    closeOnExecute: false,
    commands: [
      {
        id: 'sync',
        label: 'Synchronize workspace',
        execute: () => new Promise((resolve) => setTimeout(resolve, 900)),
      },
    ],
  },
};
export const AsyncError: Story = {
  args: {
    closeOnExecute: false,
    commands: [
      {
        id: 'fail',
        label: 'Run failing deployment',
        execute: async () => Promise.reject(new Error('Deployment service is unavailable')),
      },
    ],
  },
};
export const Nested: Story = {
  args: { commands: commandPaletteDemoCommands.filter(({ id }) => id === 'projects') },
};
export const Disabled: Story = {
  args: { commands: commandPaletteDemoCommands.filter(({ id }) => id === 'billing') },
};
export const VirtualTenThousand: Story = {
  args: {
    commands: Array.from({ length: 10_000 }, (_, index) => ({
      id: `command-${index}`,
      label: `Command ${index + 1}`,
      description: `Virtual result ${index + 1}`,
    })),
    virtual: true,
  },
};
export const Controlled: Story = {
  render: function Render() {
    const [open, setOpen] = useState(true);
    const [query, setQuery] = useState('');
    const [activeId, setActiveId] = useState<string | null>(null);
    return (
      <div>
        <button type="button" onClick={() => setOpen(true)}>
          Open controlled palette
        </button>
        <CommandPalette
          activeId={activeId}
          commands={commandPaletteDemoCommands}
          mode="embedded"
          open={open}
          query={query}
          registerShortcut={false}
          onActiveIdChange={setActiveId}
          onOpenChange={setOpen}
          onQueryChange={setQuery}
        />
      </div>
    );
  },
};
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };
export const KeyboardOnly: Story = {
  args: { mode: 'modal', open: undefined, defaultOpen: false, registerShortcut: true },
  render: (args) => (
    <div>
      <p>Focus the button and press Control/Command + K.</p>
      <CommandPalette
        {...args}
        renderTrigger={({ openPalette }) => (
          <button type="button" onClick={openPalette}>
            Open commands
          </button>
        )}
      />
    </div>
  ),
};
