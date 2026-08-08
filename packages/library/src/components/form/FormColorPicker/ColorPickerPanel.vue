<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

import {
  colorToCss,
  getIndicatorColor,
  normalizeHsva,
  opaqueHueToCss,
  parseColor,
  serializeColor,
  type FormColorPickerDensity,
  type FormColorPickerFormat,
  type FormColorPickerSwatch,
  type HsvaColor,
} from './color-picker.shared';

const props = defineProps<{
  alpha: boolean;
  blocked: boolean;
  color: HsvaColor;
  density: FormColorPickerDensity;
  eyedropperActive: boolean;
  eyedropperAvailable: boolean;
  format: FormColorPickerFormat;
  id: string;
  panelAriaLabel: string;
  recentColors: FormColorPickerSwatch[];
  savedColors: FormColorPickerSwatch[];
  showEyedropper: boolean;
  variant: 'dialog' | 'group';
}>();

const emit = defineEmits<{
  (event: 'change', color: HsvaColor): void;
  (event: 'commit', color: HsvaColor): void;
  (event: 'eyedropper'): void;
}>();

defineSlots<{
  footer?(props: { color: string }): unknown;
  'recent-color'?(props: { color: FormColorPickerSwatch; index: number }): unknown;
  'saved-color'?(props: { color: FormColorPickerSwatch; index: number }): unknown;
}>();

const classNameComponent = 'peaui-form-color-picker';
const liveColor = ref(normalizeHsva(props.color));
const activePointerId = ref<number>();
const saturationArea = ref<HTMLElement>();

watch(
  () => props.color,
  (value) => {
    if (activePointerId.value === undefined) liveColor.value = normalizeHsva(value);
  },
  { deep: true },
);

const colorCss = computed(() => colorToCss(liveColor.value));
const hueCss = computed(() => opaqueHueToCss(liveColor.value.h));
const indicatorColor = computed(() => getIndicatorColor(liveColor.value));
const displayValue = computed(() => serializeColor(liveColor.value, props.format, props.alpha));
const saturationValueText = computed(
  () => `Nasycenie ${Math.round(liveColor.value.s)}%, jasność ${Math.round(liveColor.value.v)}%`,
);
const alphaValueText = computed(() => `${Math.round(liveColor.value.a * 100)}%`);

function publish(next: HsvaColor, commit = false): void {
  if (props.blocked) return;
  liveColor.value = normalizeHsva(next);
  emit('change', liveColor.value);
  if (commit) emit('commit', liveColor.value);
}

function updateFromPointer(event: PointerEvent): void {
  const element = saturationArea.value;
  if (!element) return;
  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  publish({
    ...liveColor.value,
    s: ((event.clientX - rect.left) / rect.width) * 100,
    v: 100 - ((event.clientY - rect.top) / rect.height) * 100,
  });
}

function startPointer(event: PointerEvent): void {
  if (props.blocked) return;
  activePointerId.value = event.pointerId;
  saturationArea.value?.setPointerCapture?.(event.pointerId);
  updateFromPointer(event);
}

function movePointer(event: PointerEvent): void {
  if (activePointerId.value !== event.pointerId) return;
  updateFromPointer(event);
}

function finishPointer(event: PointerEvent, shouldCommit: boolean): void {
  if (activePointerId.value !== event.pointerId) return;
  if (shouldCommit) {
    updateFromPointer(event);
    emit('commit', liveColor.value);
  }
  if (saturationArea.value?.hasPointerCapture?.(event.pointerId)) {
    saturationArea.value.releasePointerCapture(event.pointerId);
  }
  activePointerId.value = undefined;
}

onBeforeUnmount(() => {
  const pointerId = activePointerId.value;
  if (pointerId !== undefined && saturationArea.value?.hasPointerCapture?.(pointerId)) {
    saturationArea.value.releasePointerCapture(pointerId);
  }
  activePointerId.value = undefined;
});

