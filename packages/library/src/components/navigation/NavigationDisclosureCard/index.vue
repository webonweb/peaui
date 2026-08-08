<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import { UIKIT_NAME } from '@/constants';
import { sanitizeToSlug } from '@/helpers/string.helper';
import { computed, getCurrentInstance, onMounted, ref, useId, useSlots } from 'vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  id,
  title,
  description,
  path,
  open = false,
  dataTestId,
  ariaLabel,
} = defineProps<{
  title: string;
  description: string;
  id: string;
  path?: string;
  open?: boolean;
  dataTestId?: string;
  ariaLabel?: string;
}>();

const classNameComponent = `${UIKIT_NAME}-navigation-disclosure-card`;
const uid = useId();
const slots = useSlots();
const instance = getCurrentInstance();
const collapsePanelReference = ref<HTMLDetailsElement | null>(null);
const isOpen = ref(Boolean(open));
const routerLinkComponent = instance?.appContext.components.RouterLink;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const slug = computed(() => sanitizeToSlug(id || title));
const hasPath = computed(() => Boolean(path?.trim()));
const isRouterLink = computed(() => hasPath.value && Boolean(routerLinkComponent));
const hasDefaultSlot = computed(() => Boolean(slots.default));
const transitionName = `${classNameComponent}-content`;

const rootClasses = computed(() => [
  classNameComponent,
  hasPath.value ? `${classNameComponent}--link` : `${classNameComponent}--disclosure`,
  isOpen.value && `${classNameComponent}--open`,
]);

const summaryClasses = computed(() => [
  `${classNameComponent}__summary`,
  hasPath.value
    ? `${classNameComponent}__summary--link`
    : `${classNameComponent}__summary--disclosure`,
]);

const actionClasses = computed(() => [
  `${classNameComponent}__action`,
  hasPath.value
    ? `${classNameComponent}__action--link`
    : `${classNameComponent}__action--disclosure`,
]);

const iconClasses = computed(() => [
  `${classNameComponent}__icon`,
  hasPath.value && `${classNameComponent}__icon--link`,
  !hasPath.value && isOpen.value && `${classNameComponent}__icon--open`,
]);

const actionTag = computed(() => (hasPath.value ? 'span' : 'div'));

const summaryId = computed(() => `${classNameComponent}-summary-${slug.value}-${uid}`);
const titleId = computed(() => `${classNameComponent}-title-${slug.value}-${uid}`);
const descriptionId = computed(() => `${classNameComponent}-description-${slug.value}-${uid}`);
const contentId = computed(() => `${classNameComponent}-content-${slug.value}-${uid}`);
const normalizedAriaLabel = computed(() => ariaLabel?.trim() || undefined);
const hasVisibleTitle = computed(() => Boolean(title.trim()));
const hasVisibleDescription = computed(() => Boolean(description.trim()));

const summaryTestId = computed(() => (dataTestId ? `${dataTestId}-summary` : undefined));
const titleTestId = computed(() => (dataTestId ? `${dataTestId}-title` : undefined));
const descriptionTestId = computed(() => (dataTestId ? `${dataTestId}-description` : undefined));
const actionTestId = computed(() => (dataTestId ? `${dataTestId}-action` : undefined));
const contentTestId = computed(() => (dataTestId ? `${dataTestId}-content` : undefined));
const summaryAriaControls = computed(() =>
  isOpen.value && hasDefaultSlot.value ? contentId.value : undefined,
);
const linkTag = computed(() =>
  isRouterLink.value && routerLinkComponent ? routerLinkComponent : 'a',
);
const linkBindings = computed<Record<string, string | undefined>>(() => ({
  id: summaryId.value,
  'data-testid': summaryTestId.value,
  'aria-describedby': hasVisibleDescription.value ? descriptionId.value : undefined,
  'aria-label': hasVisibleTitle.value ? undefined : normalizedAriaLabel.value,
  'aria-labelledby': hasVisibleTitle.value ? titleId.value : undefined,
  href: !isRouterLink.value ? path : undefined,
  to: isRouterLink.value ? path : undefined,
}));

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function handleToggleCollapsePanel(): void {
  isOpen.value = !isOpen.value;

  if (collapsePanelReference.value) {
    collapsePanelReference.value.open = isOpen.value;
  }
}

