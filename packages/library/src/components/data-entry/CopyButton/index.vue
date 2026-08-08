<script lang="ts">
export interface CopyButtonProps {
  /** Dokładna wartość tekstowa kopiowana, gdy getText nie został przekazany. */
  text?: string;
  /** Pobiera wartość w chwili aktywacji; obsługuje również źródła asynchroniczne. */
  getText?: () => string | Promise<string>;
  /** Czas powrotu ukończonej operacji do stanu początkowego; zero zachowuje stan. */
  resetDelay?: number;
  /** Stała dostępna nazwa akcji i domyślna widoczna etykieta. */
  label?: string;
  /** Widoczny i ogłaszany komunikat powodzenia. */
  copiedLabel?: string;
  /** Widoczny i ogłaszany komunikat błędu. */
  errorLabel?: string;
  /** Widoczny tekst podczas trwającej operacji asynchronicznej. */
  loadingLabel?: string;
  /** Określa, czy przycisk wyświetla ikonę, tekst, czy oba elementy. */
  content?: 'icon' | 'text' | 'icon-text';
  /** Wariant wizualny zgodny z ButtonAction. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Rozmiar zgodny ze skalą ButtonAction. */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l';
  /** Stan zajętości kontrolowany z zewnątrz. */
  loading?: boolean;
  /** Blokuje aktywację. */
  disabled?: boolean;
  /** Wyświetla komunikat stanu obok akcji zamiast wyłącznie dla czytnika ekranu. */
  showStatus?: boolean;
  /** Opcjonalna stała dostępna nazwa zastępująca label. */
  ariaLabel?: string;
  /** Natywny typ przycisku. */
  type?: 'button' | 'submit' | 'reset';
  /** Stały identyfikator używany w testach automatycznych. */
  dataTestId?: string;
}

export type {
  CopyButtonContent,
  CopyButtonCopyDetail,
  CopyButtonErrorDetail,
  CopyButtonMethod,
  CopyButtonSize,
  CopyButtonStatus,
  CopyButtonStatusSlotState,
  CopyButtonSuccessDetail,
  CopyButtonTextResolver,
  CopyButtonVariant,
} from './copy-button.shared';
</script>

<script setup lang="ts">
import { UIKIT_NAME } from '@/constants';
import { copyToClipboard } from '@/helpers/functions.helper';
import { computed, onBeforeUnmount, ref, useAttrs, useId, type CSSProperties } from 'vue';

import SvgIcon from '../../basic/SvgIcon/index.vue';
import ButtonAction from '../ButtonAction/index.vue';
import {
  normalizeCopyButtonResetDelay,
  resolveCopyButtonErrorStatus,
  type CopyButtonCopyDetail,
  type CopyButtonErrorDetail,
  type CopyButtonStatus,
  type CopyButtonStatusSlotState,
  type CopyButtonSuccessDetail,
} from './copy-button.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CopyButtonProps>(), {
  text: '',
  resetDelay: 2000,
  label: 'Kopiuj',
  copiedLabel: 'Skopiowano',
  errorLabel: 'Nie udało się skopiować',
  loadingLabel: 'Kopiowanie',
  content: 'icon-text',
  variant: 'secondary',
  size: 'm',
  loading: false,
  disabled: false,
  showStatus: false,
  ariaLabel: '',
  type: 'button',
});

const emit = defineEmits<{
  (event: 'copy', detail: CopyButtonCopyDetail): void;
  (event: 'success', detail: CopyButtonSuccessDetail): void;
  (event: 'error', detail: CopyButtonErrorDetail): void;
  (event: 'statusChange', status: CopyButtonStatus): void;
}>();

const slots = defineSlots<{
  default?(props: CopyButtonStatusSlotState): unknown;
  icon?(props: CopyButtonStatusSlotState): unknown;
  'copied-icon'?(props: CopyButtonStatusSlotState): unknown;
  status?(props: CopyButtonStatusSlotState): unknown;
}>();

const attrs = useAttrs();
const root = `${UIKIT_NAME}-copy-button`;
const generatedId = useId();
const statusId = `${root}-${generatedId}-status`;
const internalStatus = ref<CopyButtonStatus>('idle');
let resetTimer: ReturnType<typeof setTimeout> | undefined;
let requestId = 0;
let mounted = true;

