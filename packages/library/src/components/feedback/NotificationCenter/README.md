# NotificationCenter

`NotificationCenter` presents a controlled notification inbox for Vue, React, and Web Components. It filters and groups the supplied array without mutating it. Read state, selection, actions, retries, and data loading remain application-owned.

## When to use

- Use it for a persistent list of product, account, system, or collaboration notifications.
- Use `panel` in popovers and dashboard cards, `drawer-content` inside DrawerPanel, and `page` for a dedicated inbox route. These variants do not create an overlay by themselves.
- Use the controlled pending props while a server mutation is in progress.

Do not use it for transient confirmation messages. Use `ToastAlert` for short-lived feedback.

## Installation

```bash
# Vue or the full Web Components catalog
npm install @peaui/ui "vue@^3.5.0"

# React
npm install @peaui/ui "react@^19.2.0" "react-dom@^19.2.0"
```

The examples assume a bundler that resolves npm imports and CSS. Individual component entries load their styles automatically. Use a stable `referenceDate` on the server and client when rendering relative dates with SSR.

## Vue

```vue
<script setup lang="ts">
import { ref } from 'vue';
import NotificationCenter from '@peaui/ui/vue/feedback/NotificationCenter';
import type { NotificationCenterItem } from '@peaui/ui';

const items = ref<NotificationCenterItem[]>([
  { id: 'release', title: 'Release completed', createdAt: new Date(), read: false },
]);
const activeFilter = ref('all');
const selectedId = ref<string | number | null>(null);

function setRead(item: NotificationCenterItem, read: boolean) {
  items.value = items.value.map((current) =>
    current.id === item.id ? { ...current, read } : current,
  );
}

function markAllRead() {
  items.value = items.value.map((item) => ({ ...item, read: true }));
}
</script>

<template>
  <NotificationCenter
    :items="items"
    v-model:active-filter="activeFilter"
    v-model:selected-id="selectedId"
    @mark-read="setRead($event, true)"
    @mark-unread="setRead($event, false)"
    @mark-all-read="markAllRead"
  />
</template>
```

## React

```tsx
import { useState } from 'react';
import NotificationCenter, {
  type NotificationCenterItem,
} from '@peaui/ui/react/feedback/NotificationCenter';

export function Notifications() {
  const [items, setItems] = useState<NotificationCenterItem[]>([
    { id: 'release', title: 'Release completed', createdAt: new Date(), read: false },
  ]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  const setRead = (item: NotificationCenterItem, read: boolean) => {
    setItems((current) =>
      current.map((value) => (value.id === item.id ? { ...value, read } : value)),
    );
  };

  return (
    <NotificationCenter
      items={items}
      activeFilter={activeFilter}
      onActiveFilterChange={setActiveFilter}
      selectedId={selectedId}
      onSelectedIdChange={setSelectedId}
      onMarkRead={(item) => setRead(item, true)}
      onMarkUnread={(item) => setRead(item, false)}
      onMarkAllRead={() => setItems((current) => current.map((item) => ({ ...item, read: true })))}
    />
  );
}
```

## Web Components

Register this Vue-backed custom element in the browser. It uses light DOM and shared CSS. Assign arrays, objects and functions as properties. Component events bubble, are composed, and expose their payload in `event.detail`.

```html
<peaui-notification-center id="notifications"></peaui-notification-center>

<script type="module">
  import '@peaui/ui/wc/feedback/NotificationCenter';

  const center = document.querySelector('#notifications');
  center.items = [
    { id: 'release', title: 'Release completed', createdAt: new Date(), read: false },
  ];

  center.addEventListener('markRead', ({ detail: item }) => {
    center.items = center.items.map((value) =>
      value.id === item.id ? { ...value, read: true } : value,
    );
  });
  center.addEventListener('markUnread', ({ detail: item }) => {
    center.items = center.items.map((value) =>
      value.id === item.id ? { ...value, read: false } : value,
    );
  });
  center.addEventListener('markAllRead', () => {
    center.items = center.items.map((item) => ({ ...item, read: true }));
  });
</script>
```

