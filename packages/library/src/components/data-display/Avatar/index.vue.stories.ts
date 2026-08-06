import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';

import { avatarDemoImage, avatarDemoProps } from './avatar.demo';
import AvatarComponent from './index.vue';

const meta = {
  title: '2. Data Display/Avatar',
  component: AvatarComponent,
  parameters: {
    name: 'Avatar',
    description:
      'Dostępny awatar z kolejnością fallbacków obraz → inicjały → ikona, stabilnym rozmiarem, statusem obecności i opcjonalnym trybem interaktywnym.',
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
    shape: { control: 'select', options: ['circle', 'rounded'] },
    status: { control: 'select', options: ['none', 'online', 'offline', 'away', 'busy'] },
    loading: { control: 'select', options: ['lazy', 'eager'] },
  },
} satisfies Meta<typeof AvatarComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const { getSettings } = useSettingsStorie();

export const Playground: Story = {
  render: (args) => ({
    components: { AvatarComponent, StoryContent },
    setup: () => ({ args, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <AvatarComponent v-bind="args" />
      </StoryContent>
    `,
  }),
  args: { ...avatarDemoProps },
};

export const FallbackOrder: Story = {
  render: () => ({
    components: { AvatarComponent, StoryContent },
    setup: () => ({ avatarDemoImage, settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:1rem">
          <AvatarComponent :src="avatarDemoImage" alt="Portret Anny Kowalskiej" name="Anna Kowalska" size="xl" />
          <AvatarComponent name="Anna Maria Kowalska" size="xl" />
          <AvatarComponent initials="pea" aria-label="Zespół PEAUI" size="xl" />
          <AvatarComponent aria-label="Nieznany użytkownik" fallback-icon="users" size="xl" />
          <AvatarComponent name="DługiWieloczłonowyTekstBezSpacji" size="xl" />
        </div>
      </StoryContent>
    `,
  }),
};

export const SizesShapesAndStatuses: Story = {
  render: () => ({
    components: { AvatarComponent, StoryContent },
    setup: () => ({
      settings: getSettings(meta),
      shapes: ['circle', 'rounded'],
      sizes: ['xs', 's', 'm', 'l', 'xl'],
      statuses: ['online', 'offline', 'away', 'busy'],
    }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1.5rem">
          <div v-for="shape in shapes" :key="shape" style="display:flex;align-items:center;gap:1rem">
            <AvatarComponent v-for="size in sizes" :key="size" name="Anna Kowalska" :shape="shape" :size="size" />
          </div>
          <div style="display:flex;align-items:center;gap:1rem">
            <AvatarComponent v-for="status in statuses" :key="status" name="Anna Kowalska" :status="status" :status-label="status" size="l" />
          </div>
        </div>
      </StoryContent>
    `,
  }),
};

export const LoadingErrorAndCustomContent: Story = {
  render: () => ({
    components: { AvatarComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:1rem;padding:1rem;background:#172033;border-radius:.75rem">
          <AvatarComponent src="/missing-avatar.jpg" name="Bardzo Długa Nazwa Użytkownika" size="xl" status="offline" />
          <AvatarComponent aria-label="Niestandardowy awatar" size="xl" status="busy" status-label="Nie przeszkadzać">
            <span aria-hidden="true">UI</span>
            <template #status>!</template>
          </AvatarComponent>
        </div>
      </StoryContent>
    `,
  }),
};

export const Interactive: Story = {
  render: () => ({
    components: { AvatarComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:flex;gap:1rem">
          <AvatarComponent interactive aria-label="Otwórz profil Anny" name="Anna Kowalska" size="l" status="online" />
          <AvatarComponent interactive disabled aria-label="Profil Anny jest niedostępny" name="Anna Kowalska" size="l" />
        </div>
      </StoryContent>
    `,
  }),
};
