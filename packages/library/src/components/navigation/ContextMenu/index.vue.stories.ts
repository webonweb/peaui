import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import { contextMenuDemoItems, contextMenuDemoProps } from './context-menu.demo';
import ContextMenuComponent from './index.vue';

const targetStyle =
  'box-sizing:border-box;display:flex;align-items:center;min-height:7rem;padding:1.25rem;border:1px solid var(--peaui-color-grey-300);border-radius:.75rem;background:var(--peaui-color-grey-50);cursor:context-menu';

const meta = {
  title: '6. Navigation/ContextMenu',
  component: ContextMenuComponent,
  parameters: {
    name: 'ContextMenu',
    description:
      'Dostępne menu kontekstowe uruchamiane prawym przyciskiem, Shift+F10/Menu lub bezpiecznym long press. Współdzieli role, nawigację, typy pozycji i wygląd z DropdownMenu.',
  },
  argTypes: {
    density: { control: 'select', options: ['compact', 'comfortable'] },
    position: { control: 'select', options: ['cursor', 'target'] },
    trigger: { control: 'select', options: ['pointer', 'keyboard', 'both'] },
  },
} satisfies Meta<typeof ContextMenuComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

export const Playground: Story = {
  render: (args) => ({
    components: { ContextMenuComponent, StoryContent },
    setup: () => ({ args, settings: getSettings(meta), targetStyle }),
    template: `
      <StoryContent :settings>
        <ContextMenuComponent v-bind="args" v-model:open="args.open">
          <div class="context-story-target" :style="targetStyle">Raport kwartalny — prawy przycisk lub Shift+F10</div>
        </ContextMenuComponent>
      </StoryContent>
    `,
  }),
  args: { ...contextMenuDemoProps, open: false },
};

export const PointerActivation: Story = {
  render: () => ({
    components: { ContextMenuComponent, StoryContent },
    setup: () => ({ contextMenuDemoItems, settings: getSettings(meta), targetStyle }),
    template: `
      <StoryContent :settings>
        <ContextMenuComponent :items="contextMenuDemoItems" :context="{ id: 'report-q3' }" aria-label="Akcje raportu" data-test-id="context-pointer">
          <button class="context-story-target" type="button" :style="targetStyle">Raport kwartalny</button>
        </ContextMenuComponent>
      </StoryContent>
    `,
  }),
};

export const KeyboardActivation: Story = {
  render: () => ({
    components: { ContextMenuComponent, StoryContent },
    setup: () => ({ contextMenuDemoItems, settings: getSettings(meta), targetStyle }),
    template: `
      <StoryContent :settings>
        <ContextMenuComponent :items="contextMenuDemoItems" position="target" aria-label="Akcje dokumentu" data-test-id="context-keyboard">
          <button class="context-story-target" type="button" :style="targetStyle">Ustaw fokus i naciśnij Shift+F10</button>
        </ContextMenuComponent>
      </StoryContent>
    `,
  }),
};

export const LongPress: Story = {
  render: () => ({
    components: { ContextMenuComponent, StoryContent },
    setup: () => ({ contextMenuDemoItems, settings: getSettings(meta), targetStyle }),
    template: `
      <StoryContent :settings>
        <ContextMenuComponent :items="contextMenuDemoItems" :long-press-delay="350" data-test-id="context-long-press">
          <div class="context-story-target" :style="targetStyle">Przytrzymaj palec; ruch anuluje otwarcie i pozostawia przewijanie</div>
        </ContextMenuComponent>
      </StoryContent>
    `,
  }),
};

export const ViewportEdges: Story = {
  render: () => ({
    components: { ContextMenuComponent, StoryContent },
    setup: () => ({ contextMenuDemoItems, settings: getSettings(meta), targetStyle }),
    template: `
      <StoryContent :settings>
        <div data-context-edge-grid style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-content:space-between;justify-items:stretch;gap:clamp(2rem,16vw,16rem);max-width:100%;min-width:0;width:100%;min-height:40rem">
          <ContextMenuComponent v-for="corner in ['top-left','top-right','bottom-left','bottom-right']" :key="corner" :items="contextMenuDemoItems" :data-test-id="'edge-' + corner">
            <button class="context-story-target" type="button" :style="targetStyle">{{ corner }}</button>
          </ContextMenuComponent>
        </div>
      </StoryContent>
    `,
  }),
};

export const Submenu: Story = {
  render: () => ({
    components: { ContextMenuComponent, StoryContent },
    setup: () => ({ contextMenuDemoItems, settings: getSettings(meta), targetStyle }),
    template: `
      <StoryContent :settings>
        <ContextMenuComponent :items="contextMenuDemoItems" aria-label="Akcje z podmenu">
          <div class="context-story-target" :style="targetStyle">Wszystkie typy pozycji i dwupoziomowe podmenu</div>
        </ContextMenuComponent>
      </StoryContent>
    `,
  }),
};

export const DynamicContext: Story = {
  render: () => ({
    components: { ContextMenuComponent, StoryContent },
    setup: () => ({ contextMenuDemoItems, settings: getSettings(meta), targetStyle }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem">
          <ContextMenuComponent v-for="record in [{id:1,name:'Raport A'},{id:2,name:'Raport B'}]" :key="record.id" :items="contextMenuDemoItems" :context="record">
            <button class="context-story-target" type="button" :style="targetStyle">{{ record.name }}</button>
          </ContextMenuComponent>
        </div>
      </StoryContent>
    `,
  }),
};

export const RemovedTarget: Story = {
  render: () => ({
    components: { ContextMenuComponent, StoryContent },
    setup: () => ({
      contextMenuDemoItems,
      settings: getSettings(meta),
      show: ref(true),
      targetStyle,
    }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1rem">
          <ContextMenuComponent :items="contextMenuDemoItems">
            <button v-if="show" class="context-story-target" type="button" :style="targetStyle">Tymczasowy cel</button>
          </ContextMenuComponent>
          <button type="button" @click="show = false">Usuń aktywny cel</button>
        </div>
      </StoryContent>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    components: { ContextMenuComponent, StoryContent },
    setup: () => ({ contextMenuDemoItems, settings: getSettings(meta), targetStyle }),
    template: `
      <StoryContent :settings>
        <ContextMenuComponent :items="contextMenuDemoItems" disabled>
          <button class="context-story-target" type="button" :style="targetStyle">Natywne menu pozostaje dostępne</button>
        </ContextMenuComponent>
      </StoryContent>
    `,
  }),
};
