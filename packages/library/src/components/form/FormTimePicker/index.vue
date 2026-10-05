<script lang="ts">
import type {
  FormTimePickerFormat,
  FormTimePickerPanelMode,
  FormTimePickerPlacement,
  FormTimePickerVariant,
  TimePickerFormatContext,
  TimePickerFormatter,
  TimePickerInvalidDetail,
  TimePickerOption,
  TimePickerParser,
  TimePickerParts,
  TimePickerSegment,
} from './time-picker.shared';

export type {
  FormTimePickerFormat,
  FormTimePickerPanelMode,
  FormTimePickerPlacement,
  FormTimePickerVariant,
  TimePickerFormatContext,
  TimePickerFormatter,
  TimePickerInvalidDetail,
  TimePickerInvalidReason,
  TimePickerOption,
  TimePickerParser,
  TimePickerParts,
  TimePickerPeriod,
  TimePickerSegment,
} from './time-picker.shared';

export interface FormTimePickerProps {
  /** Stabilny identyfikator pola i powiązanych elementów ARIA. */
  id: string;
  /** Nazwa pola używana przy wysyłaniu formularza. */
  name: string;
  /** Widoczna etykieta pola. */
  label?: string;
  /** Tekst pomocy wyświetlany pod polem. */
  description?: string;
  /** Zewnętrzny komunikat błędu; ma pierwszeństwo przed walidacją wewnętrzną. */
  error?: string;
  /** Placeholder opisujący oczekiwany format. */
  placeholder?: string;
  /** Edytowalne pole tekstowe albo zestaw dostępnych segmentów. */
  variant?: FormTimePickerVariant;
  /** Lista opcji albo kompaktowe kontrolki spinbutton w panelu. */
  panelMode?: FormTimePickerPanelMode;
  /** Preferowane położenie panelu; komponent może odwrócić je przy krawędzi viewportu. */
  placement?: FormTimePickerPlacement;
  /** Format prezentacji. Model zawsze pozostaje wartością 24-godzinną. */
  format?: FormTimePickerFormat;
  /** Dodaje segment sekund do pola, modelu i panelu. */
  showSeconds?: boolean;
  /** Krok godzin wykorzystywany przez opcje i klawiaturę. */
  hourStep?: number;
  /** Krok minut wykorzystywany przez opcje i klawiaturę. */
  minuteStep?: number;
  /** Krok sekund wykorzystywany przez opcje i klawiaturę. */
  secondStep?: number;
  /** Najwcześniejsza dozwolona wartość w formacie HH:mm[:ss]. */
  min?: string;
  /** Najpóźniejsza dozwolona wartość w formacie HH:mm[:ss]. */
  max?: string;
  /** Pozwala zatwierdzić ręcznie wpisaną wartość, która nie leży na siatce kroków. */
  allowOffStep?: boolean;
  /** Locale używany do prezentacji okresu dnia w formacie 12h. */
  locale?: string;
  /** Opcjonalny parser tekstu zastępujący parser wbudowany. */
  parse?: TimePickerParser;
  /** Opcjonalny formatter prezentacji zastępujący formatter wbudowany. */
  formatValue?: TimePickerFormatter;
  /** Pozwala usunąć bieżącą wartość przyciskiem pola. */
  canErase?: boolean;
  /** Pole musi zawierać poprawną wartość. */
  required?: boolean;
  /** Całkowicie blokuje kontrolkę. */
  disabled?: boolean;
  /** Pozwala odczytać wartość bez jej zmiany. */
  readonly?: boolean;
  /** Blokuje interakcje i udostępnia stan oczekiwania technologiom asystującym. */
  loading?: boolean;
  /** Dostępna nazwa pola, gdy nie ma widocznej etykiety. */
  ariaLabel?: string;
  /** Dostępna nazwa panelu wyboru czasu. */
  panelAriaLabel?: string;
  /** Dostępna nazwa przycisku panelu w wariancie segmented. */
  triggerAriaLabel?: string;
  /** Tekst ogłaszany podczas ładowania. */
  loadingLabel?: string;
  /** Stabilny identyfikator używany w testach automatycznych. */
  dataTestId?: string;
}
</script>

<script setup lang="ts">
import { getRequiredValueAttributes, focusInvalidValue } from '@/helpers/form-validation.helper';
import { useFormControlReset } from '@/composables/useFormControlReset';
import { UIKIT_NAME } from '@/constants';
import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type StyleValue,
} from 'vue';

