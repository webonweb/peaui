import type { ComponentProps } from 'vue-component-type-helpers';
import type { ConcreteComponent } from 'vue';
import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import FormSwitchToggleComponent from './index.vue';
import { formSwitchToggleDemoProps, formSwitchToggleLongLabel } from './form-switch-toggle.demo';

const meta = {
  title: '5. Form/FormSwitchToggle',
  // Storybook expects the concrete runtime SFC; Vue exposes its generic call signature.
  component: FormSwitchToggleComponent as unknown as ConcreteComponent,
  parameters: {
    name: 'FormSwitchToggle',
    description:
      'Dostępny przełącznik formularzowy z natywnym checkboxem, rolą switch, wartościami domenowymi i obszarem dotykowym minimum 44 px.',
  },
  argTypes: {
    labelPosition: { control: 'select', options: ['start', 'end'] },
    size: { control: 'select', options: ['s', 'm', 'l'] },
  },
} satisfies Meta<ComponentProps<typeof FormSwitchToggleComponent>>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

export const Playground: Story = {
  render: (args) => ({
    components: { StoryContent, FormSwitchToggleComponent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <FormSwitchToggleComponent v-bind="args" v-model:value="args.value" />
      </StoryContent>
    `,
  }),
  args: { ...formSwitchToggleDemoProps },
};

export const OnAndOff: Story = {
  render: () => ({
    components: { StoryContent, FormSwitchToggleComponent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1rem">
          <FormSwitchToggleComponent :value="true" label="Włączony przełącznik" show-state-label />
          <FormSwitchToggleComponent :value="false" label="Wyłączony przełącznik" show-state-label />
        </div>
      </StoryContent>
    `,
  }),
};

export const SizesAndLabelPositions: Story = {
  render: () => ({
    components: { StoryContent, FormSwitchToggleComponent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem;max-width:28rem">
          <FormSwitchToggleComponent :value="false" label="Mały" size="s" />
          <FormSwitchToggleComponent :value="true" label="Średni" size="m" />
          <FormSwitchToggleComponent :value="true" label="Duży, etykieta przed szyną" label-position="start" size="l" />
        </div>
      </StoryContent>
    `,
  }),
};

export const CustomValues: Story = {
  render: () => ({
    components: { StoryContent, FormSwitchToggleComponent },
    setup: () => ({
      current: ref<'enabled' | 'disabled'>('disabled'),
      settings: getSettings(meta),
    }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem">
          <output>Wartość: {{ current }}</output>
          <FormSwitchToggleComponent
            v-model:value="current"
            label="Tryb ekspercki"
            true-value="enabled"
            false-value="disabled"
            show-state-label
          />
        </div>
      </StoryContent>
    `,
  }),
};

export const BlockingAndErrorStates: Story = {
  render: () => ({
    components: { StoryContent, FormSwitchToggleComponent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1rem">
          <FormSwitchToggleComponent :value="true" disabled label="Disabled" />
          <FormSwitchToggleComponent :value="true" readonly label="Tylko do odczytu" />
          <FormSwitchToggleComponent :value="false" loading label="Zapisywanie" />
          <FormSwitchToggleComponent :value="false" required label="Wymagana zgoda" error="Włącz zgodę, aby kontynuować." />
        </div>
      </StoryContent>
    `,
  }),
};

export const ResponsiveLongContent: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    components: { StoryContent, FormSwitchToggleComponent },
    setup: () => ({ settings: getSettings(meta), formSwitchToggleLongLabel }),
    template: `
      <StoryContent :settings>
        <div data-switch-responsive style="width:18rem;max-width:100%">
          <FormSwitchToggleComponent
            :value="false"
            :label="formSwitchToggleLongLabel"
            description="Opis również może zajmować wiele wierszy bez zmniejszania szyny przełącznika."
            show-state-label
          />
        </div>
      </StoryContent>
    `,
  }),
};

export const DarkMode: Story = {
  args: { ...formSwitchToggleDemoProps, value: true },
  parameters: { backgrounds: { default: 'dark' } },
};
