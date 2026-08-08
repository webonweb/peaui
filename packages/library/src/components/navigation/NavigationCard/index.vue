<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { sanitizeToSlug } from '@/helpers/string.helper';
import { computed, getCurrentInstance, useId } from 'vue';

// TYPES
//-----------------------------------------------------------------------------------------------//
type NavigationCardVariant = 'default' | 'complete' | 'during' | 'disabled' | 'hidden';
type NavigationCardSize = 's' | 'm' | 'l';

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import InfoTooltip from '@/components/overlayer/InfoTooltip/index.vue';

// CONSTANTS
//-----------------------------------------------------------------------------------------------//
const LOCKED_VARIANTS: NavigationCardVariant[] = ['disabled', 'hidden'];
const LOCKED_TOOLTIP_DESCRIPTION = 'Krok niedostepny - wymagane zakonczenie poprzedniego etapu.';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  title,
  path,
  description,
  size = 's',
  variant = 'default',
  ariaLabel,
  dataTestId,
} = defineProps<{
  title: string;
  path?: string;
  description: string;
  size?: NavigationCardSize;
  variant?: NavigationCardVariant;
  ariaLabel?: string;
  dataTestId?: string;
}>();

const classNameComponent = `${UIKIT_NAME}-navigation-card`;
const uid = useId();
const instance = getCurrentInstance();
const routerLinkComponent = instance?.appContext.components.RouterLink;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const slug = computed(() => sanitizeToSlug(title));
const rootTestId = computed(() => dataTestId ?? `navigation-tile-${slug.value}`);
const titleTestId = computed(() => `${rootTestId.value}-title`);
const descriptionTestId = computed(() => `${rootTestId.value}-description`);
const iconTestId = computed(() => `${rootTestId.value}-icon`);
const tooltipTestId = computed(() => `${rootTestId.value}-tooltip`);

const titleId = computed(() => `${classNameComponent}-title-${slug.value}-${uid}`);
const descriptionId = computed(() => `${classNameComponent}-description-${slug.value}-${uid}`);

const isLockedVariant = computed(() => LOCKED_VARIANTS.includes(variant));
const hasPath = computed(() => Boolean(path?.trim()));
const isInteractive = computed(() => hasPath.value && !isLockedVariant.value);
const isRouterLink = computed(() => isInteractive.value && Boolean(routerLinkComponent));
const isAnchorLink = computed(() => isInteractive.value && !routerLinkComponent);
const hasTooltip = computed(() => isLockedVariant.value);
const normalizedAriaLabel = computed(() => ariaLabel?.trim() || undefined);
const hasVisibleTitle = computed(() => Boolean(title.trim()));
const hasVisibleDescription = computed(() => Boolean(description.trim()));

const rootTag = computed(() => {
  if (isRouterLink.value && routerLinkComponent) return routerLinkComponent;
  if (isAnchorLink.value) return 'a';
  return 'article';
});

const rootAttributes = computed<Record<string, string>>(() => {
  const attributes: Record<string, string> = {
    'data-testid': rootTestId.value,
  };

  if (hasVisibleTitle.value) {
    attributes['aria-labelledby'] = titleId.value;
  } else if (normalizedAriaLabel.value) {
    attributes['aria-label'] = normalizedAriaLabel.value;
  }

  if (hasVisibleDescription.value) {
    attributes['aria-describedby'] = descriptionId.value;
  }

  if (isLockedVariant.value) {
    attributes['aria-disabled'] = 'true';
  }

  if (isRouterLink.value && path) {
    attributes.to = path;
  }

  if (isAnchorLink.value && path) {
    attributes.href = path;
  }

  return attributes;
});

const rootClass = computed(() => [
  classNameComponent,
  `${classNameComponent}--variant-${variant}`,
  isInteractive.value ? `${classNameComponent}--interactive` : `${classNameComponent}--static`,
]);

const iconName = computed(() => {
  if (variant === 'complete') return 'progressFinish';
  if (isLockedVariant.value) return 'lock';
  return 'arrow';
});

const iconWrapperClass = computed(() => [
  `${classNameComponent}__icon`,
  `${classNameComponent}__icon--variant-${variant}`,
]);

const iconClass = computed(() => [
  `${classNameComponent}__icon-symbol`,
  iconName.value === 'arrow' ? `${classNameComponent}__icon-symbol--arrow` : '',
]);

const titleClass = computed(() => [
  `${classNameComponent}__title`,
  `${classNameComponent}__title--size-${size}`,
  isLockedVariant.value ? `${classNameComponent}__title--locked` : '',
]);

const descriptionClass = computed(() => [
  `${classNameComponent}__description`,
  isLockedVariant.value ? `${classNameComponent}__description--locked` : '',
]);
</script>

<template>
  <component :is="rootTag" v-bind="rootAttributes" :class="rootClass">
    <div :class="`${classNameComponent}__content`">
      <h4 :id="titleId" :class="titleClass" :data-testid="titleTestId">
        {{ title }}
      </h4>
      <p
        :id="descriptionId"
        :class="descriptionClass"
        :data-testid="descriptionTestId"
        v-html="description"
      />
    </div>

    <div v-if="hasTooltip" :class="`${classNameComponent}__tooltip`">
      <InfoTooltip placement="right" :data-test-id="tooltipTestId">
        <div :class="iconWrapperClass" :data-testid="iconTestId">
          <SvgIcon :class="iconClass" :name="iconName" />
        </div>

        <template #description>
          {{ LOCKED_TOOLTIP_DESCRIPTION }}
        </template>
      </InfoTooltip>
    </div>

    <div v-else :class="iconWrapperClass" aria-hidden="true" :data-testid="iconTestId">
      <SvgIcon :class="iconClass" :name="iconName" />
    </div>
  </component>
</template>
