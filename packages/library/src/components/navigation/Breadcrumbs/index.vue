<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import PopoverButton from '@/components/overlayer/PopoverButton/index.vue';
import { UIKIT_NAME } from '@/constants';
import { breadcrumbsOverflowPath } from './breadcrumbs.shared';
import { computed, getCurrentInstance } from 'vue';

// TYPES
//-----------------------------------------------------------------------------------------------//
type BreadcrumbLabel = string | ((route: BreadcrumbRoute) => string);

type BreadcrumbItem = {
  key?: string;
  label: BreadcrumbLabel;
  path?: string;
};

type BreadcrumbRoute = {
  fullPath: string;
  hash: string;
  meta: Record<string, unknown>;
  params: Record<string, unknown>;
  path: string;
  query: Record<string, unknown>;
} & Record<string, unknown>;

type ParsedBreadcrumbItem = {
  originalItem: BreadcrumbItem;
  parsedLabel: string;
  resolvedKey: string;
};

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const {
  items = [],
  separator = '/',
  ariaLabel = 'Ścieżka nawigacji',
  dataTestId,
} = defineProps<{
  items: BreadcrumbItem[];
  separator?: string;
  ariaLabel?: string;
  dataTestId?: string;
}>();

const classNameComponent = `${UIKIT_NAME}-breadcrumbs`;
const instance = getCurrentInstance();
const routerLinkComponent = instance?.appContext.components.RouterLink;

// EMITS
//-----------------------------------------------------------------------------------------------//
const emit = defineEmits<{
  (e: 'on:navigate', item: BreadcrumbItem): void;
}>();

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const popoverTestId = computed(() => (dataTestId ? `${dataTestId}-popover` : undefined));
const itemTestId = computed(() => (dataTestId ? `${dataTestId}-item` : undefined));
const separatorTestId = computed(() => (dataTestId ? `${dataTestId}-item-separator` : undefined));
const buttonTestId = computed(() => (dataTestId ? `${dataTestId}-item-button` : undefined));
const currentTestId = computed(() => (dataTestId ? `${dataTestId}-item-current` : undefined));
const fallbackRoute = computed<BreadcrumbRoute>(() => {
  if (typeof window === 'undefined') {
    return {
      fullPath: '',
      hash: '',
      meta: {},
      params: {},
      path: '',
      query: {},
    };
  }

  const { hash, pathname, search } = window.location;

  return {
    fullPath: `${pathname}${search}${hash}`,
    hash,
    meta: {},
    params: {},
    path: pathname,
    query: {},
  };
});
const currentRoute = computed<BreadcrumbRoute>(() => {
  const route = (instance?.proxy as { $route?: BreadcrumbRoute } | undefined)?.$route;

  return route?.path ? route : fallbackRoute.value;
});
const parsedItems = computed<ParsedBreadcrumbItem[]>(() =>
  items.map((item, index) => ({
    originalItem: item,
    parsedLabel: typeof item.label === 'function' ? item.label(currentRoute.value) : item.label,
    resolvedKey: item.key ?? `item-${index}`,
  })),
);

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
const getItemAriaLabel = (label: string) => `Przejdź do podstrony: ${label}`;
const isLast = (index: number) => index === parsedItems.value.length - 1;
const shouldRenderLink = (item: BreadcrumbItem, index: number) =>
  !isLast(index) && Boolean(item.path?.trim());
const shouldUseRouterLink = (item: BreadcrumbItem, index: number) =>
  shouldRenderLink(item, index) && Boolean(routerLinkComponent);
const getLinkTag = (item: BreadcrumbItem, index: number) =>
  shouldUseRouterLink(item, index) ? routerLinkComponent : 'a';
const getLinkAttributes = (
  item: BreadcrumbItem,
  label: string,
  dataTestId?: string,
): Record<string, string> => {
  const attributes: Record<string, string> = {
    class: `${classNameComponent}__button`,
    'aria-label': getItemAriaLabel(label),
  };

  if (dataTestId) {
    attributes['data-testid'] = dataTestId;
  }

  if (item.path?.trim()) {
    if (routerLinkComponent) {
      attributes.to = item.path;
    } else {
      attributes.href = item.path;
    }
  }

  return attributes;
};

