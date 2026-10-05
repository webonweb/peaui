<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import PopoverButton from '@/components/overlayer/PopoverButton/index.vue';
import { UIKIT_NAME } from '@/constants';
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
          <path
            d="M9.91667 17C9.91667 16.4396 9.7505 15.8918 9.43917 15.4259C9.12784 14.96 8.68533 14.5968 8.16761 14.3824C7.64988 14.1679 7.08019 14.1118 6.53058 14.2211C5.98097 14.3304 5.47612 14.6003 5.07987 14.9965C4.68362 15.3928 4.41377 15.8976 4.30444 16.4473C4.19512 16.9969 4.25123 17.5666 4.46568 18.0843C4.68013 18.602 5.04328 19.0445 5.50922 19.3558C5.97516 19.6672 6.52296 19.8333 7.08334 19.8333C7.83478 19.8333 8.55545 19.5348 9.08681 19.0035C9.61816 18.4721 9.91667 17.7515 9.91667 17ZM24.0833 17C24.0833 17.5604 24.2495 18.1082 24.5608 18.5741C24.8722 19.0401 25.3147 19.4032 25.8324 19.6177C26.3501 19.8321 26.9198 19.8882 27.4694 19.7789C28.019 19.6696 28.5239 19.3997 28.9201 19.0035C29.3164 18.6072 29.5862 18.1024 29.6956 17.5528C29.8049 17.0032 29.7488 16.4335 29.5343 15.9157C29.3199 15.398 28.9567 14.9555 28.4908 14.6442C28.0248 14.3328 27.4771 14.1667 26.9167 14.1667C26.1652 14.1667 25.4446 14.4652 24.9132 14.9965C24.3818 15.5279 24.0833 16.2486 24.0833 17ZM14.1667 17C14.1667 17.5604 14.3328 18.1082 14.6442 18.5741C14.9555 19.0401 15.398 19.4032 15.9157 19.6177C16.4335 19.8321 17.0031 19.8882 17.5528 19.7789C18.1024 19.6696 18.6072 19.3997 19.0035 19.0035C19.3997 18.6072 19.6696 18.1024 19.7789 17.5528C19.8882 17.0032 19.8321 16.4335 19.6177 15.9157C19.4032 15.398 19.0401 14.9555 18.5741 14.6442C18.1082 14.3328 17.5604 14.1667 17 14.1667C16.2486 14.1667 15.5279 14.4652 14.9965 14.9965C14.4652 15.5279 14.1667 16.2486 14.1667 17Z"
          />
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