function handleSaturationKeydown(event: KeyboardEvent): void {
  if (props.blocked) return;
  const step = event.shiftKey ? 10 : 1;
  let next: HsvaColor | undefined;
  if (event.key === 'ArrowLeft') next = { ...liveColor.value, s: liveColor.value.s - step };
  else if (event.key === 'ArrowRight') next = { ...liveColor.value, s: liveColor.value.s + step };
  else if (event.key === 'ArrowUp') next = { ...liveColor.value, v: liveColor.value.v + step };
  else if (event.key === 'ArrowDown') next = { ...liveColor.value, v: liveColor.value.v - step };
  else if (event.key === 'PageUp') next = { ...liveColor.value, v: liveColor.value.v + 10 };
  else if (event.key === 'PageDown') next = { ...liveColor.value, v: liveColor.value.v - 10 };
  else if (event.key === 'Home') next = { ...liveColor.value, s: 0 };
  else if (event.key === 'End') next = { ...liveColor.value, s: 100 };
  if (!next) return;
  event.preventDefault();
  publish(next, true);
}

function handleHueInput(event: Event, commit = false): void {
  publish({ ...liveColor.value, h: Number((event.target as HTMLInputElement).value) }, commit);
}

function handleAlphaInput(event: Event, commit = false): void {
  publish(
    { ...liveColor.value, a: Number((event.target as HTMLInputElement).value) / 100 },
    commit,
  );
}

function selectSwatch(swatch: FormColorPickerSwatch): void {
  const parsed = parseColor(swatch.value);
  if (parsed) publish(parsed, true);
}

function swatchLabel(swatch: FormColorPickerSwatch): string {
  return swatch.label?.trim() || `Wybierz kolor ${swatch.value}`;
}
</script>

