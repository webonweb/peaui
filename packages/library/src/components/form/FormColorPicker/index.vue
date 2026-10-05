<script lang="ts">
import type {
  FormColorPickerDensity,
  FormColorPickerEyedropperErrorDetail,
  FormColorPickerFormat,
  FormColorPickerInvalidDetail,
  FormColorPickerPlacement,
  FormColorPickerSwatch,
  FormColorPickerVariant,
  HsvaColor,
} from './color-picker.shared';

export type FormColorPickerProps = {
  alpha?: boolean;
  ariaLabel?: string;
  canErase?: boolean;
  dataTestId?: string;
  density?: FormColorPickerDensity;
  description?: string;
  disabled?: boolean;
  error?: string;
  format?: FormColorPickerFormat;
  id: string;
  label?: string;
  loading?: boolean;
  loadingLabel?: string;
  name: string;
  panelAriaLabel?: string;
  placement?: FormColorPickerPlacement;
  placeholder?: string;
  readonly?: boolean;
  recentColors?: ReadonlyArray<string | FormColorPickerSwatch>;
  required?: boolean;
  savedColors?: ReadonlyArray<string | FormColorPickerSwatch>;
  showEyedropper?: boolean;
  variant?: FormColorPickerVariant;
};

export type {
  FormColorPickerDensity,
  FormColorPickerEyedropperErrorDetail,
  FormColorPickerFormat,
  FormColorPickerInvalidDetail,
  FormColorPickerInvalidReason,
  FormColorPickerPlacement,
  FormColorPickerSwatch,
  FormColorPickerVariant,
  HslaColor,
  HsvaColor,
  RgbaColor,
} from './color-picker.shared';
</script>

<script setup lang="ts">
import { UIKIT_NAME } from '@/constants';
import { useFormControlReset } from '@/composables/useFormControlReset';
import { computed, getCurrentInstance, nextTick, ref, useAttrs, useSlots, watch } from 'vue';

import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import FormField from '@/components/form/FormField/index.vue';
import PopoverOverlayer from '@/components/overlayer/PopoverOverlayer/index.vue';
import ColorPickerPanel from './ColorPickerPanel.vue';
import {
  DEFAULT_COLOR,
  colorToCss,
  normalizeHsva,
  normalizeSwatches,
  parseColor,
  serializeColor,
} from './color-picker.shared';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormColorPickerProps>(), {
  alpha: false,
  canErase: true,
  density: 'full',
  format: 'hex',
  loading: false,
  loadingLabel: 'Ładowanie wyboru koloru',
  panelAriaLabel: 'Wybierz kolor',
  placement: 'bottom',
  placeholder: '',
  recentColors: () => [],
  savedColors: () => [],
  showEyedropper: false,
  variant: 'popover',
});

const emit = defineEmits<{
  (event: 'change', value: string): void;
  (event: 'close'): void;
  (event: 'commit', value: string): void;
  (event: 'eyedropperError', detail: FormColorPickerEyedropperErrorDetail): void;
  (event: 'eyedropperStart'): void;
  (event: 'invalid', detail: FormColorPickerInvalidDetail): void;
  (event: 'open'): void;
}>();

defineSlots<{
  description?(): unknown;
  error?(props: { reason: FormColorPickerInvalidDetail['reason'] | undefined }): unknown;
  footer?(props: { color: string }): unknown;
  hint?(): unknown;
  'recent-color'?(props: { color: FormColorPickerSwatch; index: number }): unknown;
  'saved-color'?(props: { color: FormColorPickerSwatch; index: number }): unknown;
  swatch?(props: { color: string }): unknown;
  trigger?(props: { color: string; open: boolean; toggle: () => void }): unknown;
}>();

type PopoverReference = { hidePopover: () => void; showPopover: () => void };
type EyeDropperInstance = { open: () => Promise<{ sRGBHex: string }> };
type EyeDropperWindow = Window & { EyeDropper?: new () => EyeDropperInstance };

