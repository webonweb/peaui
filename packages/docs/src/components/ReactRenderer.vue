<script setup lang="ts">
import { createElement, Suspense, type ComponentType, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { t } from '../i18n';

const props = defineProps<{
  component: ComponentType<Record<string, unknown>>;
  bindings: Record<string, unknown>;
  slotContent: Record<string, string | string[]>;
}>();

const host = ref<HTMLDivElement>();
let root: Root | undefined;

function toCamelCase(value: string): string {
  return value.replace(/[-:]([a-z])/g, (_, character: string) => character.toUpperCase());
}

function renderSlot(value: string | string[], name: string): ReactNode {
  if (Array.isArray(value)) {
    return value.map((entry, index) =>
      createElement('article', { className: 'docs-demo-card', key: `${name}-${index}` }, [
        createElement(
          'span',
          { className: 'docs-demo-card__eyebrow', key: 'eyebrow' },
          t('demo.example', { number: index + 1 }),
        ),
        createElement('strong', { key: 'title' }, entry),
        createElement('p', { key: 'description' }, t('demo.interactiveItem')),
      ]),
    );
  }

  return createElement(
    'span',
    {
      className:
        name === 'default' ? 'docs-demo-content' : `docs-demo-slot docs-demo-slot--${name}`,
    },
    value,
  );
}

function renderReactComponent(): void {
  if (!root) return;
  const reactProps: Record<string, unknown> = { ...props.bindings };

  for (const [name, value] of Object.entries(props.slotContent)) {
    if (!value || (Array.isArray(value) && value.length === 0)) continue;
    if (name === 'default') reactProps.children = renderSlot(value, name);
    else reactProps[toCamelCase(name)] = renderSlot(value, name);
  }

  root.render(
    createElement(
      Suspense,
      {
        fallback: createElement(
          'span',
          { className: 'sr-only', role: 'status' },
          t('demo.loadingPreview'),
        ),
      },
      createElement(props.component, reactProps),
    ),
  );
}

onMounted(() => {
  if (!host.value) return;
  root = createRoot(host.value);
  renderReactComponent();
});

watch(
  () => [props.component, props.bindings, props.slotContent],
  () => void nextTick(renderReactComponent),
  { deep: true },
);

onBeforeUnmount(() => {
  root?.unmount();
  root = undefined;
});
</script>

<template>
  <div ref="host" class="react-live-root" />
</template>
