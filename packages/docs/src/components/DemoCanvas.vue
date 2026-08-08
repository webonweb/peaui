<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { getDemoPreset, getDemoVariants, getExampleCode } from '../data/demo-presets';
import { cloneDemoValue } from '../data/demo-utils';
import { useDemoTranslation } from '../composables/use-demo-translation';
import type { ComponentDefinition } from '../types';
import { useI18n } from '../i18n';
import CodeBlock from './CodeBlock.vue';
import DemoErrorBoundary from './DemoErrorBoundary.vue';
import LiveRenderer from './LiveRenderer.vue';
import PropControl from './PropControl.vue';

const props = defineProps<{ definition: ComponentDefinition }>();
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
    bindings[`onUpdate:${model.name}`] = (value: unknown) => {
      interactiveProps.value[model.name] = value;
      logEvent(`update:${model.name}`, value);
    };
  }

  for (const event of props.definition.events) {
    const eventBinding = `on${event.name.charAt(0).toUpperCase()}${event.name.slice(1)}`;
    // Model listeners own the controlled value. Generated event metadata may
    // contain the same update event, but replacing it would freeze the preview.
    if (bindings[eventBinding]) continue;

    bindings[eventBinding] = (...values: unknown[]) => {
      if (props.definition.name === 'TableList') {
        if (event.name === 'on:select:row' && Array.isArray(values[0])) {
          interactiveProps.value = { ...interactiveProps.value, selectedRows: values[0] };
        }
        if (event.name === 'on:check:row' && values[0] && typeof values[0] === 'object') {
          interactiveProps.value = {
            ...interactiveProps.value,
            currentCheckedRow: (values[0] as Record<string, unknown>).id,
          };
        }
      }
      logEvent(event.name, values.length < 2 ? values[0] : values);
    };
  }

  return bindings;
});
const exampleCode = computed(() => getExampleCode(props.definition, interactiveProps.value));
const resetKey = computed(
  () =>
    `${props.definition.name}-${activeVariantId.value}-${JSON.stringify(interactiveProps.value)}`,
);

function selectVariant(id: string) {
  activeVariantId.value = id;
  const variant = variants.value.find((entry) => entry.id === id) ?? variants.value[0];
  interactiveProps.value = cloneDemoValue(variant?.props ?? {});
  eventLog.value = [];
}

function updateProp(name: string, value: unknown) {
  interactiveProps.value = { ...interactiveProps.value, [name]: value };
}

function logEvent(name: string, value: unknown) {
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
    <div class="variant-tabs" role="tablist" :aria-label="t('demo.variants')">
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
            {{ t('common.code') }}
          </button>
        </div>
        <button class="reset-button" type="button" @click="selectVariant(activeVariantId)">
          {{ t('common.reset') }}
        </button>
      </div>

      <div v-if="panel === 'preview'" ref="demoStage" class="demo-stage">
        <DemoErrorBoundary :reset-key="resetKey">
          <LiveRenderer
            :component="definition.component"
            :bindings="renderedBindings"
            :slot-content="slotContent"
          />
        </DemoErrorBoundary>
      </div>
      <CodeBlock v-else :code="exampleCode" />
    </div>

    <details class="playground-controls">
      <summary>
        <span>
          <strong>{{ t('demo.propsPlayground') }}</strong>
          <small>{{ t('demo.propsHint') }}</small>
        </span>
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
      <strong>{{ t('demo.events') }}</strong>
      <code v-for="event in eventLog" :key="event">{{ event }}</code>
    </div>
  </div>
</template>
