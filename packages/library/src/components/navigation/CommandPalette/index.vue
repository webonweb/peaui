<script lang="ts">
import type {
  CommandPaletteCommand,
  CommandPaletteFilter,
  CommandPaletteGroup,
  CommandPaletteMode,
  CommandPaletteShortcut,
} from './command-palette.shared';

export interface CommandPaletteProps {
  commands?: readonly CommandPaletteCommand[];
  open?: boolean;
  query?: string;
  activeId?: string | null;
  recentIds?: readonly string[];
  shortcut?: CommandPaletteShortcut;
  registerShortcut?: boolean;
  filter?: CommandPaletteFilter;
  groups?: readonly CommandPaletteGroup[];
  loading?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  closeOnExecute?: boolean;
  dataTestId?: string;
  mode?: CommandPaletteMode;
  virtual?: boolean;
  virtualThreshold?: number;
  virtualHeight?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}

export type {
  CommandPaletteCommand,
  CommandPaletteExecutionContext,
  CommandPaletteExecutionErrorDetail,
  CommandPaletteExecutionSuccessDetail,
  CommandPaletteFilter,
  CommandPaletteGroup,
  CommandPaletteLevelChangeDetail,
  CommandPaletteMode,
  CommandPaletteResolvedCommand,
  CommandPaletteSection,
  CommandPaletteShortcut,
  CommandPaletteTriggerState,
} from './command-palette.shared';
</script>

<script setup lang="ts">
import ModalDialog from '@/components/overlayer/ModalDialog/index.vue';
import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  watch,
} from 'vue';

import CommandPalettePanel from './CommandPalettePanel.vue';
import {
  flattenCommandPaletteSections,
  getNextCommandPaletteActiveId,
  isCommandPaletteEditableTarget,
  matchesCommandPaletteShortcut,
  resolveCommandPaletteSections,
  type CommandPaletteExecutionErrorDetail,
  type CommandPaletteExecutionSuccessDetail,
  type CommandPaletteLevelChangeDetail,
  type CommandPaletteTriggerState,
} from './command-palette.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CommandPaletteProps>(), {
  commands: () => [],
  recentIds: () => [],
  shortcut: () => ['Mod', 'K'],
  registerShortcut: true,
  groups: () => [],
  loading: false,
  placeholder: 'Type a command',
  ariaLabel: 'Command palette',
  closeOnExecute: true,
  mode: 'modal',
  virtual: false,
  virtualThreshold: 200,
  virtualHeight: 384,
  emptyTitle: 'No commands found',
  emptyDescription: 'Try another phrase.',
});

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void;
  (event: 'update:query', value: string): void;
  (event: 'update:activeId', value: string | null): void;
  (event: 'select', value: CommandPaletteCommand): void;
  (event: 'execute', value: CommandPaletteCommand): void;
  (event: 'executionSuccess', value: CommandPaletteExecutionSuccessDetail): void;
  (event: 'executionError', value: CommandPaletteExecutionErrorDetail): void;
  (event: 'levelChange', value: CommandPaletteLevelChangeDetail): void;
}>();

const slots = defineSlots<{
  trigger?: (state: CommandPaletteTriggerState) => unknown;
  header?: () => unknown;
  command?: (state: {
    active: boolean;
    command: CommandPaletteCommand;
    executing: boolean;
    query: string;
  }) => unknown;
  group?: (state: { group: ReturnType<typeof resolveCommandPaletteSections>[number] }) => unknown;
  empty?: (state: { query: string }) => unknown;
  loading?: () => unknown;
  error?: (state: { error: string }) => unknown;
  footer?: () => unknown;
  breadcrumb?: (state: { path: readonly CommandPaletteCommand[]; goBack: () => void }) => unknown;
}>();

const internalOpen = ref(false);
const internalQuery = ref('');
const internalActiveId = ref<string | null>(null);
const path = ref<CommandPaletteCommand[]>([]);
const executingId = ref<string | null>(null);
const executionError = ref('');
const executionVersion = ref(0);
const panel = ref<InstanceType<typeof CommandPalettePanel> | null>(null);
const previousFocus = ref<HTMLElement | null>(null);
const listId = `peaui-command-palette-${useId()}-list`;

