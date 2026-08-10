import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import SplitButtonVueComponent from './index.vue';
import { splitButtonDemoItems, splitButtonDemoProps } from './split-button.demo';
import { defineSplitButton, SplitButtonElement } from './index.wc';

defineSplitButton();

function renderSplitButton(args: VueCustomElementStoryArgs): HTMLElement {
  const element = document.createElement(SplitButtonElement.tagName) as HTMLElement &
    Record<string, unknown>;
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }
  return element;
}

function renderCollection(configurations: VueCustomElementStoryArgs[]): HTMLElement {
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    alignItems: 'flex-start',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  });
  configurations.forEach((configuration) => wrapper.append(renderSplitButton(configuration)));
  return wrapper;
}

const meta = {
  title: '3. Data Entry/SplitButton WC',
  component: SplitButtonElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(SplitButtonVueComponent),
    ...splitButtonDemoProps,
    dataTestId: 'split-button-default',
    open: false,
  },
  argTypes: createVueCustomElementArgTypes(SplitButtonVueComponent),
  parameters: {
    name: 'SplitButton',
    description:
      'Light-DOM Web Component z identycznymi klasami, rolami ARIA, responsywnością i obsługą klawiatury jak Vue i React.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-entry/SplitButton';
</script>
<peaui-split-button label="Eksportuj" aria-label="Akcje eksportu"></peaui-split-button>
<script>
  document.querySelector('peaui-split-button').items = menuItems;
</script>
    `,
  },
  render: renderSplitButton,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const Variants: Story = {
  render: (args) =>
    renderCollection(['primary', 'secondary', 'danger'].map((variant) => ({ ...args, variant }))),
};
export const Sizes: Story = {
  render: (args) =>
    renderCollection(['xxs', 'xs', 's', 'm', 'l'].map((size) => ({ ...args, size }))),
};
export const Loading: Story = { args: { loading: true, loadingLabel: 'Trwa eksportowanie' } };
export const MenuLoading: Story = {
  args: { menuLoading: true, menuLoadingLabel: 'Pobieranie formatów…', open: true },
};
export const PartialDisabled: Story = {
  render: (args) =>
    renderCollection([
      { ...args, primaryDisabled: true },
      { ...args, menuDisabled: true },
      { ...args, disabled: true },
    ]),
};
export const StartAligned: Story = { args: { menuAlign: 'start', open: true } };
export const MobileAndLongLabel: Story = {
  args: {
    ariaLabel: 'Akcje bardzo długiego raportu',
    dataTestId: 'split-button-mobile',
    items: splitButtonDemoItems,
    label: 'Eksportuj bardzo długi raport podsumowujący cały kwartał',
    menuAriaLabel: 'Więcej opcji eksportu raportu',
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.dataset.splitButtonMobile = '';
    Object.assign(wrapper.style, { maxInlineSize: '100%', paddingBlock: '1rem', width: '18rem' });
    wrapper.append(renderSplitButton(args));
    return wrapper;
  },
};