const status = computed<CopyButtonStatus>(() => (props.loading ? 'copying' : internalStatus.value));
const busy = computed(() => status.value === 'copying');
const nativelyDisabled = computed(() => props.disabled || props.loading);
const blocked = computed(() => nativelyDisabled.value || busy.value);
const showsIcon = computed(() => props.content !== 'text');
const showsText = computed(() => props.content !== 'icon');
const statusMessage = computed(() => {
  if (status.value === 'copying') return props.loadingLabel;
  if (status.value === 'copied') return props.copiedLabel;
  if (status.value === 'error' || status.value === 'unsupported') return props.errorLabel;
  return '';
});
const visibleLabel = computed(() => {
  if (status.value === 'copying') return props.loadingLabel;
  if (status.value === 'copied') return props.copiedLabel;
  return props.label;
});
const slotState = computed<CopyButtonStatusSlotState>(() => ({
  message: statusMessage.value,
  status: status.value,
}));
const rootClasses = computed(() => [
  root,
  `${root}--content-${props.content}`,
  `${root}--status-${status.value}`,
  props.showStatus && `${root}--with-status`,
  attrs.class,
]);
const rootStyle = computed(() => attrs.style as CSSProperties | undefined);
const buttonAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    'aria-label': externalAriaLabel,
    'aria-labelledby': externalAriaLabelledBy,
    'aria-busy': _externalBusy,
    'aria-disabled': _externalDisabled,
    'data-testid': _externalDataTestId,
    ...rest
  } = attrs;

  const labelledBy = normalizeAttribute(externalAriaLabelledBy);
  return {
    ...rest,
    'aria-label': labelledBy
      ? undefined
      : normalizeAttribute(externalAriaLabel) || props.ariaLabel.trim() || props.label,
    'aria-labelledby': labelledBy,
  };
});

function normalizeAttribute(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function clearResetTimer(): void {
  if (resetTimer === undefined) return;
  clearTimeout(resetTimer);
  resetTimer = undefined;
}

function updateStatus(next: CopyButtonStatus): void {
  if (!mounted || internalStatus.value === next) return;
  internalStatus.value = next;
  emit('statusChange', next);
}

function scheduleReset(): void {
  clearResetTimer();
  const delay = normalizeCopyButtonResetDelay(props.resetDelay);
  if (delay === 0) return;
  resetTimer = setTimeout(() => {
    resetTimer = undefined;
    updateStatus('idle');
  }, delay);
}

async function resolveText(): Promise<string> {
  const value = props.getText ? await props.getText() : props.text;
  if (typeof value !== 'string')
    throw new TypeError('CopyButton text resolver must return a string');
  return value;
}

async function handleCopy(): Promise<void> {
  if (blocked.value) return;

  clearResetTimer();
  const activeRequest = ++requestId;
  updateStatus('copying');
  let text: string | undefined;

  try {
    text = await resolveText();
    if (!mounted || activeRequest !== requestId) return;
    emit('copy', { text });
    const method = await copyToClipboard(text);
    if (!mounted || activeRequest !== requestId) return;
    updateStatus('copied');
    emit('success', { method, text });
    scheduleReset();
  } catch (error) {
    if (!mounted || activeRequest !== requestId) return;
    const errorStatus = resolveCopyButtonErrorStatus(error);
    updateStatus(errorStatus);
    emit('error', { error, status: errorStatus, text });
    scheduleReset();
  }
}

onBeforeUnmount(() => {
  mounted = false;
  requestId += 1;
  clearResetTimer();
});
</script>

<template>
  <span :class="rootClasses" :style="rootStyle" :data-status="status" :data-testid="dataTestId">
    <ButtonAction
      v-bind="buttonAttrs"
      :class="`${root}__button`"
      :variant
      :size
      :type
      :disabled="nativelyDisabled"
      :aria-busy="busy || undefined"
      :aria-disabled="blocked || undefined"
      :data-testid="dataTestId ? `${dataTestId}-button` : undefined"
      :use-aria-label="true"
      @click="handleCopy"
    >
      <span v-if="busy" :class="`${root}__spinner`" aria-hidden="true" />
      <span v-else-if="showsIcon" :class="`${root}__icon`" aria-hidden="true">
        <slot v-if="status === 'copied'" name="copied-icon" v-bind="slotState">
          <SvgIcon name="clipboard-check" />
        </slot>
        <slot v-else name="icon" v-bind="slotState">
          <SvgIcon name="copy" />
        </slot>
      </span>
      <span v-if="showsText" :class="`${root}__label`">
        <slot v-bind="slotState">{{ visibleLabel }}</slot>
      </span>
    </ButtonAction>

    <span
      :id="statusId"
      :class="[`${root}__status`, !showStatus && `${root}__status--sr-only`]"
      :role="status === 'error' || status === 'unsupported' ? 'alert' : 'status'"
      :aria-live="status === 'error' || status === 'unsupported' ? 'assertive' : 'polite'"
      aria-atomic="true"
    >
      <slot name="status" v-bind="slotState">{{ statusMessage }}</slot>
    </span>
  </span>
</template>
