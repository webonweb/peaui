# PeaUI outline icons

The grouped catalog contains the 1348 SVG assets supplied in PeaUI Outline Icons Mega 0.3.0.
Every icon uses a `0 0 24 24` view box, `currentColor`, a 1.8px stroke and rounded line caps and
joins.

Public names use `category/icon-name`:

- `core/*` — the main set and its badge/circle/square variants;
- `extended/*` — additional semantic icons;
- `ring/*` — circular framed variants;
- `tile/*` — rounded-square framed variants.

`inventory.json` is the source of truth for file membership. Run `npm run icons:sync` after changing
the assets to rebuild the lazy runtime buckets and `catalog.json`; CI runs `npm run icons:check` to
verify file names, SVG safety, style attributes, counts and generated metadata.

The SVG files at the root of this directory are retained as compatibility names for existing
component APIs.
