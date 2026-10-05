import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import {
  commandPaletteDemoCommands,
  commandPaletteDemoGroups,
  commandPaletteDemoProps,
} from './command-palette.demo';
import CommandPaletteVueComponent from './index.vue';
import { CommandPaletteElement, defineCommandPalette } from './index.wc';

defineCommandPalette();

function renderCommandPalette(args: VueCustomElementStoryArgs): CommandPaletteElement {
  const element = document.createElement(CommandPaletteElement.tagName) as CommandPaletteElement &
    Record<string, unknown>;
  Object.entries(args).forEach(([name, value]) => {
    if (value !== undefined) element[name] = value;
  });
  return element;
}

const meta = {
  title: '5. Navigation/CommandPalette WC',
  component: CommandPaletteElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(CommandPaletteVueComponent),
    ...commandPaletteDemoProps,
  },
  argTypes: {
    ...createVueCustomElementArgTypes(CommandPaletteVueComponent),
    mode: { control: 'select', options: ['modal', 'embedded'] },
  },
  parameters: {
    layout: 'centered',
    name: 'CommandPalette',
    description: 'Light-DOM command palette with property data and composed CustomEvents.',
    code: `<script type="module">import '@peaui/ui/wc/navigation/CommandPalette';</script>\n<peaui-command-palette open mode="embedded"></peaui-command-palette>`,
  },
  render: renderCommandPalette,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

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
  render: () => {
    const wrapper = document.createElement('div');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Open controlled palette';
    const palette = renderCommandPalette({
      commands: commandPaletteDemoCommands,
      mode: 'embedded',
      open: true,
      registerShortcut: false,
    });
    button.addEventListener('click', () => {
      palette.open = true;
    });
    wrapper.append(button, palette);
    return wrapper;
  },
};
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile1' } } };
export const KeyboardOnly: Story = {
  args: { mode: 'modal', open: false, registerShortcut: true },
};