import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import FormField from '@/components/form/FormField/index.vue';
import PopoverOverlayer from '@/components/overlayer/PopoverOverlayer/index.vue';
import {
  DEFAULT_TIME_PARTS,
  buildSegmentOptions,
  formatDisplayTime,
  formatModelTime,
  getAdjacentSegmentValue,
  getFirstValidTime,
  getPeriodLabels,
  getSegmentRange,
  getSegmentText,
  getSegmentValue,
  isTimeParts,
  normalizeStep,
  parseDisplayTime,
  parseModelTime,
  setTimeSegment,
  validateTimeParts,
  type TimePickerInvalidReason,
  type TimePickerValidationOptions,
} from './time-picker.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormTimePickerProps>(), {
  placeholder: undefined,
  variant: 'input',
  panelMode: 'dropdown',
  placement: 'bottom',
  format: '24h',
  showSeconds: false,
  hourStep: 1,
  minuteStep: 5,
  secondStep: 5,
  allowOffStep: false,
  locale: 'pl-PL',
  canErase: true,
  required: false,
  disabled: false,
  readonly: false,
  loading: false,
  loadingLabel: 'Ładowanie wyboru czasu',
});

const value = defineModel<string | undefined>('value', {
  default: undefined,
  /** Neutralna wartość 24-godzinna w formacie HH:mm albo HH:mm:ss. */
});
const open = defineModel<boolean>('open', {
  default: false,
  /** Kontroluje otwarcie panelu wyboru czasu. */
});

const emit = defineEmits<{
  /** Emitowane po zatwierdzeniu poprawnej wartości. */
  (event: 'change', value: string | undefined, parts: TimePickerParts | undefined): void;
  /** Emitowane po odrzuceniu pustej, błędnej, poza zakresem lub poza krokiem wartości. */
  (event: 'invalid', detail: TimePickerInvalidDetail): void;
  /** Emitowane po faktycznym otwarciu panelu. */
  (event: 'open'): void;
  /** Emitowane po faktycznym zamknięciu panelu. */
  (event: 'close'): void;
}>();

defineSlots<{
  /** Zastępuje domyślny trigger pola; otrzymuje pełny stan i funkcję przełączającą. */
  trigger?(props: { displayValue: string; open: boolean; toggle: () => void }): unknown;
  /** Renderuje etykietę opcji godziny wewnątrz zachowanego option. */
  'hour-option'?(props: { option: TimePickerOption; selected: boolean }): unknown;
  /** Renderuje etykietę opcji minuty wewnątrz zachowanego option. */
  'minute-option'?(props: { option: TimePickerOption; selected: boolean }): unknown;
  /** Renderuje etykietę opcji sekundy wewnątrz zachowanego option. */
  'second-option'?(props: { option: TimePickerOption; selected: boolean }): unknown;
  /** Renderuje etykietę opcji AM/PM wewnątrz zachowanego option. */
  'period-option'?(props: { option: TimePickerOption; selected: boolean }): unknown;
  /** Renderuje dodatkową treść na końcu panelu. */
  footer?(props: { close: () => void; value: string | undefined }): unknown;
  /** Zastępuje komunikat błędu. */
  error?(props: { message: string; reason: TimePickerInvalidReason | undefined }): unknown;
  /** Zastępuje opis pola. */
  description?(): unknown;
  /** Renderuje tooltip etykiety pola. */
  hint?(): unknown;
}>();

type PopoverReference = {
  hidePopover: () => void;
  refreshPopoverPosition?: () => void;
  showPopover: () => void;
};

const attrs = useAttrs();
const slots = useSlots();
const classNameComponent = `${UIKIT_NAME}-form-time-picker`;
const componentInstance = getCurrentInstance() as
  ({ ce?: HTMLElement; isCE?: boolean } & object) | null;
const hasSlot = (name: string): boolean =>
  Boolean(slots[name]) ||
  (componentInstance?.isCE === true &&
    componentInstance.ce?.hasAttribute(`data-peaui-native-slot-${name}`) === true);
const popoverReference = useTemplateRef<PopoverReference>('popoverReference');
const triggerReference = useTemplateRef<HTMLElement>('triggerReference');
const inputReference = useTemplateRef<HTMLInputElement>('inputReference');
const panelReference = useTemplateRef<HTMLElement>('panelReference');
const draft = ref('');
const activeParts = ref<TimePickerParts>({ ...DEFAULT_TIME_PARTS });
const invalidReason = ref<TimePickerInvalidReason>();
const popoverOpen = ref(false);
const popoverPlacement = ref<FormTimePickerPlacement>(props.placement);
const digitBuffer = ref<{ segment: TimePickerSegment; text: string; timestamp: number }>();
let viewportListenersAttached = false;
useFormControlReset(triggerReference, () => {
  invalidReason.value = undefined;
  digitBuffer.value = undefined;
  syncFromModel();
});

