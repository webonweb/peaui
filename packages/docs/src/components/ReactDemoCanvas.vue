<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { getDemoPreset, getDemoVariants, getReactExampleCode } from '../data/demo-presets';
import { cloneDemoValue } from '../data/demo-utils';
import { useDemoTranslation } from '../composables/use-demo-translation';
import type { FrameworkComponentDefinition } from '../types';
import { useI18n } from '../i18n';
import CodeBlock from './CodeBlock.vue';
import PropControl from './PropControl.vue';
import ReactRenderer from './ReactRenderer.vue';

const props = defineProps<{ definition: FrameworkComponentDefinition }>();
const { locale, t } = useI18n();

const activeVariantId = ref('default');
const panel = ref<'preview' | 'code'>('preview');
const interactiveProps = ref<Record<string, unknown>>({});
const eventLog = ref<string[]>([]);
const demoStage = ref<HTMLElement>();
useDemoTranslation(demoStage);

const preset = computed(() => getDemoPreset(props.definition));
const variants = computed(() => getDemoVariants(props.definition));
const activeVariant = computed(
  () => variants.value.find((variant) => variant.id === activeVariantId.value) ?? variants.value[0],
);
const inputEntries = computed(() => [...props.definition.props, ...props.definition.models]);
const slotContent = computed<Record<string, string | string[]>>(() => ({
  ...(preset.value.defaultSlot ? { default: preset.value.defaultSlot } : {}),
  ...preset.value.slots,
}));
const renderedBindings = computed(() => {
  const bindings: Record<string, unknown> = { ...interactiveProps.value };

  for (const model of props.definition.models) {
    const capitalized = model.name.charAt(0).toUpperCase() + model.name.slice(1);
    bindings[`on${capitalized}Change`] = (value: unknown) => {
      interactiveProps.value = { ...interactiveProps.value, [model.name]: value };
      logEvent(`on${capitalized}Change`, value);
    };
  }

  for (const event of props.definition.events) {
    bindings[event.name] = (...values: unknown[]) =>
      logEvent(event.name, values.length < 2 ? values[0] : values);
  }

  return bindings;
});
const exampleCode = computed(() => getReactExampleCode(props.definition, interactiveProps.value));

function selectVariant(id: string): void {
  activeVariantId.value = id;
  const variant = variants.value.find((entry) => entry.id === id) ?? variants.value[0];
  interactiveProps.value = cloneDemoValue(variant?.props ?? {});
  eventLog.value = [];
}

function updateProp(name: string, value: unknown): void {
  interactiveProps.value = { ...interactiveProps.value, [name]: value };
}

function logEvent(name: string, value: unknown): void {
  const serialized = typeof value === 'object' ? JSON.stringify(value) : String(value);
  eventLog.value = [`${name}: ${serialized}`, ...eventLog.value].slice(0, 4);
}

watch(
  () => [props.definition.name, locale.value],
  () => {
    activeVariantId.value = 'default';
    interactiveProps.value = cloneDemoValue(variants.value[0]?.props ?? {});
    panel.value = 'preview';
    eventLog.value = [];
  },
  { immediate: true },
);
</script>

<template>
  <div class="demo-workbench">
    <div class="variant-tabs" role="tablist" :aria-label="t('demo.reactVariants')">
      <button
        v-for="variant in variants"
        :key="variant.id"
        type="button"
        role="tab"
        :aria-selected="activeVariantId === variant.id"
        @click="selectVariant(variant.id)"
      >
        {{ variant.label }}
      </button>
    </div>

    <p class="variant-description">{{ activeVariant?.description }}</p>

    <div class="demo-panel">
      <div class="demo-panel__toolbar">
        <div class="segmented-control">
          <button type="button" :class="{ active: panel === 'preview' }" @click="panel = 'preview'">
            {{ t('common.preview') }}
          </button>
          <button type="button" :class="{ active: panel === 'code' }" @click="panel = 'code'">
            {{ t('common.code') }} React
          </button>
        </div>
        <button class="reset-button" type="button" @click="selectVariant(activeVariantId)">
          {{ t('common.reset') }}
        </button>
      </div>

      <div v-if="panel === 'preview'" ref="demoStage" class="demo-stage">
        <ReactRenderer
          v-if="definition.reactComponent"
          :component="definition.reactComponent"
          :bindings="renderedBindings"
          :slot-content="slotContent"
        />
        <p v-else role="alert">{{ t('demo.reactMissing') }}</p>
      </div>
      <CodeBlock v-else :code="exampleCode" language="tsx" />
    </div>

    <details class="playground-controls">
      <summary>
        <span
          ><strong>{{ t('demo.reactPlayground') }}</strong
          ><small>{{ t('demo.reactHint') }}</small></span
        >
        <span aria-hidden="true">+</span>
      </summary>
      <div class="playground-controls__grid">
        <PropControl
          v-for="entry in inputEntries"
          :key="entry.name"
          :entry="entry"
          :value="interactiveProps[entry.name]"
          @change="updateProp(entry.name, $event)"
        />
      </div>
    </details>

    <div v-if="eventLog.length" class="event-log" aria-live="polite">
      <strong>{{ t('demo.callbacks') }}</strong>
      <code v-for="event in eventLog" :key="event">{{ event }}</code>
    </div>
  </div>
</template>
