// Importing the per-component WC entry registers only this custom element.
import "@peaui/ui/wc/data-display/TagChip";

import { PEAUI_WEB_COMPONENT_TAG_NAMES } from "@peaui/ui/web-components";

if (!PEAUI_WEB_COMPONENT_TAG_NAMES.includes("peaui-tag-chip")) {
  throw new Error("The public Web Components catalog is incomplete.");
}