const formatContext = computed<TimePickerFormatContext>(() => ({
  format: props.format,
  locale: props.locale,
  showSeconds: props.showSeconds,
}));
const validationOptions = computed<TimePickerValidationOptions>(() => ({
  ...formatContext.value,
  allowOffStep: props.allowOffStep,
  hourStep: normalizeStep(props.hourStep, 24),
  minuteStep: normalizeStep(props.minuteStep, 60),
  secondStep: normalizeStep(props.secondStep, 60),
  min: props.min,
  max: props.max,
}));
const segments = computed<TimePickerSegment[]>(() => [
  'hour',
  'minute',
  ...(props.showSeconds ? (['second'] as const) : []),
  ...(props.format === '12h' ? (['period'] as const) : []),
]);
const periodLabels = computed(() => getPeriodLabels(props.locale));
const hourOptions = computed(() =>
  buildSegmentOptions('hour', activeParts.value, validationOptions.value),
);
const minuteOptions = computed(() =>
  buildSegmentOptions('minute', activeParts.value, validationOptions.value),
);
const secondOptions = computed(() =>
  buildSegmentOptions('second', activeParts.value, validationOptions.value),
);
const periodOptions = computed<TimePickerOption[]>(() =>
  (['am', 'pm'] as const).map((period) => {
    const candidate = setTimeSegment(activeParts.value, 'period', period);
    return {
      disabled: Boolean(validateTimeParts(candidate, validationOptions.value)),
      label: periodLabels.value[period],
      value: period,
    };
  }),
);
const placeholder = computed(
  () =>
    props.placeholder ??
    (props.format === '12h'
      ? props.showSeconds
        ? 'gg:mm:ss AM/PM'
        : 'gg:mm AM/PM'
      : props.showSeconds
        ? 'gg:mm:ss'
        : 'gg:mm'),
);
const panelId = computed(() => `${props.id}-time-panel`);
const panelLabelId = computed(() => `${props.id}-time-panel-label`);
const triggerLabel = computed(
  () => props.triggerAriaLabel?.trim() || `Wybierz czas${props.label ? `: ${props.label}` : ''}`,
);
const panelLabel = computed(
  () => props.panelAriaLabel?.trim() || `Wybór czasu${props.label ? `: ${props.label}` : ''}`,
);
const internalErrorMessage = computed(() => getInvalidMessage(invalidReason.value));
const errorMessage = computed(() => props.error?.trim() || internalErrorMessage.value);
const hasError = computed(() => Boolean(slots.error || errorMessage.value));
const blocked = computed(() => props.disabled || props.readonly || props.loading);
const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--variant-${props.variant}`,
  `${classNameComponent}--panel-${props.panelMode}`,
  {
    [`${classNameComponent}--open`]: popoverOpen.value,
    [`${classNameComponent}--disabled`]: props.disabled,
    [`${classNameComponent}--readonly`]: props.readonly,
    [`${classNameComponent}--loading`]: props.loading,
    [`${classNameComponent}--invalid`]: hasError.value,
  },
  attrs.class,
]);
const contentClass = computed(() => `${classNameComponent}__popover-content`);
const popoverTestId = computed(() =>
  props.dataTestId ? `${props.dataTestId}-popover` : undefined,
);
const panelTestId = computed(() => (props.dataTestId ? `${props.dataTestId}-panel` : undefined));
const elementTestId = computed(() =>
  props.dataTestId ? `${props.dataTestId}-element` : undefined,
);
const loadingId = computed(() => `${props.id}-time-loading`);

watch([value, formatContext, validationOptions], () => syncFromModel(), {
  deep: true,
  immediate: true,
});

watch(open, async (nextOpen) => {
  if (nextOpen === popoverOpen.value || blocked.value) return;
  await nextTick();
  if (nextOpen) popoverReference.value?.showPopover();
  else popoverReference.value?.hidePopover();
});

watch(blocked, (nextBlocked) => {
  if (nextBlocked) closePicker(false);
});

onMounted(() => {
  if (open.value && !blocked.value) {
    void nextTick(() => popoverReference.value?.showPopover());
  }
});

onBeforeUnmount(removeViewportListeners);

function syncFromModel(): void {
  const parsed = parseModelTime(value.value);
  const reason = parsed
    ? validateTimeParts(parsed, validationOptions.value)
    : value.value
      ? 'format'
      : invalidReason.value === 'empty'
        ? 'empty'
        : undefined;
  invalidReason.value = reason;
  if (parsed && !reason) activeParts.value = parsed;
  else activeParts.value = getFirstValidTime(validationOptions.value) ?? { ...DEFAULT_TIME_PARTS };
  draft.value = parsed ? formatForDisplay(parsed) : `${value.value ?? ''}`;
}

function formatForDisplay(parts: TimePickerParts): string {
  const model = formatModelTime(parts, props.showSeconds);
  if (props.formatValue) {
    try {
      return props.formatValue(model, formatContext.value);
    } catch {
      return formatDisplayTime(parts, formatContext.value);
    }
  }
  return formatDisplayTime(parts, formatContext.value);
}

function parseDraftValue(input: string): TimePickerParts | undefined {
  if (props.parse) {
    try {
      const parsed = props.parse(input, formatContext.value);
      if (isTimeParts(parsed)) return parsed;
      return parseModelTime(parsed);
    } catch {
      return undefined;
    }
  }
  return parseDisplayTime(input, props.format, props.showSeconds);
}

function commitDraft(closeAfterCommit = false): boolean {
  const input = draft.value.trim();
  if (!input) {
    if (props.required) return rejectValue(input, 'empty');
    invalidReason.value = undefined;
    value.value = undefined;
    emit('change', undefined, undefined);
    if (closeAfterCommit) closePicker(true);
    return true;
  }

  const parsed = parseDraftValue(input);
  if (!parsed) return rejectValue(input, 'format');
  const reason = validateTimeParts(parsed, validationOptions.value);
  if (reason) return rejectValue(input, reason);

  applyParts(parsed, closeAfterCommit);
  return true;
}

function rejectValue(input: string, reason: TimePickerInvalidReason): false {
  invalidReason.value = reason;
  emit('invalid', { input, reason });
  return false;
}

function applyParts(parts: TimePickerParts, closeAfterCommit = false): void {
  if (blocked.value) return;
  const reason = validateTimeParts(parts, validationOptions.value);
  if (reason) {
    rejectValue(formatModelTime(parts, props.showSeconds), reason);
    return;
  }

  const nextValue = formatModelTime(parts, props.showSeconds);
  activeParts.value = parts;
  invalidReason.value = undefined;
  draft.value = formatForDisplay(parts);
  value.value = nextValue;
  emit('change', nextValue, parts);
  if (closeAfterCommit) closePicker(true);
}

function handleDraftInput(event: Event): void {
  draft.value = (event.target as HTMLInputElement).value;
  invalidReason.value = undefined;
}

function handleInputChange(): void {
  commitDraft(false);
}

function handleInputKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    openPicker(true);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    commitDraft(true);
  } else if (event.key === 'Escape') {
    event.preventDefault();
    syncFromModel();
    closePicker(true);
  } else if (event.key === 'Tab') {
    commitDraft(false);
    closePicker(false);
  }
}

function handleErase(): void {
  if (blocked.value) return;
  draft.value = '';
  invalidReason.value = props.required ? 'empty' : undefined;
  value.value = undefined;
  emit('change', undefined, undefined);
  closePicker(true);
}

function selectOption(segment: TimePickerSegment, option: TimePickerOption): void {
  if (option.disabled || blocked.value) return;
  applyParts(setTimeSegment(activeParts.value, segment, option.value));
  void nextTick(() => focusSelectedOption(segment));
}

function handleSegmentKeydown(
  event: KeyboardEvent,
  segment: TimePickerSegment,
  index: number,
): void {
  if (blocked.value) return;
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
    const next = getAdjacentSegmentValue(
      segment,
      activeParts.value,
      event.key === 'ArrowUp' ? 1 : -1,
      validationOptions.value,
    );
    if (next) applyParts(next);
    return;
  }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    focusSegment(index + (event.key === 'ArrowRight' ? 1 : -1));
    return;
  }
  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    selectSegmentEdge(segment, event.key === 'Home' ? 'first' : 'last');
    return;
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openPicker(true, segment);
    return;
  }
  if (event.key === 'Escape') {
    event.preventDefault();
    closePicker(true);
    return;
  }
  if (/^\d$/.test(event.key) && segment !== 'period') {
    event.preventDefault();
    replaceSegmentWithDigit(segment, event.key);
  }
}

function replaceSegmentWithDigit(
  segment: Exclude<TimePickerSegment, 'period'>,
  digit: string,
): void {
  const now = Date.now();
  const previous = digitBuffer.value;
  const nextText =
    previous?.segment === segment && now - previous.timestamp < 800
      ? `${previous.text}${digit}`.slice(-2)
      : digit;
  digitBuffer.value = { segment, text: nextText, timestamp: now };
  const range = getSegmentRange(segment, props.format);
  const numeric = Number(nextText);
  if (numeric < range.min || numeric > range.max) return;

  let internalValue = numeric;
  if (segment === 'hour' && props.format === '12h') {
    internalValue = (numeric % 12) + (activeParts.value.hour >= 12 ? 12 : 0);
  }
  const next = setTimeSegment(activeParts.value, segment, internalValue);
  if (!validateTimeParts(next, validationOptions.value)) applyParts(next);
}

function selectSegmentEdge(segment: TimePickerSegment, edge: 'first' | 'last'): void {
  if (segment === 'period') {
    const option = periodOptions.value[edge === 'first' ? 0 : periodOptions.value.length - 1];
    if (option) selectOption(segment, option);
    return;
  }
  const options = getOptions(segment).filter((option) => !option.disabled);
  const option = options[edge === 'first' ? 0 : options.length - 1];
  if (option) selectOption(segment, option);
}

function getOptions(segment: Exclude<TimePickerSegment, 'period'>): TimePickerOption[] {
  if (segment === 'hour') return hourOptions.value;
  if (segment === 'minute') return minuteOptions.value;
  return secondOptions.value;
}

function getOptionId(segment: TimePickerSegment, option: TimePickerOption): string {
  return `${props.id}-${segment}-option-${String(option.value)}`;
}

function getSegmentLabel(segment: TimePickerSegment): string {
  return {
    hour: 'Godzina',
    minute: 'Minuta',
    second: 'Sekunda',
    period: 'Okres dnia',
  }[segment];
}

function focusSegment(index: number): void {
  const segmentElements = Array.from(
    triggerReference.value?.querySelectorAll<HTMLElement>(
      `.${classNameComponent}__segments > [data-time-segment]`,
    ) ?? [],
  );
  if (!segmentElements.length) return;
  const normalized = (index + segmentElements.length) % segmentElements.length;
  segmentElements[normalized]?.focus();
}

function syncPopoverPlacement(): void {
  const trigger = triggerReference.value;
  if (!trigger || typeof window === 'undefined') return;
  const rect = trigger.getBoundingClientRect();
  const panelHeight = props.panelMode === 'dropdown' ? 310 : 230;
  const availableAbove = rect.top;
  const availableBelow = window.innerHeight - rect.bottom;
  const preferredSpace = props.placement === 'bottom' ? availableBelow : availableAbove;
  const fallback = props.placement === 'bottom' ? 'top' : 'bottom';
  const fallbackSpace = fallback === 'bottom' ? availableBelow : availableAbove;
  popoverPlacement.value =
    preferredSpace >= panelHeight || preferredSpace >= fallbackSpace ? props.placement : fallback;
}

function openPicker(focusPanel = false, segment: TimePickerSegment = 'hour'): void {
  if (blocked.value) return;
  syncPopoverPlacement();
  popoverReference.value?.showPopover();
  if (focusPanel) void nextTick(() => focusSelectedOption(segment));
}

function closePicker(restoreFocus: boolean): void {
  popoverReference.value?.hidePopover();
  if (restoreFocus) {
    void nextTick(() =>
      (props.variant === 'input'
        ? inputReference.value
        : triggerReference.value?.querySelector<HTMLElement>(
            `.${classNameComponent}__segments > [data-time-segment]`,
          )
      )?.focus(),
    );
  }
}

function togglePicker(): void {
  if (popoverOpen.value) closePicker(true);
  else openPicker(false);
}

function handlePopoverState(nextOpen: boolean): void {
  if (popoverOpen.value === nextOpen) return;
  popoverOpen.value = nextOpen;
  open.value = nextOpen;
  if (nextOpen) {
    addViewportListeners();
    emit('open');
    return;
  }
  removeViewportListeners();
  emit('close');
}

function refreshPopover(): void {
  if (!popoverOpen.value) return;
  syncPopoverPlacement();
  void nextTick(() => popoverReference.value?.refreshPopoverPosition?.());
}

function addViewportListeners(): void {
  if (viewportListenersAttached || typeof window === 'undefined') return;
  window.addEventListener('resize', refreshPopover);
  window.addEventListener('scroll', refreshPopover, true);
  window.visualViewport?.addEventListener('resize', refreshPopover);
  window.visualViewport?.addEventListener('scroll', refreshPopover);
  viewportListenersAttached = true;
}

function removeViewportListeners(): void {
  if (!viewportListenersAttached || typeof window === 'undefined') return;
  window.removeEventListener('resize', refreshPopover);
  window.removeEventListener('scroll', refreshPopover, true);
  window.visualViewport?.removeEventListener('resize', refreshPopover);
  window.visualViewport?.removeEventListener('scroll', refreshPopover);
  viewportListenersAttached = false;
}

function focusSelectedOption(segment: TimePickerSegment): void {
  const panel = panelReference.value;
  if (!panel) return;
  if (props.panelMode === 'spinbutton') {
    panel.querySelector<HTMLElement>(`[data-time-segment="${segment}"]`)?.focus();
    return;
  }
  const selectedValue =
    segment === 'period'
      ? activeParts.value.hour >= 12
        ? 'pm'
        : 'am'
      : activeParts.value[segment];
  panel
    .querySelector<HTMLElement>(
      `[data-time-option-segment="${segment}"][data-time-option-value="${selectedValue}"]`,
    )
    ?.focus();
}

function handlePanelKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault();
    syncFromModel();
    closePicker(true);
  }
}

function handleOptionKeydown(event: KeyboardEvent, segment: TimePickerSegment): void {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    const currentIndex = segments.value.indexOf(segment);
    const nextIndex =
      (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + segments.value.length) %
      segments.value.length;
    focusSelectedOption(segments.value[nextIndex]!);
    return;
  }
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const list = (event.currentTarget as HTMLElement).closest('[role="listbox"]');
  const options = Array.from(
    list?.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])') ?? [],
  );
  const currentIndex = options.indexOf(event.currentTarget as HTMLElement);
  const nextIndex =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? options.length - 1
        : (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
  options[nextIndex]?.focus();
}

function getInvalidMessage(reason: TimePickerInvalidReason | undefined): string {
  if (reason === 'empty') return 'Wybierz czas.';
  if (reason === 'format') return `Wpisz czas w formacie ${placeholder.value}.`;
  if (reason === 'range') return 'Wybrany czas jest poza dozwolonym zakresem.';
  if (reason === 'step') return 'Wybrany czas nie pasuje do dozwolonego interwału.';
  return '';
}

function getInputBindings(fieldProps: Record<string, unknown>): Record<string, unknown> {
  const forwarded = { ...attrs } as Record<string, unknown>;
  delete forwarded.class;
  delete forwarded.style;
  return {
    ...forwarded,
    ...fieldProps,
    'aria-busy': props.loading || undefined,
    'aria-controls': panelId.value,
    'aria-expanded': popoverOpen.value,
    'aria-haspopup': 'dialog',
    'aria-invalid': hasError.value || undefined,
    'aria-label': props.ariaLabel || (props.label ? undefined : fieldProps['aria-label']),
    'aria-labelledby': props.ariaLabel
      ? undefined
      : props.label
        ? `label-${props.id}`
        : fieldProps['aria-labelledby'],
    'aria-readonly': props.readonly || undefined,
  };
}

function getSegmentGroupBindings(fieldProps: Record<string, unknown>): Record<string, unknown> {
  return {
    class: [fieldProps.class, `${classNameComponent}__segments`],
    id: fieldProps.id,
    'aria-busy': props.loading || undefined,
    'aria-describedby': fieldProps['aria-describedby'],
    'aria-invalid': hasError.value || undefined,
    'aria-label':
      props.ariaLabel || (props.label ? undefined : fieldProps['aria-label'] || props.name),
    'aria-labelledby': props.ariaLabel
      ? undefined
      : props.label
        ? `label-${props.id}`
        : fieldProps['aria-labelledby'],
    role: 'group',
    style: fieldProps.style as StyleValue,
  };
}
</script>

<template>
  <PopoverOverlayer
    ref="popoverReference"
    :class="[rootClasses, `${classNameComponent}__overlayer`]"
    :style="attrs.style"
    :content-class="contentClass"
    :data-test-id="popoverTestId"
    :disabled="blocked"
    match-trigger-width
    popup-type="dialog"
    :placement="popoverPlacement"
    @update:open="handlePopoverState"
  >
    <div ref="triggerReference" :class="`${classNameComponent}__trigger-host`">
      <slot name="trigger" :display-value="draft" :open="popoverOpen" :toggle="togglePicker">
        <FormField
          :can-erase="props.canErase"
          :disabled="props.disabled || props.loading"
          :icon-after="props.variant === 'input' ? 'clock' : undefined"
          :id="props.id"
          :label="props.label"
          :name="props.name"
          :placeholder="placeholder"
          :readonly="props.readonly"
          :required="props.required"
          :value="draft"
          :data-test-id="props.dataTestId"
          @on:remove="handleErase"
        >
          <template v-if="hasSlot('hint')" #hint><slot name="hint" /></template>

          <template #default="{ props: fieldProps }">
            <input
              v-if="props.variant === 'input'"
              ref="inputReference"
              v-bind="getInputBindings(fieldProps)"
              type="text"
              role="combobox"
              aria-autocomplete="none"
              :aria-controls="panelId"
              :aria-expanded="popoverOpen"
              aria-haspopup="dialog"
              autocomplete="off"
              autocapitalize="none"
              :class="[fieldProps.class, `${classNameComponent}__input`]"
              :data-testid="elementTestId"
              data-type="time-picker"
              :disabled="props.disabled || props.loading"
              :inputmode="props.format === '12h' ? 'text' : 'numeric'"
              :placeholder="placeholder"
              :readonly="props.readonly"
              :spellcheck="false"
              :value="draft"
              @change.stop="handleInputChange"
              @click.stop="openPicker(false)"
              @input.stop="handleDraftInput"
              @keydown="handleInputKeydown"
            />

            <div
              v-else
              v-bind="getSegmentGroupBindings(fieldProps)"
              :data-testid="elementTestId"
              @click.stop
            >
              <template v-for="(segment, index) in segments" :key="segment">
                <span
                  v-if="index > 0 && segment !== 'period'"
                  aria-hidden="true"
                  :class="`${classNameComponent}__separator`"
                  >:</span
                >
                <button
                  type="button"
                  :class="`${classNameComponent}__segment`"
                  role="spinbutton"
                  :aria-label="getSegmentLabel(segment)"
                  :aria-valuemax="getSegmentRange(segment, props.format).max"
                  :aria-valuemin="getSegmentRange(segment, props.format).min"
                  :aria-valuenow="getSegmentValue(activeParts, segment, props.format)"
                  :aria-valuetext="getSegmentText(activeParts, segment, formatContext)"
                  :data-time-segment="segment"
                  :disabled="props.disabled || props.loading"
                  @click="
                    segment === 'period'
                      ? selectSegmentEdge('period', activeParts.hour >= 12 ? 'first' : 'last')
                      : undefined
                  "
                  @keydown="handleSegmentKeydown($event, segment, index)"
                >
                  {{ getSegmentText(activeParts, segment, formatContext) }}
                </button>
              </template>
              <button
                type="button"
                data-peaui-popover-trigger
                :class="`${classNameComponent}__panel-trigger`"
                :aria-controls="panelId"
                :aria-expanded="popoverOpen"
                aria-haspopup="dialog"
                :aria-label="triggerLabel"
                :disabled="blocked"
                @click.stop="togglePicker"
                @keydown.down.prevent="openPicker(true)"
              >
                <SvgIcon name="clock" aria-hidden="true" />
              </button>
              <input
                type="hidden"
                :name="props.name"
                :value="value"
                :disabled="props.disabled || props.loading"
              />
              <input
                v-bind="
                  getRequiredValueAttributes(
                    Boolean(value),
                    props.required,
                    props.disabled || props.loading,
                    props.readonly,
                  )
                "
                @invalid="
                  focusInvalidValue($event, triggerReference?.querySelector('[role=spinbutton]'))
                "
              />
            </div>
          </template>

          <template v-if="props.description || hasSlot('description')" #description>
            <slot name="description">{{ props.description }}</slot>
          </template>
          <template v-if="hasError" #error>
            <slot name="error" :message="errorMessage" :reason="invalidReason">
              {{ errorMessage }}
            </slot>
          </template>
        </FormField>
      </slot>

      <span
        v-if="props.loading"
        :id="loadingId"
        :class="`${classNameComponent}__loading-status`"
        role="status"
        aria-live="polite"
      >
        <span :class="`${classNameComponent}__spinner`" aria-hidden="true" />
        {{ props.loadingLabel }}
      </span>
    </div>

    <template #content>
      <div
        :id="panelId"
        ref="panelReference"
        :class="`${classNameComponent}__panel`"
        role="dialog"
        aria-modal="false"
        :aria-labelledby="panelLabelId"
        :data-testid="panelTestId"
        @keydown="handlePanelKeydown"
      >
        <p :id="panelLabelId" :class="`${classNameComponent}__panel-heading`">
          {{ panelLabel }}
        </p>

        <div v-if="props.panelMode === 'dropdown'" :class="`${classNameComponent}__option-columns`">
          <div
            v-for="segment in segments"
            :key="segment"
            :class="`${classNameComponent}__option-column`"
          >
            <span
              :id="`${props.id}-${segment}-label`"
              :class="`${classNameComponent}__column-label`"
            >
              {{ getSegmentLabel(segment) }}
            </span>
            <div
              :class="`${classNameComponent}__listbox`"
              role="listbox"
              :aria-labelledby="`${props.id}-${segment}-label`"
              :data-time-listbox="segment"
            >
              <button
                v-for="option in segment === 'period' ? periodOptions : getOptions(segment)"
                :id="getOptionId(segment, option)"
                :key="String(option.value)"
                type="button"
                role="option"
                :class="[
                  `${classNameComponent}__option`,
                  {
                    [`${classNameComponent}__option--selected`]:
                      segment === 'period'
                        ? (activeParts.hour >= 12 ? 'pm' : 'am') === option.value
                        : activeParts[segment] === option.value,
                  },
                ]"
                :aria-disabled="option.disabled || undefined"
                :aria-selected="
                  segment === 'period'
                    ? (activeParts.hour >= 12 ? 'pm' : 'am') === option.value
                    : activeParts[segment] === option.value
                "
                :data-time-option-segment="segment"
                :data-time-option-value="option.value"
                :disabled="option.disabled"
                :tabindex="
                  (segment === 'period'
                    ? (activeParts.hour >= 12 ? 'pm' : 'am') === option.value
                    : activeParts[segment] === option.value) && !option.disabled
                    ? 0
                    : -1
                "
                @click="selectOption(segment, option)"
                @keydown="handleOptionKeydown($event, segment)"
              >
                <slot
                  v-if="segment === 'hour'"
                  name="hour-option"
                  :option="option"
                  :selected="activeParts.hour === option.value"
                  >{{ option.label }}</slot
                >
                <slot
                  v-else-if="segment === 'minute'"
                  name="minute-option"
                  :option="option"
                  :selected="activeParts.minute === option.value"
                  >{{ option.label }}</slot
                >
                <slot
                  v-else-if="segment === 'second'"
                  name="second-option"
                  :option="option"
                  :selected="activeParts.second === option.value"
                  >{{ option.label }}</slot
                >
                <slot
                  v-else
                  name="period-option"
                  :option="option"
                  :selected="(activeParts.hour >= 12 ? 'pm' : 'am') === option.value"
                  >{{ option.label }}</slot
                >
              </button>
            </div>
          </div>
        </div>

        <div
          v-else
          :class="`${classNameComponent}__spin-columns`"
          role="group"
          :aria-label="panelLabel"
        >
          <div
            v-for="(segment, index) in segments"
            :key="segment"
            :class="`${classNameComponent}__spin-column`"
          >
            <span :class="`${classNameComponent}__column-label`">{{
              getSegmentLabel(segment)
            }}</span>
            <button
              type="button"
              :class="`${classNameComponent}__spin-action`"
              :aria-label="`Zwiększ: ${getSegmentLabel(segment)}`"
              @click="
                (() => {
                  const next = getAdjacentSegmentValue(segment, activeParts, 1, validationOptions);
                  if (next) applyParts(next);
                })()
              "
            >
              <span aria-hidden="true">+</span>
            </button>
            <button
              type="button"
              role="spinbutton"
              :class="`${classNameComponent}__spin-value`"
              :aria-label="getSegmentLabel(segment)"
              :aria-valuemax="getSegmentRange(segment, props.format).max"
              :aria-valuemin="getSegmentRange(segment, props.format).min"
              :aria-valuenow="getSegmentValue(activeParts, segment, props.format)"
              :aria-valuetext="getSegmentText(activeParts, segment, formatContext)"
              :data-time-segment="segment"
              @keydown="handleSegmentKeydown($event, segment, index)"
            >
              {{ getSegmentText(activeParts, segment, formatContext) }}
            </button>
            <button
              type="button"
              :class="`${classNameComponent}__spin-action`"
              :aria-label="`Zmniejsz: ${getSegmentLabel(segment)}`"
              @click="
                (() => {
                  const next = getAdjacentSegmentValue(segment, activeParts, -1, validationOptions);
                  if (next) applyParts(next);
                })()
              "
            >
              <span aria-hidden="true">−</span>
            </button>
          </div>
        </div>

        <div v-if="hasSlot('footer')" :class="`${classNameComponent}__footer`">
          <slot name="footer" :close="() => closePicker(true)" :value="value" />
        </div>
      </div>
    </template>
  </PopoverOverlayer>
</template>
