import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import { contextMenuDemoItems } from './context-menu.demo';
import ContextMenuVueComponent from './index.vue';
import { ContextMenuElement, defineContextMenu } from './index.wc';

defineContextMenu();

function renderContextMenu(args: VueCustomElementStoryArgs): HTMLElement {
  const element = document.createElement(ContextMenuElement.tagName);
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) Reflect.set(element, name, value);
  }
  const target = document.createElement('button');
  target.className = 'context-story-target';
  target.type = 'button';
  target.textContent = 'Raport kwartalny — prawy przycisk lub Shift+F10';
  Object.assign(target.style, {
    alignItems: 'center',
    background: 'var(--peaui-color-grey-50)',
    border: '1px solid var(--peaui-color-grey-300)',
    borderRadius: '.75rem',
    boxSizing: 'border-box',
    cursor: 'context-menu',
    display: 'flex',
    minHeight: '7rem',
    padding: '1.25rem',
  });
  element.append(target);
  return element;
}

const meta = {
  title: '6. Navigation/ContextMenu WC',
  component: ContextMenuElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(ContextMenuVueComponent),
    ariaLabel: 'Akcje raportu',
    context: { id: 'report-q3' },
    items: contextMenuDemoItems,
    open: false,
  },
  argTypes: createVueCustomElementArgTypes(ContextMenuVueComponent),
  parameters: {
    name: 'ContextMenu',
    description:
      'Light-DOM Web Component z identycznym wyglądem, rolami ARIA, pozycjonowaniem i obsługą klawiatury jak Vue oraz React.',
    code: `
<script type="module">
  import '@peaui/ui/wc/navigation/ContextMenu';
</script>
<peaui-context-menu aria-label="Akcje raportu">
  <button type="button">Raport kwartalny</button>
</peaui-context-menu>
<script>
  const menu = document.querySelector('peaui-context-menu');
  menu.items = menuItems;
  menu.context = { id: 'report-q3' };
</script>
    `,
  },
  render: renderContextMenu,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const PointerActivation: Story = {};
export const KeyboardActivation: Story = { args: { position: 'target' } };
export const LongPress: Story = { args: { longPressDelay: 350 } };
export const ViewportEdges: Story = {};
export const Submenu: Story = {};
export const DynamicContext: Story = { args: { context: { id: 'report-live' } } };
export const RemovedTarget: Story = {};
export const Disabled: Story = { args: { disabled: true } };