const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance() as ({ ce?: HTMLElement; isCE?: boolean } & object) | null;
const modelValue = defineModel<string>('value', { default: '#4C9A2A' });
const openModel = defineModel<boolean>('open', { default: false });
const classNameComponent = `${UIKIT_NAME}-form-color-picker`;
const popoverReference = ref<PopoverReference>();
const triggerReference = ref<HTMLElement>();
const inputReference = ref<HTMLInputElement>();
const isOpen = ref(false);
const touched = ref(false);
useFormControlReset(triggerReference, () => {
  touched.value = false;
  syncFromModel();
});
const canonicalColor = ref<HsvaColor>(parseColor(modelValue.value) ?? DEFAULT_COLOR);
const inputText = ref(modelValue.value || serializeColor(DEFAULT_COLOR, props.format, props.alpha));
const eyedropperActive = ref(false);
const popoverPlacement = ref<FormColorPickerPlacement>(props.placement);
const availablePanelHeight = ref(580);
const publishedValues = new Set<string>();

const blocked = computed(() => props.disabled || props.readonly || props.loading);
const parsedInput = computed(() => parseColor(inputText.value));
const publicReason = computed(() => {
  if (!touched.value) return undefined;
  if (!inputText.value.trim()) return props.required ? ('empty' as const) : undefined;
  return parsedInput.value ? undefined : ('format' as const);
});
const hasError = computed(() => Boolean(props.error || publicReason.value));
const displayValue = computed(() =>
  serializeColor(canonicalColor.value, props.format, props.alpha),
);
const resolvedPlaceholder = computed(() => {
  if (props.placeholder) return props.placeholder;
  if (props.format === 'rgb') return props.alpha ? 'rgba(76, 154, 42, 1)' : 'rgb(76, 154, 42)';
  if (props.format === 'hsl') return props.alpha ? 'hsla(101, 57%, 38%, 1)' : 'hsl(101, 57%, 38%)';
  return props.alpha ? '#4C9A2AFF' : '#4C9A2A';
});
const rootClasses = computed(() => [
  classNameComponent,
  `${classNameComponent}--${props.variant}`,
  `${classNameComponent}--${props.density}`,
  {
    [`${classNameComponent}--open`]: isOpen.value,
    [`${classNameComponent}--disabled`]: props.disabled,
    [`${classNameComponent}--readonly`]: props.readonly,
    [`${classNameComponent}--loading`]: props.loading,
    [`${classNameComponent}--error`]: hasError.value,
  },
  attrs.class,
]);
const normalizedSavedColors = computed(() => normalizeSwatches(props.savedColors));
const normalizedRecentColors = computed(() => normalizeSwatches(props.recentColors));
const baseTestId = computed(() => props.dataTestId || (attrs['data-testid'] as string | undefined));
const eyedropperAvailable = computed(() => {
  if (typeof window === 'undefined') return false;
  return (
    window.isSecureContext === true && typeof (window as EyeDropperWindow).EyeDropper === 'function'
  );
});

function hasSlot(name: string): boolean {
  if (slots[name]) return true;
  return Boolean(
    instance?.isCE === true && instance.ce?.hasAttribute(`data-peaui-native-slot-${name}`),
  );
}

function getFieldDescription(fieldProps: Record<string, unknown>): string | undefined {
  const values = [attrs['aria-describedby'], fieldProps['aria-describedby']]
    .filter((value): value is string => typeof value === 'string' && Boolean(value.trim()))
    .flatMap((value) => value.trim().split(/\s+/));
  return [...new Set(values)].join(' ') || undefined;
}

function handleInputArrowDown(event: KeyboardEvent): void {
  if (props.variant !== 'popover') return;
  event.preventDefault();
  openPicker();
}

