import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import { dropdownMenuDemoItems } from './dropdown-menu.demo';
import DropdownMenuVueComponent from './index.vue';
import { defineDropdownMenu, DropdownMenuElement } from './index.wc';

defineDropdownMenu();

function renderMenu(args: VueCustomElementStoryArgs): HTMLElement {
  const element = document.createElement(DropdownMenuElement.tagName);
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) Reflect.set(element, name, value);
  }
  return element;
}

function renderSlottedMenu(args: VueCustomElementStoryArgs): HTMLElement {
  const element = renderMenu(args);
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.setAttribute('slot', 'trigger');
  trigger.textContent = typeof args.triggerLabel === 'string' ? args.triggerLabel : 'Opcje';
  element.append(trigger);
  return element;
}

function renderPlacementGrid(args: VueCustomElementStoryArgs): HTMLElement {
  const grid = document.createElement('div');
  grid.dataset.dropdownPlacementGrid = '';
  Object.assign(grid.style, {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'grid',
    gap: 'clamp(3rem, 15vw, 7rem)',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    maxWidth: '100%',
    minHeight: '32rem',
    minWidth: '0',
    padding: 'clamp(2.5rem, 15vw, 7rem)',
    width: '100%',
  });
  for (const placement of ['top', 'right', 'bottom', 'left'] as const) {
    grid.append(
      renderMenu({
        ...args,
        align: 'center',
        dataTestId: `placement-${placement}`,
        items: dropdownMenuDemoItems.slice(0, 2),
        open: false,
        placement,
        triggerLabel: placement,
      }),
    );
  }
  return grid;
}

const meta = {
  title: '6. Navigation/DropdownMenu WC',
  component: DropdownMenuElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(DropdownMenuVueComponent),
    ariaLabel: 'Akcje profilu',
    items: dropdownMenuDemoItems,
    open: false,
    triggerLabel: 'Opcje',
  },
  argTypes: createVueCustomElementArgTypes(DropdownMenuVueComponent),
  parameters: {
    name: 'DropdownMenu',
    description:
      'Light-DOM Web Component z identycznymi klasami, rolami ARIA i zachowaniem klawiatury jak implementacje Vue i React.',
    code: `
<script type="module">
  import '@peaui/ui/wc/navigation/DropdownMenu';
</script>

<peaui-dropdown-menu aria-label="Akcje profilu" trigger-label="Opcje"></peaui-dropdown-menu>
<script>
  const menu = document.querySelector('peaui-dropdown-menu');
  menu.items = menuItems;
  menu.open = true;
</script>
    `,
  },
  render: renderMenu,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const Compact: Story = { args: { density: 'compact' } };
export const Disabled: Story = { args: { disabled: true, open: false } };
export const Empty: Story = { args: { items: [], open: true } };
export const Loading: Story = { args: { items: [], loading: true, open: true } };
export const EndAlignedTop: Story = { args: { align: 'end', placement: 'top' } };
export const Placements: Story = { render: renderPlacementGrid };
export const CustomTrigger: Story = {
  args: { open: false, triggerLabel: 'Własny trigger' },
  render: renderSlottedMenu,
};
export const LongContent: Story = {
  args: {
    items: [
      {
        id: 'long',
        label: 'Bardzo długa nazwa akcji, która pozostaje w granicach viewportu',
        shortcut: 'Ctrl+Shift+L',
      },
    ],
    open: true,
  },
};
