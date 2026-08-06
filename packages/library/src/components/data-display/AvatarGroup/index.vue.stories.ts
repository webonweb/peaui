import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';

import { avatarGroupDemoItems, avatarGroupDemoProps } from './avatar-group.demo';
import AvatarGroupComponent from './index.vue';

const meta = {
  title: '2. Data Display/AvatarGroup',
  component: AvatarGroupComponent,
  parameters: {
    name: 'AvatarGroup',
    description:
      'Dostępna grupa awatarów z kontrolowanym limitem, stabilną kolejnością DOM, licznikiem nadmiaru i opcjonalnym popoverem.',
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
    shape: { control: 'select', options: ['circle', 'rounded'] },
    direction: { control: 'select', options: ['start', 'end'] },
    overflowMode: { control: 'select', options: ['count', 'popover', 'none'] },
  },
} satisfies Meta<typeof AvatarGroupComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const { getSettings } = useSettingsStorie();

export const Playground: Story = {
  render: (args) => ({
    components: { AvatarGroupComponent, StoryContent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <AvatarGroupComponent v-bind="args" />
      </StoryContent>
    `,
  }),
  args: { ...avatarGroupDemoProps },
};

export const EmptyAndSmallGroups: Story = {
  render: () => ({
    components: { AvatarGroupComponent, StoryContent },
    setup: () => ({ avatarGroupDemoItems, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1.5rem">
          <AvatarGroupComponent :items="[]" aria-label="Pusty zespół" />
          <AvatarGroupComponent :items="avatarGroupDemoItems.slice(0, 1)" aria-label="Jedna osoba" />
          <AvatarGroupComponent :items="avatarGroupDemoItems.slice(0, 3)" aria-label="Trzy osoby" />
        </div>
      </StoryContent>
    `,
  }),
};

export const LayoutsDirectionsAndStatuses: Story = {
  render: () => ({
    components: { AvatarGroupComponent, StoryContent },
    setup: () => ({ avatarGroupDemoItems, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1.75rem">
          <AvatarGroupComponent :items="avatarGroupDemoItems" :max-visible="5" direction="start" size="l" />
          <AvatarGroupComponent :items="avatarGroupDemoItems" :max-visible="5" direction="end" size="l" />
          <AvatarGroupComponent :items="avatarGroupDemoItems" :max-visible="5" :overlap="false" shape="rounded" size="l" />
        </div>
      </StoryContent>
    `,
  }),
};

export const OverflowCount: Story = {
  args: { ...avatarGroupDemoProps, maxVisible: 2, overflowMode: 'count' },
};

export const ControlledPopover: Story = {
  render: (args) => ({
    components: { AvatarGroupComponent, StoryContent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <AvatarGroupComponent v-bind="args" v-model:open="args.open" />
      </StoryContent>
    `,
  }),
  args: { ...avatarGroupDemoProps, maxVisible: 2, open: true },
};

export const DisabledAndLoading: Story = {
  render: () => ({
    components: { AvatarGroupComponent, StoryContent },
    setup: () => ({ avatarGroupDemoItems, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1.5rem">
          <AvatarGroupComponent :items="avatarGroupDemoItems" disabled :max-visible="3" />
          <AvatarGroupComponent :items="avatarGroupDemoItems" loading :max-visible="2" open overflow-mode="popover" />
        </div>
      </StoryContent>
    `,
  }),
};

export const MobileAndLongNames: Story = {
  render: () => ({
    components: { AvatarGroupComponent, StoryContent },
    setup: () => ({
      items: [
        ...avatarGroupDemoItems,
        { id: 'long', name: 'Aleksandra Bardzo Długa Wieloczłonowa Nazwa Użytkownika' },
      ],
      settings: getSettings(meta),
    }),
    template: `
      <StoryContent :settings>
        <div style="width:220px;max-width:100%">
          <AvatarGroupComponent :items="items" :max-visible="2" open overflow-mode="popover" size="s" />
        </div>
      </StoryContent>
    `,
  }),
};

export const CustomRendering: Story = {
  render: () => ({
    components: { AvatarGroupComponent, StoryContent },
    setup: () => ({ avatarGroupDemoItems, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <AvatarGroupComponent :items="avatarGroupDemoItems" :max-visible="2" open overflow-mode="popover">
          <template #overflow="{ count }"><strong>+{{ count }}</strong></template>
          <template #popover-header>Pełny skład zespołu</template>
          <template #empty>Nie przypisano osób</template>
        </AvatarGroupComponent>
      </StoryContent>
    `,
  }),
};
