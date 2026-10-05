import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import {
  commandPaletteDemoCommands,
  commandPaletteDemoGroups,
  commandPaletteDemoProps,
} from './command-palette.demo';
import CommandPalette from './index.vue';

const meta = {
  title: '5. Navigation/CommandPalette',
  component: CommandPalette,
  args: commandPaletteDemoProps,
  argTypes: {
    mode: { control: 'select', options: ['modal', 'embedded'] },
  },
  parameters: {
    layout: 'centered',
    name: 'CommandPalette',
    description:
      'Accessible command search with groups, nested levels, async actions and optional virtualization.',
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
  render: () => ({
    components: { CommandPalette },
    setup() {
      const open = ref(true);
      const query = ref('');
      const activeId = ref<string | null>(null);
      return { activeId, commandPaletteDemoCommands, open, query };
    },
    template: `<div><button type="button" @click="open = true">Open controlled palette</button><CommandPalette v-model:active-id="activeId" v-model:open="open" v-model:query="query" :commands="commandPaletteDemoCommands" mode="embedded" :register-shortcut="false" /></div>`,
  }),
};
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
export const KeyboardOnly: Story = {
  args: { mode: 'modal', open: false, registerShortcut: true },
  render: (args) => ({
    components: { CommandPalette },
    setup: () => ({ args }),
    template: `<div><p>Focus the button and press Control/Command + K.</p><CommandPalette v-bind="args"><template #trigger="{ openPalette }"><button type="button" @click="openPalette">Open commands</button></template></CommandPalette></div>`,
  }),
};