const componentInstance = getCurrentInstance();
const isOpenControlled = (): boolean =>
  Object.prototype.hasOwnProperty.call(componentInstance?.vnode.props ?? {}, 'open');
const isOpen = computed(() => (isOpenControlled() ? props.open === true : internalOpen.value));
const query = computed(() => props.query ?? internalQuery.value);
const activeId = computed(() => props.activeId ?? internalActiveId.value);
const currentCommands = computed<readonly CommandPaletteCommand[]>(() =>
  path.value.length > 0 ? (path.value.at(-1)?.children ?? []) : props.commands,
);
const sections = computed(() =>
  resolveCommandPaletteSections({
    commands: currentCommands.value,
    filter: props.filter,
    groups: props.groups,
    query: query.value,
    recentIds: path.value.length ? [] : props.recentIds,
  }),
);
const results = computed(() => flattenCommandPaletteSections(sections.value));
const useVirtualList = computed(
  () => props.virtual || results.value.length >= props.virtualThreshold,
);
const triggerState = computed<CommandPaletteTriggerState>(() => ({
  close: closePalette,
  open: isOpen.value,
  openPalette,
  toggle: togglePalette,
}));

function setOpen(value: boolean): void {
  if (!isOpenControlled()) internalOpen.value = value;
  emit('update:open', value);
}

function setQuery(value: string): void {
  if (props.query === undefined) internalQuery.value = value;
  executionError.value = '';
  emit('update:query', value);
}

function setActiveId(value: string | null): void {
  if (props.activeId === undefined) internalActiveId.value = value;
  emit('update:activeId', value);
}

function openPalette(): void {
  setOpen(true);
}

function closePalette(): void {
  setOpen(false);
}

function togglePalette(): void {
  setOpen(!isOpen.value);
}

function emitLevelChange(): void {
  emit('levelChange', { commands: currentCommands.value, path: [...path.value] });
}

function enterLevel(command: CommandPaletteCommand): void {
  if (!command.children?.length) return;
  path.value = [...path.value, command];
  setQuery('');
  setActiveId(null);
  emitLevelChange();
}

function leaveLevel(): void {
  if (!path.value.length) return;
  path.value = path.value.slice(0, -1);
  setQuery('');
  setActiveId(null);
  emitLevelChange();
}

async function executeCommand(command: CommandPaletteCommand): Promise<void> {
  if (command.disabled || executingId.value) return;
  emit('select', command);
  if (command.children?.length) {
    enterLevel(command);
    return;
  }

  const version = ++executionVersion.value;
  executingId.value = command.id;
  executionError.value = '';
  emit('execute', command);
  try {
    const result = await command.execute?.({ command, path: [...path.value], query: query.value });
    if (version !== executionVersion.value) return;
    emit('executionSuccess', { command, result });
    if (props.closeOnExecute) closePalette();
  } catch (error) {
    if (version !== executionVersion.value) return;
    executionError.value = error instanceof Error ? error.message : 'Command failed';
    emit('executionError', { command, error });
  } finally {
    if (version === executionVersion.value) executingId.value = null;
  }
}

function moveActive(direction: 1 | -1 | 'first' | 'last'): void {
  setActiveId(getNextCommandPaletteActiveId(results.value, activeId.value, direction));
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    moveActive(event.key === 'ArrowDown' ? 1 : -1);
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    moveActive(event.key === 'Home' ? 'first' : 'last');
  } else if (event.key === 'Enter') {
    event.preventDefault();
    const active = results.value.find(({ command }) => command.id === activeId.value)?.command;
    if (active) void executeCommand(active);
  } else if (event.key === 'Escape') {
    event.preventDefault();
    path.value.length ? leaveLevel() : closePalette();
  } else if (event.key === 'Backspace' && !query.value && path.value.length) {
    event.preventDefault();
    leaveLevel();
  }
}

function handleGlobalShortcut(event: KeyboardEvent): void {
  if (
    props.registerShortcut === false ||
    isCommandPaletteEditableTarget(event.target) ||
    !matchesCommandPaletteShortcut(event, props.shortcut ?? ['Mod', 'K'])
  ) {
    return;
  }
  event.preventDefault();
  togglePalette();
}

watch(
  results,
  (nextResults) => {
    if (!nextResults.some(({ command }) => command.id === activeId.value && !command.disabled)) {
      setActiveId(getNextCommandPaletteActiveId(nextResults, null, 'first'));
    }
  },
  { immediate: true },
);

