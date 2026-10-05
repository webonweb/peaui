<script lang="ts" setup>
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { getPageRange } from '@/helpers/number.helper';
import { computed, useId } from 'vue';

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import GridSection from '@/components/layout/GridSection/index.vue';
import PageSizeControl from '@/components/navigation/ListLimitControl/index.vue';
import PaginationControl from '@/components/navigation/PaginationControl/index.vue';

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  rowsNumber,
  rowsPerPage,
  page,
  total,
  under = false,
  isFlex = false,
  dataTestId,
} = defineProps<{
  /** Total record count used to calculate the visible range and page count. */
  rowsNumber: number;
  rowsPerPage: number;
  page: number;
  /** Total page count; zero suppresses pagination. Pages are derived from rowsNumber/rowsPerPage. */
  total: number;
  under?: boolean;
  isFlex?: boolean;
  dataTestId?: string;
}>();

// EMITS
//-----------------------------------------------------------------------------------------------//
const emit = defineEmits<{
  (e: 'on:change:page', page: number): void;
  (e: 'on:change:limit', limit: number): void;
}>();

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const summaryUid = useId();
const pageNumbers = computed(() => Math.ceil(rowsNumber / rowsPerPage));
const summaryId = computed(() => `table-list-current-page-range-${summaryUid}`);
const pageSizeControlId = computed(() => `table-list-footer-limit-${summaryUid}`);
</script>
<template>
  <GridSection
    v-if="rowsNumber > 0"
    class="peaui-table-list-footer"
    :class="{ 'peaui-table-list-footer--flex': isFlex }"
    :data-testid="dataTestId"
    :columns="3"
    :data-current-page="page"
    :data-rows-number="rowsNumber"
    :data-rows-per-page="rowsPerPage"
    :data-total-pages="total"
    :is-flex="isFlex"
    role="group"
    :gap="1"
    aria-label="Stopka listy tabeli"
    :aria-describedby="summaryId"
  >
    <div
      :id="summaryId"
      class="peaui-table-list-footer__summary"
      :data-testid="dataTestId ? `${dataTestId}-summary` : undefined"
      role="status"
      aria-live="polite"
    >
      Wyświetlane:
      {{ getPageRange(page, rowsPerPage, rowsNumber) }}
      /
      {{ rowsNumber }}
    </div>
    <PaginationControl
      v-if="total > 0 && rowsNumber > rowsPerPage && !under"
      class="peaui-table-list-footer__pagination"
      :dataTestId="dataTestId ? `${dataTestId}-pagination` : undefined"
      :page="page"
      :total-pages="pageNumbers"
      @update:page="(page) => emit('on:change:page', page)"
      ariaLabel="Stronicowanie listy"
    />
    <div
      v-else
      class="peaui-table-list-footer__placeholder"
      :data-testid="dataTestId ? `${dataTestId}-placeholder` : undefined"
      aria-hidden="true"
    ></div>
    <PageSizeControl
      :id="pageSizeControlId"
      class="peaui-table-list-footer__limit"
      :dataTestId="dataTestId ? `${dataTestId}-limit` : undefined"
      :limit="rowsPerPage"
      @update:limit="(limit) => emit('on:change:limit', limit)"
      label="Ilosc rekordow na stronie listy"
      position="top"
    >
      Pokaż na stronie
    </PageSizeControl>

    <PaginationControl
      v-if="total > 0 && rowsNumber > rowsPerPage && under"
      class="peaui-table-list-footer__pagination peaui-table-list-footer__pagination--under"
      :dataTestId="dataTestId ? `${dataTestId}-pagination-under` : undefined"
      :page="page"
      :total-pages="pageNumbers"
      @update:page="(page) => emit('on:change:page', page)"
      ariaLabel="Stronicowanie listy"
    />
  </GridSection>
</template>
