<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch, type ComponentPublicInstance } from 'vue';

import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import PopoverOverlayer from '@/components/overlayer/PopoverOverlayer/index.vue';

import type { TableColumn } from '../index.vue';
import { buildTableTestId, TABLE_LIST_CLASS } from '../shared';

const { actionsButtonsColumn, dataTestId, record } = defineProps<{
  actionsButtonsColumn: TableColumn;
  record: Record<string, any>;
  dataTestId?: string;
}>();

const emit = defineEmits<{
  (e: 'on:fire:action', action: string): void;
}>();

const isOpen = ref(false);
const rootReference = ref<HTMLTableCellElement | null>(null);
const triggerReference = ref<HTMLElement | null>(null);
const popoverReference = ref<{ hidePopover?: () => void } | null>(null);
const actionButtonReferences = ref<Array<HTMLButtonElement | null>>([]);

const resolvedActions = computed(() =>
  actionsButtonsColumn?.resolve
    ? (actionsButtonsColumn.resolve(record) as Array<Record<string, any>>)
    : [],
);

const isSimpleActions = computed(
  () => resolvedActions.value.length === 1 && Boolean(resolvedActions.value[0]?.simple),
);

const triggerTestId = computed(() => buildTableTestId(dataTestId, 'trigger'));
const popoverTriggerTestId = computed(() => {
  const popoverTestId = buildTableTestId(dataTestId, 'popover');

  return popoverTestId ? `${popoverTestId}-trigger` : undefined;
});

function getActionButtonTestId(actionKey: string): string | undefined {
  return buildTableTestId(dataTestId, 'action', actionKey);
}

function setActionButtonReference(
  element: Element | ComponentPublicInstance | null,
  index: number,
): void {
  actionButtonReferences.value[index] = element instanceof HTMLButtonElement ? element : null;
}

function getActionButtons(): HTMLButtonElement[] {
  return actionButtonReferences.value.filter(
    (button): button is HTMLButtonElement => button instanceof HTMLButtonElement,
  );
}

function focusActionButton(index: number): void {
  const buttons = getActionButtons();

  if (!buttons.length) {
    return;
  }

  const normalizedIndex = (index + buttons.length) % buttons.length;
  buttons[normalizedIndex]?.focus();
}

function syncTriggerReference(): void {
  if (!rootReference.value || !popoverTriggerTestId.value) {
    triggerReference.value = null;
    return;
  }

  triggerReference.value = rootReference.value.querySelector(
    `[data-testid="${popoverTriggerTestId.value}"]`,
  );
}

function closeActionsMenu(): void {
  popoverReference.value?.hidePopover?.();
  isOpen.value = false;

  nextTick(() => {
    triggerReference.value?.focus();
  });
}

function handleSelectAction(key: string): void {
  emit('on:fire:action', key);
  closeActionsMenu();
}

function handleActionButtonKeydown(event: KeyboardEvent, index: number, key: string): void {
  switch (event.key) {
    case 'ArrowDown':
    case 'Down':
      event.preventDefault();
      focusActionButton(index + 1);
      return;
    case 'ArrowUp':
    case 'Up':
      event.preventDefault();
      focusActionButton(index - 1);
      return;
    case 'Home':
      event.preventDefault();
      focusActionButton(0);
      return;
    case 'End':
      event.preventDefault();
      focusActionButton(getActionButtons().length - 1);
      return;
    case 'Escape':
      event.preventDefault();
      closeActionsMenu();
      return;
    case 'Enter':
    case ' ':
    case 'Spacebar':
      event.preventDefault();
      handleSelectAction(key);
      return;
    default:
      return;
  }
}

watch(isOpen, async (open) => {
  await nextTick();
  syncTriggerReference();

  if (!open) {
    return;
  }

  focusActionButton(0);
});

watch(
  resolvedActions,
  (actions) => {
    actionButtonReferences.value = Array.from({ length: actions.length }, () => null);
  },
  {
    immediate: true,
  },
);

onMounted(() => {
  syncTriggerReference();
});
</script>

<template>
  <td ref="rootReference" :class="`${TABLE_LIST_CLASS}__actions-cell`">
    <PopoverOverlayer
      ref="popoverReference"
      v-if="
        (actionsButtonsColumn.visibleColumn ? actionsButtonsColumn.visibleColumn(record) : true) &&
        !isSimpleActions
      "
      v-model:open="isOpen"
      :class="`${TABLE_LIST_CLASS}__actions-popover-trigger`"
      :dataTestId="buildTableTestId(dataTestId, 'popover')"
      :matchTriggerWidth="false"
      placement="left"
      :contentClass="`${TABLE_LIST_CLASS}__actions-popover`"
      ariaLabel="Pokaz akcje dla rekordu"
      role="button"
      tabindex="0"
    >
      <span
        :class="`${TABLE_LIST_CLASS}__actions-trigger`"
        :data-testid="triggerTestId"
        aria-hidden="true"
      >
        &bull; &bull; &bull;
      </span>

      <template #content>
        <div :class="`${TABLE_LIST_CLASS}__actions-menu`">
          <div :class="`${TABLE_LIST_CLASS}__actions-list`">
            <button
              v-for="(option, index) in resolvedActions"
              :key="option.key"
              type="button"
              :ref="(element) => setActionButtonReference(element, index)"
              :class="`${TABLE_LIST_CLASS}__actions-button`"
              :data-testid="getActionButtonTestId(option.key)"
              :aria-label="`Uruchom akcje ${option.label} dla rekordu`"
              @click.prevent="handleSelectAction(option.key)"
              @keydown="
                (event: KeyboardEvent) => handleActionButtonKeydown(event, index, option.key)
              "
            >
              <SvgIcon
                :class="`${TABLE_LIST_CLASS}__actions-button-icon`"
                :name="option.icon"
                aria-hidden="true"
              />
              <span :class="`${TABLE_LIST_CLASS}__actions-button-label`">{{ option.label }}</span>
            </button>
          </div>
        </div>
      </template>
    </PopoverOverlayer>

    <span :class="`${TABLE_LIST_CLASS}__actions-simple`" v-else>
      <span v-if="!isSimpleActions">&nbsp;</span>

      <button
        v-else
        type="button"
        :class="`${TABLE_LIST_CLASS}__actions-simple-button`"
        :aria-label="`Uruchom akcje ${resolvedActions[0]?.label} dla rekordu`"
        :data-testid="getActionButtonTestId(resolvedActions[0]?.key)"
        @click.prevent="emit('on:fire:action', resolvedActions[0]?.key)"
      >
        <SvgIcon
          :class="`${TABLE_LIST_CLASS}__actions-simple-icon`"
          :name="resolvedActions[0]?.icon"
          aria-hidden="true"
        />
      </button>
    </span>
  </td>
</template>