The adapter synchronizes `activeFilter` and `selectedId` properties after `update:activeFilter` and `update:selectedId`. Listen to those exact event names when also synchronizing an application store. Read-state events remain intents: the handlers above replace `items` explicitly.

## Main API

| Prop / property                              | Purpose                                                        |
| -------------------------------------------- | -------------------------------------------------------------- |
| `items`                                      | Controlled notification array; never mutated by the component. |
| `unreadCount`                                | Optional server-side total when only one page is loaded.       |
| `filters`, `activeFilter`                    | Custom filters and controlled active filter.                   |
| `groupBy`                                    | `none`, `date`, or `type`.                                     |
| `selectedId`                                 | Controlled selected item identifier.                           |
| `loading`, `loadingMore`, `hasMore`, `error` | Controlled request states.                                     |
| `pendingItemIds`, `markAllPending`           | Disable intents being processed by the application.            |
| `variant`                                    | `panel`, `drawer-content`, or `page`.                          |
| `density`                                    | `comfortable` or `compact`.                                    |
| `paginationMode`                             | `pagination` or `infinite`.                                    |
| `locale`, `formatDate`, `referenceDate`      | Date presentation controls.                                    |
| `labels`                                     | Overrides every built-in user-facing label for localization.   |

## Events

- `select` / `onSelect`: `{ item, index }`.
- `action` / `onAction`: `{ item, action, index }`.
- `markRead` / `onMarkRead`, `markUnread` / `onMarkUnread`: the affected item; `markAllRead` / `onMarkAllRead`: no payload. These are application-owned mutation intents.
- `loadMore` / `onLoadMore`: `{ mode, visibleCount }`; the built-in button disables immediately after a request. Set `loadingMore` while fetching. The lock clears when it changes from true to false, the item count changes, or `hasMore` becomes false. Vue template refs and React `NotificationCenterHandle` refs also expose `requestLoadMore()` and `resetLoadRequest()`; these are not declared methods on the WC host type.
- `filterChange` / `onFilterChange`: the filter ID; `retry` / `onRetry`: recovery intent with no payload.
- Vue and WC emit `update:activeFilter` and `update:selectedId`; React calls `onActiveFilterChange` and `onSelectedIdChange`. Vue uses `v-model:active-filter` and `v-model:selected-id`; React must pass the updated values back through props. WC event names retain their case and colon.

## Slots and render functions

Vue exposes `header`, `filters`, `group-header`, `item`, `item-icon`, `item-actions`, `empty`, `loading`, `error`, and `footer`. React provides equivalent `renderHeader`, `renderFilters`, `renderGroupHeader`, `renderItem`, `renderItemIcon`, `renderItemActions`, `renderEmpty`, `renderLoading`, `renderError`, and `renderFooter` props.

WC accepts named HTML content such as `<div slot="empty">No notifications</div>`. HTML slots cannot receive Vue scoped-slot arguments or React render contexts. Use the built-in item presentation for repeated data; do not expect a single projected DOM node to act as a per-item rendering function. Custom content must supply its own accessible labels and wire any replacement actions.

The [component documentation](https://webonweb.github.io/peaui/vue/components/feedback/notification-center) contains the full API and framework-specific examples.

## Accessibility

- The root is a named region and reports `aria-busy` during initial and incremental loading.
- Notifications use native lists; groups are related to instance-specific visible headings with `aria-labelledby`, including when several centers share a page.
- Selection, filters, read state, and actions use native buttons and standard `Tab` navigation.
- Unread state is announced as text and is not communicated only by the colored indicator.
- Dates use semantic `time` elements with machine-readable `datetime` values.
- Pending and disabled actions are removed from interaction through native `disabled` behavior.
- The layout wraps at narrow widths and tolerates long localized labels and browser zoom.

Date formatters are reused by locale with bounded caches, and each date-group label is calculated once per group. For large histories, load additional pages on demand; `maxHeight` limits the viewport rather than the number of rendered notifications.
