import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';

import { keyboardKeyDemoProps } from './keyboard-key.demo';
import KeyboardKey from './index.vue';

const meta = {
  title: '4. Data Display/KeyboardKey',
  component: KeyboardKey,
  args: keyboardKeyDemoProps,
  argTypes: {
    format: { control: 'select', options: ['symbol', 'text'] },
    platform: { control: 'select', options: ['auto', 'windows', 'mac', 'linux', 'generic'] },
    size: { control: 'select', options: ['xs', 's', 'm'] },
  },
  parameters: {
    layout: 'padded',
    name: 'KeyboardKey',
    description:
      'Semantyczne keycapy i kombinacje skrótów z mapowaniem platform oraz pełną nazwą dla czytników ekranu.',
  },
} satisfies Meta<typeof KeyboardKey>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

export const Default: Story = {
  render: (args) => ({
    components: { KeyboardKey, StoryContent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `<StoryContent :settings><KeyboardKey v-bind="args" /></StoryContent>`,
  }),
};
export const SingleKey: Story = { args: { keys: 'Escape' } };
export const TextFormat: Story = { args: { format: 'text', keys: ['Mod', 'Enter'] } };
export const Block: Story = { args: { inline: false } };
export const Muted: Story = { args: { muted: true } };
export const CustomAccessibleLabel: Story = {
  args: { ariaLabel: 'Otwórz globalne wyszukiwanie', keys: ['Mod', 'K'] },
};
export const PlatformMatrix: Story = {
  render: () => ({
    components: { KeyboardKey },
    template: `<div style="display:grid;gap:.75rem"><div v-for="platform in ['windows','mac','linux','generic']" :key="platform" style="display:flex;align-items:center;gap:.75rem"><span style="inline-size:5rem">{{ platform }}</span><KeyboardKey :keys="['Mod','Shift','K']" :platform /></div></div>`,
  }),
};
export const InlineSentence: Story = {
  args: { keys: ['Mod', 'S'], platform: 'mac', size: 'xs' },
  render: (args) => ({
    components: { KeyboardKey },
    setup: () => ({ args }),
    template: `<p>Aby zapisać dokument, naciśnij <KeyboardKey v-bind="args" /> przed zamknięciem okna.</p>`,
  }),
};
export const LongNames: Story = {
  args: { format: 'text', keys: ['Control', 'PrintScreen', 'PageDown'], platform: 'windows' },
};
export const NarrowContainer: Story = {
  args: { format: 'text', keys: ['Control', 'Shift', 'PrintScreen'], platform: 'windows' },
  render: (args) => ({
    components: { KeyboardKey },
    setup: () => ({ args }),
    template: `<div data-keyboard-key-narrow style="inline-size:10rem;max-inline-size:100%"><KeyboardKey v-bind="args" /></div>`,
  }),
};
export const CustomSlots: Story = {
  args: { keys: ['Mod', 'K'], platform: 'mac' },
  render: (args) => ({
    components: { KeyboardKey },
    setup: () => ({ args }),
    template: `<KeyboardKey v-bind="args"><template #key="{ visualLabel }"><strong>{{ visualLabel }}</strong></template><template #separator>then</template></KeyboardKey>`,
  }),
};
