import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import ScrollArea from './index.vue';
import { scrollAreaDemoItems } from './scroll-area.demo';
import type { ScrollAreaHandle } from './scroll-area.shared';

const { getSettings } = useSettingsStorie();

const meta = {
  title: '6. Layout/ScrollArea',
  component: ScrollArea,
  args: {
    ariaLabel: 'Sekcje raportu',
    autoHideDelay: 700,
    dataTestId: 'scroll-area',
    orientation: 'vertical',
    scrollbarSize: 10,
    scrollbarVisibility: 'auto',
    tabindex: 0,
    type: 'styled',
  },
  argTypes: {
    type: { control: 'select', options: ['native', 'styled'] },
    orientation: { control: 'select', options: ['vertical', 'horizontal', 'both'] },
    scrollbarVisibility: { control: 'select', options: ['auto', 'always', 'hover'] },
    scrollbarSize: { control: { type: 'range', min: 6, max: 20, step: 1 } },
  },
  parameters: {
    name: 'ScrollArea',
    description:
      'Natywny viewport z opcjonalnymi paskami PeaUI, logiczną pozycją RTL, dostępną klawiaturą i publicznym API przewijania.',
    code: `<ScrollArea ariaLabel="Sekcje raportu" :tabindex="0" style="block-size: 18rem">
  <article v-for="item in items" :key="item.id">...</article>
</ScrollArea>`,
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderVertical = (args: Record<string, unknown>) => ({
  components: { ScrollArea, StoryContent },
  setup() {
    const settings = getSettings(meta);
    return { args, items: scrollAreaDemoItems, settings };
  },
  template: `
    <StoryContent :settings>
      <ScrollArea v-bind="args" style="block-size: 18rem; max-inline-size: 40rem;">
        <div style="display: grid; gap: 0.625rem; padding: 0.75rem;">
          <article
            v-for="item in items"
            :id="item.id"
            :key="item.id"
            style="padding: 0.875rem; border: 1px solid #dfe5eb; border-radius: 0.625rem; background: #fff;"
          >
            <strong>{{ item.title }}</strong>
            <p style="margin: 0.25rem 0 0;">{{ item.description }}</p>
          </article>
        </div>
      </ScrollArea>
    </StoryContent>
  `,
});

export const Vertical: Story = { render: renderVertical };
export const Native: Story = { args: { type: 'native' }, render: renderVertical };
export const AlwaysVisible: Story = {
  args: { scrollbarVisibility: 'always' },
  render: renderVertical,
};
export const HoverVisible: Story = {
  args: { scrollbarVisibility: 'hover' },
  render: renderVertical,
};

export const NoOverflow: Story = {
  render: (args) => ({
    components: { ScrollArea, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `<StoryContent :settings><ScrollArea v-bind="args" style="block-size: 12rem;"><p style="padding: 1rem;">Krótka treść bez przepełnienia.</p></ScrollArea></StoryContent>`,
  }),
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal', scrollbarVisibility: 'always' },
  render: (args) => ({
    components: { ScrollArea, StoryContent },
    setup() {
      return { args, items: scrollAreaDemoItems.slice(0, 6), settings: getSettings(meta) };
    },
    template: `
      <StoryContent :settings>
        <ScrollArea v-bind="args" style="block-size: 12rem; max-inline-size: 40rem;">
          <div style="display: flex; inline-size: max-content; gap: 0.75rem; padding: 0.75rem;">
            <article v-for="item in items" :key="item.id" style="inline-size: 14rem; padding: 1rem; border: 1px solid #dfe5eb; border-radius: 0.625rem;">
              <strong>{{ item.title }}</strong><p>{{ item.description }}</p>
            </article>
          </div>
        </ScrollArea>
      </StoryContent>`,
  }),
};

export const BothAxes: Story = {
  args: { orientation: 'both', scrollbarVisibility: 'always' },
  render: (args) => ({
    components: { ScrollArea, StoryContent },
    setup() {
      return { args, settings: getSettings(meta) };
    },
    template: `<StoryContent :settings><ScrollArea v-bind="args" style="block-size: 18rem; inline-size: min(100%, 32rem);"><div style="inline-size: 54rem; block-size: 36rem; padding: 1rem; background: repeating-linear-gradient(45deg, #f5f8fa, #f5f8fa 20px, #fff 20px, #fff 40px);">Duża powierzchnia w obu osiach</div></ScrollArea></StoryContent>`,
  }),
};

export const RTL: Story = {
  args: { orientation: 'horizontal', scrollbarVisibility: 'always' },
  render: (args) => ({
    components: { ScrollArea, StoryContent },
    setup() {
      return { args, items: scrollAreaDemoItems.slice(0, 6), settings: getSettings(meta) };
    },
    template: `<StoryContent :settings><ScrollArea v-bind="args" dir="rtl" style="block-size: 10rem; max-inline-size: 40rem;"><div style="display:flex;inline-size:max-content;gap:.75rem;padding:.75rem;"><article v-for="item in items" :key="item.id" style="inline-size:14rem;padding:1rem;border:1px solid #dfe5eb;border-radius:.625rem;">{{ item.title }}</article></div></ScrollArea></StoryContent>`,
  }),
};

export const Programmatic: Story = {
  render: (args) => ({
    components: { ScrollArea, StoryContent },
    setup() {
      const area = ref<ScrollAreaHandle>();
      return { area, args, items: scrollAreaDemoItems, settings: getSettings(meta) };
    },
    template: `<StoryContent :settings><div style="display:grid;gap:.75rem;"><button type="button" @click="area?.scrollIntoView('#section-10', { behavior: 'smooth', block: 'start' })">Przejdź do sekcji 10</button><ScrollArea ref="area" v-bind="args" style="block-size:18rem;"><div style="display:grid;gap:.625rem;padding:.75rem;"><article v-for="item in items" :id="item.id" :key="item.id" style="padding:1rem;border:1px solid #dfe5eb;border-radius:.625rem;">{{ item.title }}</article></div></ScrollArea></div></StoryContent>`,
  }),
};

export const DynamicAndNarrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => ({
    components: { ScrollArea, StoryContent },
    setup() {
      const count = ref(4);
      return { args, count, items: scrollAreaDemoItems, settings: getSettings(meta) };
    },
    template: `<StoryContent :settings><div style="display:grid;inline-size:min(100%,14rem);gap:.75rem;"><button type="button" @click="count = count === 4 ? 12 : 4">Zmień liczbę elementów</button><ScrollArea v-bind="args" style="block-size:16rem;"><div style="display:grid;gap:.5rem;padding:.625rem;"><article v-for="item in items.slice(0,count)" :key="item.id" style="padding:.75rem;border:1px solid #dfe5eb;border-radius:.5rem;">{{ item.title }}</article></div></ScrollArea></div></StoryContent>`,
  }),
};

export const Nested: Story = {
  render: (args) => ({
    components: { ScrollArea, StoryContent },
    setup() {
      return { args, items: scrollAreaDemoItems, settings: getSettings(meta) };
    },
    template: `<StoryContent :settings><ScrollArea v-bind="args" aria-label="Zewnętrzny obszar" style="block-size:22rem;"><div style="display:grid;gap:1rem;padding:1rem;"><p v-for="item in items.slice(0,3)" :key="item.id">{{ item.description }}</p><ScrollArea aria-label="Wewnętrzny obszar" orientation="horizontal" scrollbar-visibility="always" style="block-size:9rem;"><div style="inline-size:48rem;padding:1rem;">Niezależna zawartość pozioma</div></ScrollArea><p v-for="item in items.slice(3,8)" :key="item.id">{{ item.description }}</p></div></ScrollArea></StoryContent>`,
  }),
};
