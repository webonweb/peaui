import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import ToggleGroupVueComponent from './index.vue';
import { defineToggleGroup, ToggleGroupElement } from './index.wc';
import { toggleGroupFormattingItems, toggleGroupViewItems } from './toggle-group.demo';

defineToggleGroup();

function renderGroup(args: VueCustomElementStoryArgs): HTMLElement {
  const element = document.createElement(ToggleGroupElement.tagName) as HTMLElement &
    Record<string, unknown>;
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }
  return element;
}

function renderSet(entries: VueCustomElementStoryArgs[]): HTMLElement {
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, { display: 'grid', gap: '1.5rem', justifyItems: 'start' });
  wrapper.append(...entries.map(renderGroup));
  return wrapper;
}

const meta = {
  title: '3. Data Entry/ToggleGroup WC',
  component: ToggleGroupElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(ToggleGroupVueComponent),
    ariaLabel: 'Widok wyników',
    dataTestId: 'toggle-group-default',
    items: toggleGroupViewItems,
    label: 'Widok wyników',
    size: 'm',
    value: 'grid',
  },
  argTypes: {
    ...createVueCustomElementArgTypes(ToggleGroupVueComponent),
    appearance: { control: 'select', options: ['separate', 'attached'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    overflow: { control: 'select', options: ['wrap', 'scroll'] },
    semanticRole: { control: 'select', options: ['toolbar', 'group'] },
    size: { control: 'select', options: ['xxs', 'xs', 's', 'm', 'l'] },
    type: { control: 'select', options: ['single', 'multiple'] },
    variant: { control: 'select', options: ['default', 'outline', 'ghost'] },
  },
  parameters: {
    name: 'ToggleGroup',
    description:
      'Light-DOM Web Component z tym samym modelem, roving tabindex, responsywnością i wyglądem co Vue oraz React.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-entry/ToggleGroup';
</script>
<peaui-toggle-group aria-label="Widok wyników"></peaui-toggle-group>
<script>document.querySelector('peaui-toggle-group').items = [{ value: 'grid', label: 'Kafelki' }];</script>
    `,
  },
  render: renderGroup,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const Multiple: Story = {
  args: {
    items: toggleGroupFormattingItems,
    label: 'Formatowanie',
    type: 'multiple',
    value: ['bold', 'underline'],
  },
};

export const SizesAndAlignment: Story = {
  render: () =>
    renderSet(
      (['xxs', 'xs', 's', 'm', 'l'] as const).map((size) => ({
        appearance: 'attached',
        dataTestId: `toggle-group-size-${size}`,
        items: toggleGroupViewItems,
        label: `Rozmiar ${size}`,
        size,
        value: 'grid',
      })),
    ),
};
export const RequiredAndAllowEmpty: Story = {
  render: () =>
    renderSet([
      { items: toggleGroupViewItems, label: 'Wymagany widok', required: true, value: 'grid' },
      {
        allowEmpty: false,
        items: toggleGroupViewItems,
        label: 'Zawsze jeden wybór',
        value: 'list',
      },
      { items: toggleGroupViewItems, label: 'Pusty wymagany wybór', required: true },
    ]),
};
export const OrientationsAndAppearance: Story = {
  render: () =>
    renderSet([
      { appearance: 'attached', items: toggleGroupViewItems, label: 'Poziomo', value: 'grid' },
      { items: toggleGroupViewItems, label: 'Pionowo', orientation: 'vertical', value: 'list' },
    ]),
};
export const DisabledStates: Story = {
  render: () =>
    renderSet([
      {
        items: toggleGroupViewItems.map((item, index) => ({ ...item, disabled: index === 1 })),
        label: 'Wyłączona pozycja',
        value: 'grid',
      },
      { disabled: true, items: toggleGroupViewItems, label: 'Wyłączona grupa', value: 'grid' },
      { items: toggleGroupViewItems, label: 'Tylko do odczytu', readonly: true, value: 'grid' },
    ]),
};
export const DynamicItems: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    const group = renderGroup({
      dataTestId: 'toggle-group-dynamic',
      items: [...toggleGroupViewItems],
      label: 'Dynamiczny widok',
    }) as HTMLElement & Record<string, unknown>;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Usuń ostatnią pozycję';
    remove.addEventListener('click', () => {
      group.items = (group.items as unknown[]).slice(0, -1);
    });
    Object.assign(wrapper.style, { display: 'grid', gap: '.75rem', justifyItems: 'start' });
    wrapper.append(group, remove);
    return wrapper;
  },
};
export const MobileOverflow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.dataset.toggleGroupMobile = '';
    Object.assign(wrapper.style, { maxWidth: '100%', width: '20rem' });
    wrapper.append(
      renderGroup({
        appearance: 'attached',
        items: Array.from({ length: 8 }, (_, index) => ({
          value: index,
          label: `Opcja ${index + 1}`,
        })),
        label: 'Filtry',
        overflow: 'scroll',
        value: 0,
      }),
    );
    return wrapper;
  },
};
export const Rtl: Story = { args: { dir: 'rtl', label: 'Kierunek RTL' } };
export const DarkMode: Story = {
  args: { appearance: 'attached' },
  parameters: { backgrounds: { default: 'dark' } },
};
