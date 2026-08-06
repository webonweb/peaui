import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  renderVueCustomElementStory,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import { avatarGroupDemoItems } from './avatar-group.demo';
import AvatarGroupVueComponent from './index.vue';
import { AvatarGroupElement, defineAvatarGroup } from './index.wc';

defineAvatarGroup();

const meta = {
  title: '2. Data Display/AvatarGroup WC',
  component: AvatarGroupElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(AvatarGroupVueComponent),
    ariaLabel: 'Zespół projektu',
    items: avatarGroupDemoItems,
    maxVisible: 3,
    overflowMode: 'popover',
    size: 'l',
  },
  argTypes: createVueCustomElementArgTypes(AvatarGroupVueComponent),
  parameters: {
    name: 'AvatarGroup',
    description:
      'Web Component korzystający z tego samego light DOM, CSS, kontraktu ARIA i obsługi klawiatury co wariant Vue.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-display/AvatarGroup';
  import '@peaui/ui/styles.css';
</script>

<peaui-avatar-group max-visible="3" overflow-mode="popover"></peaui-avatar-group>
    `,
  },
  render: (args: VueCustomElementStoryArgs) =>
    renderVueCustomElementStory(AvatarGroupElement.tagName, args),
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const Empty: Story = { args: { items: [] } };
export const OverflowCount: Story = { args: { maxVisible: 2, overflowMode: 'count' } };
export const OpenPopover: Story = { args: { maxVisible: 2, open: true, overflowMode: 'popover' } };
export const SpacedRounded: Story = { args: { overlap: false, shape: 'rounded' } };
export const StartDirection: Story = { args: { direction: 'start' } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = {
  args: { loading: true, maxVisible: 2, open: true, overflowMode: 'popover' },
};
