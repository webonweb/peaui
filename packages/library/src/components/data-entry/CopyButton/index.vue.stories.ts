import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';

import { ClipboardError } from '@/helpers/functions.helper';

import { copyButtonDemoProps } from './copy-button.demo';
import CopyButton from './index.vue';

const meta = {
  title: '3. Data Entry/CopyButton',
  component: CopyButton,
  args: copyButtonDemoProps,
  argTypes: {
    content: { control: 'select', options: ['icon', 'text', 'icon-text'] },
    size: { control: 'select', options: ['xxs', 'xs', 's', 'm', 'l'] },
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
  },
  parameters: {
    layout: 'padded',
    name: 'CopyButton',
    description:
      'Dostępna akcja kopiowania oparta na ButtonAction i SvgIcon, z bezpiecznym fallbackiem, stanami async i stabilnym fokusem.',
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

export const IconAndText: Story = {
  render: (args) => ({
    components: { CopyButton, StoryContent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `<StoryContent :settings><CopyButton v-bind="args" /></StoryContent>`,
  }),
};

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
  render: (args) => ({
    components: { CopyButton },
    setup: () => ({ args }),
    template: `<div style="inline-size:12rem;max-inline-size:100%"><CopyButton v-bind="args" /></div>`,
  }),
};
export const CustomSlots: Story = {
  render: (args) => ({
    components: { CopyButton },
    setup: () => ({ args }),
    template: `<CopyButton v-bind="args"><template #icon>⧉</template><template #copied-icon>✓</template><template #status="{ message }"><strong>{{ message }}</strong></template></CopyButton>`,
  }),
};
