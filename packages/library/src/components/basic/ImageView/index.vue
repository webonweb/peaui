<script lang="ts" setup>
import { UIKIT_NAME } from '@/constants';
import { computed, useAttrs, type StyleValue } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const DEFAULT_ALT_TEXT = 'Obraz';
const FORWARDED_IMAGE_ATTR_NAMES = new Set([
  'aria-label',
  'aria-labelledby',
  'crossorigin',
  'decoding',
  'fetchpriority',
  'height',
  'loading',
  'referrerpolicy',
  'sizes',
  'srcset',
  'title',
  'usemap',
  'width',
]);

type ImageViewSize = 'auto' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'full';

const props = withDefaults(
  defineProps<{
    alt?: string;
    dataTestId?: string;
    max?: string;
    size?: ImageViewSize;
    src?: string;
  }>(),
  {
    size: 'auto',
  },
);

const attrs = useAttrs();
const classNameComponent = `${UIKIT_NAME}-image-view`;

function getNormalizedAttributeValue(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const normalizedValue = value.trim();

    return normalizedValue.length > 0 ? normalizedValue : undefined;
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    const normalizedValue = String(value).trim();

    return normalizedValue.length > 0 ? normalizedValue : undefined;
  }

  return undefined;
}

function getHumanizedSourceText(src: string | undefined): string | undefined {
  if (!src) {
    return undefined;
  }

  const normalizedSource = src.trim();

  if (
    normalizedSource.length === 0 ||
    normalizedSource.startsWith('data:') ||
    normalizedSource.startsWith('blob:')
  ) {
    return undefined;
  }

  const sourceWithoutHash = normalizedSource.split('#')[0] ?? normalizedSource;
  const sourceWithoutQuery = sourceWithoutHash.split('?')[0] ?? sourceWithoutHash;
  const lastSegment = sourceWithoutQuery.split('/').filter(Boolean).pop();

  if (!lastSegment) {
    return undefined;
  }

  const decodedSegment = decodeURIComponent(lastSegment);
  const segmentWithoutExtension = decodedSegment.replace(/\.[^.]+$/, '');
  const humanizedText = segmentWithoutExtension.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();

  return humanizedText.length > 0 ? humanizedText : undefined;
}

const normalizedSrc = computed(() => getNormalizedAttributeValue(props.src));
const normalizedMax = computed(() => getNormalizedAttributeValue(props.max));
const ariaLabel = computed(() => getNormalizedAttributeValue(attrs['aria-label']));
const ariaLabelledBy = computed(() => getNormalizedAttributeValue(attrs['aria-labelledby']));
const title = computed(() => getNormalizedAttributeValue(attrs.title));
const resolvedAlt = computed(() => {
  if (props.alt !== undefined) {
    return props.alt.trim();
  }

  return (
    ariaLabel.value ??
    title.value ??
    getHumanizedSourceText(normalizedSrc.value) ??
    DEFAULT_ALT_TEXT
  );
});
const isDecorative = computed(
  () => resolvedAlt.value === '' && !ariaLabel.value && !ariaLabelledBy.value,
);
const classes = computed(() => [classNameComponent, `${classNameComponent}--size-${props.size}`]);
const dataTestId = computed(
  () =>
    getNormalizedAttributeValue(props.dataTestId) ??
    getNormalizedAttributeValue(attrs['data-testid']),
);
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([name]) =>
        !FORWARDED_IMAGE_ATTR_NAMES.has(name) && name !== 'data-testid' && name !== 'style',
    ),
  ),
);
const rootStyle = computed<StyleValue | undefined>(() => {
  if (!normalizedMax.value) {
    return attrs.style as StyleValue | undefined;
  }

  const maxWidthStyle = { maxWidth: normalizedMax.value };

  return attrs.style === undefined ? maxWidthStyle : [attrs.style as StyleValue, maxWidthStyle];
});
const imageAttrs = computed<Record<string, string>>(() => {
  const nextAttrs: Record<string, string> = {
    alt: resolvedAlt.value,
    class: `${classNameComponent}__image`,
    src: normalizedSrc.value ?? '',
  };

  if (dataTestId.value) {
    nextAttrs['data-testid'] = dataTestId.value;
  }

  for (const [name, value] of Object.entries(attrs)) {
    if (!FORWARDED_IMAGE_ATTR_NAMES.has(name)) {
      continue;
    }

    const normalizedValue = getNormalizedAttributeValue(value);

    if (normalizedValue !== undefined) {
      nextAttrs[name] = normalizedValue;
    }
  }

  if (isDecorative.value) {
    nextAttrs['aria-hidden'] = 'true';
    nextAttrs.role = 'presentation';
  }

  return nextAttrs;
});
</script>

<template>
  <span :class="classes" :style="rootStyle" v-bind="rootAttrs">
    <img v-if="normalizedSrc" v-bind="imageAttrs" />
  </span>
</template>
