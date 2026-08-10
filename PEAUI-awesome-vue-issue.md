# PEAUI – Accessible Vue 3 component library with React and Web Components parity

![PEAUI logo](https://raw.githubusercontent.com/webonweb/peaui/main/packages/library/peaui-logo.png)

PEAUI is an accessible, typed, and production-ready UI component library for modern web applications.  
It provides one design system with three implementation targets:

- Vue 3 components
- Native React 19 components (not wrappers)
- Standards-based Web Components (`peaui-*`)

It is useful for teams that need a consistent component set across multiple apps and stacks while keeping API quality, accessibility, and visual parity.

## Links
- GitHub: https://github.com/webonweb/peaui
- npm: https://www.npmjs.com/package/@peaui/ui
- Documentation: https://webonweb.github.io/peaui/
- Issues: https://github.com/webonweb/peaui/issues

## Why PEAUI
- Accessible-first components with keyboard behavior and semantic state-aware API patterns
- Typed props and stable interfaces (TypeScript)
- Shared design tokens + shared stylesheet for consistent spacing, color, typography, focus, and states
- Per-component imports for smaller bundles
- Real production depth: forms, data entry, feedback, navigation, overlays, and data displays

## Install
```bash
npm install @peaui/ui
```

For React consumers:
```bash
npm install @peaui/ui react react-dom
```

Global styles:
```ts
import "@peaui/ui/styles.css";
```

## Usage examples

### Vue 3
```vue
<script setup lang="ts">
import { ref } from "vue";
import { FormInput, ToastAlert } from "@peaui/ui";
import SearchInput from "@peaui/ui/data-entry/SearchInput";
import "@peaui/ui/styles.css";

const name = ref("");
const query = ref("");
</script>

<template>
  <FormInput
    v-model:value="name"
    id="first-name"
    name="firstName"
    label="First name"
    placeholder="Enter your name"
  />

  <SearchInput
    v-model:value="query"
    aria-label="Search documentation"
    @on:search="console.log($event)"
    placeholder="Search components..."
  />

  <ToastAlert
    variant="success"
    title="Saved"
    description="Changes were applied."
    size="m"
  />
</template>
```

### React
```tsx
import { useState } from "react";
import FormInput from "@peaui/ui/form/FormInput";
import SearchInput from "@peaui/ui/data-entry/SearchInput";
import ToastAlert from "@peaui/ui/feedback/ToastAlert";
import "@peaui/ui/styles.css";

export function Demo() {
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");

  return (
    <div>
      <FormInput
        id="first-name"
        name="firstName"
        label="First name"
        placeholder="Enter your name"
        value={name}
        onValueChange={setName}
      />

      <SearchInput
        ariaLabel="Search documentation"
        placeholder="Search components..."
        value={query}
        onValueChange={setQuery}
        onSearch={(value) => console.log("search:", value)}
      />

      <ToastAlert
        variant="info"
        title="Search ready"
        description={`Current query: ${query || "none"}`}
        size="m"
      />
    </div>
  );
}
```

### Web Components
```html
<script type="module">
  import "@peaui/ui/styles.css";
  import "@peaui/ui/form/FormInput";
  import "@peaui/ui/data-entry/SearchInput";
  import "@peaui/ui/feedback/ToastAlert";
</script>

<peaui-form-input
  id="first-name"
  name="firstName"
  label="First name"
  placeholder="Enter your name"
></peaui-form-input>

<peaui-search-input
  aria-label="Search documentation"
  placeholder="Search components..."
></peaui-search-input>

<peaui-toast-alert
  variant="success"
  title="Search started"
  description="PEAUI web component loaded."
  size="m"
></peaui-toast-alert>
```

## Components you can mention from catalog
`FormInput`, `SearchInput`, `ToastAlert`, `FormCheckbox`, `FormSelect`, `NavigationTabs`, `ModalDialog`, `TableList`, `TreeList`, `Avatar`, `TagChip`, `DrawerPanel`, `InfoTooltip`, `SegmentedControl`, `TransferList`.

---

## Suggested issue title
**PEAUI – Accessible component library for Vue 3 with React and Web Components parity**
