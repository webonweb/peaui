import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import ToggleGroupComponent, { type ToggleGroupItem } from './index.vue';
import { toggleGroupFormattingItems, toggleGroupViewItems } from './toggle-group.demo';

const meta = {
  title: '3. Data Entry/ToggleGroup',
  component: ToggleGroupComponent,
  parameters: {
    name: 'ToggleGroup',
    description:
      'Dostępna grupa aria-pressed z wyborem single/multiple, jednym tab stopem, obsługą RTL i responsywnym układem.',
  },
  argTypes: {
    appearance: { control: 'select', options: ['separate', 'attached'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    overflow: { control: 'select', options: ['wrap', 'scroll'] },
    semanticRole: { control: 'select', options: ['toolbar', 'group'] },
    size: { control: 'select', options: ['xxs', 'xs', 's', 'm', 'l'] },
    type: { control: 'select', options: ['single', 'multiple'] },
    variant: { control: 'select', options: ['default', 'outline', 'ghost'] },
  },
} satisfies Meta<InstanceType<typeof ToggleGroupComponent>['$props'] & { dir?: 'ltr' | 'rtl' }>;

export default meta;
type Story = StoryObj<
  InstanceType<typeof ToggleGroupComponent>['$props'] & { dir?: 'ltr' | 'rtl' }
>;
const { getSettings } = useSettingsStorie();

export const Playground: Story = {
  render: (args) => ({
    components: { StoryContent, ToggleGroupComponent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <ToggleGroupComponent v-bind="args" v-model:value="args.value" />
      </StoryContent>
    `,
  }),
  args: {
    dataTestId: 'toggle-group-default',
    items: toggleGroupViewItems,
    label: 'Widok wyników',
    size: 'm',
    value: 'grid',
  },
};

export const Multiple: Story = {
  args: {
    items: toggleGroupFormattingItems,
    label: 'Formatowanie',
    type: 'multiple',
    value: ['bold', 'underline'],
  },
};

export const SizesAndAlignment: Story = {
  render: () => ({
    components: { StoryContent, ToggleGroupComponent },
    setup: () => ({
      settings: getSettings(meta),
      sizes: ['xxs', 'xs', 's', 'm', 'l'],
      toggleGroupViewItems,
    }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1rem;justify-items:start">
          <ToggleGroupComponent
            v-for="size in sizes"
            :key="size"
            appearance="attached"
            :data-test-id="'toggle-group-size-' + size"
            :items="toggleGroupViewItems"
            :label="'Rozmiar ' + size"
            :size="size"
            value="grid"
          />
        </div>
      </StoryContent>
    `,
  }),
};

export const RequiredAndAllowEmpty: Story = {
  render: () => ({
    components: { StoryContent, ToggleGroupComponent },
    setup: () => ({ settings: getSettings(meta), toggleGroupViewItems }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1.5rem">
          <ToggleGroupComponent :items="toggleGroupViewItems" label="Wymagany widok" required value="grid" />
          <ToggleGroupComponent :allow-empty="false" :items="toggleGroupViewItems" label="Zawsze jeden wybór" value="list" />
          <ToggleGroupComponent :items="toggleGroupViewItems" label="Pusty wymagany wybór" required />
        </div>
      </StoryContent>
    `,
  }),
};

export const OrientationsAndAppearance: Story = {
  render: () => ({
    components: { StoryContent, ToggleGroupComponent },
    setup: () => ({ settings: getSettings(meta), toggleGroupViewItems }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1.5rem;justify-items:start">
          <ToggleGroupComponent appearance="attached" :items="toggleGroupViewItems" label="Poziomo" value="grid" />
          <ToggleGroupComponent :items="toggleGroupViewItems" label="Pionowo" orientation="vertical" value="list" />
        </div>
      </StoryContent>
    `,
  }),
};

export const DisabledStates: Story = {
  render: () => ({
    components: { StoryContent, ToggleGroupComponent },
    setup: () => ({ settings: getSettings(meta), toggleGroupViewItems }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1.5rem">
          <ToggleGroupComponent :items="toggleGroupViewItems.map((item, index) => ({ ...item, disabled: index === 1 }))" label="Wyłączona pozycja" value="grid" />
          <ToggleGroupComponent disabled :items="toggleGroupViewItems" label="Wyłączona grupa" value="grid" />
          <ToggleGroupComponent :items="toggleGroupViewItems" label="Tylko do odczytu" readonly value="grid" />
        </div>
      </StoryContent>
    `,
  }),
};

export const DynamicItems: Story = {
  render: () => ({
    components: { StoryContent, ToggleGroupComponent },
    setup() {
      const dynamicItems = ref<ToggleGroupItem[]>([...toggleGroupViewItems]);
      return { dynamicItems, settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem;justify-items:start">
          <ToggleGroupComponent data-test-id="toggle-group-dynamic" :items="dynamicItems" label="Dynamiczny widok" />
          <button type="button" @click="dynamicItems = dynamicItems.slice(0, -1)">Usuń ostatnią pozycję</button>
          <button type="button" @click="dynamicItems = [...toggleGroupViewItems]">Przywróć pozycje</button>
        </div>
      </StoryContent>
    `,
  }),
};

export const MobileOverflow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    components: { ToggleGroupComponent },
    setup: () => ({
      items: Array.from({ length: 8 }, (_, index) => ({
        value: index,
        label: `Opcja ${index + 1}`,
      })),
    }),
    template: `<div data-toggle-group-mobile style="width:20rem;max-width:100%"><ToggleGroupComponent appearance="attached" :items="items" label="Filtry" overflow="scroll" :value="0" /></div>`,
  }),
};

export const Rtl: Story = {
  args: { dir: 'rtl', items: toggleGroupViewItems, label: 'Kierunek RTL', value: 'grid' },
};

export const DarkMode: Story = {
  args: { appearance: 'attached', items: toggleGroupViewItems, label: 'Widok', value: 'grid' },
  parameters: { backgrounds: { default: 'dark' } },
};
