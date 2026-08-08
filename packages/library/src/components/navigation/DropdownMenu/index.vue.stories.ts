import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';

import { dropdownMenuDemoItems, dropdownMenuDemoProps } from './dropdown-menu.demo';
import DropdownMenuComponent from './index.vue';

const meta = {
  title: '6. Navigation/DropdownMenu',
  component: DropdownMenuComponent,
  parameters: {
    name: 'DropdownMenu',
    description:
      'Dostępne menu akcji z pełną nawigacją klawiaturą, typeahead, grupami, checkboxami, radiami, podmenu i pozycjonowaniem odpornym na kolizje viewportu.',
  },
  argTypes: {
    align: { control: 'select', options: ['start', 'center', 'end'] },
    density: { control: 'select', options: ['compact', 'comfortable'] },
    placement: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
  },
} satisfies Meta<typeof DropdownMenuComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

export const Playground: Story = {
  render: (args) => ({
    components: { DropdownMenuComponent, StoryContent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <DropdownMenuComponent v-bind="args" v-model:open="args.open" />
      </StoryContent>
    `,
  }),
  args: { ...dropdownMenuDemoProps, open: false },
};

export const ItemTypesAndSubmenu: Story = {
  render: () => ({
    components: { DropdownMenuComponent, StoryContent },
    setup: () => ({ dropdownMenuDemoItems, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <DropdownMenuComponent
          aria-label="Akcje rekordu"
          :items="dropdownMenuDemoItems"
          open
          trigger-label="Wszystkie typy pozycji"
        />
      </StoryContent>
    `,
  }),
};

export const PlacementsAndAlignment: Story = {
  render: () => ({
    components: { DropdownMenuComponent, StoryContent },
    setup: () => ({ dropdownMenuDemoItems, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div data-dropdown-placement-grid style="box-sizing:border-box;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(3rem,15vw,7rem);min-height:32rem;max-width:100%;min-width:0;width:100%;padding:clamp(2.5rem,15vw,7rem);align-items:center">
          <DropdownMenuComponent v-for="placement in ['top','right','bottom','left']" :key="placement"
            :items="dropdownMenuDemoItems.slice(0,2)" :placement="placement" align="center"
            :data-test-id="'placement-' + placement" :trigger-label="placement" />
        </div>
      </StoryContent>
    `,
  }),
};

export const StatesAndDensity: Story = {
  render: () => ({
    components: { DropdownMenuComponent, StoryContent },
    setup: () => ({ dropdownMenuDemoItems, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start">
          <DropdownMenuComponent :items="dropdownMenuDemoItems" density="compact" trigger-label="Kompaktowe" />
          <DropdownMenuComponent :items="dropdownMenuDemoItems" disabled trigger-label="Wyłączone" />
          <DropdownMenuComponent :items="[]" open trigger-label="Puste" />
          <DropdownMenuComponent :items="[]" loading open trigger-label="Ładowanie" />
        </div>
      </StoryContent>
    `,
  }),
};

export const CustomTriggerAndSlots: Story = {
  render: () => ({
    components: { DropdownMenuComponent, StoryContent },
    setup: () => ({ dropdownMenuDemoItems, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <DropdownMenuComponent :items="dropdownMenuDemoItems">
          <template #trigger="{ open }"><button type="button">Profil {{ open ? '▲' : '▼' }}</button></template>
          <template #group-label="{ item }">Sekcja: {{ item.label }}</template>
          <template #item="{ item }"><strong v-if="item.variant === 'danger'">{{ item.label }}</strong><span v-else>{{ item.label }}</span></template>
        </DropdownMenuComponent>
      </StoryContent>
    `,
  }),
};

export const MobileAndLongContent: Story = {
  render: () => ({
    components: { DropdownMenuComponent, StoryContent },
    setup: () => ({
      items: [
        {
          id: 'long',
          label: 'Bardzo długa nazwa akcji, która nie może wypchnąć menu poza viewport',
          shortcut: 'Ctrl+Shift+Alt+L',
        },
        { id: 'disabled', label: 'Niedostępna bardzo długa akcja', disabled: true },
      ],
      settings: getSettings(meta),
    }),
    template: `
      <StoryContent :settings>
        <div style="width:18rem;max-width:100%">
          <DropdownMenuComponent :items="items" open trigger-label="Menu mobilne" />
        </div>
      </StoryContent>
    `,
  }),
};
