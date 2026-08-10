import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import { menuBarDemoMenus } from './menu-bar.demo';
import MenuBarVueComponent from './index.vue';
import { defineMenuBar, MenuBarElement } from './index.wc';

defineMenuBar();

function renderMenuBar(args: VueCustomElementStoryArgs): HTMLElement {
  const element = document.createElement(MenuBarElement.tagName) as HTMLElement &
    Record<string, unknown>;
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }
  return element;
}

function renderResponsive(args: VueCustomElementStoryArgs): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.dataset.menubarResponsive = '';
  Object.assign(wrapper.style, { maxWidth: '100%', width: '18rem' });
  wrapper.append(renderMenuBar(args));
  return wrapper;
}

const meta = {
  title: '6. Navigation/MenuBar WC',
  component: MenuBarElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(MenuBarVueComponent),
    ariaLabel: 'Menu edytora',
    menus: menuBarDemoMenus,
    openMenu: null,
  },
  argTypes: createVueCustomElementArgTypes(MenuBarVueComponent),
  parameters: {
    name: 'MenuBar',
    description:
      'Light-DOM Web Component z identycznym wyglądem, wzorcem ARIA menubar, klawiaturą i responsywnym overflow jak Vue oraz React.',
    code: `
<script type="module">
  import '@peaui/ui/wc/navigation/MenuBar';
</script>
<peaui-menu-bar aria-label="Menu edytora"></peaui-menu-bar>
<script>
  document.querySelector('peaui-menu-bar').menus = menuSections;
</script>
    `,
  },
  render: renderMenuBar,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const MultipleMenusAndKeyboard: Story = { args: { dataTestId: 'menubar-keyboard' } };
export const SubmenuCheckboxRadioAndShortcuts: Story = { args: { openMenu: 'view' } };
export const Controlled: Story = { args: { openMenu: 'edit' } };
export const DisabledAndCompact: Story = {
  args: {
    menus: menuBarDemoMenus.map((menu, index) => ({ ...menu, disabled: index === 1 })),
    variant: 'compact',
  },
};
export const ResponsiveOverflow: Story = {
  args: { ariaLabel: 'Responsywne menu', dataTestId: 'menubar-responsive' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: renderResponsive,
};
