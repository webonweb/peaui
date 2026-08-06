<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { computed, useAttrs, useId, useSlots } from 'vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const attrs = useAttrs();
const slots = useSlots();

const { dataTestId, title, description } = defineProps<{
  dataTestId?: string;
  title?: string;
  description?: string;
}>();

const classNameComponent = `${UIKIT_NAME}-empty-state`;

const uid = `empty-${useId()}`;
const titleId = `${uid}-title`;
const descId = `${uid}-desc`;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const ariaLabel = computed(() => title || description || 'Brak danych');

const titleTestId = computed(() => (dataTestId ? `${dataTestId}-title` : undefined));
const descriptionTestId = computed(() => (dataTestId ? `${dataTestId}-description` : undefined));
</script>

<template>
  <section
    v-bind="attrs"
    :class="classNameComponent"
    :data-testid="dataTestId"
    :aria-labelledby="title ? titleId : undefined"
    :aria-describedby="description ? descId : undefined"
    :aria-label="title ? undefined : ariaLabel"
  >
    <svg
      :class="`${classNameComponent}__icon`"
      viewBox="0 0 64 41"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" fill-rule="evenodd" transform="translate(0 1)">
        <ellipse
          cx="32"
          cy="33"
          rx="32"
          ry="7"
          :class="`${classNameComponent}__icon-shadow`"
        ></ellipse>
        <g fill-rule="nonzero" :class="`${classNameComponent}__icon-outline`">
          <path
            d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"
          ></path>
          <path
            d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
            :class="`${classNameComponent}__icon-line`"
          ></path>
        </g>
      </g>
    </svg>

    <div :class="`${classNameComponent}__content`">
      <h3
        v-if="title"
        :id="titleId"
        :class="`${classNameComponent}__title`"
        :data-testid="titleTestId"
      >
        {{ title }}
      </h3>

      <p
        v-if="description"
        :id="descId"
        :class="`${classNameComponent}__description`"
        :data-testid="descriptionTestId"
      >
        {{ description }}
      </p>

      <div v-if="slots.additional" :class="`${classNameComponent}__additional`">
        <slot name="additional" />
      </div>
    </div>
  </section>
</template>
