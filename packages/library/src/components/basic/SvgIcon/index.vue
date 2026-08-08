<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { loadCatalogIcon, type CatalogIconData } from '@/assets/icons/runtime/catalog/load-icon';
import { hasLegacyIcon, loadLegacyIcon } from '@/assets/icons/runtime/load-icon';
import {
  computed,
  defineComponent,
  defineAsyncComponent,
  h,
  shallowRef,
  useAttrs,
  useId,
  watch,
  type Component,
} from 'vue';

defineOptions({
  inheritAttrs: false,
});

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const id = useId();
const attrs = useAttrs();

const props = defineProps<{
  dataTestId?: string;
  name: string;
}>();

const classNameComponent = `${UIKIT_NAME}-svg-icon`;
const icon = shallowRef<Component | null>(null);

type IconComponentLoader = () => Promise<Component>;

// The compatibility set stays source-compatible. The grouped PEAUI catalog uses
// lazy buckets so the complete set does not increase the base SvgIcon bundle.
const EMPTY_ICON_COMPONENT = defineComponent({
  render: () => null,
});

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const rootAttrs = computed(() => {
  const accessibleName = attrs['aria-label'] || attrs['aria-labelledby'];

  return {
    ...(!accessibleName && attrs['aria-hidden'] === undefined ? { 'aria-hidden': 'true' } : {}),
    ...(accessibleName && attrs.role === undefined ? { role: 'img' } : {}),
    focusable: 'false',
    ...attrs,
  };
});

function getSvgAttribute(source: string, name: string): string | undefined {
  return source.match(new RegExp(`(?:^|\\s)${name}=["']([^"']+)["']`, 'i'))?.[1];
}

function createIconComponentFromMarkup(markup: string): Component {
  const root = markup.match(/<svg\b([^>]*)>/i)?.[1];
  const body = markup.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)?.[1]?.trim();

  if (root === undefined || body === undefined) throw new Error('Nieprawidlowy plik SVG.');

  return createIconComponent(body, {
    fill: getSvgAttribute(root, 'fill'),
    height: getSvgAttribute(root, 'height'),
    preserveAspectRatio: getSvgAttribute(root, 'preserveAspectRatio'),
    stroke: getSvgAttribute(root, 'stroke'),
    'stroke-linecap': getSvgAttribute(root, 'stroke-linecap'),
    'stroke-linejoin': getSvgAttribute(root, 'stroke-linejoin'),
    'stroke-width': getSvgAttribute(root, 'stroke-width'),
    viewBox: getSvgAttribute(root, 'viewBox') ?? '0 0 24 24',
    width: getSvgAttribute(root, 'width'),
  });
}

function createCatalogIconComponent(iconData: CatalogIconData): Component {
  return createIconComponent(iconData.body, {
    fill: iconData.fill,
    height: iconData.height,
    stroke: iconData.stroke,
    'stroke-linecap': iconData.strokeLinecap,
    'stroke-linejoin': iconData.strokeLinejoin,
    'stroke-width': iconData.strokeWidth,
    viewBox: iconData.viewBox,
    width: iconData.width,
  });
}

function createIconComponent(
  body: string,
  sourceAttrs: Record<string, string | undefined>,
): Component {
  return defineComponent({
    inheritAttrs: false,
    setup(_props, { attrs: componentAttrs }) {
      return () => h('svg', { ...sourceAttrs, ...componentAttrs, innerHTML: body });
    },
  });
}

function getIconComponentLoader(name: string): IconComponentLoader | undefined {
  if (name.includes('/')) {
    return async () => {
      const iconData = await loadCatalogIcon(name);

      return iconData ? createCatalogIconComponent(iconData) : EMPTY_ICON_COMPONENT;
    };
  }

  if (!hasLegacyIcon(name)) return undefined;

  return async () => {
    const markup = await loadLegacyIcon(name);

    return markup ? createIconComponentFromMarkup(markup) : EMPTY_ICON_COMPONENT;
  };
}

watch(
  () => props.name,
  (nextName) => {
    const loader = getIconComponentLoader(nextName);

    icon.value = loader ? defineAsyncComponent(loader) : null;
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <component
    v-bind="rootAttrs"
    :key="props.name"
    :id
    :class="classNameComponent"
    :data-testid="props.dataTestId"
    :is="icon"
  />
</template>
