import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FormSwitchToggleVueComponent from './index.vue';
import { defineFormSwitchToggle, FormSwitchToggleElement } from './index.wc';
import { formSwitchToggleDemoProps, formSwitchToggleLongLabel } from './form-switch-toggle.demo';

defineFormSwitchToggle();

function renderFormSwitch(args: VueCustomElementStoryArgs): HTMLElement {
  const element = document.createElement(FormSwitchToggleElement.tagName) as HTMLElement &
    Record<string, unknown>;
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }
  return element;
}

const meta = {
  title: '5. Form/FormSwitchToggle WC',
  component: FormSwitchToggleElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(FormSwitchToggleVueComponent),
    ...formSwitchToggleDemoProps,
  },
  argTypes: createVueCustomElementArgTypes(FormSwitchToggleVueComponent),
  parameters: {
    name: 'FormSwitchToggle',
    description:
      'Light-DOM Web Component zachowujący natywny formularz, ARIA, wartości domenowe, wygląd i responsywność Vue oraz React.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormSwitchToggle';
  import '@peaui/ui/styles.css';
</script>
<peaui-form-switch-toggle label="Powiadomienia" name="notifications"></peaui-form-switch-toggle>
    `,
  },
  render: renderFormSwitch,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const On: Story = { args: { value: true } };
export const Sizes: Story = { args: { size: 'l', value: true } };
export const CustomValues: Story = {
  args: { falseValue: 'disabled', trueValue: 'enabled', value: 'enabled' },
};
export const Disabled: Story = { args: { disabled: true, value: true } };
export const Readonly: Story = { args: { readonly: true, value: true } };
export const Loading: Story = { args: { loading: true } };
export const Error: Story = { args: { error: 'Włącz zgodę, aby kontynuować.', required: true } };
export const ResponsiveLongContent: Story = {
  args: {
    description: 'Długi opis zawija się bez zmniejszania szyny przełącznika.',
    label: formSwitchToggleLongLabel,
    showStateLabel: true,
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.dataset.switchResponsive = '';
    Object.assign(wrapper.style, { maxWidth: '100%', width: '18rem' });
    wrapper.append(renderFormSwitch(args));
    return wrapper;
  },
};
export const DarkMode: Story = {
  args: { value: true },
  parameters: { backgrounds: { default: 'dark' } },
};