function inputBindings(fieldProps: Record<string, unknown>) {
  const forwarded = { ...attrs } as Record<string, unknown>;
  delete forwarded.class;
  delete forwarded.style;
  delete forwarded['data-testid'];
  return {
    ...forwarded,
    ...fieldProps,
    id: props.id,
    'aria-busy': props.loading || undefined,
    'aria-controls': props.variant === 'popover' ? `${props.id}-panel` : undefined,
    'aria-describedby': getFieldDescription(fieldProps),
    'aria-expanded': props.variant === 'popover' ? isOpen.value : undefined,
    'aria-haspopup': props.variant === 'popover' ? ('dialog' as const) : undefined,
    'aria-invalid': hasError.value || undefined,
    'aria-label': props.ariaLabel || (props.label ? undefined : props.name),
    'aria-labelledby': props.ariaLabel || !props.label ? undefined : `label-${props.id}`,
    'aria-readonly': props.readonly || undefined,
  };
}

function syncFromModel(value = modelValue.value): void {
  const parsed = parseColor(value);
  if (!parsed) {
    inputText.value = value ?? '';
    return;
  }
  canonicalColor.value = normalizeHsva({ ...parsed, a: props.alpha ? parsed.a : 1 });
  inputText.value = serializeColor(canonicalColor.value, props.format, props.alpha);
}

function publishColor(color: HsvaColor, commit = false): void {
  if (blocked.value) return;
  canonicalColor.value = normalizeHsva({ ...color, a: props.alpha ? color.a : 1 });
  const next = serializeColor(canonicalColor.value, props.format, props.alpha);
  inputText.value = next;
  touched.value = false;
  setModelValue(next);
  emit('change', next);
  if (commit) emit('commit', next);
}

function commitPanelColor(color: HsvaColor): void {
  canonicalColor.value = normalizeHsva({ ...color, a: props.alpha ? color.a : 1 });
  const next = serializeColor(canonicalColor.value, props.format, props.alpha);
  if (modelValue.value !== next) setModelValue(next);
  inputText.value = next;
  emit('commit', next);
}

function handleTextInput(event: Event): void {
  inputText.value = (event.target as HTMLInputElement).value;
  touched.value = false;
}

function commitTextInput(): void {
  if (blocked.value) return;
  const source = inputText.value.trim();
  if (!source) {
    if (props.required) {
      touched.value = true;
      emit('invalid', { input: inputText.value, reason: 'empty' });
      return;
    }
    setModelValue('');
    emit('change', '');
    emit('commit', '');
    return;
  }
  const parsed = parseColor(source);
  if (!parsed) {
    touched.value = true;
    emit('invalid', { input: inputText.value, reason: 'format' });
    return;
  }
  const next = serializeColor(parsed, props.format, props.alpha);
  if (inputText.value === next && modelValue.value === next && !publicReason.value) return;
  publishColor(parsed, true);
}

function eraseColor(): void {
  if (blocked.value) return;
  inputText.value = '';
  if (props.required) {
    touched.value = true;
    emit('invalid', { input: '', reason: 'empty' });
    return;
  }
  setModelValue('');
  emit('change', '');
  emit('commit', '');
  closePicker(true);
}

function syncPopoverPlacement(): void {
  const trigger = triggerReference.value;
  if (!trigger || typeof window === 'undefined') return;
  const rect = trigger.getBoundingClientRect();
  const above = rect.top;
  const below = window.innerHeight - rect.bottom;
  const preferred = props.placement === 'bottom' ? below : above;
  const fallback = props.placement === 'bottom' ? 'top' : 'bottom';
  const fallbackSpace = fallback === 'bottom' ? below : above;
  popoverPlacement.value =
    preferred >= 540 || preferred >= fallbackSpace ? props.placement : fallback;
  const selectedSpace = popoverPlacement.value === 'bottom' ? below : above;
  availablePanelHeight.value = Math.max(240, selectedSpace - 10);
}

function openPicker(focusInput = false): void {
  if (blocked.value || props.variant !== 'popover') return;
  syncPopoverPlacement();
  popoverReference.value?.showPopover();
  if (focusInput) void nextTick(() => inputReference.value?.focus());
}

function closePicker(restoreFocus = false): void {
  popoverReference.value?.hidePopover();
  if (restoreFocus) void nextTick(() => inputReference.value?.focus());
}

function togglePicker(): void {
  if (isOpen.value) closePicker(true);
  else openPicker();
}