function onHandleClick(item: BreadcrumbItem, index: number, event?: MouseEvent) {
  if (isLast(index)) return;

  if (
    event &&
    (event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey)
  ) {
    return;
  }

  emit('on:navigate', item);
}
</script>

<template>
  <nav :aria-label="ariaLabel" :data-testid="dataTestId" :class="classNameComponent">
    <div :class="`${classNameComponent}__mobile`">
      <PopoverButton
        placement="bottom-right"
        variant="ghost"
        useAriaLabel
        ariaLabel="Pokaż menu ścieżki nawigacji"
        size="xs"
        :class="`${classNameComponent}__popover`"
        :data-testid="popoverTestId"
      >
        <svg
          :class="`${classNameComponent}__icon`"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path :d="breadcrumbsOverflowPath" />
        </svg>

        <template #content>
          <ul :class="`${classNameComponent}__menu`" aria-label="Menu ścieżki nawigacji">
            <li v-for="(item, index) in parsedItems" :key="item.resolvedKey">
              <span
                v-if="isLast(index)"
                :class="`${classNameComponent}__current`"
                aria-current="page"
              >
                {{ item.parsedLabel }}
              </span>
              <component
                v-else-if="shouldRenderLink(item.originalItem, index)"
                :is="getLinkTag(item.originalItem, index)"
                v-bind="getLinkAttributes(item.originalItem, item.parsedLabel)"
                @click="onHandleClick(item.originalItem, index, $event)"
              >
                {{ item.parsedLabel }}
              </component>
              <button
                v-else
                type="button"
                :class="`${classNameComponent}__button`"
                @click="onHandleClick(item.originalItem, index)"
                :aria-label="getItemAriaLabel(item.parsedLabel)"
              >
                {{ item.parsedLabel }}
              </button>
            </li>
          </ul>
        </template>
      </PopoverButton>

      <span :class="`${classNameComponent}__separator`" aria-hidden="true">{{ separator }}</span>
      <span :class="`${classNameComponent}__current`" aria-current="page">
        {{ parsedItems.at(-1)?.parsedLabel }}
      </span>
    </div>

    <ol :class="`${classNameComponent}__content`">
      <li
        v-for="(item, index) in parsedItems"
        :key="item.resolvedKey"
        :class="`${classNameComponent}__item`"
        :data-testid="itemTestId ? `${itemTestId}-${item.resolvedKey}` : undefined"
      >
        <span
          v-if="index !== 0"
          :class="`${classNameComponent}__separator`"
          :data-testid="separatorTestId ? `${separatorTestId}-${item.resolvedKey}` : undefined"
          aria-hidden="true"
        >
          {{ separator }}
        </span>

        <span
          v-if="isLast(index)"
          :class="`${classNameComponent}__current`"
          :data-testid="currentTestId ? `${currentTestId}-${item.resolvedKey}` : undefined"
          aria-current="page"
        >
          {{ item.parsedLabel }}
        </span>

        <component
          v-else-if="shouldRenderLink(item.originalItem, index)"
          :is="getLinkTag(item.originalItem, index)"
          v-bind="
            getLinkAttributes(
              item.originalItem,
              item.parsedLabel,
              buttonTestId ? `${buttonTestId}-${item.resolvedKey}` : undefined,
            )
          "
          @click="onHandleClick(item.originalItem, index, $event)"
        >
          {{ item.parsedLabel }}
        </component>

        <button
          v-else
          type="button"
          :class="`${classNameComponent}__button`"
          @click="onHandleClick(item.originalItem, index)"
          :aria-label="getItemAriaLabel(item.parsedLabel)"
          :data-testid="buttonTestId ? `${buttonTestId}-${item.resolvedKey}` : undefined"
        >
          {{ item.parsedLabel }}
        </button>
      </li>
    </ol>
  </nav>
</template>
