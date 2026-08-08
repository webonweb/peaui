import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import ToggleButtonVueComponent from './index.vue';
import { defineToggleButton, ToggleButtonElement } from './index.wc';
import { toggleButtonDemoProps, toggleButtonLongLabel } from './toggle-button.demo';

defineToggleButton();

function renderToggle(args: VueCustomElementStoryArgs): HTMLElement {
  const element = document.createElement(ToggleButtonElement.tagName) as HTMLElement &
    Record<string, unknown>;
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }
  return element;
}

function renderSet(entries: VueCustomElementStoryArgs[]): HTMLElement {
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '.75rem',
  });
  wrapper.append(...entries.map(renderToggle));
  return wrapper;
}

const meta = {
  title: '3. Data Entry/ToggleButton WC',
  component: ToggleButtonElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(ToggleButtonVueComponent),
    ...toggleButtonDemoProps,
  },
  argTypes: createVueCustomElementArgTypes(ToggleButtonVueComponent),
  parameters: {
    name: 'ToggleButton',
    description:
      'Light-DOM Web Component zachowujący aria-pressed, model, rozmiary, blokady i wygląd Vue oraz React.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-entry/ToggleButton';
  import '@peaui/ui/styles.css';
</script>
<peaui-toggle-button label="Podgląd" icon="eye"></peaui-toggle-button>
    `,
  },
  render: renderToggle,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const Pressed: Story = { args: { value: true } };
export const ContentModes: Story = {
  render: () =>
    renderSet([
      { content: 'text', label: 'Pogrubienie' },
      { ariaLabel: 'Pokaż podgląd', content: 'icon', icon: 'eye' },
      { content: 'icon-text', icon: 'lock', label: 'Zablokuj' },
    ]),
};
export const VariantsAndSizes: Story = {
  render: () =>
    renderSet([
      { label: 'Default xxs', size: 'xxs', variant: 'default' },
      { label: 'Outline xs', size: 'xs', value: true, variant: 'outline' },
      { label: 'Ghost s', size: 's', variant: 'ghost' },
      { icon: 'eye', label: 'Default m', size: 'm', value: true },
      { icon: 'lock', label: 'Outline l', size: 'l', value: true, variant: 'outline' },
    ]),
};
export const Controlled: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    const output = document.createElement('output');
    const toggle = renderToggle({ ...toggleButtonDemoProps, value: false });
    Object.assign(wrapper.style, { display: 'grid', gap: '.75rem', justifyItems: 'start' });
    output.textContent = 'Stan: wyłączony';
    toggle.addEventListener('update:value', (event) => {
      const value = (event as CustomEvent<boolean>).detail;
      output.textContent = `Stan: ${value ? 'włączony' : 'wyłączony'}`;
    });
    wrapper.append(output, toggle);
    return wrapper;
  },
};
export const Disabled: Story = {
  args: { dataTestId: 'toggle-disabled', disabled: true, label: 'Disabled', value: true },
};
export const Readonly: Story = {
  args: { dataTestId: 'toggle-readonly', label: 'Tylko do odczytu', readonly: true, value: true },
};
export const Loading: Story = {
  args: { dataTestId: 'toggle-loading', label: 'Zapisywanie', loading: true },
};
export const ResponsiveLongContent: Story = {
  args: { allowWrap: true, icon: 'eye', label: toggleButtonLongLabel, variant: 'outline' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.dataset.toggleResponsive = '';
    Object.assign(wrapper.style, { maxWidth: '100%', width: '18rem' });
    wrapper.append(renderToggle(args));
    return wrapper;
  },
};
export const DarkMode: Story = {
  args: { value: true },
  parameters: { backgrounds: { default: 'dark' } },
};
