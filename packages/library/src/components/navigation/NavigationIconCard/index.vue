<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { sanitizeToSlug } from '@/helpers/string.helper';
import { computed, getCurrentInstance, useAttrs, useId } from 'vue';

defineOptions({
  inheritAttrs: false,
});

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  icon = 'info',
  text = '',
  path = '',
  ariaLabel,
  dataTestId,
} = defineProps<{
  icon: string;
  text: string;
  path: string;
  ariaLabel?: string;
  dataTestId?: string;
}>();

const attrs = useAttrs();
const uid = useId();
const instance = getCurrentInstance();
const routerLinkComponent = instance?.appContext.components.RouterLink;
const classNameComponent = `${UIKIT_NAME}-navigation-icon-card`;
const DEFAULT_ACCESSIBLE_NAME = 'Karta nawigacyjna';

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const normalizedPath = computed(() => path.trim());
const normalizedText = computed(() => text.trim());
const normalizedAriaLabel = computed(() => ariaLabel?.trim() || undefined);
const normalizedAttrsAriaLabel = computed(() => `${attrs['aria-label'] ?? ''}`.trim() || undefined);
const normalizedAttrsAriaLabelledBy = computed(
  () => `${attrs['aria-labelledby'] ?? ''}`.trim() || undefined,
);
const normalizedAttrsAriaDescribedBy = computed(
  () => `${attrs['aria-describedby'] ?? ''}`.trim() || undefined,
);
const normalizedAttrsDataTestId = computed(
  () => `${attrs['data-testid'] ?? ''}`.trim() || undefined,
);
const normalizedTarget = computed(() => `${attrs.target ?? ''}`.trim());
const normalizedRel = computed(() => `${attrs.rel ?? ''}`.trim() || undefined);
const hasValidPath = computed(() => normalizedPath.value.length > 0);
const isHashLink = computed(() => normalizedPath.value.startsWith('#'));
const isProtocolLink = computed(
  () => /^[a-z][a-z\d+.-]*:/i.test(normalizedPath.value) || normalizedPath.value.startsWith('//'),
);
const isTargetBlank = computed(() => normalizedTarget.value.toLowerCase() === '_blank');
const isRouterLink = computed(
  () =>
    hasValidPath.value &&
    Boolean(routerLinkComponent) &&
    !isHashLink.value &&
    !isProtocolLink.value,
);
const rootTag = computed(() =>
  isRouterLink.value && routerLinkComponent ? routerLinkComponent : 'a',
);
const slug = computed(() => sanitizeToSlug(normalizedText.value || icon));
const rootTestId = computed(
  () => dataTestId ?? normalizedAttrsDataTestId.value ?? `${classNameComponent}-${slug.value}`,
);
const iconTestId = computed(() => `${rootTestId.value}-icon`);
const textTestId = computed(() => `${rootTestId.value}-text`);
const textId = computed(() => `${classNameComponent}-text-${slug.value}-${uid}`);
const targetDescriptionId = computed(
  () => `${classNameComponent}-target-description-${slug.value}-${uid}`,
);
const derivedAriaLabel = computed(() => getDerivedAccessibleName(normalizedPath.value));
const rootAriaLabel = computed(() =>
  normalizedText.value || normalizedAttrsAriaLabelledBy.value
    ? undefined
    : (normalizedAriaLabel.value ??
      normalizedAttrsAriaLabel.value ??
      derivedAriaLabel.value ??
      DEFAULT_ACCESSIBLE_NAME),
);
const rootAriaLabelledBy = computed(() =>
  normalizedText.value ? textId.value : normalizedAttrsAriaLabelledBy.value,
);
const rootAriaDescribedBy = computed(() => {
  const descriptionIds = [
    normalizedAttrsAriaDescribedBy.value,
    isTargetBlank.value && hasValidPath.value ? targetDescriptionId.value : undefined,
  ].filter(Boolean);

  return descriptionIds.length > 0 ? descriptionIds.join(' ') : undefined;
});

const rootClasses = computed(() => [classNameComponent, attrs.class]);
const rootAttrs = computed(() => {
  const {
    class: _class,
    href: _href,
    to: _to,
    target: _target,
    'data-testid': _dataTestId,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    'aria-describedby': _ariaDescribedBy,
    rel: _rel,
    ...restAttrs
  } = attrs;

  const resolvedRel = isTargetBlank.value
    ? (normalizedRel.value ?? 'noopener noreferrer')
    : normalizedRel.value;

  return {
    ...restAttrs,
    'data-testid': rootTestId.value,
    'aria-label': rootAriaLabel.value,
    'aria-labelledby': rootAriaLabelledBy.value,
    'aria-describedby': rootAriaDescribedBy.value,
    'aria-disabled': hasValidPath.value ? undefined : 'true',
    role: hasValidPath.value ? attrs.role : 'link',
    href: isRouterLink.value || !hasValidPath.value ? undefined : normalizedPath.value,
    to: isRouterLink.value ? normalizedPath.value : undefined,
    target: hasValidPath.value ? normalizedTarget.value : undefined,
    rel: hasValidPath.value ? resolvedRel : undefined,
    tabindex: hasValidPath.value ? (attrs.tabindex ?? 0) : '-1',
  };
});

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function decodeSegment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeAccessibleSegment(value: string): string | undefined {
  const normalizedValue = decodeSegment(value)
    .replace(/[?#].*$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return normalizedValue || undefined;
}

function getDerivedAccessibleName(pathValue: string): string | undefined {
  const normalizedValue = pathValue.trim();

  if (!normalizedValue) {
    return undefined;
  }

  if (normalizedValue.startsWith('#')) {
    const hashLabel = normalizeAccessibleSegment(normalizedValue.slice(1));

    return hashLabel ? `Przejdz do ${hashLabel}` : undefined;
  }

  if (isProtocolLink.value) {
    try {
      const parsedUrl = new URL(normalizedValue);
      const segments = parsedUrl.pathname.split('/').filter(Boolean);
      const pathLabel = normalizeAccessibleSegment(segments.at(-1) ?? parsedUrl.hostname);

      return pathLabel ? `Przejdz do ${pathLabel}` : undefined;
    } catch {
      return undefined;
    }
  }

  const segments = normalizedValue.split(/[?#]/)[0]?.split('/').filter(Boolean) ?? [];
  const pathLabel = normalizeAccessibleSegment(segments.at(-1) ?? '');

  return pathLabel ? `Przejdz do ${pathLabel}` : undefined;
}

// WARNINGS
//-----------------------------------------------------------------------------------------------//
if (import.meta.env.DEV && !hasValidPath.value) {
  console.warn('[NavigationIconCard] Missing path. Rendering a disabled card without navigation.');
}

if (
  import.meta.env.DEV &&
  !normalizedText.value &&
  !normalizedAriaLabel.value &&
  !normalizedAttrsAriaLabel.value &&
  !normalizedAttrsAriaLabelledBy.value
) {
  console.warn(
    '[NavigationIconCard] Missing visible text/aria label. Deriving accessible name from path or using a generic fallback.',
  );
}
</script>

<template>
  <component :is="rootTag" :class="rootClasses" v-bind="rootAttrs">
    <SvgIcon :name="icon" :class="`${classNameComponent}__icon`" :data-test-id="iconTestId" />

    <strong :id="textId" :class="`${classNameComponent}__text`" :data-testid="textTestId">
      {{ text }}
    </strong>

    <span
      v-if="isTargetBlank && hasValidPath"
      :id="targetDescriptionId"
      :class="`${classNameComponent}__sr-only`"
    >
      Link otwiera sie w nowej karcie.
    </span>
  </component>
</template>
