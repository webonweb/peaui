<script setup lang="ts">
import KeyboardKey from '@/components/data-display/KeyboardKey/index.vue';
import VirtualList from '@/components/data-display/VirtualList/index.vue';
import SearchInput from '@/components/data-entry/SearchInput/index.vue';
import EmptyState from '@/components/feedback/EmptyState/index.vue';
import SpinnerLoader from '@/components/feedback/SpinnerLoader/index.vue';
import { computed, nextTick, ref, useSlots, watch } from 'vue';

import type {
  CommandPaletteCommand,
  CommandPaletteResolvedCommand,
  CommandPaletteSection,
} from './command-palette.shared';

const props = defineProps<{
  activeId: string | null;
  ariaLabel: string;
  dataTestId?: string;
  emptyDescription: string;
  emptyTitle: string;
  error: string;
  executingId: string | null;
  listId: string;
  loading: boolean;
  path: readonly CommandPaletteCommand[];
  placeholder: string;
  query: string;
  results: readonly CommandPaletteResolvedCommand[];
  sections: readonly CommandPaletteSection[];
  virtual: boolean;
  virtualHeight: number;
}>();

const emit = defineEmits<{
  (event: 'activeChange', value: string | null): void;
  (event: 'back'): void;
  (event: 'keydown', value: KeyboardEvent): void;
  (event: 'queryChange', value: string): void;
  (event: 'select', value: CommandPaletteCommand): void;
}>();

const slots = useSlots();
const root = ref<HTMLElement | null>(null);
const virtualList = ref<InstanceType<typeof VirtualList> | null>(null);
const activeIndex = computed(() =>
  props.results.findIndex(({ command }) => command.id === props.activeId),
);
const activeDescendant = computed(() => (props.activeId ? optionId(props.activeId) : undefined));

function optionId(id: string): string {
  return `${props.listId}-option-${id.replace(/[^a-zA-Z0-9_-]/gu, '-')}`;
}

function groupId(id: string): string {
  return `${props.listId}-group-${id.replace(/[^a-zA-Z0-9_-]/gu, '-')}`;
}

function resolveVirtualCommand(item: unknown): CommandPaletteResolvedCommand {
  return item as CommandPaletteResolvedCommand;
}

function setVirtualActiveIndex(index: number | null): void {
  emit('activeChange', index === null ? null : (props.results[index]?.command.id ?? null));
}

function focusSearch(): void {
  const focusInput = (): boolean => {
    const input = root.value?.querySelector<HTMLInputElement>('.peaui-search-input__input');
    input?.focus();
    return input !== null && input !== undefined;
  };
  if (!focusInput()) void nextTick(focusInput);
}

watch(activeIndex, (index) => {
  if (props.virtual && index >= 0) virtualList.value?.scrollToIndex(index);
});

defineExpose({ focusSearch });
</script>