function handlePopoverState(next: boolean): void {
  if (isOpen.value === next) return;
  isOpen.value = next;
  openModel.value = next;
  if (next) emit('open');
  else emit('close');
}

async function startEyedropper(): Promise<void> {
  if (!eyedropperAvailable.value) {
    emit('eyedropperError', { reason: 'unavailable' });
    return;
  }
  const EyeDropper = (window as EyeDropperWindow).EyeDropper;
  if (!EyeDropper) return;
  eyedropperActive.value = true;
  emit('eyedropperStart');
  try {
    const result = await new EyeDropper().open();
    const parsed = parseColor(result.sRGBHex);
    if (!parsed) throw new TypeError('EyeDropper returned an invalid color.');
    publishColor(parsed, true);
  } catch (error) {
    const reason =
      error instanceof DOMException && error.name === 'AbortError' ? 'cancelled' : 'failed';
    emit('eyedropperError', { error, reason });
  } finally {
    eyedropperActive.value = false;
  }
}

function invalidMessage(): string {
  if (props.error) return props.error;
  if (publicReason.value === 'empty') return 'Wybierz kolor.';
  if (publicReason.value === 'format') return 'Wpisz poprawny kolor HEX, RGB lub HSL.';
  return '';
}

function setModelValue(value: string): void {
  publishedValues.add(value);
  if (publishedValues.size > 64) {
    const oldest = publishedValues.values().next().value;
    if (oldest !== undefined) publishedValues.delete(oldest);
  }
  modelValue.value = value;
}

watch(
  modelValue,
  (value) => {
    if (publishedValues.delete(value)) return;
    syncFromModel(value);
  },
  { immediate: true },
);
watch(
  () => [props.format, props.alpha] as const,
  () => {
    const next = serializeColor(canonicalColor.value, props.format, props.alpha);
    inputText.value = next;
    if (modelValue.value && modelValue.value !== next) setModelValue(next);
  },
);
watch(openModel, (next) => {
  if (props.variant !== 'popover') return;
  if (next && !isOpen.value) openPicker();
  else if (!next && isOpen.value) closePicker();
});
watch(
  () => props.variant,
  (variant) => {
    if (variant === 'inline' && isOpen.value) closePicker();
  },
);
</script>

