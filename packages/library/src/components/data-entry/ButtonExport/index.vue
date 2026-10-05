<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useId } from 'vue';

defineOptions({ inheritAttrs: false });

// TYPES
//-----------------------------------------------------------------------------------------------//
type ButtonSize = 'xs' | 's' | 'm' | 'l';
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonType = 'button' | 'submit' | 'reset';
type Placement =
  'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import CounterBadge from '@/components/data-display/CounterBadge/index.vue';
import FormContainer from '@/components/form/FormContainer/index.vue';
import ModalDialog from '@/components/overlayer/ModalDialog/index.vue';
import PopoverButton from '@/components/overlayer/PopoverButton/index.vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const exportFileTypeOptions: { key: string; label: string }[] = [
  { key: 'csv', label: 'Do CSV' },
  { key: 'xlsx', label: 'Do XLSX' },
  { key: 'pdf', label: 'Do PDF' },
];

const isModalExportPromptOpen = ref(false);
const classNameComponent = `${UIKIT_NAME}-button-export`;
const id = useId();

const {
  size = 'm',
  variant = 'secondary',
  disabled = false,
  ariaLabel,
  dataTestId,
  placement = 'bottom',
  selectedItemsCount = 0,
  forceExport = false,
  useAriaLabel = false,
} = defineProps<{
  size?: ButtonSize;
  variant?: ButtonVariant;
  type?: ButtonType;
  disabled?: boolean;
  ariaLabel?: string;
  placement?: Placement;
  dataTestId?: string;
  selectedItemsCount?: number;
  forceExport?: boolean;
  useAriaLabel?: boolean;
}>();

const attrs = useAttrs();

const emit = defineEmits<{
  (e: 'on:export', type: string): void;
}>();

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const classes = computed(() => [classNameComponent]);
const iconTestId = computed(() => (dataTestId ? `${dataTestId}-icon` : undefined));
const arrowTestId = computed(() => (dataTestId ? `${dataTestId}-arrow` : undefined));
const buttonListTestId = computed(() => (dataTestId ? `${dataTestId}-button-type` : undefined));
const promptTestId = computed(() => (dataTestId ? `${dataTestId}-prompt` : undefined));
const contentRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);
const isKeyboardPopoverOpenRequest = ref(false);
const typeExportFile = ref<string | undefined>('');

const triggerAttrs = computed(() => ({
  ...attrs,
}));

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
const getOptionButtons = () =>
  Array.from(
    contentRef.value?.querySelectorAll<HTMLButtonElement>(
      `button.${classNameComponent}__content-button:not(:disabled)`,
    ) ?? [],
  );

const focusOptionByIndex = (index: number) => {
  const buttons = getOptionButtons();

  if (!buttons.length) {
    return;
  }

  const normalizedIndex = ((index % buttons.length) + buttons.length) % buttons.length;
  buttons[normalizedIndex]?.focus();
};

const focusFirstOption = () => {
  focusOptionByIndex(0);
};

const onHandleTriggerKeydown = (event: KeyboardEvent) => {
  isKeyboardPopoverOpenRequest.value = ['Enter', ' ', 'Spacebar', 'ArrowDown'].includes(event.key);
};

const onHandleTriggerPointerDown = () => {
  isKeyboardPopoverOpenRequest.value = false;
};

const onHandleContentKeydown = (event: KeyboardEvent) => {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    return;
  }

  const buttons = getOptionButtons();

  if (!buttons.length) {
    return;
  }

  event.preventDefault();

  const currentIndex = buttons.findIndex((button) => button === document.activeElement);

  if (event.key === 'Home') {
    focusOptionByIndex(0);
    return;
  }

  if (event.key === 'End') {
    focusOptionByIndex(buttons.length - 1);
    return;
  }

  if (event.key === 'ArrowDown') {
    const nextIndex = currentIndex >= 0 ? currentIndex + 1 : 0;
    focusOptionByIndex(nextIndex);
    return;
  }

  const previousIndex = currentIndex >= 0 ? currentIndex - 1 : buttons.length - 1;
  focusOptionByIndex(previousIndex);
};