<template>
  <div
    ref="root"
    class="peaui-command-palette__panel"
    :data-testid="dataTestId"
    @keydown="emit('keydown', $event)"
  >
    <div v-if="path.length" class="peaui-command-palette__breadcrumb">
      <slot name="breadcrumb" :path="path" :go-back="() => emit('back')">
        <button type="button" class="peaui-command-palette__back" @click="emit('back')">
          <span aria-hidden="true">&#8592;</span>
          {{ path.map(({ label }) => label).join(' / ') }}
        </button>
      </slot>
    </div>

    <SearchInput
      :aria-activedescendant="activeDescendant"
      aria-autocomplete="list"
      :aria-controls="listId"
      :aria-expanded="true"
      aria-haspopup="listbox"
      :aria-label="ariaLabel"
      :data-test-id="dataTestId ? `${dataTestId}-search` : undefined"
      :debounce-time="0"
      :placeholder="placeholder"
      role="combobox"
      :value="query"
      @update:value="emit('queryChange', $event ?? '')"
    />

    <p class="peaui-command-palette__status" role="status" aria-live="polite" aria-atomic="true">
      <template v-if="loading">Loading commands</template>
      <template v-else-if="error">{{ error }}</template>
      <template v-else>{{ results.length }} results</template>
    </p>

    <div v-if="loading" class="peaui-command-palette__state">
      <slot name="loading">
        <SpinnerLoader :data-test-id="dataTestId ? `${dataTestId}-loading` : undefined" />
      </slot>
    </div>

    <div v-else-if="error" class="peaui-command-palette__state" role="alert">
      <slot name="error" :error="error">{{ error }}</slot>
    </div>

    <div v-else-if="!results.length" class="peaui-command-palette__state">
      <slot name="empty" :query="query">
        <EmptyState
          :data-test-id="dataTestId ? `${dataTestId}-empty` : undefined"
          :description="emptyDescription"
          :title="emptyTitle"
        />
      </slot>
    </div>

    <VirtualList
      v-else-if="virtual"
      :id="listId"
      ref="virtualList"
      :active-index="activeIndex >= 0 ? activeIndex : null"
      :aria-label="ariaLabel"
      :data-test-id="dataTestId ? `${dataTestId}-virtual-list` : undefined"
      :height="virtualHeight"
      :item-key="(item: unknown) => resolveVirtualCommand(item).command.id"
      :item-label="(item: unknown) => resolveVirtualCommand(item).command.label"
      :items="results"
      :item-size="64"
      semantic-role="listbox"
      @update:active-index="setVirtualActiveIndex"
    >
      <template #item="{ item, active }">
        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -- The search input handles keyboard activation of this virtual option. -->
        <div
          :id="optionId(resolveVirtualCommand(item).command.id)"
          :class="[
            'peaui-command-palette__command',
            active && 'peaui-command-palette__command--active',
            resolveVirtualCommand(item).command.disabled &&
              'peaui-command-palette__command--disabled',
          ]"
          :aria-disabled="resolveVirtualCommand(item).command.disabled || undefined"
          @click="emit('select', resolveVirtualCommand(item).command)"
          @mousedown.prevent
          @mousemove="emit('activeChange', resolveVirtualCommand(item).command.id)"
        >
          <slot
            name="command"
            :active="active"
            :command="resolveVirtualCommand(item).command"
            :executing="executingId === resolveVirtualCommand(item).command.id"
            :query="query"
          >
            <span class="peaui-command-palette__command-copy">
              <strong>{{ resolveVirtualCommand(item).command.label }}</strong>
              <small v-if="resolveVirtualCommand(item).command.description">
                {{ resolveVirtualCommand(item).command.description }}
              </small>
            </span>
            <KeyboardKey
              v-if="resolveVirtualCommand(item).command.shortcut"
              :keys="resolveVirtualCommand(item).command.shortcut!"
              muted
              size="xs"
            />
            <span v-if="resolveVirtualCommand(item).command.children?.length" aria-hidden="true">
              &#8594;
            </span>
            <span
              v-if="executingId === resolveVirtualCommand(item).command.id"
              class="peaui-command-palette__executing"
            >
              Running
            </span>
          </slot>
        </div>
      </template>
    </VirtualList>

    <div v-else :id="listId" class="peaui-command-palette__list" role="listbox">
      <section
        v-for="section in sections"
        :key="section.id"
        class="peaui-command-palette__group"
        role="group"
        :aria-labelledby="groupId(section.id)"
      >
        <div :id="groupId(section.id)" class="peaui-command-palette__group-label">
          <slot name="group" :group="section">{{ section.label }}</slot>
        </div>
        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -- The search input handles keyboard activation with aria-activedescendant. -->
        <div
          v-for="result in section.commands"
          :id="optionId(result.command.id)"
          :key="result.command.id"
          :aria-disabled="result.command.disabled || undefined"
          :aria-selected="activeId === result.command.id"
          :class="[
            'peaui-command-palette__command',
            activeId === result.command.id && 'peaui-command-palette__command--active',
            result.command.disabled && 'peaui-command-palette__command--disabled',
          ]"
          role="option"
          @click="emit('select', result.command)"
          @mousedown.prevent
          @mousemove="emit('activeChange', result.command.id)"
        >
          <slot
            name="command"
            :active="activeId === result.command.id"
            :command="result.command"
            :executing="executingId === result.command.id"
            :query="query"
          >
            <span class="peaui-command-palette__command-copy">
              <strong>{{ result.command.label }}</strong>
              <small v-if="result.command.description">{{ result.command.description }}</small>
            </span>
            <KeyboardKey
              v-if="result.command.shortcut"
              :keys="result.command.shortcut"
              muted
              size="xs"
            />
            <span v-if="result.command.children?.length" aria-hidden="true">&#8594;</span>
            <span v-if="executingId === result.command.id" class="peaui-command-palette__executing">
              Running
            </span>
          </slot>
        </div>
      </section>
    </div>

    <footer v-if="slots.footer" class="peaui-command-palette__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>