<template>
  <PopoverOverlayer
    ref="popoverReference"
    :class="rootClasses"
    :content-class="`${classNameComponent}__popover-content`"
    :data-test-id="baseTestId ? `${baseTestId}-popover` : undefined"
    :disabled="blocked || props.variant === 'inline'"
    :manage-trigger-accessibility="props.variant === 'popover'"
    match-trigger-width
    :placement="popoverPlacement"
    popup-type="dialog"
    :style="attrs.style"
    @update:open="handlePopoverState"
  >
    <div ref="triggerReference" :class="`${classNameComponent}__trigger-host`">
      <slot name="trigger" :color="displayValue" :open="isOpen" :toggle="togglePicker">
        <FormField
          :can-erase="props.canErase"
          :disabled="props.disabled || props.loading"
          :id="props.id"
          :label="props.label"
          :name="props.name"
          :placeholder="resolvedPlaceholder"
          :readonly="props.readonly"
          :required="props.required"
          :value="inputText"
          :data-test-id="baseTestId"
          @on:remove="eraseColor"
        >
          <template v-if="hasSlot('hint')" #hint><slot name="hint" /></template>
          <template #default="{ props: fieldProps }">
            <div :class="`${classNameComponent}__field-shell`">
              <slot name="swatch" :color="displayValue">
                <span
                  aria-hidden="true"
                  :class="`${classNameComponent}__field-swatch`"
                  :style="{ '--peaui-form-color-picker-color': colorToCss(canonicalColor) }"
                />
              </slot>
              <input
                ref="inputReference"
                v-bind="inputBindings(fieldProps)"
                :class="[fieldProps.class, `${classNameComponent}__input`]"
                :data-testid="baseTestId ? `${baseTestId}-input` : undefined"
                type="text"
                :role="props.variant === 'popover' ? 'combobox' : undefined"
                autocomplete="off"
                :disabled="props.disabled || props.loading"
                :placeholder="resolvedPlaceholder"
                :readonly="props.readonly"
                :value="inputText"
                @blur="commitTextInput"
                @click.stop="openPicker()"
                @input.stop="handleTextInput"
                @keydown.down="handleInputArrowDown"
                @keydown.enter.prevent="commitTextInput"
                @keydown.esc="closePicker(true)"
              />
              <button
                v-if="props.variant === 'popover'"
                type="button"
                :aria-controls="`${props.id}-panel`"
                :aria-expanded="isOpen"
                aria-haspopup="dialog"
                :aria-label="isOpen ? 'Zamknij wybór koloru' : 'Otwórz wybór koloru'"
                :class="`${classNameComponent}__toggle`"
                :disabled="blocked"
                @click.stop="togglePicker"
              >
                <SvgIcon :class="`${classNameComponent}__toggle-icon`" name="arrow" />
              </button>
            </div>
          </template>
          <template v-if="hasSlot('description') || props.description" #description>
            <slot name="description">{{ props.description }}</slot>
          </template>
          <template v-if="hasSlot('error') || hasError" #error>
            <slot name="error" :reason="publicReason">{{ invalidMessage() }}</slot>
          </template>
        </FormField>
        <span v-if="props.loading" :class="`${classNameComponent}__loading-status`" role="status">
          <span aria-hidden="true" :class="`${classNameComponent}__spinner`" />
          {{ props.loadingLabel }}
        </span>
      </slot>
    </div>

    <ColorPickerPanel
      v-if="props.variant === 'inline'"
      :alpha="props.alpha"
      :blocked="blocked"
      :color="canonicalColor"
      :density="props.density"
      :eyedropper-active="eyedropperActive"
      :eyedropper-available="eyedropperAvailable"
      :format="props.format"
      :id="props.id"
      :panel-aria-label="props.panelAriaLabel"
      :recent-colors="normalizedRecentColors"
      :saved-colors="normalizedSavedColors"
      :show-eyedropper="props.showEyedropper"
      variant="group"
      @change="publishColor"
      @commit="commitPanelColor"
      @eyedropper="startEyedropper"
    >
      <template v-if="hasSlot('saved-color')" #saved-color="slotProps">
        <slot name="saved-color" v-bind="slotProps" />
      </template>
      <template v-if="hasSlot('recent-color')" #recent-color="slotProps">
        <slot name="recent-color" v-bind="slotProps" />
      </template>
      <template v-if="hasSlot('footer')" #footer="slotProps">
        <slot name="footer" v-bind="slotProps" />
      </template>
    </ColorPickerPanel>

    <template #content>
      <ColorPickerPanel
        v-if="props.variant === 'popover'"
        :alpha="props.alpha"
        :blocked="blocked"
        :color="canonicalColor"
        :density="props.density"
        :eyedropper-active="eyedropperActive"
        :eyedropper-available="eyedropperAvailable"
        :format="props.format"
        :id="props.id"
        :panel-aria-label="props.panelAriaLabel"
        :recent-colors="normalizedRecentColors"
        :saved-colors="normalizedSavedColors"
        :show-eyedropper="props.showEyedropper"
        variant="dialog"
        :style="{ '--peaui-form-color-picker-available-height': `${availablePanelHeight}px` }"
        @change="publishColor"
        @commit="commitPanelColor"
        @eyedropper="startEyedropper"
        @keydown.esc.prevent="closePicker(true)"
      >
        <template v-if="hasSlot('saved-color')" #saved-color="slotProps">
          <slot name="saved-color" v-bind="slotProps" />
        </template>
        <template v-if="hasSlot('recent-color')" #recent-color="slotProps">
          <slot name="recent-color" v-bind="slotProps" />
        </template>
        <template v-if="hasSlot('footer')" #footer="slotProps">
          <slot name="footer" v-bind="slotProps" />
        </template>
      </ColorPickerPanel>
    </template>
  </PopoverOverlayer>
</template>