const onHandlePopoverToggle = (event: Event) => {
  const newState = (event as Event & { newState?: 'open' | 'closed' }).newState;

  if (newState === 'closed') {
    isKeyboardPopoverOpenRequest.value = false;
    return;
  }

  if (newState !== 'open' || !isKeyboardPopoverOpenRequest.value) {
    return;
  }

  void nextTick(() => {
    focusFirstOption();
  });
};

onMounted(() => {
  popoverRef.value = contentRef.value?.closest<HTMLElement>('[popover]') ?? null;
  popoverRef.value?.addEventListener('toggle', onHandlePopoverToggle as EventListener);
});

onBeforeUnmount(() => {
  popoverRef.value?.removeEventListener('toggle', onHandlePopoverToggle as EventListener);
});

const handleCancelExportRecords = () => {
  isModalExportPromptOpen.value = false;
  typeExportFile.value = undefined;
};

const onHandleExportRecords = (type?: string, force = false) => {
  if (!selectedItemsCount && !force && !forceExport) {
    isModalExportPromptOpen.value = true;
    typeExportFile.value = type;
  } else {
    emit('on:export', type as string);
    handleCancelExportRecords();
  }
};
</script>

<template>
  <PopoverButton
    :variant
    :size
    :placement
    match-trigger-width
    v-bind="triggerAttrs"
    :class="classes"
    :disabled="disabled"
    :dataTestId="dataTestId"
    :ariaLabel="ariaLabel"
    :useAriaLabel="useAriaLabel"
    @keydown="onHandleTriggerKeydown"
    @pointerdown="onHandleTriggerPointerDown"
  >
    <SvgIcon name="download" :class="`${classNameComponent}__icon`" :dataTestId="iconTestId" />

    <slot />

    <CounterBadge v-if="selectedItemsCount > 0" :value="selectedItemsCount || 0" variant="info" />
    <SvgIcon name="arrow" :class="`${classNameComponent}__arrow`" :dataTestId="arrowTestId" />
    <template #content>
      <div
        ref="contentRef"
        :id="`${classNameComponent}-${id}`"
        :aria-labelledby="`${classNameComponent}-label-${id}`"
        :class="`${classNameComponent}__content`"
        @keydown="onHandleContentKeydown"
      >
        <h3
          :id="`${classNameComponent}-label-${id}`"
          :class="`${classNameComponent}__content-sr-only`"
        >
          Akcje eksportu
        </h3>
        <ul :class="`${classNameComponent}__content-list`">
          <li
            v-for="(type, index) in exportFileTypeOptions"
            :key="type.key"
            :class="`${classNameComponent}__content-item`"
          >
            <button
              type="button"
              :class="`${classNameComponent}__content-button`"
              :data-testid="buttonListTestId ? `${buttonListTestId}-${index}` : undefined"
              :aria-label="`${type.label}. Wyeksportuj rekordy do pliku ${type.key.toUpperCase()}`"
              @click.prevent="onHandleExportRecords(type.key)"
            >
              {{ type.label }}
            </button>
          </li>
        </ul>
      </div>
    </template>
  </PopoverButton>
  <ModalDialog
    ariaLabel="Potwierdzenie eksportu rekordow"
    :open="isModalExportPromptOpen"
    @update:open="(state: boolean) => (isModalExportPromptOpen = state)"
    is-sticky
  >
    <template #header>Potwierdzenie eksportu</template>
    <FormContainer
      submit-button-label="Eksportuj"
      label="Potwierdzenie czy wyeksportować wszystkie rekordy"
      :data-test-id="promptTestId"
      actions-position="bottom-right"
      @on:cancel="handleCancelExportRecords"
      @on:submit="onHandleExportRecords(typeExportFile, true)"
    >
      <p>Czy na pewno chcesz wyeksportować wszystkie rekordy rejestru do pliku zewnętrznego?</p>
    </FormContainer>
  </ModalDialog>
</template>
