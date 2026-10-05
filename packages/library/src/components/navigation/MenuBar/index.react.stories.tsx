/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { menuBarDemoMenus, menuBarDemoProps } from './menu-bar.demo';
import MenuBar from './index';

const meta = {
  title: 'React/navigation/MenuBar',
  component: MenuBar,
  args: { ...menuBarDemoProps },
  parameters: {
    layout: 'padded',
    description:
      'Natywna implementacja React współdzieląca z Vue i Web Components wzorzec APG, zachowanie klawiatury, responsywność i CSS.',
  },
} satisfies Meta<typeof MenuBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MultipleMenusAndKeyboard: Story = {
  args: { ariaLabel: 'Menu edytora', dataTestId: 'menubar-keyboard' },
};

export const SubmenuCheckboxRadioAndShortcuts: Story = {
  args: { defaultOpenMenu: 'view' },
};

export const Controlled: Story = {
  render: function Render(args) {
    const [openMenu, setOpenMenu] = useState<string | number | null>('edit');
    return (
      <div style={{ display: 'grid', gap: '.75rem' }}>
        <output>Otwarta sekcja: {openMenu ?? 'brak'}</output>
        <MenuBar {...args} openMenu={openMenu} onOpenMenuChange={setOpenMenu} />
        <button
          style={{ justifySelf: 'start' }}
          type="button"
          onClick={() => setOpenMenu((current) => (current === 'file' ? null : 'file'))}
        >
          Przełącz sekcję Plik
        </button>
      </div>
    );
  },
};

export const DisabledAndCompact: Story = {
  args: {
    menus: menuBarDemoMenus.map((menu, index) => ({ ...menu, disabled: index === 1 })),
    variant: 'compact',
  },
};

export const CustomRendering: Story = {
  args: {
    renderMenuTrigger: (menu) => <span>Dział: {menu.label}</span>,
    renderShortcut: (item) => (item.shortcut ? <kbd>{item.shortcut}</kbd> : null),
  },
};

export const ResponsiveOverflow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div data-menubar-responsive style={{ maxWidth: '100%', width: '18rem' }}>
      <MenuBar
        ariaLabel="Responsywne menu"
        dataTestId="menubar-responsive"
        menus={menuBarDemoMenus}
      />
    </div>
  ),
};
