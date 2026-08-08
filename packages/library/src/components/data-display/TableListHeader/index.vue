<script lang="ts" setup>
import { useSlots } from 'vue';

import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import CounterBadge from '@/components/data-display/CounterBadge/index.vue';
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';
import ButtonExport from '@/components/data-entry/ButtonExport/index.vue';
import SearchInput from '@/components/data-entry/SearchInput/index.vue';
import DrawerPanel from '@/components/overlayer/DrawerPanel/index.vue';

const {
  buttonCreateLabel = 'Dodaj rekord',
  canCreate,
  canExport,
  canFilter,
  canSearch,
  countFilters,
  countSelectedRecords,
  searchPlaceholder,
  totalRecords,
  forceExport,
} = defineProps<{
  buttonCreateLabel?: string;
  canCreate?: boolean;
  canExport?: boolean;
  canFilter?: boolean;
  canSearch?: boolean;
  countFilters?: number;
  countSelectedRecords?: number;
  searchPlaceholder?: string;
  totalRecords?: number;
  userId?: string;
  forceExport?: boolean;
}>();

const emit = defineEmits<{
  (e: 'on:search', pharse: string): void;
  (e: 'on:reset-filters'): void;
  (e: 'on:create'): void;
  (e: 'on:export', type: string): void;
}>();

const slots = useSlots();
const isFiltersDrawerPanelOpen = defineModel<boolean>('filters-open', { default: false });
</script>

<template>
  <div
    class="peaui-table-list-header"
    :class="{
      'peaui-table-list-header--without-description':
        !slots['additional-description'] && !slots['addtional-description'],
      'peaui-table-list-header--with-description':
        slots['additional-description'] || slots['addtional-description'],
    }"
    data-testid="table-list-header"
    role="region"
    aria-label="Nagłówek listy tabeli"
  >
    <div class="peaui-table-list-header__controls" data-testid="table-list-header-controls">
      <div
        v-if="canSearch || canFilter"
        class="peaui-table-list-header__search-area"
        data-testid="table-list-header-search-area"
      >
        <div class="peaui-table-list-header__search">
          <SearchInput
            v-if="canSearch"
            dataTestId="table-list-header-search"
            :placeholder="searchPlaceholder || 'Wpisz czego szukasz'"
            ariaLabel="Wyszukaj na liscie"
            @on:search="(phrase: string) => emit('on:search', phrase)"
          />
        </div>

        <ButtonAction
          v-if="canFilter"
          class="peaui-table-list-header__filter-button"
          dataTestId="table-list-header-filter-button"
          size="s"
          type="button"
          variant="secondary"
          @click="isFiltersDrawerPanelOpen = !isFiltersDrawerPanelOpen"
        >
          <SvgIcon class="peaui-table-list-header__filter-reset-icon" name="filters" />
          <span class="peaui-table-list-header__filter-button-label">Filtruj</span>
          <CounterBadge
            v-if="countFilters"
            class="peaui-table-list-header__filter-badge"
            dataTestId="table-list-header-filter-badge"
            :value="countFilters || 0"
            variant="info"
          />
        </ButtonAction>

        <ButtonAction
          v-if="canFilter && countFilters"
          class="peaui-table-list-header__filter-reset"
          dataTestId="table-list-header-filter-reset"
          ariaLabel="Wyczysc filtry"
          size="s"
          type="button"
          variant="ghost"
          @click="emit('on:reset-filters')"
        >
          <SvgIcon class="peaui-table-list-header__filter-reset-icon" name="close" />
          <span class="peaui-table-list-header__filter-reset-label">Wyczysc filtry</span>
        </ButtonAction>

        <DrawerPanel
          v-if="canFilter"
          v-model:open="isFiltersDrawerPanelOpen"
          class="peaui-table-list-header__filters-drawer"
          dataTestId="table-list-header-filters-drawer"
          ariaLabel="Panel filtrowania listy"
        >
          <slot :open="isFiltersDrawerPanelOpen" name="filters-drawer" />
        </DrawerPanel>
      </div>

      <div
        v-if="canCreate || canExport || slots['additional-buttons']"
        class="peaui-table-list-header__actions"
        data-testid="table-list-header-actions"
      >
        <ButtonAction
          v-if="canCreate"
          class="peaui-table-list-header__create-button"
          dataTestId="table-list-header-create"
          :ariaLabel="buttonCreateLabel"
          size="s"
          type="button"
          use-aria-label
          variant="primary"
          @click.prevent="emit('on:create')"
        >
          <SvgIcon class="peaui-table-list-header__create-icon" name="plus" />
          <span class="peaui-table-list-header__create-label">
            {{ buttonCreateLabel }}
          </span>
        </ButtonAction>
        <slot name="additional-buttons" />
        <ButtonExport
          size="s"
          v-if="canExport"
          class="peaui-table-list-header__export-button"
          dataTestId="table-list-header-export"
          :disabled="!totalRecords"
          :forceExport="forceExport"
          :selectedItemsCount="countSelectedRecords || 0"
          ariaLabel="Eksportuj rekordy listy"
          @on:export="(type: string) => emit('on:export', type)"
        >
          Eksportuj
        </ButtonExport>
      </div>
    </div>
    <slot v-if="slots['additional-content']" name="additional-content" />
    <slot v-else name="addtional-content" />
    <slot v-if="slots['additional-description']" name="additional-description" />
    <slot v-else name="addtional-description" />
  </div>
</template>
