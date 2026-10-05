# PEAUI — Vue 3 component library with React and Web Components

![PEAUI logo](https://raw.githubusercontent.com/webonweb/peaui/main/packages/library/peaui-logo.png)

PEAUI provides one design system for Vue 3, native React components and Custom Elements (`peaui-*`). The catalog covers forms, data display, navigation, feedback, layout and overlays, with shared design tokens, TypeScript declarations and framework-specific examples.

## Links

- [Repository](https://github.com/webonweb/peaui)
- [npm package](https://www.npmjs.com/package/@peaui/ui)
- [Documentation](https://webonweb.github.io/peaui/)
- [Issues](https://github.com/webonweb/peaui/issues)

## Installation

Install the runtime for the selected integration:

```bash
# Vue or the complete Web Components catalog
npm install @peaui/ui "vue@^3.5.0"

# React
npm install @peaui/ui "react@^19.2.0" "react-dom@^19.2.0"
```

The framework peers are optional at install time; the entries you use still need their runtime. The WC catalog includes native DOM elements and Vue-backed elements. Individual browser/bundler component imports load their required CSS. The full `@peaui/ui/styles.css` stylesheet is optional; Node/SSR entries omit CSS and require styles through the client build.

## Vue

```vue
<script setup lang="ts">
import { ref } from 'vue';
import FormInput from '@peaui/ui/vue/form/FormInput';

const name = ref('');
</script>

<template>
  <FormInput
    id="first-name"
    name="firstName"
    label="First name"
    placeholder="Enter your name"
    v-model:value="name"
  />
</template>
```

The root `@peaui/ui`, explicit `@peaui/ui/vue` alias and historical framework-less paths expose Vue. Use per-component paths when you want component-sized dependencies and styles. Vite applications can keep named imports by adding `peauiImports()` from `@peaui/ui/vite` to their existing framework configuration.

## React

```tsx
import { useState } from 'react';
import FormInput from '@peaui/ui/react/form/FormInput';

export function ProfileForm() {
  const [name, setName] = useState('');

  return (
    <FormInput
      id="first-name"
      name="firstName"
      label="First name"
      placeholder="Enter your name"
      value={name}
      onValueChange={(value) => setName(value ?? '')}
    />
  );
}
```

React uses native React implementations, with models and callbacks documented per component. Named imports are also available from `@peaui/ui/react`.

## Web Components

In a bundled application, register the element before setting properties or interacting with it:

```ts
import type {} from '@peaui/ui/web-components';
import '@peaui/ui/wc/form/FormInput';

const input = document.querySelector('peaui-form-input');
input?.addEventListener('update:value', (event) => {
  console.log((event as CustomEvent<string>).detail);
});
```

```html
<peaui-form-input id="first-name" name="firstName" label="First name" placeholder="Enter your name">
  <span slot="hint">Use the name shown on your profile.</span>
</peaui-form-input>
```

Register WC modules in the browser for SSR applications. Assign arrays and objects as DOM properties. Use boolean properties or attribute presence/removal to change flags; `disabled="false"` is not portable across the catalog. Elements render light DOM and expose native CustomEvents with payloads in `detail`.

## Accessibility and theming

The library targets WCAG 2.2 AA through semantic controls, keyboard interaction, focus handling and accessible state. Applications still supply labels, alternative text and document structure and must validate their final workflows with assistive technology.

CSS custom properties control colors, typography and other design tokens. The shared styles support light/dark themes and per-component imports. The documentation includes the icon catalog, interactive examples, props, events and composition APIs for all three integrations.

## Suggested issue title

**PEAUI — Vue 3 components with native React and Web Components implementations**