<template>
  <section
    :id="`${props.id}-panel`"
    :aria-label="props.panelAriaLabel"
    :class="[
      `${classNameComponent}__panel`,
      `${classNameComponent}__panel--${props.density}`,
      `${classNameComponent}__panel--${props.variant}`,
    ]"
    :role="props.variant"
  >
    <div :class="`${classNameComponent}__preview-row`">
      <span
        aria-hidden="true"
        :class="`${classNameComponent}__preview`"
        :style="{ '--peaui-form-color-picker-color': colorCss }"
      />
      <div>
        <p :class="`${classNameComponent}__current-label`">Wybrany kolor</p>
        <output :class="`${classNameComponent}__current-value`">{{ displayValue }}</output>
      </div>
    </div>

    <div
      ref="saturationArea"
      :aria-describedby="`${props.id}-saturation-instructions`"
      aria-label="Nasycenie i jasność koloru"
      :aria-valuemax="100"
      :aria-valuemin="0"
      :aria-valuenow="Math.round(liveColor.s)"
      :aria-valuetext="saturationValueText"
      :class="`${classNameComponent}__saturation`"
      :style="{ '--peaui-form-color-picker-hue': hueCss }"
      role="slider"
      :tabindex="props.blocked ? -1 : 0"
      @keydown="handleSaturationKeydown"
      @pointercancel="finishPointer($event, false)"
      @pointerdown.prevent="startPointer"
      @pointermove.prevent="movePointer"
      @pointerup.prevent="finishPointer($event, true)"
    >
      <span
        aria-hidden="true"
        :class="`${classNameComponent}__saturation-indicator`"
        :style="{
          '--peaui-form-color-picker-indicator': indicatorColor,
          left: `${liveColor.s}%`,
          top: `${100 - liveColor.v}%`,
        }"
      />
    </div>
    <p :id="`${props.id}-saturation-instructions`" :class="`${classNameComponent}__sr-only`">
      Strzałki lewo i prawo zmieniają nasycenie, a góra i dół jasność. Shift zwiększa krok.
    </p>

    <div :class="`${classNameComponent}__sliders`">
      <label :class="`${classNameComponent}__slider-row`">
        <span>Odcień</span>
        <input
          :id="`${props.id}-hue`"
          aria-label="Odcień"
          :aria-valuetext="`${Math.round(liveColor.h)} stopni`"
          :class="`${classNameComponent}__range ${classNameComponent}__range--hue`"
          :disabled="props.blocked"
          max="359"
          min="0"
          type="range"
          :value="liveColor.h"
          @change="handleHueInput($event, true)"
          @input="handleHueInput"
        />
        <output :for="`${props.id}-hue`">{{ Math.round(liveColor.h) }}°</output>
      </label>
      <label v-if="props.alpha" :class="`${classNameComponent}__slider-row`">
        <span>Krycie</span>
        <input
          :id="`${props.id}-alpha`"
          aria-label="Krycie"
          :aria-valuetext="alphaValueText"
          :class="`${classNameComponent}__range ${classNameComponent}__range--alpha`"
          :disabled="props.blocked"
          max="100"
          min="0"
          type="range"
          :value="liveColor.a * 100"
          :style="{ '--peaui-form-color-picker-opaque': colorToCss({ ...liveColor, a: 1 }) }"
          @change="handleAlphaInput($event, true)"
          @input="handleAlphaInput"
        />
        <output :for="`${props.id}-alpha`">{{ Math.round(liveColor.a * 100) }}%</output>
      </label>
    </div>

    <section
      v-if="props.savedColors.length"
      :aria-labelledby="`${props.id}-saved-heading`"
      :class="`${classNameComponent}__palette-section`"
    >
      <h3 :id="`${props.id}-saved-heading`">Zapisane kolory</h3>
      <div :class="`${classNameComponent}__swatches`">
        <button
          v-for="(swatch, index) in props.savedColors"
          :key="`${swatch.value}-${index}`"
          type="button"
          :aria-label="swatchLabel(swatch)"
          :class="`${classNameComponent}__swatch`"
          :disabled="props.blocked"
          :style="{ '--peaui-form-color-picker-swatch': colorToCss(parseColor(swatch.value)!) }"
          @click="selectSwatch(swatch)"
        >
          <slot name="saved-color" :color="swatch" :index="index" />
        </button>
      </div>
    </section>

    <section
      v-if="props.recentColors.length"
      :aria-labelledby="`${props.id}-recent-heading`"
      :class="`${classNameComponent}__palette-section`"
    >
      <h3 :id="`${props.id}-recent-heading`">Ostatnie kolory</h3>
      <div :class="`${classNameComponent}__swatches`">
        <button
          v-for="(swatch, index) in props.recentColors"
          :key="`${swatch.value}-${index}`"
          type="button"
          :aria-label="swatchLabel(swatch)"
          :class="`${classNameComponent}__swatch`"
          :disabled="props.blocked"
          :style="{ '--peaui-form-color-picker-swatch': colorToCss(parseColor(swatch.value)!) }"
          @click="selectSwatch(swatch)"
        >
          <slot name="recent-color" :color="swatch" :index="index" />
        </button>
      </div>
    </section>

    <div
      v-if="props.showEyedropper || $slots.footer"
      :class="`${classNameComponent}__panel-footer`"
    >
      <button
        v-if="props.showEyedropper"
        type="button"
        :aria-describedby="
          !props.eyedropperAvailable ? `${props.id}-eyedropper-unavailable` : undefined
        "
        :class="`${classNameComponent}__eyedropper`"
        :disabled="props.blocked || !props.eyedropperAvailable || props.eyedropperActive"
        @click="emit('eyedropper')"
      >
        {{ props.eyedropperActive ? 'Pobieranie koloru…' : 'Pobierz kolor z ekranu' }}
      </button>
      <span
        v-if="props.showEyedropper && !props.eyedropperAvailable"
        :id="`${props.id}-eyedropper-unavailable`"
        :class="`${classNameComponent}__unavailable`"
      >
        EyeDropper jest niedostępny w tej przeglądarce lub poza bezpiecznym kontekstem.
      </span>
      <slot name="footer" :color="displayValue" />
    </div>
  </section>
</template>
