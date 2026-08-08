import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import ToggleButtonComponent from './index.vue';
import { toggleButtonDemoProps, toggleButtonLongLabel } from './toggle-button.demo';

const meta = {
  title: '3. Data Entry/ToggleButton',
  component: ToggleButtonComponent,
  parameters: {
    name: 'ToggleButton',
    description:
      'Dostępny przycisk przełączalny z natywnym aria-pressed, kontrolowanym modelem i celem dotykowym minimum 44 px.',
  },
  argTypes: {
    content: { control: 'select', options: ['text', 'icon', 'icon-text'] },
    size: { control: 'select', options: ['xxs', 'xs', 's', 'm', 'l'] },
    variant: { control: 'select', options: ['default', 'outline', 'ghost'] },
  },
} satisfies Meta<typeof ToggleButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

export const Playground: Story = {
  render: (args) => ({
    components: { StoryContent, ToggleButtonComponent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <ToggleButtonComponent v-bind="args" v-model:value="args.value" />
      </StoryContent>
    `,
  }),
  args: { ...toggleButtonDemoProps },
};

export const ContentModes: Story = {
  render: () => ({
    components: { StoryContent, ToggleButtonComponent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:flex;flex-wrap:wrap;gap:.75rem;align-items:center">
          <ToggleButtonComponent content="text" label="Pogrubienie" />
          <ToggleButtonComponent aria-label="Pokaż podgląd" content="icon" icon="eye" />
          <ToggleButtonComponent content="icon-text" icon="lock" label="Zablokuj" />
        </div>
      </StoryContent>
    `,
  }),
};

export const VariantsAndSizes: Story = {
  render: () => ({
    components: { StoryContent, ToggleButtonComponent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem;justify-items:start">
          <ToggleButtonComponent label="Default xxs" size="xxs" variant="default" />
          <ToggleButtonComponent :value="true" label="Outline xs" size="xs" variant="outline" />
          <ToggleButtonComponent label="Ghost s" size="s" variant="ghost" />
          <ToggleButtonComponent :value="true" icon="eye" label="Default m" size="m" />
          <ToggleButtonComponent :value="true" icon="lock" label="Outline l" size="l" variant="outline" />
        </div>
      </StoryContent>
    `,
  }),
};

export const Controlled: Story = {
  render: () => ({
    components: { StoryContent, ToggleButtonComponent },
    setup: () => ({ current: ref(false), settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem;justify-items:start">
          <output>Stan: {{ current ? 'włączony' : 'wyłączony' }}</output>
          <ToggleButtonComponent
            v-model:value="current"
            aria-label="Pokaż podgląd"
            icon="eye"
            label="Podgląd"
            pressed-icon="eye"
            pressed-label="Podgląd widoczny"
          />
        </div>
      </StoryContent>
    `,
  }),
};

export const BlockingStates: Story = {
  render: () => ({
    components: { StoryContent, ToggleButtonComponent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:flex;flex-wrap:wrap;gap:.75rem">
          <ToggleButtonComponent :value="true" data-test-id="toggle-disabled" disabled label="Disabled" />
          <ToggleButtonComponent :value="true" data-test-id="toggle-readonly" readonly label="Tylko do odczytu" />
          <ToggleButtonComponent data-test-id="toggle-loading" loading label="Zapisywanie" />
        </div>
      </StoryContent>
    `,
  }),
};

export const StableAccessibleName: Story = {
  args: { ...toggleButtonDemoProps, value: true },
};

export const ResponsiveLongContent: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    components: { StoryContent, ToggleButtonComponent },
    setup: () => ({ settings: getSettings(meta), toggleButtonLongLabel }),
    template: `
      <StoryContent :settings>
        <div data-toggle-responsive style="width:18rem;max-width:100%">
          <ToggleButtonComponent
            :label="toggleButtonLongLabel"
            allow-wrap
            icon="eye"
            variant="outline"
          />
        </div>
      </StoryContent>
    `,
  }),
};

export const DarkMode: Story = {
  args: { ...toggleButtonDemoProps, value: true },
  parameters: { backgrounds: { default: 'dark' } },
};
