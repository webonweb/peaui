import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import FullscreenContainerVueComponent from './index.ce.vue';
import { FullscreenContainerElement, defineFullscreenContainer } from './index.wc';
import {
  ButtonActionElement,
  defineButtonAction,
} from '@/components/data-entry/ButtonAction/index.wc';

defineFullscreenContainer();
defineButtonAction();

const meta = {
  title: '6. Layout/FullscreenContainer',
  component: FullscreenContainerElement.tagName,
  args: createVueCustomElementStoryArgs(FullscreenContainerVueComponent),
  argTypes: createVueCustomElementArgTypes(FullscreenContainerVueComponent),
  parameters: {
    name: 'FullscreenContainer',
    description:
      'Web Component zachowujący publiczne API, rendering i dostępność komponentu Vue FullscreenContainer.',
    code: `
<script type="module">
  import '@peaui/ui/wc/layout/FullscreenContainer';
</script>

<peaui-fullscreen-container></peaui-fullscreen-container>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(FullscreenContainerElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;

type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};

export const KeyboardInteraction: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    const element = new FullscreenContainerElement();
    Object.assign(element, args);
    element.innerHTML =
      '<peaui-button-action>Akcja w kontenerze</peaui-button-action><p>Po otwarciu pełnego ekranu Tab pozostaje wewnątrz. Escape zamyka widok i przywraca fokus.</p>';
    wrapper.innerHTML = '<peaui-button-action>Przed kontenerem</peaui-button-action>';
    wrapper.append(element);
    const after = new ButtonActionElement();
    after.textContent = 'Za kontenerem';
    wrapper.append(after);
    return wrapper;
  },
};
