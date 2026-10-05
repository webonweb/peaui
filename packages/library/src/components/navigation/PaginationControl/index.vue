<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import { UIKIT_NAME } from '@/constants';
import { computed, useAttrs } from 'vue';
import { getPaginationRange } from './pagination.shared';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const { ariaLabel, totalPages, dataTestId } = defineProps<{
  ariaLabel: string;
  totalPages: number;
  dataTestId?: string;
}>();

const attrs = useAttrs();
const currentPage = defineModel<number>('page', {
  required: true,
  default: 1,
});

const classNameComponent = `${UIKIT_NAME}-pagination-control`;

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const rootAttrs = computed(() => ({
  ...attrs,
}));

const range = computed(() => getPaginationRange(totalPages, currentPage.value ?? 1));
const pagesCount = computed(() => range.value.total);
const activePage = computed(() => range.value.current);

const isFirstPage = computed(() => activePage.value === 1);
const isLastPage = computed(() => activePage.value === pagesCount.value);

const showLeadingShortcut = computed(() => range.value.leading);
const showTrailingShortcut = computed(() => range.value.trailing);
const visiblePages = computed(() => range.value.pages);

const firstPageButtonTestId = computed(() =>
  dataTestId ? `${dataTestId}-button-first-page` : undefined,
);
const previousPageButtonTestId = computed(() =>
  dataTestId ? `${dataTestId}-button-previous-page` : undefined,
);
const nextPageButtonTestId = computed(() =>
  dataTestId ? `${dataTestId}-button-next-page` : undefined,
);
const lastPageButtonTestId = computed(() =>
  dataTestId ? `${dataTestId}-button-last-page` : undefined,
);
const leadingEllipsisTestId = computed(() =>
  dataTestId ? `${dataTestId}-ellipsis-leading` : undefined,
);
const trailingEllipsisTestId = computed(() =>
  dataTestId ? `${dataTestId}-ellipsis-trailing` : undefined,
);

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function clampPage(page: number): number {
  return Math.min(pagesCount.value, Math.max(1, page));
}

function setPage(page: number): void {
  currentPage.value = clampPage(page);
}

function isCurrentPage(page: number): boolean {
  return activePage.value === page;
}

function getPageButtonTestId(page: number): string | undefined {
  return dataTestId ? `${dataTestId}-button-${page}-page` : undefined;
}

function getPageAriaLabel(page: number): string {
  if (activePage.value === page) {
    return `Aktualna strona ${page} z ${pagesCount.value}`;
  }

  return `Przejdz do strony ${page} z ${pagesCount.value}`;
}
</script>

<template>
  <nav
    :class="classNameComponent"
    :aria-label="ariaLabel"
    :data-testid="dataTestId"
    :data-current-page="activePage"
    :data-total-pages="pagesCount"
    v-bind="rootAttrs"
  >
    <div :class="`${classNameComponent}__controls ${classNameComponent}__controls--start`">
      <button
        type="button"
        :class="`${classNameComponent}__button`"
        :data-testid="firstPageButtonTestId"
        :aria-disabled="isFirstPage || undefined"
        :disabled="isFirstPage"
        @click="setPage(1)"
        aria-label="Przejdz do pierwszej strony"
      >
        <SvgIcon
          :class="`${classNameComponent}__icon ${classNameComponent}__icon--first`"
          name="doubleArrowRounded"
          aria-hidden="true"
          focusable="false"
        />
      </button>
      <button
        type="button"
        :class="`${classNameComponent}__button`"
        :data-testid="previousPageButtonTestId"
        :aria-disabled="isFirstPage || undefined"
        :disabled="isFirstPage"
        @click="setPage(activePage - 1)"
        aria-label="Przejdz do poprzedniej strony"
      >
        <SvgIcon
          :class="`${classNameComponent}__icon ${classNameComponent}__icon--previous`"
          name="arrowRounded"
          aria-hidden="true"
          focusable="false"
        />
      </button>
    </div>
    <div :class="`${classNameComponent}__pages`">
      <button
        v-if="showLeadingShortcut && pagesCount > 4"
        type="button"
        :class="`${classNameComponent}__button ${classNameComponent}__button--page`"
        :data-testid="getPageButtonTestId(1)"
        :aria-label="getPageAriaLabel(1)"
        :aria-current="isCurrentPage(1) ? 'page' : undefined"
        :aria-disabled="isCurrentPage(1) ? 'true' : undefined"
        :disabled="isCurrentPage(1)"
        @click="setPage(1)"
      >
        1
      </button>
      <div
        v-if="range.leadingGap"
        :class="`${classNameComponent}__ellipsis`"
        :data-testid="leadingEllipsisTestId"
        aria-hidden="true"
      >
        ...
      </div>
      <button
        v-for="page in visiblePages"
        :key="page"
        type="button"
        :class="[
          `${classNameComponent}__button`,
          `${classNameComponent}__button--page`,
          isCurrentPage(page) && `${classNameComponent}__button--current`,
        ]"
        :data-testid="getPageButtonTestId(page)"
        :aria-current="isCurrentPage(page) ? 'page' : undefined"
        :aria-disabled="isCurrentPage(page) ? 'true' : undefined"
        :aria-label="getPageAriaLabel(page)"
        :disabled="isCurrentPage(page)"
        @click="setPage(page)"
      >
        {{ page }}
      </button>
      <div
        v-if="range.trailingGap"
        :class="`${classNameComponent}__ellipsis`"
        :data-testid="trailingEllipsisTestId"
        aria-hidden="true"
      >
        ...
      </div>
      <button
        v-if="showTrailingShortcut"
        type="button"
        :class="`${classNameComponent}__button ${classNameComponent}__button--page`"
        :data-testid="getPageButtonTestId(pagesCount)"
        :aria-current="isCurrentPage(pagesCount) ? 'page' : undefined"
        :aria-disabled="isCurrentPage(pagesCount) ? 'true' : undefined"
        :aria-label="getPageAriaLabel(pagesCount)"
        :disabled="isCurrentPage(pagesCount)"
        @click="setPage(pagesCount)"
      >
        {{ pagesCount }}
      </button>
    </div>
    <div :class="`${classNameComponent}__controls ${classNameComponent}__controls--end`">
      <button
        type="button"
        :class="`${classNameComponent}__button`"
        :data-testid="nextPageButtonTestId"
        :aria-disabled="isLastPage || undefined"
        :disabled="isLastPage"
        @click="setPage(activePage + 1)"
        aria-label="Przejdz do kolejnej strony"
      >
        <SvgIcon
          :class="`${classNameComponent}__icon ${classNameComponent}__icon--next`"
          name="arrowRounded"
          aria-hidden="true"
          focusable="false"
        />
      </button>
      <button
        type="button"
        :class="`${classNameComponent}__button`"
        :data-testid="lastPageButtonTestId"
        :aria-disabled="isLastPage || undefined"
        :disabled="isLastPage"
        @click="setPage(pagesCount)"
        aria-label="Przejdz do ostatniej strony"
      >
        <SvgIcon
          :class="`${classNameComponent}__icon ${classNameComponent}__icon--last`"
          name="doubleArrowRounded"
          aria-hidden="true"
          focusable="false"
        />
      </button>
    </div>
  </nav>
</template>
