import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import { menuBarDemoMenus, menuBarDemoProps } from './menu-bar.demo';
import MenuBarComponent from './index.vue';

const meta = {
  title: '6. Navigation/MenuBar',
  component: MenuBarComponent,
  parameters: {
    name: 'MenuBar',
    description:
      'Responsywny pasek menu aplikacyjnego zgodny z APG: roving tabindex, przełączanie sekcji strzałkami, typeahead i poziomy overflow bez automatycznej zmiany wzorca.',
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'compact'] },
  },
} satisfies Meta<typeof MenuBarComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

export const Playground: Story = {
  render: (args) => ({
    components: { MenuBarComponent, StoryContent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <MenuBarComponent v-bind="args" v-model:open-menu="args.openMenu" />
      </StoryContent>
    `,
  }),
  args: { ...menuBarDemoProps, openMenu: null },
};

export const MultipleMenusAndKeyboard: Story = {
  render: () => ({
    components: { MenuBarComponent, StoryContent },
    setup: () => ({ menuBarDemoMenus, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <p style="margin:0 0 .75rem;color:var(--peaui-color-grey-600)">Tab, strzałki, Home/End, typeahead oraz Escape.</p>
        <MenuBarComponent aria-label="Menu edytora" :menus="menuBarDemoMenus" data-test-id="menubar-keyboard" />
      </StoryContent>
    `,
  }),
};

export const SubmenuCheckboxRadioAndShortcuts: Story = {
  render: () => ({
    components: { MenuBarComponent, StoryContent },
    setup: () => ({ menuBarDemoMenus, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <MenuBarComponent :menus="menuBarDemoMenus" open-menu="view" />
      </StoryContent>
    `,
  }),
};

export const Controlled: Story = {
  render: () => ({
    components: { MenuBarComponent, StoryContent },
    setup: () => ({
      menuBarDemoMenus,
      openMenu: ref<string | number | null>('edit'),
      settings: getSettings(meta),
    }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem">
          <output>Otwarta sekcja: {{ openMenu ?? 'brak' }}</output>
          <MenuBarComponent v-model:open-menu="openMenu" :menus="menuBarDemoMenus" />
          <button type="button" style="justify-self:start" @click="openMenu = openMenu === 'file' ? null : 'file'">
            Przełącz sekcję Plik
          </button>
        </div>
      </StoryContent>
    `,
  }),
};

export const DisabledAndCompact: Story = {
  render: () => ({
    components: { MenuBarComponent, StoryContent },
    setup: () => ({
      menus: menuBarDemoMenus.map((menu, index) => ({ ...menu, disabled: index === 1 })),
      settings: getSettings(meta),
    }),
    template: `
      <StoryContent :settings>
        <MenuBarComponent aria-label="Kompaktowe menu" :menus="menus" variant="compact" />
      </StoryContent>
    `,
  }),
};

export const ResponsiveOverflow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    components: { MenuBarComponent, StoryContent },
    setup: () => ({ menuBarDemoMenus, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div data-menubar-responsive style="width:18rem;max-width:100%">
          <MenuBarComponent aria-label="Responsywne menu" :menus="menuBarDemoMenus" data-test-id="menubar-responsive" />
        </div>
      </StoryContent>
    `,
  }),
};