watch(isOpen, async (open) => {
  if (open) {
    if (typeof document !== 'undefined')
      previousFocus.value = document.activeElement as HTMLElement;
    await nextTick();
    panel.value?.focusSearch();
  } else {
    path.value = [];
    executionError.value = '';
    await nextTick();
    previousFocus.value?.focus();
    previousFocus.value = null;
  }
});

onMounted(() => document.addEventListener('keydown', handleGlobalShortcut, true));
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleGlobalShortcut, true);
  executionVersion.value += 1;
});

defineExpose({ closePalette, focusSearch: () => panel.value?.focusSearch(), openPalette });
</script>

<template>
  <slot name="trigger" v-bind="triggerState" />

  <ModalDialog
    v-if="mode === 'modal'"
    :ariaLabel="ariaLabel"
    :data-test-id="dataTestId ? `${dataTestId}-dialog` : undefined"
    :open="isOpen"
    @update:open="setOpen"
  >
    <template #header>
      <slot name="header">{{ ariaLabel }}</slot>
    </template>
    <CommandPalettePanel
      v-if="isOpen"
      ref="panel"
      :active-id="activeId"
      :ariaLabel="ariaLabel"
      :data-test-id="dataTestId"
      :empty-description="emptyDescription"
      :empty-title="emptyTitle"
      :error="executionError"
      :executing-id="executingId"
      :list-id="listId"
      :loading="loading"
      :path="path"
      :placeholder="placeholder"
      :query="query"
      :results="results"
      :sections="sections"
      :virtual="useVirtualList"
      :virtual-height="virtualHeight"
      @active-change="setActiveId"
      @back="leaveLevel"
      @keydown="handleKeydown"
      @query-change="setQuery"
      @select="executeCommand"
    >
      <template v-if="slots.command" #command="state"
        ><slot name="command" v-bind="state"
      /></template>
      <template v-if="slots.group" #group="state"><slot name="group" v-bind="state" /></template>
      <template v-if="slots.empty" #empty="state"><slot name="empty" v-bind="state" /></template>
      <template v-if="slots.loading" #loading><slot name="loading" /></template>
      <template v-if="slots.error" #error="state"><slot name="error" v-bind="state" /></template>
      <template v-if="slots.footer" #footer><slot name="footer" /></template>
      <template v-if="slots.breadcrumb" #breadcrumb="state"
        ><slot name="breadcrumb" v-bind="state"
      /></template>
    </CommandPalettePanel>
  </ModalDialog>

  <section
    v-else-if="isOpen"
    class="peaui-command-palette peaui-command-palette--embedded"
    role="dialog"
    :aria-label="ariaLabel"
  >
    <header class="peaui-command-palette__embedded-header">
      <slot name="header">{{ ariaLabel }}</slot>
    </header>
    <CommandPalettePanel
      ref="panel"
      :active-id="activeId"
      :ariaLabel="ariaLabel"
      :data-test-id="dataTestId"
      :empty-description="emptyDescription"
      :empty-title="emptyTitle"
      :error="executionError"
      :executing-id="executingId"
      :list-id="listId"
      :loading="loading"
      :path="path"
      :placeholder="placeholder"
      :query="query"
      :results="results"
      :sections="sections"
      :virtual="useVirtualList"
      :virtual-height="virtualHeight"
      @active-change="setActiveId"
      @back="leaveLevel"
      @keydown="handleKeydown"
      @query-change="setQuery"
      @select="executeCommand"
    >
      <template v-if="slots.command" #command="state"
        ><slot name="command" v-bind="state"
      /></template>
      <template v-if="slots.group" #group="state"><slot name="group" v-bind="state" /></template>
      <template v-if="slots.empty" #empty="state"><slot name="empty" v-bind="state" /></template>
      <template v-if="slots.loading" #loading><slot name="loading" /></template>
      <template v-if="slots.error" #error="state"><slot name="error" v-bind="state" /></template>
      <template v-if="slots.footer" #footer><slot name="footer" /></template>
      <template v-if="slots.breadcrumb" #breadcrumb="state"
        ><slot name="breadcrumb" v-bind="state"
      /></template>
    </CommandPalettePanel>
  </section>
</template>