onMounted(() => {
  if (collapsePanelReference.value) {
    collapsePanelReference.value.open = Boolean(open);
  }
});
</script>

<template>
  <div v-if="hasPath" :id :class="rootClasses" :data-testid="dataTestId">
    <component :is="linkTag" :class="summaryClasses" v-bind="linkBindings">
      <div :class="`${classNameComponent}__summary-inner`">
        <div :class="`${classNameComponent}__summary-content`">
          <div :class="`${classNameComponent}__header`">
            <div :class="`${classNameComponent}__title-group`">
              <h3 :id="titleId" :class="`${classNameComponent}__title`" :data-testid="titleTestId">
                {{ title }}
              </h3>
              <slot name="title-additional" />
            </div>
            <div :class="`${classNameComponent}__description-additional`">
              <slot name="description-additional" />
            </div>
          </div>
          <div :class="`${classNameComponent}__description-row`">
            <p
              :id="descriptionId"
              :class="`${classNameComponent}__description`"
              :data-testid="descriptionTestId"
            >
              {{ description }}
            </p>
            <component
              :is="actionTag"
              :class="actionClasses"
              :data-testid="actionTestId"
              aria-hidden="true"
            >
              <SvgIcon :class="iconClasses" name="arrowRight" />
            </component>
          </div>
        </div>
      </div>
    </component>
    <Transition :name="transitionName">
      <div
        v-if="isOpen && hasDefaultSlot"
        :id="contentId"
        role="region"
        :class="`${classNameComponent}__content`"
        :aria-labelledby="titleId"
        :data-testid="contentTestId"
      >
        <slot />
      </div>
    </Transition>
  </div>

  <details
    v-else
    :id
    :class="rootClasses"
    :data-testid="dataTestId"
    :open="isOpen"
    ref="collapsePanelReference"
  >
    <summary
      :id="summaryId"
      :class="summaryClasses"
      :data-testid="summaryTestId"
      :aria-controls="summaryAriaControls"
      :aria-expanded="isOpen"
      @click.prevent="handleToggleCollapsePanel"
      @keydown.enter.prevent="handleToggleCollapsePanel"
      @keydown.space.prevent="handleToggleCollapsePanel"
    >
      <div :class="`${classNameComponent}__summary-inner`">
        <div :class="`${classNameComponent}__summary-content`">
          <div :class="`${classNameComponent}__header`">
            <div :class="`${classNameComponent}__title-group`">
              <h3 :id="titleId" :class="`${classNameComponent}__title`" :data-testid="titleTestId">
                {{ title }}
              </h3>
              <slot name="title-additional" />
            </div>
            <div :class="`${classNameComponent}__description-additional`">
              <slot name="description-additional" />
            </div>
          </div>
          <div :class="`${classNameComponent}__description-row`">
            <p
              :id="descriptionId"
              :class="`${classNameComponent}__description`"
              :data-testid="descriptionTestId"
            >
              {{ description }}
            </p>
            <component
              :is="actionTag"
              :class="actionClasses"
              :data-testid="actionTestId"
              aria-hidden="true"
            >
              <SvgIcon :class="iconClasses" name="arrow" />
            </component>
          </div>
        </div>
      </div>
    </summary>
    <Transition :name="transitionName">
      <div
        v-if="isOpen && hasDefaultSlot"
        :id="contentId"
        role="region"
        :class="`${classNameComponent}__content`"
        :aria-labelledby="titleId"
        :data-testid="contentTestId"
      >
        <slot />
      </div>
    </Transition>
  </details>
</template>
