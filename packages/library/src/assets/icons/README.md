# PeaUI outline icons

The grouped catalog contains the 1348 SVG assets supplied in PeaUI Outline Icons Mega 0.3.0.
Every icon uses a `0 0 24 24` view box, `currentColor`, a 1.8px stroke and rounded line caps and
joins.

Public names use `category/icon-name`:

- `core/*` — the main set and its badge/circle/square variants;
- `extended/*` — additional semantic icons;
- `ring/*` — circular framed variants;
- `tile/*` — rounded-square framed variants.

Use the same public name in each framework. Component entry points load their required styles:

```vue
<script setup lang="ts">
import SvgIcon from '@peaui/ui/vue/basic/SvgIcon';
</script>

<template>
  <SvgIcon name="core/check" aria-label="Complete" />
</template>
```

```tsx
import SvgIcon from '@peaui/ui/react/basic/SvgIcon';

export function CompleteIcon() {
  return <SvgIcon name="core/check" aria-label="Complete" />;
}
```

```ts
import '@peaui/ui/wc/basic/SvgIcon';

const icon = document.createElement('peaui-svg-icon');
icon.name = 'core/check';
icon.setAttribute('aria-label', 'Complete');
document.body.append(icon);
```

The Vue entry requires Vue 3.5; React requires React and React DOM 19.2. SvgIcon's native custom
element does not require Vue, although other elements in the full WC catalog do. The imports above
assume a bundler with CSS support. See the library README for installation.
Icons without an accessible name are decorative by default. Use `aria-label` or `aria-labelledby`
when the graphic conveys information itself. Inside an icon-only button, provide the button's
accessible name and keep the icon decorative.

Grouped names are loaded from shared lazy runtime buckets. The complete catalog is not added to
the base SvgIcon bundle. Keep the generated chunks when deploying an application so icons can
load on demand.

`inventory.json` is the source of truth for file membership. From the repository root, run:

```bash
npm -w packages/library run icons:sync
npm -w packages/library run icons:check
```

Synchronization rebuilds the lazy runtime buckets and `catalog.json`. The check verifies file
names, SVG safety, style attributes, counts and generated metadata. Do not edit generated catalog
or bucket files by hand.

The SVG files at the root of this directory are retained as compatibility names for existing
component APIs.
